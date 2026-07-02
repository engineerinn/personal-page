import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import { PostMeta } from '../types/post';
import { loadPostBody, formatDate } from '../utils/posts';

interface PostProps {
  post: PostMeta;
  onBack: () => void;
}

/**
 * Renders a single post's Markdown body (fetched by slug) with GitHub-flavored
 * Markdown, LaTeX math (KaTeX), and syntax-highlighted code blocks.
 */
function Post({ post, onBack }: PostProps) {
  const [body, setBody] = useState<string>('');
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    loadPostBody(post.slug)
      .then((text) => {
        if (!cancelled) {
          setBody(text);
          setStatus('ready');
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    // Jump to top when opening a post.
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => {
      cancelled = true;
    };
  }, [post.slug]);

  return (
    <div className="post-container">
      <button className="post-back" onClick={onBack} type="button" id="return-button">
        ← Back to articles
      </button>

      <article className="post">
        <h1 className="post-title">{post.title}</h1>
        <p className="post-meta">
          {formatDate(post.date)} · {post.readingTime} min read
        </p>
        {post.tags.length > 0 && (
          <div className="post-tags">
            {post.tags.map((tag) => (
              <span className="post-tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {status === 'loading' && <p className="post-status">Loading…</p>}
        {status === 'error' && (
          <p className="post-status">Sorry, this post could not be loaded.</p>
        )}
        {status === 'ready' && (
          <div className="post-body">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex, rehypeHighlight]}>
              {body}
            </ReactMarkdown>
          </div>
        )}
      </article>
    </div>
  );
}

export default Post;
