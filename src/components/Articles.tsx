import React, { useEffect, useMemo, useState } from 'react';
import { PostMeta, SortKey } from '../types/post';
import { getPostIndex, formatDate } from '../utils/posts';
import '../assets/styles/Project.scss';
import '../assets/styles/Articles.scss';
import {useNavigate} from "react-router";

function Articles() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostMeta[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [page, setPage] = useState(1);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getPostIndex()
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

    //Default sorting is by date descending!
    const sorted = [...posts].sort((a, b) => {
          return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
    });

    const latestPosts = sorted.slice(0, 6);


  const showFullArticles = () => {
    navigate('/articles-list', { state: {} });
  }

  return (
    <div className="projects-container" id="articles">
      <div className="article-section-header">
        <h1 id="section-header">Latest Articles</h1>
        <h1 id="article-list" onClick={showFullArticles}> Article List</h1>
      </div>

      {status === 'loading' && <p>Loading articles...</p>}
      {status === 'error' && <p>Articles could not be loaded right now.</p>}
      {status === 'ready' && posts.length === 0 && <p>Coming soon...</p>}
      {status === 'ready' && posts.length > 0 && (
        <>


            <div className="projects-grid">
              {latestPosts.map((post) => (
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

        </>
      )}
    </div>
  );
}

export default Articles;
