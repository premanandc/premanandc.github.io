import { useState } from 'react';

interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  readingTime: string;
  coverImage?: string;
}

interface Props {
  posts: Post[];
  allTags: string[];
}

export default function TagFilter({ posts, allTags }: Props) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = activeTag
    ? posts.filter(p => p.tags.includes(activeTag))
    : posts;

  return (
    <div>
      <div className="tag-filter-bar">
        <button
          className={`filter-tag ${activeTag === null ? 'active' : ''}`}
          onClick={() => setActiveTag(null)}
        >
          All
        </button>
        {allTags.map(tag => (
          <button
            key={tag}
            className={`filter-tag ${activeTag === tag ? 'active' : ''}`}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
          >
            {tag}
          </button>
        ))}
      </div>
      <div className="posts-list">
        {filtered.map(post => (
          <a key={post.slug} href={`/blog/${post.slug}`} className="post-card">
            {post.coverImage && (
              <img src={post.coverImage} alt={post.title} className="post-cover" />
            )}
            <div className="post-card-body">
              <div className="post-meta">
                <span className="post-date">{post.date}</span>
                <span className="post-meta-dot">&bull;</span>
                <span className="post-reading">{post.readingTime}</span>
              </div>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <div className="post-tags">
                {post.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
