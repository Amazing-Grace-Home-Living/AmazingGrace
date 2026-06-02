import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const DIST_DIR = path.resolve('dist');
const ARCADE_DIR = path.join(DIST_DIR, 'arcade');
const HTML_EXTENSIONS = new Set(['.html']);
const ASSET_EXTENSIONS = new Set([
  '.js', '.mjs', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp',
  '.ico', '.json', '.txt', '.xml', '.webmanifest', '.mp3', '.wav', '.ogg',
  '.mp4', '.webm', '.pdf'
]);

const htmlFiles = [];
const errors = [];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath);
    } else if (entry.isFile()) {
      htmlFiles.push(fullPath);
    }
  }
}

function isExternalLink(value) {
  return /^(https?:|mailto:|tel:|data:|javascript:)/i.test(value);
}

function stripHashAndQuery(value) {
  return value.split('#')[0].split('?')[0];
}

async function exists(targetPath) {
  try {
    await stat(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function resolveBuiltPath(fromHtmlFile, rawRef) {
  const cleanRef = stripHashAndQuery(rawRef).trim();
  if (!cleanRef) return null;
  if (cleanRef.startsWith('#')) return null;
  if (isExternalLink(cleanRef)) return null;

  let resolved;

  if (cleanRef.startsWith('/')) {
    resolved = path.join(DIST_DIR, cleanRef.slice(1));
  } else {
    resolved = path.resolve(path.dirname(fromHtmlFile), cleanRef);
  }

  if (await exists(resolved)) {
    return resolved;
  }

  if (path.extname(resolved) === '') {
    const asHtml = `${resolved}.html`;
    if (await exists(asHtml)) return asHtml;

    const asIndex = path.join(resolved, 'index.html');
    if (await exists(asIndex)) return asIndex;
  }

  return null;
}

function collectRefs(html) {
  const refs = [];
  const refRegex = /(?:href|src)=["']([^"']+)["']/gi;
  let match;

  while ((match = refRegex.exec(html)) !== null) {
    refs.push(match[1]);
  }

  const metaTagRegex = /<meta\b[^>]*>/gi;
  while ((match = metaTagRegex.exec(html)) !== null) {
    const tag = match[0];
    if (!/\bhttp-equiv=["']refresh["']/i.test(tag)) continue;

    const contentMatch = tag.match(/\bcontent=["']([^"']+)["']/i);
    if (!contentMatch) continue;

    const refreshUrlMatch = contentMatch[1].match(
      /(?:^|;\s*)url\s*=\s*(?:"([^"]*)"|'([^']*)'|([^;]*))/i
    );
    if (!refreshUrlMatch) continue;

    const [_fullMatch, doubleQuotedUrl, singleQuotedUrl, bareUrl] = refreshUrlMatch;
    const refreshUrl = [doubleQuotedUrl, singleQuotedUrl, bareUrl]
      .find((candidate) => candidate !== undefined)
      ?.trim() ?? '';
    if (refreshUrl) {
      refs.push(refreshUrl);
    }
  }

  return refs;
}

function shouldCheck(ref) {
  const clean = stripHashAndQuery(ref).trim();
  if (!clean) return false;
  if (clean.startsWith('#')) return false;
  if (isExternalLink(clean)) return false;

  const ext = path.extname(clean).toLowerCase();
  if (!ext) return true;
  return HTML_EXTENSIONS.has(ext) || ASSET_EXTENSIONS.has(ext);
}

await walk(ARCADE_DIR);

for (const file of htmlFiles) {
  if (path.extname(file).toLowerCase() !== '.html') continue;

  const html = await readFile(file, 'utf8');
  const refs = collectRefs(html);

  for (const ref of refs) {
    if (!shouldCheck(ref)) continue;

    const resolved = await resolveBuiltPath(file, ref);
    if (!resolved) {
      errors.push({
        file: path.relative(process.cwd(), file),
        ref
      });
    }
  }
}

if (errors.length) {
  console.error(`Found ${errors.length} broken internal arcade references in dist:\n`);
  for (const error of errors) {
    console.error(`- ${error.file} -> ${error.ref}`);
  }
  process.exit(1);
}

console.log('All checked internal arcade dist links and asset references resolved successfully.');

