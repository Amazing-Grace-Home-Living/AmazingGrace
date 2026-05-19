#!/usr/bin/env node

/**
 * GitHub Ruleset Bypass Helper
 *
 * Generates bypass actor JSON snippets and (optionally) applies them to a
 * repository ruleset via the GitHub REST API.
 *
 * Commands:
 *   snippet --app <app-slug> [--mode always|pull_request]
 *   list-rulesets [--owner <owner> --repo <repo>]
 *   list-installations [--owner <owner> --repo <repo>]
 *   add-bypass --ruleset <id> (--app <app-slug> | --actor-id <id> --actor-type <type>) [--mode always|pull_request] [--dry-run]
 *
 * Auth:
 *   GITHUB_TOKEN (or GH_TOKEN) is required for list/apply commands.
 */

const DEFAULT_API_BASE = 'https://api.github.com';

const KNOWN_APP_IDS = {
  // Public GitHub App: https://api.github.com/apps/github-actions
  'github-actions': 15368,
};

function normalizeWhitespace(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const command = args[0] || 'help';
  const options = {};

  for (let i = 1; i < args.length; i++) {
    const token = args[i];
    if (!token.startsWith('--')) continue;

    const key = token.slice(2);
    const next = args[i + 1];
    const hasValue = next && !next.startsWith('--');

    if (!hasValue) {
      options[key] = true;
      continue;
    }

    options[key] = next;
    i++;
  }

  return { command, options };
}

function getRepoFromEnvOrOptions(options) {
  const fromOptions = options.owner && options.repo ? `${options.owner}/${options.repo}` : '';
  if (fromOptions) return { owner: options.owner, repo: options.repo };

  const envRepo = process.env.GITHUB_REPOSITORY;
  if (!envRepo || !envRepo.includes('/')) return { owner: '', repo: '' };
  const [owner, repo] = envRepo.split('/');
  return { owner, repo };
}

function getToken() {
  return process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
}

async function ghFetchJson(url, { token, method, body } = {}) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'AmazingGraceRulesetBypassTool',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body) headers['Content-Type'] = 'application/json';

  const res = await fetch(url, {
    method: method || (body ? 'POST' : 'GET'),
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }

  if (!res.ok) {
    const message = json && json.message ? json.message : text;
    throw new Error(`GitHub API ${res.status} ${res.statusText}: ${normalizeWhitespace(message)}`);
  }

  return json;
}

async function resolveIntegrationAppId(appSlug) {
  const slug = String(appSlug || '').trim();
  if (!slug) throw new Error('Missing app slug');

  if (KNOWN_APP_IDS[slug]) return KNOWN_APP_IDS[slug];

  const url = `${DEFAULT_API_BASE}/apps/${encodeURIComponent(slug)}`;
  const json = await ghFetchJson(url);
  if (!json || !json.id) throw new Error(`Unable to resolve app id for slug "${slug}"`);
  return json.id;
}

function normalizeBypassMode(value) {
  const mode = String(value || 'always').toLowerCase();
  if (mode === 'always') return 'always';
  if (mode === 'pull_request' || mode === 'pull-request') return 'pull_request';
  throw new Error(`Invalid bypass mode "${value}" (expected always|pull_request)`);
}

async function buildBypassActor(options) {
  const mode = normalizeBypassMode(options.mode);

  if (options['actor-id'] && options['actor-type']) {
    const actorId = Number(options['actor-id']);
    if (!Number.isFinite(actorId) || actorId <= 0) throw new Error('actor-id must be a positive number');
    return {
      actor_type: String(options['actor-type']),
      actor_id: actorId,
      bypass_mode: mode,
    };
  }

  if (options.app) {
    const actorId = await resolveIntegrationAppId(options.app);
    return {
      actor_type: 'Integration',
      actor_id: actorId,
      bypass_mode: mode,
    };
  }

  throw new Error('Provide --app <app-slug> or --actor-id <id> --actor-type <type>');
}

function printHelp() {
  process.stdout.write(
    [
      'GitHub Ruleset Bypass Helper',
      '',
      'Commands:',
      '  snippet --app <app-slug> [--mode always|pull_request]',
      '  list-rulesets [--owner <owner> --repo <repo>]',
      '  list-installations [--owner <owner> --repo <repo>]',
      '  add-bypass --ruleset <id> (--app <app-slug> | --actor-id <id> --actor-type <type>) [--mode always|pull_request] [--dry-run]',
      '',
      'Auth:',
      '  GITHUB_TOKEN (or GH_TOKEN) is required for list/apply commands.',
      '',
    ].join('\n'),
  );
}

