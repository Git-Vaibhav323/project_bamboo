import React, { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import { blogFallback } from "../data/data";
import { Blog, supabase } from "../lib/supabase";

type BlogDetailData = Omit<Blog, "id" | "created_at" | "updated_at"> & {
  id?: string;
};

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<BlogDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchBlog = async () => {
      setLoading(true);

      if (supabase) {
        const { data } = await supabase
          .from("blogs")
          .select("*")
          .eq("slug", slug)
          .eq("is_published", true)
          .single();

        if (data) {
          setBlog(data);
          setLoading(false);
          return;
        }
      }

      setBlog(blogFallback.find((item) => item.slug === slug) || null);
      setLoading(false);
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="blog-detail-loading">
        <p>Loading article...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="blog-detail-loading">
        <h1>Article not found</h1>
        <Link href="/blogs" className="pill-btn primary">Back to Blogs</Link>
      </div>
    );
  }

  return (
    <article className="blog-detail-page">
      <header className="blog-detail-hero">
        <img src={blog.cover_image || "/samples/1.jpg"} alt={blog.title} />
        <div className="blog-detail-hero-overlay" />
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Link href="/blogs" className="blog-detail-back">Back to blogs</Link>
          <span className="tag">{blog.category || "Journal"}</span>
          <h1>{blog.title}</h1>
          <p>{blog.excerpt}</p>
        </motion.div>
      </header>

      <div className="blog-detail-content">
        <div className="blog-detail-meta">
          <span>{blog.author || "BAANS INFRA Studio"}</span>
          <span>{blog.published_at?.slice(0, 10) || "Published"}</span>
        </div>
        {blog.content.split("\n").filter(Boolean).map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <div className="blog-detail-cta">
          <Link href="/contact" className="pill-btn primary">Start your journey with us now</Link>
        </div>
      </div>
    </article>
  );
}
