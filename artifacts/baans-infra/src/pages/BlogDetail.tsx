import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { blogFallback } from "../data/data";
import { Blog, supabase } from "../lib/supabase";

type BlogDetailData = Omit<Blog, "id" | "created_at" | "updated_at"> & { id?: string };

function readingTime(text: string): number {
  return Math.max(1, Math.ceil((text || "").trim().split(/\s+/).length / 200));
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric", month: "long", year: "numeric",
    });
  } catch { return dateStr.slice(0, 10); }
}

// Strip bare URLs that are just image links dumped as plain text
function cleanContent(content: string): string {
  return content
    .split("\n")
    .filter(line => !/^https?:\/\/\S+$/.test(line.trim()))
    .join("\n");
}

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<BlogDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [readProgress, setReadProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const el = contentRef.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = -el.getBoundingClientRect().top;
      setReadProgress(Math.min(100, Math.max(0, (scrolled / total) * 100)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [blog]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchBlog = async () => {
      setLoading(true);
      if (supabase) {
        const { data } = await supabase
          .from("blogs").select("*")
          .eq("slug", slug).eq("is_published", true).single();
        if (data) { setBlog(data); setLoading(false); return; }
      }
      setBlog(blogFallback.find(b => b.slug === slug) || null);
      setLoading(false);
    };
    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="blog-detail-loading">
        <div className="blog-detail-loading-spinner" />
        <p style={{ color: "var(--color-text-muted)", fontSize: "14px", letterSpacing: "0.1em" }}>
          Loading article...
        </p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="blog-detail-loading">
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "36px" }}>Article not found</h2>
        <Link href="/blogs" className="pill-btn primary">← Back to Journal</Link>
      </div>
    );
  }

  const mins = readingTime(blog.content);
  const cleanedContent = cleanContent(blog.content);

  return (
    <article className="blog-detail-page" ref={contentRef}>

      {/* Reading progress bar */}
      <div className="blog-read-progress-track">
        <div className="blog-read-progress-fill" style={{ width: `${readProgress}%` }} />
      </div>

      {/* Hero */}
      <header className="blog-detail-hero">
        <img src={blog.cover_image || "/samples/1.jpg"} alt={blog.title} />
        <div className="blog-detail-hero-overlay" />
        <motion.div
          className="blog-detail-hero-content"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link href="/blogs" className="blog-detail-back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "6px", verticalAlign: "middle" }}>
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Journal
          </Link>
          <div className="blog-detail-hero-meta">
            {blog.category && <span className="blog-detail-category">{blog.category}</span>}
            <span className="blog-detail-readtime">{mins} min read</span>
          </div>
          <h1 className="blog-detail-title">{blog.title}</h1>
          <p className="blog-detail-excerpt">{blog.excerpt}</p>
        </motion.div>
      </header>

      {/* Body */}
      <div className="blog-detail-body-wrap">

        {/* Byline */}
        <div className="blog-detail-byline">
          <div className="blog-detail-author-block">
            <div className="blog-detail-author-avatar">
              {(blog.author || "B").charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="blog-detail-author-name">{blog.author || "BAANS INFRA Studio"}</p>
              <p className="blog-detail-author-role">BAANS INFRA</p>
            </div>
          </div>
          <div className="blog-detail-date-block">
            <p className="blog-detail-date-label">Published</p>
            <p className="blog-detail-date-value">{formatDate(blog.published_at)}</p>
          </div>
        </div>

        <div className="blog-detail-divider" />

        {/* ── Markdown content ── */}
        <div className="blog-content">
          <ReactMarkdown>{cleanedContent}</ReactMarkdown>
        </div>

        <div className="blog-detail-divider" style={{ marginTop: "64px" }} />

        {/* Tags */}
        {blog.category && (
          <div className="blog-detail-tags">
            <span className="blog-detail-tag">{blog.category}</span>
            <span className="blog-detail-tag">Bamboo Architecture</span>
            <span className="blog-detail-tag">Sustainable Design</span>
          </div>
        )}

        {/* CTA card */}
        <div className="blog-detail-cta-card">
          <p className="blog-detail-cta-label">Ready to build?</p>
          <h3 className="blog-detail-cta-heading">Let's shape something that breathes.</h3>
          <p className="blog-detail-cta-sub">
            Tell us about your land and vision. We'll tell you what bamboo can become.
          </p>
          <Link href="/contact" className="pill-btn primary">Start your journey →</Link>
        </div>

        <div className="blog-detail-back-footer">
          <Link href="/blogs" className="blog-detail-back-link">← Back to all articles</Link>
        </div>
      </div>
    </article>
  );
}