async function listRulesets({ owner, repo, token }) {
  const url = `${DEFAULT_API_BASE}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/rulesets`;
  const json = await ghFetchJson(url, { token });
  const rulesets = Array.isArray(json) ? json : [];

  for (const ruleset of rulesets) {
    const id = ruleset.id;
    const name = ruleset.name || '';
    const target = ruleset.target || '';
    const enforcement = ruleset.enforcement || '';
    process.stdout.write(`${id}\t${name}\t${target}\t${enforcement}\n`);
  }
}

async function listInstallations({ owner, repo, token }) {
  const url = `${DEFAULT_API_BASE}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/installations`;
  const json = await ghFetchJson(url, { token });
  const installations = Array.isArray(json)
    ? json
    : Array.isArray(json?.installations)
      ? json.installations
      : [];

  for (const installation of installations) {
    const appId = installation.app_id;
    const appSlug = installation.app_slug || '';
    const targetType = installation.target_type || '';
    process.stdout.write(`${appId}\t${appSlug}\t${targetType}\n`);
  }
}

function hasBypassActor(existing, candidate) {
  return (existing || []).some(
    (actor) =>
      Number(actor.actor_id) === Number(candidate.actor_id) &&
      String(actor.actor_type) === String(candidate.actor_type) &&
      String(actor.bypass_mode || 'always') === String(candidate.bypass_mode || 'always'),
  );
}

async function addBypassActor({ owner, repo, token, rulesetId, bypassActor, dryRun }) {
  const getUrl = `${DEFAULT_API_BASE}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/rulesets/${encodeURIComponent(
    rulesetId,
  )}`;
  const ruleset = await ghFetchJson(getUrl, { token });
  const bypassActors = Array.isArray(ruleset.bypass_actors) ? ruleset.bypass_actors : [];

  if (hasBypassActor(bypassActors, bypassActor)) {
    process.stdout.write('Bypass actor already present; no changes.\n');
    return;
  }

  const nextBypassActors = [...bypassActors, bypassActor];
  const patchBody = {
    name: ruleset.name,
    target: ruleset.target,
    enforcement: ruleset.enforcement,
    conditions: ruleset.conditions,
    rules: ruleset.rules,
    bypass_actors: nextBypassActors,
  };

  if (dryRun) {
    process.stdout.write(JSON.stringify(patchBody, null, 2) + '\n');
    return;
  }

  const patchUrl = `${DEFAULT_API_BASE}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/rulesets/${encodeURIComponent(
    rulesetId,
  )}`;
  await ghFetchJson(patchUrl, { token, method: 'PATCH', body: patchBody });
  process.stdout.write('Updated ruleset bypass actors.\n');
}

async function main() {
  const { command, options } = parseArgs(process.argv);

  if (command === 'help' || options.help) {
    printHelp();
    return;
  }

  if (command === 'snippet') {
    const actor = await buildBypassActor(options);
    process.stdout.write(JSON.stringify(actor, null, 2) + '\n');
    return;
  }

  const token = getToken();
  if (!token) {
    throw new Error('Missing GITHUB_TOKEN (or GH_TOKEN).');
  }

  const { owner, repo } = getRepoFromEnvOrOptions(options);
  if (!owner || !repo) {
    throw new Error('Missing repo. Provide --owner and --repo, or set GITHUB_REPOSITORY.');
  }

  if (command === 'list-rulesets') {
    await listRulesets({ owner, repo, token });
    return;
  }

  if (command === 'list-installations') {
    await listInstallations({ owner, repo, token });
    return;
  }

  if (command === 'add-bypass') {
    const rulesetId = options.ruleset;
    if (!rulesetId) throw new Error('Missing --ruleset <id>');
    const actor = await buildBypassActor(options);
    await addBypassActor({
      owner,
      repo,
      token,
      rulesetId,
      bypassActor: actor,
      dryRun: Boolean(options['dry-run']),
    });
    return;
  }

  throw new Error(`Unknown command "${command}"`);
}

module.exports = {
  KNOWN_APP_IDS,
  buildBypassActor,
  normalizeBypassMode,
  parseArgs,
  resolveIntegrationAppId,
};

if (require.main === module) {
  main().catch((error) => {
    process.stderr.write(`${normalizeWhitespace(error && error.message ? error.message : String(error))}\n`);
    process.exit(1);
  });
}

