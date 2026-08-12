import React, { useState } from 'react';
import { Calendar, Clock, ArrowLeft, BookOpen } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  date: string;
  readTime: string;
  category: string;
  excerpt: string;
  content: string[];
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: 'Building Bloop: Reinventing Git Workflows with AI',
    date: 'August 12, 2026',
    readTime: '4 min read',
    category: 'Engineering',
    excerpt: 'How I built an AI-powered CLI assistant in TypeScript to automate conventional commit messages, structure pull requests, and summarize branch changes.',
    content: [
      'As developers, we commit code dozens of times a day. Writing structured, conventional commit messages and descriptive pull requests is essential for team collaboration, but it is also a repetitive task that often leads to short, unhelpful logs like "fixed bugs" or "updates".',
      'To solve this developer friction, I built Bloop—a lightweight, interactive CLI assistant written in TypeScript. Bloop integrates directly with your local Git repository to fetch changes, analyze diffs, and generate conventional commit messages on the fly.',
      'Under the hood, Bloop utilizes LLMs to comprehend code updates. It doesn\'t just look at file names; it parses the abstract diffs to understand the *intent* of the change. For example, if you modify a React component and its CSS rules, Bloop classifies it as a `feat(ui)` or `fix(styles)` automatically.',
      'Beyond commit messages, Bloop speeds up GitHub workflows by creating detailed pull request descriptions. It summarizes branch changes, groups updates by module, and drafts markdown summaries ready to copy or submit directly via the GitHub API. It has significantly streamlined my daily commit routine, making repository documentation effortless and reliable.'
    ]
  },
  {
    id: 2,
    title: 'Getting Started with Swift: An Intern\'s Perspective',
    date: 'July 24, 2026',
    readTime: '3 min read',
    category: 'Mobile Dev',
    excerpt: 'Reflections and core design lessons learned during my internship developing Swift-based iOS applications at Ramaiah Institute of Technology.',
    content: [
      'Transitioning from Web Development (React/Node) to native mobile development in Swift during my internship at Ramaiah Institute of Technology was an eye-opening journey. The level of type safety, compilation speed, and tight hardware-software integration in the Apple ecosystem provided a totally different perspective on software design.',
      'My primary assignment during the internship was building a gamified educational application for learning programming concepts. We used Swift Playgrounds and UIKit to implement interactive coding challenges. The goal was to let users drag, drop, and rearrange code segments to solve logical puzzles.',
      'I quickly realized that UI responsiveness on mobile devices requires absolute precision. Unlike web layouts where DOM nodes are highly forgiving, native mobile render pipelines demand carefully managed constraint systems. Storing local user progress state via CoreData taught me the importance of disk I/O optimization and thread management.',
      'Swift\'s syntax—with features like optionals, guard statements, and protocols—encourages clean, robust code by default. It has made me a better engineer, showing me how structural static typing and careful view lifecycle management translate into reliable, fluid software.'
    ]
  }
];

export const Blog: React.FC = () => {
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const selectedPost = BLOG_POSTS.find(post => post.id === selectedPostId);

  if (selectedPost) {
    return (
      <section id="blog-post-view" className="blog-post-container">
        <button 
          onClick={() => setSelectedPostId(null)} 
          className="blog-back-btn"
        >
          <ArrowLeft size={16} />
          <span>Back to Articles</span>
        </button>

        <article className="full-article">
          <header className="article-header">
            <div className="article-meta">
              <span className="article-category-badge">{selectedPost.category}</span>
              <span className="article-meta-item">
                <Calendar size={14} />
                <span>{selectedPost.date}</span>
              </span>
              <span className="article-meta-item">
                <Clock size={14} />
                <span>{selectedPost.readTime}</span>
              </span>
            </div>
            <h1 className="article-title">{selectedPost.title}</h1>
          </header>

          <div className="article-body">
            {selectedPost.content.map((paragraph, index) => (
              <p key={index} className="article-paragraph">
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      </section>
    );
  }

  return (
    <section id="blog-list" className="blog-list-container">
      <h3 className="section-title">Writing & Thoughts</h3>
      <p className="section-desc">
        Articles and logs on software engineering, technical projects, and my experiences learning web and mobile technologies.
      </p>

      <div className="blog-grid">
        {BLOG_POSTS.map((post) => (
          <div 
            key={post.id} 
            className="blog-card"
            onClick={() => setSelectedPostId(post.id)}
          >
            <div className="blog-card-meta">
              <span className="blog-category">{post.category}</span>
              <span className="blog-date">{post.date}</span>
            </div>

            <h4 className="blog-card-title">{post.title}</h4>
            <p className="blog-card-excerpt">{post.excerpt}</p>
            
            <div className="blog-card-footer">
              <span className="blog-read-more">
                <BookOpen size={14} />
                <span>Read Article ({post.readTime})</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
