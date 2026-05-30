import React, { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { InstagramGalleryItem, supabase } from "../lib/supabase";
import { uploadImageToSupabase } from "../lib/imageCompression";

type InstagramGalleryDraft = {
  id?: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
};

const SLOT_COUNT = 9;

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 12px",
  border: "1px solid rgba(58,47,30,0.18)",
  borderRadius: "4px",
  fontSize: "14px",
  fontFamily: "inherit",
  background: "#fff",
};

const makeEmptyPost = (order: number): InstagramGalleryDraft => ({
  image_url: "",
  display_order: order,
  is_active: true,
});

const normalizePosts = (posts: InstagramGalleryItem[]): InstagramGalleryDraft[] => {
  const byOrder = new Map<number, InstagramGalleryItem>();
  posts.forEach((post) => {
    if (post.display_order >= 1 && post.display_order <= SLOT_COUNT) {
      byOrder.set(post.display_order, post);
    }
  });

  return Array.from({ length: SLOT_COUNT }, (_, index) => {
    const order = index + 1;
    const post = byOrder.get(order);
    if (!post) return makeEmptyPost(order);

    return {
      id: post.id,
      image_url: post.image_url || "",
      display_order: order,
      is_active: post.is_active,
    };
  });
};

export default function AdminSettings() {
  const [posts, setPosts] = useState<InstagramGalleryDraft[]>(
    Array.from({ length: SLOT_COUNT }, (_, index) => makeEmptyPost(index + 1)),
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const activePreviewCount = useMemo(
    () => posts.filter((post) => post.is_active && post.image_url).length,
    [posts],
  );

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("instagram_gallery")
      .select("*")
      .order("display_order", { ascending: true })
      .limit(SLOT_COUNT);

    if (error) {
      setMessage(error.message);
    } else {
      setPosts(normalizePosts((data || []) as InstagramGalleryItem[]));
    }

    setLoading(false);
  };

  const updatePost = (index: number, patch: Partial<InstagramGalleryDraft>) => {
    setPosts((current) =>
      current.map((post, postIndex) => (postIndex === index ? { ...post, ...patch } : post)),
    );
  };

  const reorderPosts = (from: number, to: number) => {
    if (from === to || to < 0 || to >= SLOT_COUNT) return;
    setPosts((current) => {
      const next = [...current];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next.map((post, index) => ({ ...post, display_order: index + 1 }));
    });
  };

  const handleImageUpload = async (index: number, file?: File) => {
    if (!file) return;
    if (!supabase) {
      setMessage("Supabase is not configured. Use an image URL instead.");
      return;
    }

    setUploadingIndex(index);
    setMessage("");

    try {
      const path = `instagram/post-${index + 1}-${Date.now()}.jpg`;
      const imageUrl = await uploadImageToSupabase(file, "project-images", path);
      updatePost(index, { image_url: imageUrl });
      setMessage("Image uploaded. Please save changes.");
    } catch (error: any) {
      setMessage(error?.message || "Image upload failed.");
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setMessage("Supabase is not configured.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const payload = posts.map((post, index) => ({
        ...(post.id ? { id: post.id } : {}),
        image_url: post.image_url.trim(),
        display_order: index + 1,
        is_active: post.is_active && Boolean(post.image_url.trim()),
      }));

      const { error } = await supabase
        .from("instagram_gallery")
        .upsert(payload, { onConflict: "id" });

      if (error) throw error;

      await fetchPosts();
      setMessage("Instagram grid updated.");
    } catch (error: any) {
      setMessage(error?.message || "Could not save Instagram grid.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        Loading Instagram grid...
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--color-bg)", paddingTop: "100px" }}>
      <div style={{ maxWidth: "1180px", margin: "0 auto", padding: "40px" }}>
        <div style={{ marginBottom: "34px" }}>
          <Link href="/admin">
            <span style={{ color: "var(--color-text-muted)", fontSize: "14px" }}>Back to Dashboard</span>
          </Link>
          <h1 style={{ fontSize: "40px", marginTop: "8px" }}>Instagram Grid Manager</h1>
          <p style={{ margin: "10px 0 0", maxWidth: "680px", fontSize: "15px" }}>
            Edit all 9 gallery images in one screen. Reorder by dragging an image row or using the arrow controls, then save once.
          </p>
        </div>

        <form onSubmit={handleSave}>
          <div className="admin-instagram-layout">
            <div className="admin-instagram-editor">
              {posts.map((post, index) => (
                <div
                  key={`${post.id || "slot"}-${index}`}
                  className="admin-instagram-row"
                  draggable
                  onDragStart={() => setDragIndex(index)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => {
                    if (dragIndex !== null) reorderPosts(dragIndex, index);
                    setDragIndex(null);
                  }}
                >
                  <div className="admin-instagram-row-head">
                    <span className="admin-instagram-slot">{index + 1}</span>
                    <div className="admin-instagram-row-actions">
                      <button type="button" onClick={() => reorderPosts(index, index - 1)} disabled={index === 0}>
                        ↑
                      </button>
                      <button type="button" onClick={() => reorderPosts(index, index + 1)} disabled={index === SLOT_COUNT - 1}>
                        ↓
                      </button>
                    </div>
                  </div>

                  <div className="admin-instagram-thumb">
                    {post.image_url ? <img src={post.image_url} alt="" /> : <span>Image</span>}
                  </div>

                  <div className="admin-instagram-fields">
                    <input
                      type="url"
                      placeholder="Image URL"
                      style={inputStyle}
                      value={post.image_url}
                      onChange={(event) => updatePost(index, { image_url: event.target.value })}
                    />
                    <div className="admin-instagram-upload-row">
                      <label>
                        <input
                          type="checkbox"
                          checked={post.is_active}
                          onChange={(event) => updatePost(index, { is_active: event.target.checked })}
                        />
                        Active
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => handleImageUpload(index, event.target.files?.[0])}
                      />
                      {uploadingIndex === index && <span>Uploading...</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="admin-instagram-preview-panel">
              <h2>Live Grid Preview</h2>
              <div className="admin-instagram-preview-grid">
                {posts.map((post, index) => (
                  <div key={`preview-${index}`} className="admin-instagram-preview-tile">
                    {post.image_url ? <img src={post.image_url} alt="" /> : <span>{index + 1}</span>}
                  </div>
                ))}
              </div>
              <p>{activePreviewCount}/9 complete active posts.</p>
            </aside>
          </div>

          {message && (
            <p
              style={{
                margin: "22px 0 0",
                fontSize: "14px",
                color: message.includes("updated") || message.includes("uploaded") || message.includes("added")
                  ? "var(--color-forest)"
                  : "#b91c1c",
              }}
            >
              {message}
            </p>
          )}

          <button type="submit" disabled={saving || uploadingIndex !== null} className="pill-btn primary" style={{ padding: "14px 34px", marginTop: "24px" }}>
            {saving ? "Saving..." : "Save Instagram Grid"}
          </button>
        </form>
      </div>
    </div>
  );
}
