import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Blog, supabase } from "../lib/supabase";

// ─── helpers ────────────────────────────────────────────────
const slugify = (v: string) =>
  v.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

// Shared field label + input wrapper
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8A7A60" }}>
        {label}{required && <span style={{ color: "#b91c1c", marginLeft: "3px" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const inp: React.CSSProperties = {
  width: "100%", padding: "11px 14px",
  border: "1px solid #e0d8cc", borderRadius: "6px",
  fontSize: "14px", fontFamily: "inherit",
  background: "#fff", color: "#2C1810",
  outline: "none", boxSizing: "border-box",
  transition: "border-color 0.2s ease",
};

// ─── Toolbar button definition ───────────────────────────────
interface ToolBtn {
  label: string;
  title: string;
  /** wrap = wraps selected text; prefix = inserts at line start; insert = raw insert */
  mode: "wrap" | "prefix" | "insert";
  syntax: string;       // for wrap: the marker; for prefix: line prefix; for insert: raw text
  syntaxEnd?: string;   // for wrap: closing marker (defaults to syntax)
}

const TOOLBAR: ToolBtn[] = [
  { label: "H1",        title: "Heading 1",       mode: "prefix", syntax: "# " },
  { label: "H2",        title: "Heading 2",       mode: "prefix", syntax: "## " },
  { label: "H3",        title: "Heading 3",       mode: "prefix", syntax: "### " },
  { label: "B",         title: "Bold",            mode: "wrap",   syntax: "**" },
  { label: "I",         title: "Italic",          mode: "wrap",   syntax: "_" },
  { label: "~~",        title: "Strikethrough",   mode: "wrap",   syntax: "~~" },
  { label: "—",         title: "Divider",         mode: "insert", syntax: "\n\n---\n\n" },
  { label: "• list",    title: "Bullet list",     mode: "prefix", syntax: "- " },
  { label: "1. list",   title: "Numbered list",   mode: "prefix", syntax: "1. " },
  { label: '" quote',   title: "Blockquote",      mode: "prefix", syntax: "> " },
  { label: "`code`",    title: "Inline code",     mode: "wrap",   syntax: "`" },
];

// ─── Smart toolbar action ────────────────────────────────────
function applyToolbar(
  btn: ToolBtn,
  content: string,
  taRef: React.RefObject<HTMLTextAreaElement>,
  setContent: (v: string) => void
) {
  const ta = taRef.current;
  if (!ta) return;

  const start = ta.selectionStart;
  const end   = ta.selectionEnd;
  const selected = content.slice(start, end);
  let newContent = content;
  let newCursor  = start;

  if (btn.mode === "wrap") {
    const open  = btn.syntax;
    const close = btn.syntaxEnd ?? btn.syntax;
    if (selected) {
      // Wrap selected text
      newContent = content.slice(0, start) + open + selected + close + content.slice(end);
      newCursor  = start + open.length + selected.length + close.length;
    } else {
      // Insert markers and place cursor between them
      newContent = content.slice(0, start) + open + close + content.slice(end);
      newCursor  = start + open.length;
    }
  } else if (btn.mode === "prefix") {
    // Find start of the line
    const lineStart = content.lastIndexOf("\n", start - 1) + 1;
    newContent = content.slice(0, lineStart) + btn.syntax + content.slice(lineStart);
    newCursor  = start + btn.syntax.length;
  } else {
    // Raw insert at cursor
    newContent = content.slice(0, start) + btn.syntax + content.slice(end);
    newCursor  = start + btn.syntax.length;
  }

  setContent(newContent);
  requestAnimationFrame(() => {
    ta.focus();
    ta.setSelectionRange(newCursor, newCursor);
  });
}

// ─── Main component ──────────────────────────────────────────
export default function AdminBlogs() {
  const [blogs, setBlogs]     = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState<Blog | null>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const [formData, setFormData] = useState({
    title: "", slug: "", excerpt: "", content: "",
    cover_image: "", author: "BAANS INFRA Studio",
    category: "", published_at: "", is_published: true,
  });

  const setContent = useCallback((v: string) => setFormData(f => ({ ...f, content: v })), []);

  useEffect(() => { fetchBlogs(); }, []);

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
      title: blog.title, slug: blog.slug,
      excerpt: blog.excerpt || "", content: blog.content || "",
      cover_image: blog.cover_image || "", author: blog.author || "BAANS INFRA Studio",
      category: blog.category || "", published_at: blog.published_at?.slice(0, 10) || "",
      is_published: blog.is_published,
    });
    setShowForm(true);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
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

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      Loading blogs...
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--color-bg)", paddingTop: "100px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 32px" }}>

        {/* Page header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <div>
            <Link href="/admin">
              <span style={{ color: "var(--color-text-muted)", fontSize: "13px", cursor: "pointer" }}>← Back to Dashboard</span>
            </Link>
            <h1 style={{ fontSize: "36px", marginTop: "8px", fontFamily: "Cormorant Garamond, serif" }}>Manage Blogs</h1>
          </div>
          <button onClick={() => { resetForm(); setShowForm(v => !v); }} className="pill-btn primary" style={{ padding: "12px 28px" }}>
            {showForm ? "Cancel" : "+ New Article"}
          </button>
        </div>

        {/* ── EDITOR FORM ── */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: "#fff",
              border: "1px solid #e0d8cc",
              borderRadius: "12px",
              marginBottom: "40px",
              overflow: "hidden",
            }}
          >
            {/* Form header */}
            <div style={{ padding: "24px 32px", borderBottom: "1px solid #e0d8cc", background: "#faf7f2" }}>
              <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "24px", margin: 0, color: "#2C1810" }}>
                {editing ? `Editing: ${editing.title}` : "New Article"}
              </h2>
              <p style={{ fontSize: "13px", color: "#8A7A60", margin: "4px 0 0" }}>
                Write content in Markdown. Use the toolbar to format selected text.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: "32px" }}>

              {/* ── Section: Article Info ── */}
              <div style={{ marginBottom: "32px" }}>
                <p style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C8A96E", marginBottom: "16px", borderBottom: "1px solid #e0d8cc", paddingBottom: "8px" }}>
                  Article Info
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <Field label="Title" required>
                    <input
                      required style={inp} value={formData.title}
                      placeholder="e.g. Why Bamboo Is Ready for Luxury Resorts"
                      onChange={e => setFormData({ ...formData, title: e.target.value, slug: formData.slug || slugify(e.target.value) })}
                      onFocus={e => (e.target.style.borderColor = "#8B6914")}
                      onBlur={e => (e.target.style.borderColor = "#e0d8cc")}
                    />
                  </Field>
                  <Field label="URL Slug" required>
                    <input
                      required style={{ ...inp, fontFamily: "'Courier New', monospace", fontSize: "13px" }}
                      value={formData.slug} placeholder="auto-generated from title"
                      onChange={e => setFormData({ ...formData, slug: slugify(e.target.value) })}
                      onFocus={e => (e.target.style.borderColor = "#8B6914")}
                      onBlur={e => (e.target.style.borderColor = "#e0d8cc")}
                    />
                  </Field>
                </div>
              </div>

              {/* ── Section: Meta ── */}
              <div style={{ marginBottom: "32px" }}>
                <p style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C8A96E", marginBottom: "16px", borderBottom: "1px solid #e0d8cc", paddingBottom: "8px" }}>
                  Meta
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "16px" }}>
                  <Field label="Category">
                    <input style={inp} value={formData.category} placeholder="e.g. Material Insight"
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      onFocus={e => (e.target.style.borderColor = "#8B6914")}
                      onBlur={e => (e.target.style.borderColor = "#e0d8cc")} />
                  </Field>
                  <Field label="Author">
                    <input style={inp} value={formData.author}
                      onChange={e => setFormData({ ...formData, author: e.target.value })}
                      onFocus={e => (e.target.style.borderColor = "#8B6914")}
                      onBlur={e => (e.target.style.borderColor = "#e0d8cc")} />
                  </Field>
                  <Field label="Publish Date">
                    <input type="date" style={inp} value={formData.published_at}
                      onChange={e => setFormData({ ...formData, published_at: e.target.value })}
                      onFocus={e => (e.target.style.borderColor = "#8B6914")}
                      onBlur={e => (e.target.style.borderColor = "#e0d8cc")} />
                  </Field>
                  <Field label="Cover Image URL">
                    <input style={inp} value={formData.cover_image} placeholder="https://..."
                      onChange={e => setFormData({ ...formData, cover_image: e.target.value })}
                      onFocus={e => (e.target.style.borderColor = "#8B6914")}
                      onBlur={e => (e.target.style.borderColor = "#e0d8cc")} />
                  </Field>
                </div>
              </div>

              {/* ── Section: Excerpt ── */}
              <div style={{ marginBottom: "32px" }}>
                <p style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C8A96E", marginBottom: "16px", borderBottom: "1px solid #e0d8cc", paddingBottom: "8px" }}>
                  Excerpt <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "#8A7A60", fontSize: "11px" }}>— shown on blog listing cards</span>
                </p>
                <Field label="Short summary (1–2 sentences)" required>
                  <textarea
                    required rows={3}
                    style={{ ...inp, resize: "vertical", lineHeight: 1.65 }}
                    value={formData.excerpt}
                    placeholder="A concise summary that appears on the blog listing page..."
                    onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                    onFocus={e => (e.target.style.borderColor = "#8B6914")}
                    onBlur={e => (e.target.style.borderColor = "#e0d8cc")}
                  />
                </Field>
              </div>

              {/* ── Section: Content editor ── */}
              <div style={{ marginBottom: "28px" }}>
                <p style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C8A96E", marginBottom: "16px", borderBottom: "1px solid #e0d8cc", paddingBottom: "8px" }}>
                  Article Content <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "#8A7A60", fontSize: "11px" }}>— Markdown supported</span>
                </p>

                {/* Toolbar */}
                <div style={{
                  background: "#faf7f2",
                  border: "1px solid #e0d8cc",
                  borderBottom: "none",
                  borderRadius: "8px 8px 0 0",
                  padding: "10px 14px",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px",
                  alignItems: "center",
                }}>
                  {TOOLBAR.map((btn) => {
                    const isBold   = btn.label === "B";
                    const isItalic = btn.label === "I";
                    const isDiv    = btn.label === "—";
                    return (
                      <button
                        key={btn.label}
                        type="button"
                        title={btn.title}
                        onClick={() => applyToolbar(btn, formData.content, taRef, setContent)}
                        style={{
                          fontFamily: isBold || isItalic ? "Georgia, serif" : "'Courier New', monospace",
                          fontWeight: isBold ? 900 : 600,
                          fontStyle: isItalic ? "italic" : "normal",
                          fontSize: isBold || isItalic ? "14px" : "12px",
                          color: "#8B6914",
                          background: "rgba(139,105,20,0.07)",
                          border: "1px solid rgba(139,105,20,0.22)",
                          borderRadius: "5px",
                          padding: isDiv ? "4px 10px" : "4px 11px",
                          cursor: "pointer",
                          lineHeight: 1.5,
                          minWidth: "32px",
                          textAlign: "center",
                          transition: "background 0.15s, border-color 0.15s, transform 0.1s",
                          userSelect: "none",
                        }}
                        onMouseDown={e => e.preventDefault()} // keep textarea focus
                        onMouseEnter={e => {
                          const el = e.currentTarget as HTMLButtonElement;
                          el.style.background = "rgba(139,105,20,0.16)";
                          el.style.borderColor = "rgba(139,105,20,0.5)";
                          el.style.transform = "translateY(-1px)";
                        }}
                        onMouseLeave={e => {
                          const el = e.currentTarget as HTMLButtonElement;
                          el.style.background = "rgba(139,105,20,0.07)";
                          el.style.borderColor = "rgba(139,105,20,0.22)";
                          el.style.transform = "";
                        }}
                      >
                        {btn.label}
                      </button>
                    );
                  })}

                  {/* Separator */}
                  <div style={{ width: "1px", height: "20px", background: "#e0d8cc", margin: "0 4px" }} />

                  <span style={{ fontSize: "11px", color: "#8A7A60", fontStyle: "italic" }}>
                    Select text, then click a button to wrap it
                  </span>
                </div>

                {/* Textarea */}
                <textarea
                  ref={taRef}
                  required
                  rows={24}
                  style={{
                    ...inp,
                    borderRadius: "0 0 8px 8px",
                    fontFamily: "'Courier New', monospace",
                    fontSize: "13.5px",
                    lineHeight: 1.75,
                    resize: "vertical",
                    minHeight: "480px",
                    tabSize: 2,
                    whiteSpace: "pre",
                    overflowWrap: "normal",
                    overflowX: "auto",
                  }}
                  value={formData.content}
                  placeholder={`## Section Heading\n\nYour paragraph text here. Select any text and click a toolbar button to format it.\n\n### Sub-section\n\n- Bullet point one\n- Bullet point two\n\n1. Numbered item one\n2. Numbered item two\n\n> A blockquote or key insight\n\n---\n\nAnother section...`}
                  onChange={e => setContent(e.target.value)}
                  onFocus={e => (e.target.style.borderColor = "#8B6914")}
                  onBlur={e => (e.target.style.borderColor = "#e0d8cc")}
                />

                {/* Word count */}
                <p style={{ fontSize: "11px", color: "#8A7A60", marginTop: "6px", textAlign: "right" }}>
                  {formData.content.trim().split(/\s+/).filter(Boolean).length} words
                  &nbsp;·&nbsp;
                  ~{Math.max(1, Math.ceil(formData.content.trim().split(/\s+/).filter(Boolean).length / 200))} min read
                </p>
              </div>

              {/* Published toggle + actions */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", paddingTop: "20px", borderTop: "1px solid #e0d8cc" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", cursor: "pointer", userSelect: "none" }}>
                  <input type="checkbox" checked={formData.is_published}
                    onChange={e => setFormData({ ...formData, is_published: e.target.checked })}
                    style={{ width: "16px", height: "16px", accentColor: "#4A6741" }} />
                  <span style={{ fontWeight: 600, color: "#2C1810" }}>Published</span>
                  <span style={{ fontSize: "12px", color: "#8A7A60" }}>(uncheck to save as draft)</span>
                </label>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button type="button" onClick={resetForm} className="pill-btn" style={{ padding: "12px 28px" }}>Cancel</button>
                  <button type="submit" className="pill-btn primary" style={{ padding: "12px 32px" }}>
                    {editing ? "Update Article" : "Publish Article"}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}

        {/* ── Blog list ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {blogs.length === 0 && (
            <p style={{ textAlign: "center", color: "#8A7A60", padding: "40px" }}>No articles yet. Click "+ New Article" to create one.</p>
          )}
          {blogs.map(blog => (
            <div key={blog.id} style={{
              background: "var(--color-ivory)",
              border: "1px solid #e0d8cc",
              borderRadius: "8px",
              padding: "20px 24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "20px",
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                  <h3 style={{ fontSize: "18px", margin: 0, fontFamily: "Cormorant Garamond, serif" }}>{blog.title}</h3>
                  <span style={{
                    fontSize: "9px", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase",
                    padding: "3px 10px", borderRadius: "999px",
                    background: blog.is_published ? "rgba(74,103,65,0.1)" : "rgba(139,105,20,0.1)",
                    color: blog.is_published ? "#4A6741" : "#8B6914",
                    border: `1px solid ${blog.is_published ? "rgba(74,103,65,0.25)" : "rgba(139,105,20,0.25)"}`,
                  }}>
                    {blog.is_published ? "Published" : "Draft"}
                  </span>
                  {blog.category && (
                    <span style={{ fontSize: "10px", color: "#8A7A60", fontWeight: 600 }}>{blog.category}</span>
                  )}
                </div>
                <p style={{ fontSize: "12px", color: "#8A7A60", margin: 0, fontFamily: "'Courier New', monospace" }}>
                  /blogs/{blog.slug}
                </p>
              </div>
              <div style={{ display: "flex", gap: "10px", flexShrink: 0 }}>
                <button onClick={() => handleEdit(blog)} className="pill-btn" style={{ padding: "8px 18px", fontSize: "13px" }}>Edit</button>
                <button onClick={() => handleDelete(blog.id)} style={{
                  padding: "8px 18px", fontSize: "13px",
                  background: "#fee2e2", color: "#b91c1c",
                  border: "none", borderRadius: "99px", cursor: "pointer",
                }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
