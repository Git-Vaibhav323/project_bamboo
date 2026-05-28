import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { blogFallback } from "../data/data";
import { Blog, supabase } from "../lib/supabase";

type BlogCard = Omit<Blog, "id" | "created_at" | "updated_at"> & { id?: string };

function readingTime(text: string) {
  return Math.max(1, Math.ceil((text || "").trim().split(/\s+/).length / 200));
}

function formatDate(d?: string) {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  } catch { return d.slice(0, 10); }
}

// Category → accent color
const CAT_COLOR: Record<string, string> = {
  "Material Insight": "#C8A96E",
  "Execution":        "#8FAF85",
  "Design":           "#A07840",
  "Journal":          "#C8A96E",
};
function catColor(c?: string) { return CAT_COLOR[c ?? ""] ?? "#C8A96E"; }

// ── Featured (first) card — full-bleed image with overlay text ──
function FeaturedCard({ blog, idx }: { blog: BlogCard; idx: number }) {
  const color = catColor(blog.category);
  return (
    <motion.article
      className="bc-featured"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/blogs/${blog.slug}`} className="bc-featured-link">
        {/* Image */}
        <div className="bc-featured-img-wrap">
          <img src={blog.cover_image || "/samples/1.jpg"} alt={blog.title} className="bc-featured-img" />
          <div className="bc-featured-overlay" />
        </div>

        {/* Content */}
        <div className="bc-featured-body">
          <div className="bc-featured-top">
            <span className="bc-cat-pill" style={{ color, borderColor: `${color}50`, background: `${color}18` }}>
              {blog.category || "Journal"}
            </span>
            <span className="bc-readtime">{readingTime(blog.content ?? "")} min read</span>
          </div>

          <h2 className="bc-featured-title">{blog.title}</h2>
          <p className="bc-featured-excerpt">{blog.excerpt}</p>

          <div className="bc-featured-footer">
            <div className="bc-author-row">
              <div className="bc-avatar" style={{ background: `linear-gradient(135deg, ${color}, #5C3E18)` }}>
                {(blog.author || "B").charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="bc-author-name">{blog.author || "BAANS INFRA Studio"}</p>
                <p className="bc-author-date">{formatDate(blog.published_at)}</p>
              </div>
            </div>
            <span className="bc-read-btn">
              Read article
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="bc-arrow">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>

        {/* Hover accent line */}
        <div className="bc-accent-line" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
      </Link>
    </motion.article>
  );
}

// ── Regular card — dark warm-brown with image top ──
function RegularCard({ blog, idx }: { blog: BlogCard; idx: number }) {
  const color = catColor(blog.category);
  return (
    <motion.article
      className="bc-card"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65, delay: idx * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/blogs/${blog.slug}`} className="bc-card-link">
        {/* Image */}
        <div className="bc-card-img-wrap">
          <img src={blog.cover_image || `/samples/${(idx % 4) + 1}.jpg`} alt={blog.title} className="bc-card-img" />
          <div className="bc-card-img-overlay" />
          {/* Category badge over image */}
          <span className="bc-card-cat-badge" style={{ color, borderColor: `${color}60`, background: `${color}22` }}>
            {blog.category || "Journal"}
          </span>
        </div>

        {/* Body */}
        <div className="bc-card-body">
          <div className="bc-card-meta-row">
            <span className="bc-card-date">{formatDate(blog.published_at)}</span>
            <span className="bc-card-mins">{readingTime(blog.content ?? "")} min</span>
          </div>

          <h3 className="bc-card-title">{blog.title}</h3>
          <p className="bc-card-excerpt">{blog.excerpt}</p>

          <div className="bc-card-footer">
            <span className="bc-card-read">
              Read article
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="bc-arrow">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="bc-card-accent" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
      </Link>
    </motion.article>
  );
}

export default function Blogs() {
  const [blogs, setBlogs] = useState<BlogCard[]>(blogFallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        if (!supabase) return;
        const { data, error } = await supabase
          .from("blogs")
          .select("*")
          .eq("is_published", true)
          .order("published_at", { ascending: false });
        if (!error && data && data.length > 0) setBlogs(data);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const [featured, ...rest] = blogs;

  return (
    <div className="blogs-page">

      {/* Hero */}
      <section className="blogs-hero">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: "center" }}
        >
          <span className="tag" style={{ color: "#C8A96E", opacity: 1 }}>Baans Journal</span>
          <h1 style={{ color: "#ffffff", marginTop: "16px" }}>
            Insights from bamboo sites<br />across India.
          </h1>
          <p className="subheading" style={{ color: "rgba(250,247,242,0.72)", marginTop: "20px", maxWidth: "600px", margin: "20px auto 0" }}>
            Notes on material performance, resort execution, climate detailing, and sustainable luxury.
          </p>
        </motion.div>
      </section>

      {/* Grid */}
      <section className="blogs-grid-wrap">
        {loading && (
          <p style={{ textAlign: "center", color: "var(--color-text-muted)", padding: "40px 0" }}>
            Loading articles...
          </p>
        )}

        {!loading && blogs.length > 0 && (
          <div className="bc-layout">

            {/* Featured first article */}
            {featured && <FeaturedCard blog={featured} idx={0} />}

            {/* Rest in 3-col grid */}
            {rest.length > 0 && (
              <div className="bc-grid">
                {rest.map((blog, i) => (
                  <RegularCard key={blog.slug} blog={blog} idx={i} />
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
