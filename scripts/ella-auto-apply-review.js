#!/usr/bin/env node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process'; 

const APPLY_MARKER_RE = /<!--\s*ella:apply\s*-->/i;

const ALLOWED_AUTHOR_ASSOCIATIONS = new Set([      
  'OWNER',
  'MEMBER',
  'COLLABORATOR',
]);

const DISALLOWED_PATH_PREFIXES = [
  '.github/',
  '.git/',
];

function writeOutput(name, value) {
  const outputPath = process.env.GITHUB_OUTPUT;
  if (!outputPath) return;
  fs.appendFileSync(outputPath, `${name}<<__ELLA__\n${value}\n__ELLA__\n`, 'utf8');
}

function toSingleLine(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function tokenizePatchPath(rawPath) {
  const trimmed = rawPath.trim();
  if (!trimmed || trimmed === '/dev/null') return null;
  return trimmed.split(/\s+/)[0];
}

export function wantsAutoApply(reviewBody) {
  return APPLY_MARKER_RE.test(reviewBody || '');
}

export function extractPatchBlocks(text) {
  const body = text || '';
  const blocks = [];

  const fenceRe = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  for (const match of body.matchAll(fenceRe)) {
    const lang = (match[1] || '').toLowerCase();
    const content = match[2] || '';
    const looksLikeDiff = /^(diff --git|---\s+\S+|\+\+\+\s+\S+)/m.test(content);
    const isDiffFence = lang === 'diff' || lang === 'patch' || lang === 'udiff';
    if (isDiffFence || looksLikeDiff) blocks.push(content.trimEnd() + '\n');
  }

  return blocks;
}

export function listTouchedPathsFromPatch(patchText) {
  const patch = patchText || '';
  const touched = new Set();

  for (const line of patch.split('\n')) {
    const diffMatch = /^diff --git a\/(.+?) b\/(.+?)\s*$/.exec(line);
    if (diffMatch) {
      const bPath = tokenizePatchPath(diffMatch[2]);
      if (bPath) touched.add(bPath);
      continue;
    }

    const plusMatch = /^\+\+\+\s+(.*)$/.exec(line);
    if (plusMatch) {
      const plusPath = tokenizePatchPath(plusMatch[1].replace(/^b\//, ''));
      if (plusPath) touched.add(plusPath);
      continue;
    }
  }

  return [...touched].sort();
}

export function assertPatchPathsAllowed(paths) {
  const bad = (paths || []).filter((p) =>
    DISALLOWED_PATH_PREFIXES.some((prefix) => p.startsWith(prefix)),
  );
  if (bad.length) {
    throw new Error(`Patch attempts to modify protected paths: ${bad.join(', ')}`);
  }
}

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8' });
}

function tryGitApply(patchFile) {
  try {
    execFileSync('git', ['apply', '--index', '--3way', '--whitespace=fix', patchFile], {
      stdio: 'pipe',
    });
    return;
  } catch (error) {
    try {
      execFileSync('git', ['apply', '--index', '--whitespace=fix', patchFile], {
        stdio: 'pipe',
      });
      return;
    } catch (fallbackError) {
      const msg = (fallbackError && fallbackError.stderr)
        ? String(fallbackError.stderr)
        : (fallbackError?.message || 'git apply failed');
      throw new Error(msg);
    }
  }
}

function getChangedFiles() {
  const out = git(['diff', '--cached', '--name-only']).trim();
  if (!out) return [];
  return out.split('\n').map((s) => s.trim()).filter(Boolean);
}

function readEventPayload(eventPath) {
  const raw = fs.readFileSync(eventPath, 'utf8');
  return JSON.parse(raw);
}

async function main() {
  const argv = process.argv.slice(2);
  const shouldApply = argv.includes('--apply');

  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventPath) return; // Exit quietly if not in CI

  const payload = readEventPayload(eventPath);
  const review = payload.review;
  const pr = payload.pull_request;

  if (!review || !pr) {
    writeOutput('result', 'skipped');
    return;
  }

  const authorAssociation = review.author_association || 'NONE';
  const reviewBody = review.body || '';
  const reviewId = review.id;
  const headRef = pr.head?.ref;

  if (!ALLOWED_AUTHOR_ASSOCIATIONS.has(authorAssociation)) {
    writeOutput('result', 'skipped');
    return;
  }

  if (!wantsAutoApply(reviewBody)) {
    writeOutput('result', 'skipped');
    return;
  }

  const blocks = extractPatchBlocks(reviewBody);
  const patchText = blocks.join('\n');
  const touchedPaths = listTouchedPathsFromPatch(patchText);

  if (!patchText.trim()) {
    writeOutput('result', 'error');
    return;
  }

  assertPatchPathsAllowed(touchedPaths);

  if (!shouldApply) {
    writeOutput('result', 'skipped');
    return;
  }

  const patchFile = path.join(os.tmpdir(), `ella-review-${reviewId || 'unknown'}.patch`);
  fs.writeFileSync(patchFile, patchText, 'utf8');

  if (headRef) {
    execFileSync('git', ['checkout', headRef], { stdio: 'ignore' });
  }

  tryGitApply(patchFile);

  const changedFiles = getChangedFiles();
  writeOutput('changed_files', JSON.stringify(changedFiles));

  if (!changedFiles.length) {
    writeOutput('result', 'skipped');
    return;
  }

  const title = `ella: apply review recommendations${reviewId ? ` (review ${reviewId})` : ''}`;
  execFileSync('git', ['commit', '-m', title], { stdio: 'ignore' });
  execFileSync('git', ['push', 'origin', `HEAD:${headRef}`], { stdio: 'ignore' });

  const pushedSha = git(['rev-parse', '--short', 'HEAD']).trim();
  writeOutput('pushed_sha', pushedSha);
  writeOutput('result', 'applied');
}

if (process.env.NODE_ENV !== 'test') {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
