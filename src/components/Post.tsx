import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import { PostMeta } from '../types/post';
import { useLocation, useParams } from 'react-router';
import { loadPostBody, getPostData, formatDate } from '../utils/posts';
import {useNavigate} from "react-router";

/**
 * Renders a single post's Markdown body (fetched by slug) with GitHub-flavored
 * Markdown, LaTeX math (KaTeX), and syntax-highlighted code blocks.
 */
function Post() {
  const { slug } = useParams();
  const location = useLocation();
  const statePost = (location.state as { post?: PostMeta } | null)?.post ?? null;
  const navigate = useNavigate();

  const [post, setPost] = useState<PostMeta | null>(statePost);
  const [body, setBody] = useState<string>('');
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    if (!slug) {
      setStatus('error');
      return;
    }
    // Only refetch metadata if we didn't get it via navigation state
    const metaPromise = post ? Promise.resolve(post) : getPostData(slug);

    metaPromise
      .then((data) => {
        if (!data) throw new Error('not found');
        setPost(data);
        return loadPostBody(slug);
      })
      .then((text) => {
        setBody(text);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, [slug]);

  if (status === 'loading' && !post) {
    return <p className="post-status">Loading…</p>;
  }


  return (
      <div className="projects-container" id="articles">
      <div className="post-container">
      <button className="post-back" type="button" onClick={ ()=> navigate(-1)}>
          ← Back to Articles List</button>
      <article className="post">
        {status === 'loading' && <p>Loading Article...</p>}
        {status === 'error' && <p className="post-status">Sorry, this post could not be loaded.</p>}
          {status === 'ready' && post && (
              <>
                  <h1 className="post-title">{post.title}</h1>
                  <p className="post-meta">
                      {formatDate(post.date)} · {post.readingTime} min read
                  </p>

                  {post.tags.length > 0 && (
                      <div className="post-tags">
                          {post.tags.map((tag) => (
                              <span className="post-tag" key={tag}>{tag}</span>
                          ))}
                      </div>
                  )}

                  <div className="post-body">
                      <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex, rehypeHighlight]}>
                          {body}
                      </ReactMarkdown>
                  </div>
              </>

        )}
      </article>
    </div>
          </div>
  );
}

export default Post;
