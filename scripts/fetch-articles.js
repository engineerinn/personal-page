/**
 * Build-time fetcher for the Medium RSS feed.
 *
 * Fetches https://medium.com/feed/@<username>, normalizes the items, and
 * writes them to src/data/articles.json so the Articles section ships with
 * static data (no runtime dependency, no CORS issues).
 *
 * Wired to the `prebuild` npm hook, so it runs automatically on
 * `npm run build` / `npm run deploy`. Run manually with `npm run fetch:articles`.
 *
 * Resilience: if the fetch fails but a previous articles.json exists, the
 * build proceeds with stale data instead of failing.
 */

const fs = require('fs');
const path = require('path');

const config = require('../src/config/medium.json');

const FEED_URL = `https://medium.com/feed/@${config.username}`;
const OUTPUT_PATH = path.join(__dirname, '..', 'src', 'data', 'articles.json');

/** Extract the text of a tag, unwrapping CDATA if present. */
function extractTag(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  if (!match) return '';
  return match[1].replace(/^<!\[CDATA\[([\s\S]*)\]\]>$/, '$1').trim();
}

/** Extract all occurrences of a tag (used for <category>). */
function extractTags(xml, tag) {
  const matches = xml.match(new RegExp(`<${tag}[^>]*>[\\s\\S]*?</${tag}>`, 'g')) || [];
  return matches.map((m) => extractTag(m, tag));
}

/** First real <img> in the post body, ignoring Medium's 1px tracking pixel. */
function extractThumbnail(html) {
  const imgs = html.match(/<img[^>]+src="([^"]+)"/g) || [];
  for (const img of imgs) {
    const src = img.match(/src="([^"]+)"/)[1];
    if (!src.includes('medium.com/_/stat')) return src;
  }
  return null;
}

/** Strip HTML tags and collapse whitespace into a short plain-text snippet. */
function toSnippet(html, maxLength = 200) {
  const text = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).replace(/\s+\S*$/, '')}…`;
}

function parseFeed(xml) {
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
  return items.slice(0, config.maxArticles).map((item) => {
    const content = extractTag(item, 'content:encoded');
    return {
      title: extractTag(item, 'title'),
      link: extractTag(item, 'link').split('?')[0],
      pubDate: new Date(extractTag(item, 'pubDate')).toISOString(),
      thumbnail: extractThumbnail(content),
      snippet: toSnippet(content),
      categories: extractTags(item, 'category'),
    };
  });
}

async function main() {
  let xml;
  try {
    // FEED_FILE lets you run the parser against a saved XML file
    // (offline development / testing): FEED_FILE=feed.xml npm run fetch:articles
    if (process.env.FEED_FILE) {
      xml = fs.readFileSync(process.env.FEED_FILE, 'utf8');
    } else {
      const res = await fetch(FEED_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      xml = await res.text();
    }
  } catch (err) {
    if (fs.existsSync(OUTPUT_PATH)) {
      console.warn(`[fetch-articles] Fetch failed (${err.message}); keeping existing articles.json`);
      process.exit(0);
    }
    console.error(`[fetch-articles] Fetch failed and no cached articles.json exists: ${err.message}`);
    process.exit(1);
  }

  const articles = parseFeed(xml);
  if (articles.length === 0) {
    console.warn('[fetch-articles] Feed parsed but contained no items; writing empty list.');
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    source: FEED_URL,
    articles,
  };

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`[fetch-articles] Wrote ${articles.length} article(s) to src/data/articles.json`);
}

main();
