import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { blogFallback } from "../data/data";
import { Blog, supabase } from "../lib/supabase";

type BlogCard = Omit<Blog, "id" | "created_at" | "updated_at"> & {
  id?: string;
};

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

        if (!error && data && data.length > 0) {
          setBlogs(data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="blogs-page">
      <section className="blogs-hero">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <span className="tag">Baans Journal</span>
          <h1>Insights from bamboo sites across India.</h1>
          <p className="subheading">
            Notes on material performance, resort execution, climate detailing, and sustainable luxury.
          </p>
        </motion.div>
      </section>

      <section className="blogs-grid-wrap">
        {loading && <p style={{ textAlign: "center" }}>Loading blogs...</p>}
        <div className="blogs-grid">
          {blogs.map((blog, idx) => (
            <motion.article
              key={blog.slug}
              className="blog-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.55 }}
            >
              <Link href={`/blogs/${blog.slug}`}>
                <span className="blog-card-image">
                  <img src={blog.cover_image || "/samples/1.jpg"} alt={blog.title} />
                </span>
                <span className="blog-card-content">
                  <span className="blog-card-meta">
                    {blog.category || 'Journal'}
                    {blog.published_at && (
                      <span style={{ color: 'var(--color-text-muted)', fontWeight: 500, letterSpacing: '0.1em' }}>
                        {new Date(blog.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    )}
                  </span>
                  <h2>{blog.title}</h2>
                  <p>{blog.excerpt}</p>
                  <span className="blog-card-link">
                    Read article <span className="blog-card-link-arrow">→</span>
                  </span>
                </span>
              </Link>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
}
