/**
 * build-posts-index.js
 *
 * Scans public/posts/*.md, reads each file's YAML-ish front matter, and writes
 * public/posts/index.json — a lightweight metadata manifest the Articles
 * component loads to power the list, search, sort, tag filter, and pagination.
 *
 * The full Markdown body is NOT included here; the Post component fetches the
 * individual .md file only when a post is opened. This keeps the list fast.
 *
 * Dependency-free (Node built-ins only) to match the project's existing
 * script style and avoid adding build dependencies.
 *
 * Run automatically via the npm `prestart` and `prebuild` hooks, or manually:
 *   node scripts/build-posts-index.js
 */

const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, '..', 'public', 'posts');
const OUTPUT = path.join(POSTS_DIR, 'index.json');
const WORDS_PER_MINUTE = 200;

/**
 * Parse a front matter block of simple `key: value` lines.
 * Supports: strings (quoted or bare), and arrays in either
 *   tags: [a, b, c]   or   tags: a, b, c
 */
function parseFrontMatter(raw) {
  const meta = {};
  const lines = raw.split(/\r?\n/);
  for (const line of lines) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (!key) continue;

    // Array form: [a, b] or bare comma list for known list keys
    const isBracketArray = value.startsWith('[') && value.endsWith(']');
    if (isBracketArray) {
      value = value
        .slice(1, -1)
        .split(',')
        .map((v) => stripQuotes(v.trim()))
        .filter(Boolean);
    } else if (key === 'tags' && value.includes(',')) {
      value = value.split(',').map((v) => stripQuotes(v.trim())).filter(Boolean);
    } else {
      value = stripQuotes(value);
    }
    meta[key] = value;
  }
  return meta;
}

function stripQuotes(s) {
  return s.replace(/^["']|["']$/g, '');
}

/** Split a file into { frontMatter, body }. */
function splitFrontMatter(content) {
  const fmMatch = content.match(/^﻿?---\s*\r?\n([\s\S]*?)\r?\n---\s*(\r?\n|$)/);
  if (!fmMatch) return { frontMatter: {}, body: content };
  const frontMatter = parseFrontMatter(fmMatch[1]);
  const body = content.slice(fmMatch[0].length);
  return { frontMatter, body };
}

/** Rough plain-text excerpt from Markdown body. */
function makeExcerpt(body, max = 200) {
  const text = body
    .replace(/```[\s\S]*?```/g, ' ')      // code fences
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links -> text
    .replace(/[#>*_`~-]/g, ' ')            // markdown punctuation
    .replace(/\$[^$]*\$/g, ' ')            // inline math
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, '') + '…';
}

function readingTimeMinutes(body) {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

function toArray(v) {
  if (Array.isArray(v)) return v;
  if (v == null || v === '') return [];
  return [v];
}

function build() {
  if (!fs.existsSync(POSTS_DIR)) {
    console.error(`[build-posts-index] posts dir not found: ${POSTS_DIR}`);
    fs.mkdirSync(POSTS_DIR, { recursive: true });
  }

  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.toLowerCase().endsWith('.md'));

  const posts = files
    .map((file) => {
      const full = path.join(POSTS_DIR, file);
      const content = fs.readFileSync(full, 'utf8');
      const { frontMatter, body } = splitFrontMatter(content);
      const slug = file.replace(/\.md$/i, '');
      const stat = fs.statSync(full);

      // Skip drafts (front matter `draft: true`).
      const isDraft = String(frontMatter.draft).toLowerCase() === 'true';
      if (isDraft) return null;

      return {
        slug,
        title: frontMatter.title || slug,
        date: frontMatter.date || stat.mtime.toISOString().slice(0, 10),
        tags: toArray(frontMatter.tags),
        excerpt: frontMatter.excerpt || makeExcerpt(body),
        thumbnail: frontMatter.thumbnail || null,
        readingTime: readingTimeMinutes(body),
      };
    })
    .filter(Boolean);

  // Newest first by date.
  posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  const out = {
    generatedAt: new Date().toISOString(),
    count: posts.length,
    posts,
  };

  fs.writeFileSync(OUTPUT, JSON.stringify(out, null, 2) + '\n', 'utf8');
  console.log(`[build-posts-index] wrote ${posts.length} post(s) to ${OUTPUT}`);
}

build();
