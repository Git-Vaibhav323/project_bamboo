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

              {/* ── Markdown cheatsheet bar ── */}
              <div style={{
                marginTop: "16px",
                background: "#faf7f2",
                border: "1px solid #ddd",
                borderBottom: "none",
                borderRadius: "4px 4px 0 0",
                padding: "10px 14px",
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                alignItems: "center",
              }}>
                <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8A7A60", marginRight: "4px" }}>
                  Markdown:
                </span>
                {[
                  { label: "# H1",       insert: "# " },
                  { label: "## H2",      insert: "## " },
                  { label: "### H3",     insert: "### " },
                  { label: "**bold**",   insert: "**bold**" },
                  { label: "- bullet",   insert: "- " },
                  { label: "1. list",    insert: "1. " },
                  { label: "> quote",    insert: "> " },
                  { label: "---",        insert: "\n---\n" },
                ].map(({ label, insert }) => (
                  <button
                    key={label}
                    type="button"
                    title={`Insert: ${insert.trim()}`}
                    onClick={() => {
                      const ta = document.getElementById("blog-content-ta") as HTMLTextAreaElement | null;
                      if (!ta) return;
                      const start = ta.selectionStart;
                      const end = ta.selectionEnd;
                      const before = formData.content.slice(0, start);
                      const after = formData.content.slice(end);
                      const newContent = before + insert + after;
                      setFormData({ ...formData, content: newContent });
                      // Restore cursor after React re-render
                      requestAnimationFrame(() => {
                        ta.focus();
                        ta.setSelectionRange(start + insert.length, start + insert.length);
                      });
                    }}
                    style={{
                      fontFamily: "'Courier New', monospace",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#8B6914",
                      background: "rgba(139,105,20,0.08)",
                      border: "1px solid rgba(139,105,20,0.25)",
                      borderRadius: "4px",
                      padding: "3px 10px",
                      cursor: "pointer",
                      transition: "background 0.2s ease, border-color 0.2s ease",
                      lineHeight: 1.5,
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(139,105,20,0.16)";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(139,105,20,0.5)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(139,105,20,0.08)";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(139,105,20,0.25)";
                    }}
                  >
                    {label}
                  </button>
                ))}
                <span style={{ marginLeft: "auto", fontSize: "11px", color: "#8A7A60", fontStyle: "italic" }}>
                  Blank line between paragraphs
                </span>
              </div>

              <textarea
                id="blog-content-ta"
                required
                placeholder={`Write your article in Markdown...\n\n## Section Heading\n\nYour paragraph text here.\n\n- Bullet point one\n- Bullet point two\n\n> A blockquote or key insight`}
                rows={16}
                style={{
                  ...inputStyle,
                  borderRadius: "0 0 4px 4px",
                  fontFamily: "'Courier New', monospace",
                  fontSize: "13px",
                  lineHeight: 1.7,
                  resize: "vertical",
                }}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
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
