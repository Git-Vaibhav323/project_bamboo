import React, { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { featuredOnFallback } from "../data/data";
import { MediaFeature, supabase } from "../lib/supabase";

type FeatureCard = Omit<MediaFeature, "id" | "created_at" | "updated_at"> & {
  id?: string;
};

// Category → accent color mapping
const CATEGORY_COLORS: Record<string, string> = {
  "Magazine":    "#C8A96E",
  "Trade Paper": "#8FAF85",
  "Editorial":   "#A07840",
};

function getCategoryColor(cat: string) {
  return CATEGORY_COLORS[cat] ?? "#C8A96E";
}

// Initials badge — two letters from publication name
function InitialsBadge({ name, color }: { name: string; color: string }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <div
      style={{
        width: "52px",
        height: "52px",
        borderRadius: "12px",
        background: `${color}18`,
        border: `1px solid ${color}40`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "18px",
        fontWeight: 700,
        color,
        flexShrink: 0,
        letterSpacing: "0.04em",
      }}
    >
      {initials}
    </div>
  );
}

export default function FeaturedOnSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [features, setFeatures] = useState<FeatureCard[]>(featuredOnFallback);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchFeatures = async () => {
      if (!supabase) return;
      const { data, error } = await supabase
        .from("media_features")
        .select("*")
        .order("order", { ascending: true });
      if (!error && data && data.length > 0) setFeatures(data);
    };
    fetchFeatures();
  }, []);

  return (
    <section ref={sectionRef} className="featured-on-section-new">
      {/* Background texture */}
      <div className="featured-on-bg-texture" aria-hidden />

      <div className="featured-on-inner-new">

        {/* Header */}
        <motion.div
          className="featured-on-header-new"
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="featured-on-eyebrow">Featured On</span>
          <h2 className="featured-on-heading">
            Paper, magazines <em>&amp; press</em>
          </h2>
          <p className="featured-on-subtext">
            Recognition for design-led bamboo construction, hospitality spaces, and PAN India execution.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="featured-on-grid-new">
          {features.map((feature, idx) => {
            const color = getCategoryColor(feature.category);
            return (
              <motion.a
                key={`${feature.publication}-${feature.title}`}
                href={feature.url || "#"}
                target={feature.url && feature.url !== "#" ? "_blank" : undefined}
                rel={feature.url && feature.url !== "#" ? "noopener noreferrer" : undefined}
                className="featured-on-card-new"
                initial={{ opacity: 0, y: 36 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.65, delay: 0.15 + idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } }}
              >
                {/* Top row: badge + category */}
                <div className="foc-top">
                  {feature.logo_url ? (
                    <div className="foc-logo-img">
                      <img src={feature.logo_url} alt={feature.publication} />
                    </div>
                  ) : (
                    <InitialsBadge name={feature.publication} color={color} />
                  )}
                  <span className="foc-category" style={{ color }}>
                    {feature.category}
                  </span>
                </div>

                {/* Publication name */}
                <h3 className="foc-publication">{feature.publication}</h3>

                {/* Article title */}
                <p className="foc-title">{feature.title}</p>

                {/* Excerpt */}
                {feature.excerpt && (
                  <p className="foc-excerpt">{feature.excerpt}</p>
                )}

                {/* Bottom: read link */}
                <div className="foc-footer">
                  <span className="foc-read-link">
                    Read feature
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: "6px", transition: "transform 0.25s ease" }} className="foc-arrow">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>

                {/* Hover accent line */}
                <div className="foc-accent-line" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
              </motion.a>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          className="featured-on-cta-new"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link href="/blogs" className="pill-btn">
            Read latest insights
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
