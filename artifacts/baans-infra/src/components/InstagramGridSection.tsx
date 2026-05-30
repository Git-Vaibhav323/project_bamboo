import React, { useEffect, useState } from "react";
import { FaInstagram } from "react-icons/fa";
import { siteConfig } from "../data/data";
import { InstagramGalleryItem, supabase } from "../lib/supabase";
import { useScrollReveal } from "../hooks/useScrollReveal";

const POST_LIMIT = 9;

const fallbackPosts: InstagramGalleryItem[] = [
  "/samples/1.jpg",
  "/samples/2.jpg",
  "/samples/3.jpg",
  "/samples/4.jpg",
  "https://picsum.photos/seed/baans-insta-1/900/900",
  "https://picsum.photos/seed/baans-insta-2/900/900",
  "https://picsum.photos/seed/baans-insta-3/900/900",
  "https://picsum.photos/seed/baans-insta-4/900/900",
  "https://picsum.photos/seed/baans-insta-5/900/900",
].map((imageUrl, index) => ({
  id: `fallback-${index}`,
  image_url: imageUrl,
  display_order: index + 1,
  is_active: true,
  created_at: "",
}));

export default function InstagramGridSection() {
  const sectionRef = useScrollReveal<HTMLElement>();
  const [posts, setPosts] = useState<InstagramGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    if (!supabase) {
      return fallbackPosts;
    }

    const { data, error } = await supabase
      .from("instagram_gallery")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .limit(POST_LIMIT);

    if (error) {
      console.error("Error fetching Instagram posts:", error);
      return fallbackPosts;
    }

    return ((data || []) as InstagramGalleryItem[]).filter((post) => post.image_url).slice(0, POST_LIMIT);
  };

  useEffect(() => {
    fetchPosts()
      .then((items) => setPosts(items.length > 0 ? items : fallbackPosts))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && posts.length === 0) return null;

  return (
    <section ref={sectionRef} className="scroll-reveal instagram-grid-section">
      <div className="instagram-grid-container">
        <h2 className="instagram-grid-title">Follow us on Instagram</h2>

        <div className="instagram-post-grid" aria-busy={loading}>
          {(loading ? fallbackPosts : posts).map((post) => (
            <a
              key={post.id}
              href={post.image_url}
              className="instagram-post-card"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Instagram gallery image"
            >
              <img src={post.image_url} alt="" className="instagram-post-image" loading="lazy" />
              <span className="instagram-post-overlay" aria-hidden />
              <FaInstagram className="instagram-post-icon" aria-hidden="true" />
            </a>
          ))}
        </div>

        <a
          href={siteConfig.socialLinks.instagram}
          className="instagram-load-more"
          target="_blank"
          rel="noopener noreferrer"
        >
          Load more
        </a>
      </div>
    </section>
  );
}
