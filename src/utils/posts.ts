import { PostIndex, PostMeta } from '../types/post';
import {data} from "react-router";

// Root-relative URLs work in dev (localhost) and in production at the site
// root (rinnadia.com), avoiding any dependency on Vite's `base` setting.
const POSTS_BASE = '/posts';

/**
 * Load the lightweight post index (metadata only) that powers the
 * Articles list, search, sort, tag filter, and pagination.
 */
export async function loadPostIndex(): Promise<PostMeta[]> {
  const res = await fetch(`${POSTS_BASE}/index.json`, { cache: 'no-cache' });
  if (!res.ok) {
    throw new Error(`Failed to load posts index (${res.status})`);
  }
  const data: PostIndex = await res.json();

  console.log("Data from PostIndex", data);

  return data.posts ?? [];
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
    cache: 'no-cache',
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
