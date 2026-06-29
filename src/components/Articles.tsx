import React, { useEffect, useMemo, useState } from 'react';
import { PostMeta, SortKey } from '../types/post';
import { loadPostIndex, formatDate } from '../utils/posts';
import Post from './Post';
import '../assets/styles/Project.scss';
import '../assets/styles/Articles.scss';

const PAGE_SIZE = 6;

function Articles() {
  const [posts, setPosts] = useState<PostMeta[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('date-desc');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadPostIndex()
      .then((data) => {
        if (!cancelled) {
          setPosts(data);
          setStatus('ready');
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setPage(1);
  }, [query, sortKey, activeTag]);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matched = posts.filter((p) => {
      const matchesTag = !activeTag || p.tags.includes(activeTag);
      if (!matchesTag) return false;
      if (!q) return true;
      const haystack = [p.title, p.excerpt, p.tags.join(' ')].join(' ').toLowerCase();
      return haystack.includes(q);
    });

    const sorted = [...matched].sort((a, b) => {
      switch (sortKey) {
        case 'date-asc':
          return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'date-desc':
        default:
          return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
      }
    });
    return sorted;
  }, [posts, query, activeTag, sortKey]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const selectedPost = selectedSlug
    ? posts.find((p) => p.slug === selectedSlug) ?? null
    : null;

  if (selectedPost) {
    return (
      <div className="projects-container" id="articles">
        <Post post={selectedPost} onBack={() => setSelectedSlug(null)} />
      </div>
    );
  }

  const showFullArticles = () => {
    console.log("clicked!");
  }

  return (
    <div className="projects-container" id="articles">
      <h1 onClick={showFullArticles}>Articles</h1>

      {status === 'loading' && <p>Loading articles...</p>}
      {status === 'error' && <p>Articles could not be loaded right now.</p>}
      {status === 'ready' && posts.length === 0 && <p>Coming soon...</p>}

      {status === 'ready' && posts.length > 0 && (
        <>
          <div className="articles-controls">
            <input
              className="articles-search"
              type="search"
              placeholder="Search articles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search articles"
            />
            <select
              className="articles-sort"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              aria-label="Sort articles"
            >
              <option value="date-desc">Newest first</option>
              <option value="date-asc">Oldest first</option>
              <option value="title-asc">Title (A-Z)</option>
            </select>
          </div>

          {allTags.length > 0 && (
            <div className="articles-tags">
              <button
                type="button"
                className={`tag-chip ${activeTag === null ? 'active' : ''}`}
                onClick={() => setActiveTag(null)}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  className={`tag-chip ${activeTag === tag ? 'active' : ''}`}
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          {filtered.length === 0 ? (
            <p className="articles-empty">No articles match your search.</p>
          ) : (
            <div className="projects-grid">
              {pageItems.map((post) => (
                <div
                  className="project article-card"
                  key={post.slug}
                  onClick={() => setSelectedSlug(post.slug)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedSlug(post.slug);
                    }
                  }}
                >
                  {post.thumbnail && (
                    <img src={post.thumbnail} className="zoom" alt={post.title} width="100%" />
                  )}
                  <h2>{post.title}</h2>
                  <p className="article-date">
                    {formatDate(post.date)} - {post.readingTime} min read
                  </p>
                  <p>{post.excerpt}</p>
                  {post.tags.length > 0 && (
                    <div className="card-tags">
                      {post.tags.map((tag) => (
                        <span className="card-tag" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="articles-pagination">
              <button type="button" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                Prev
              </button>
              <span className="page-indicator">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Articles;
