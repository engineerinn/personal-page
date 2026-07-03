import { PostIndex, PostMeta } from '../types/post';


// Root-relative URLs work in dev (localhost) and in production at the site
// root (rinnadia.com), avoiding any dependency on Vite's `base` setting.

const POSTS_BASE = '/posts';

let postIndexPromise: Promise<PostMeta[]> | null = null;
let postIndexMapPromise: Promise<Map<string, PostMeta>> | null = null;


function fail(message: string): never {
  throw new Error(message);
}

/**
 * Load the lightweight post index (metadata only) that powers the
 * Articles list, search, sort, tag filter, and pagination.
 */
export function getPostIndex(): Promise<PostMeta[]> {
  if (!postIndexPromise) {
    postIndexPromise = fetchPostIndex();
    if(postIndexPromise != null) {
      postIndexMapPromise = postIndexPromise.then(
          (posts) => new Map(posts.map((p) => [p.slug, p]))
      );
    }
  }
  return postIndexPromise;
}

async function fetchPostIndex(): Promise<PostMeta[]> {
  const res = await fetch(`${POSTS_BASE}/index.json`); // drop cache:'no-cache'
  if (!res.ok) {
    postIndexPromise = null;          // let it retry on next call
    throw new Error(`Failed to load posts index (${res.status})`);
  }
  const data: PostIndex = await res.json();
  return data.posts ?? [];
}

export async function getPostData(slug: string): Promise<PostMeta> {
  if (!postIndexPromise) {
      getPostIndex();
  }
  const data = await postIndexMapPromise;
  return data?.get(slug) ?? fail(`Failed to load post "${slug}"`);
}
/**
 * Strip a leading YAML front matter block (--- ... ---) from raw Markdown,
 * returning just the body. The list already has the metadata, so the post
 * view only needs the content.
 */
export function stripFrontMatter(raw: string): string {
  const match = raw.match(/^﻿?---\s*\r?\n[\s\S]*?\r?\n---\s*(\r?\n|$)/);
  return match ? raw.slice(match[0].length) : raw;
}

/**
 * Fetch the full Markdown body for one post by slug. Called only when a
 * post is opened, so large content isn't loaded up front.
 */
export async function loadPostBody(slug: string): Promise<string> {
  const fetchingResponse = await fetch(`${POSTS_BASE}/${encodeURIComponent(slug)}.md`, {
    cache: 'default',
  });
  if (!fetchingResponse.ok) {
    throw new Error(`Failed to load post "${slug}" (${fetchingResponse.status})`);
  }
  const rawData = await fetchingResponse.text();
  return stripFrontMatter(rawData);
}

export function formatDate(isoDate: string): string {
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
