import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Blog, supabase } from "../lib/supabase";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  fontSize: "14px",
  fontFamily: "inherit",
};

const slugify = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Blog | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    cover_image: "",
    author: "BAANS INFRA Studio",
    category: "",
    published_at: "",
    is_published: true,
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    if (!supabase) { setLoading(false); return; }
    const { data, error } = await supabase.from("blogs").select("*").order("created_at", { ascending: false });
    if (!error && data) setBlogs(data);
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({ title: "", slug: "", excerpt: "", content: "", cover_image: "", author: "BAANS INFRA Studio", category: "", published_at: "", is_published: true });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (blog: Blog) => {
    setEditing(blog);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      cover_image: blog.cover_image || "",
      author: blog.author || "BAANS INFRA Studio",
      category: blog.category || "",
      published_at: blog.published_at?.slice(0, 10) || "",
      is_published: blog.is_published,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) { alert("Supabase is not configured."); return; }

    const payload = {
      ...formData,
      slug: formData.slug || slugify(formData.title),
      published_at: formData.published_at || new Date().toISOString(),
    };

    const { error } = editing
      ? await supabase.from("blogs").update(payload).eq("id", editing.id)
      : await supabase.from("blogs").insert([payload]);

    if (error) { alert(error.message); return; }
    await fetchBlogs();
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog?")) return;
    if (!supabase) return;
    await supabase.from("blogs").delete().eq("id", id);
    await fetchBlogs();
  };

  if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading blogs...</div>;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--color-bg)", paddingTop: "100px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <div>
            <Link href="/admin"><span style={{ color: "var(--color-text-muted)", fontSize: "14px" }}>Back to Dashboard</span></Link>
            <h1 style={{ fontSize: "40px", marginTop: "8px" }}>Manage Blogs</h1>
          </div>
          <button onClick={() => setShowForm((v) => !v)} className="pill-btn primary" style={{ padding: "12px 24px" }}>
            {showForm ? "Cancel" : "+ Add Blog"}
          </button>
        </div>

        {showForm && (
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} style={{ backgroundColor: "var(--color-ivory)", padding: "32px", borderRadius: "8px", marginBottom: "32px" }}>
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
                <input required placeholder="Title" style={inputStyle} value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: formData.slug || slugify(e.target.value) })} />
                <input required placeholder="Slug" style={inputStyle} value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: slugify(e.target.value) })} />
                <input placeholder="Cover image URL" style={inputStyle} value={formData.cover_image} onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })} />
                <input placeholder="Category" style={inputStyle} value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
                <input placeholder="Author" style={inputStyle} value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} />
                <input type="date" style={inputStyle} value={formData.published_at} onChange={(e) => setFormData({ ...formData, published_at: e.target.value })} />
              </div>
              <textarea required placeholder="Excerpt" rows={3} style={{ ...inputStyle, marginTop: "16px" }} value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} />
              <textarea required placeholder="Article content. Use blank lines between paragraphs." rows={10} style={{ ...inputStyle, marginTop: "16px" }} value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} />
              <label style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "16px", fontSize: "14px" }}>
                <input type="checkbox" checked={formData.is_published} onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })} />
                Published
              </label>
              <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                <button type="submit" className="pill-btn primary" style={{ padding: "12px 28px" }}>{editing ? "Update" : "Create"}</button>
                <button type="button" onClick={resetForm} className="pill-btn" style={{ padding: "12px 28px" }}>Cancel</button>
              </div>
            </form>
          </motion.div>
        )}

        <div style={{ display: "grid", gap: "16px" }}>
          {blogs.map((blog) => (
            <div key={blog.id} style={{ backgroundColor: "var(--color-ivory)", padding: "20px", borderRadius: "8px", display: "flex", justifyContent: "space-between", gap: "20px" }}>
              <div>
                <h3 style={{ fontSize: "20px" }}>{blog.title}</h3>
                <p style={{ fontSize: "14px" }}>{blog.is_published ? "Published" : "Draft"} / /blogs/{blog.slug}</p>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <button onClick={() => handleEdit(blog)} className="pill-btn" style={{ padding: "8px 16px" }}>Edit</button>
                <button onClick={() => handleDelete(blog.id)} style={{ padding: "8px 16px", backgroundColor: "#fee2e2", color: "#b91c1c", border: "none", borderRadius: "99px" }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
