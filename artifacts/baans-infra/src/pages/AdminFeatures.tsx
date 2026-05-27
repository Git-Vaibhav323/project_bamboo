import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { MediaFeature, supabase } from "../lib/supabase";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  fontSize: "14px",
  fontFamily: "inherit",
};

export default function AdminFeatures() {
  const [features, setFeatures] = useState<MediaFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<MediaFeature | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    publication: "",
    category: "",
    url: "",
    logo_url: "",
    excerpt: "",
    published_at: "",
    order: 0,
  });

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    if (!supabase) { setLoading(false); return; }
    const { data, error } = await supabase.from("media_features").select("*").order("order", { ascending: true });
    if (!error && data) setFeatures(data);
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({ title: "", publication: "", category: "", url: "", logo_url: "", excerpt: "", published_at: "", order: 0 });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (feature: MediaFeature) => {
    setEditing(feature);
    setFormData({
      title: feature.title,
      publication: feature.publication,
      category: feature.category || "",
      url: feature.url || "",
      logo_url: feature.logo_url || "",
      excerpt: feature.excerpt || "",
      published_at: feature.published_at?.slice(0, 10) || "",
      order: feature.order || 0,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) { alert("Supabase is not configured."); return; }

    const payload = {
      ...formData,
      published_at: formData.published_at || null,
    };

    const { error } = editing
      ? await supabase.from("media_features").update(payload).eq("id", editing.id)
      : await supabase.from("media_features").insert([payload]);

    if (error) { alert(error.message); return; }
    await fetchFeatures();
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this featured item?")) return;
    if (!supabase) return;
    await supabase.from("media_features").delete().eq("id", id);
    await fetchFeatures();
  };

  if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading featured items...</div>;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--color-bg)", paddingTop: "100px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <div>
            <Link href="/admin"><span style={{ color: "var(--color-text-muted)", fontSize: "14px" }}>Back to Dashboard</span></Link>
            <h1 style={{ fontSize: "40px", marginTop: "8px" }}>Manage Featured On</h1>
          </div>
          <button onClick={() => setShowForm((v) => !v)} className="pill-btn primary" style={{ padding: "12px 24px" }}>
            {showForm ? "Cancel" : "+ Add Feature"}
          </button>
        </div>

        {showForm && (
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} style={{ backgroundColor: "var(--color-ivory)", padding: "32px", borderRadius: "8px", marginBottom: "32px" }}>
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
                <input required placeholder="Article title" style={inputStyle} value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                <input required placeholder="Publication" style={inputStyle} value={formData.publication} onChange={(e) => setFormData({ ...formData, publication: e.target.value })} />
                <input placeholder="Category, e.g. Magazine" style={inputStyle} value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
                <input placeholder="Link URL" style={inputStyle} value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} />
                <input placeholder="Logo image URL" style={inputStyle} value={formData.logo_url} onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })} />
                <input type="date" style={inputStyle} value={formData.published_at} onChange={(e) => setFormData({ ...formData, published_at: e.target.value })} />
                <input type="number" placeholder="Display order" style={inputStyle} value={formData.order} onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })} />
              </div>
              <textarea placeholder="Short excerpt" rows={3} style={{ ...inputStyle, marginTop: "16px" }} value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} />
              <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                <button type="submit" className="pill-btn primary" style={{ padding: "12px 28px" }}>{editing ? "Update" : "Create"}</button>
                <button type="button" onClick={resetForm} className="pill-btn" style={{ padding: "12px 28px" }}>Cancel</button>
              </div>
            </form>
          </motion.div>
        )}

        <div style={{ display: "grid", gap: "16px" }}>
          {features.map((feature) => (
            <div key={feature.id} style={{ backgroundColor: "var(--color-ivory)", padding: "20px", borderRadius: "8px", display: "flex", justifyContent: "space-between", gap: "20px" }}>
              <div>
                <h3 style={{ fontSize: "20px" }}>{feature.publication}</h3>
                <p style={{ fontSize: "14px" }}>{feature.title}</p>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <button onClick={() => handleEdit(feature)} className="pill-btn" style={{ padding: "8px 16px" }}>Edit</button>
                <button onClick={() => handleDelete(feature.id)} style={{ padding: "8px 16px", backgroundColor: "#fee2e2", color: "#b91c1c", border: "none", borderRadius: "99px" }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
