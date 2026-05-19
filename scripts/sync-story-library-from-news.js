#!/usr/bin/env node

/**
 * Syncs News article pages into the Storybook Library (`stories/library.json`).
 *
 * Usage:
 *   node scripts/sync-story-library-from-news.js
 *   node scripts/sync-story-library-from-news.js --check
 *   node scripts/sync-story-library-from-news.js --dry-run
 *
 * This tool manages entries with `source: "news"` and keeps the rest of the
 * story library intact.
 */

const fs = require('node:fs');
const path = require('node:path');

const REPO_ROOT = process.cwd();
const STORIES_LIBRARY_PATH = path.join(REPO_ROOT, 'stories', 'library.json');
const NEWS_ARTICLES_DIR = path.join(REPO_ROOT, 'news', 'articles');

function readUtf8(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function writeUtf8(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
}

function normalizeWhitespace(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function decodeMinimalEntities(text) {
  return String(text || '')
    .replace(/&mdash;/g, '—')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function extractFirst(re, text) {
  const match = re.exec(text);
  return match ? match[1] : '';
}

function extractNewsArticleMetadata(html) {
  const decoded = decodeMinimalEntities(html);
  const title = normalizeWhitespace(
    extractFirst(/<h1[^>]*>([^<]+)<\/h1>/i, decoded) ||
      extractFirst(/<title[^>]*>([^<]+)<\/title>/i, decoded),
  );

  const description = normalizeWhitespace(
    extractFirst(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']\s*\/?>/i, decoded),
  );

  const tag = normalizeWhitespace(
    extractFirst(/<span[^>]*class=["'][^"']*\btag\b[^"']*["'][^>]*>([^<]+)<\/span>/i, decoded),
  );

  const meta = normalizeWhitespace(
    extractFirst(/<p[^>]*class=["'][^"']*\bmeta\b[^"']*["'][^>]*>([\s\S]*?)<\/p>/i, decoded),
  );

  let author = '';
  let date = '';
  if (meta) {
    const parts = meta.split('—').map((p) => normalizeWhitespace(p)).filter(Boolean);
    author = parts[0] || '';
    date = parts.slice(1).join(' — ');
  }

  return { title, description, tag, author, date };
}

function toSlug(basename) {
  return `news-${basename}`
    .replace(/[^a-zA-Z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

function normalizeTag(tag) {
  return normalizeWhitespace(tag).toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/-+/g, '-');
}

function buildNewsEntry(articleFileName, metadata) {
  const basename = articleFileName.replace(/\.html$/i, '');
  const tag = normalizeTag(metadata.tag);

  const tags = ['news'];
  if (tag && !tags.includes(tag)) tags.push(tag);

  const entryTitle = metadata.title || basename;
  const entryAuthor = metadata.author || 'Amazing Grace Home Living';

  return {
    title: entryTitle,
    author: entryAuthor,
    genre: 'News / Article',
    series: 'News',
    type: 'blog',
    source: 'news',
    slug: toSlug(basename),
    // Keep links preview-safe for GitHub Pages PR deploys.
    path: `../news/articles/${articleFileName}`,
    tags,
    summary: metadata.description || `Read "${entryTitle}".`,
    ...(metadata.date ? { published: metadata.date } : {}),
  };
}

function listNewsArticleFiles() {
  if (!fs.existsSync(NEWS_ARTICLES_DIR)) return [];
  return fs
    .readdirSync(NEWS_ARTICLES_DIR)
    .filter((name) => name.toLowerCase().endsWith('.html'))
    .sort((a, b) => a.localeCompare(b));
}

function loadLibraryJson() {
  const raw = readUtf8(STORIES_LIBRARY_PATH);
  return { raw, json: JSON.parse(raw) };
}

function formatJson(value) {
  return JSON.stringify(value, null, 2) + '\n';
}

function syncLibraryWithNews(libraryJson) {
  const existingEntries = Array.isArray(libraryJson.entries) ? libraryJson.entries : [];

  const keptEntries = existingEntries.filter((entry) => {
    const source = String(entry && entry.source ? entry.source : '');
    if (source === 'news') {
      return false;
    }

    const slug = String(entry && entry.slug ? entry.slug : '');
    const entryPath = String(entry && entry.path ? entry.path : '');
    if (slug.startsWith('news-') && entryPath.startsWith('../news/articles/')) {
      return false;
    }

    return true;
  });

  const newsEntries = listNewsArticleFiles().map((fileName) => {
    const html = readUtf8(path.join(NEWS_ARTICLES_DIR, fileName));
    const metadata = extractNewsArticleMetadata(html);
    return buildNewsEntry(fileName, metadata);
  });

  return {
    ...libraryJson,
    entries: [...keptEntries, ...newsEntries],
  };
}

function deepEqualJson(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

async function main() {
  const args = new Set(process.argv.slice(2));
  const dryRun = args.has('--dry-run');
  const check = args.has('--check');

  const { json: libraryJson } = loadLibraryJson();
  const next = syncLibraryWithNews(libraryJson);
  const formatted = formatJson(next);

  if (dryRun) {
    process.stdout.write(formatted);
    return;
  }

  if (check) {
    const current = JSON.parse(readUtf8(STORIES_LIBRARY_PATH));
    if (!deepEqualJson(current, next)) {
      console.error('stories/library.json is out of sync with news/articles. Run: node scripts/sync-story-library-from-news.js');
      process.exit(1);
    }
    return;
  }

  writeUtf8(STORIES_LIBRARY_PATH, formatted);
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : String(error));
  process.exit(1);
});

