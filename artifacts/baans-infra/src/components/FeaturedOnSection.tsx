import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import { featuredOnFallback } from "../data/data";
import { MediaFeature, supabase } from "../lib/supabase";
import { useScrollReveal } from "../hooks/useScrollReveal";

type FeatureCard = Omit<MediaFeature, "id" | "created_at" | "updated_at"> & {
  id?: string;
};

export default function FeaturedOnSection() {
  const sectionRef = useScrollReveal<HTMLElement>();
  const [features, setFeatures] = useState<FeatureCard[]>(featuredOnFallback);

  useEffect(() => {
    const fetchFeatures = async () => {
      if (!supabase) return;

      const { data, error } = await supabase
        .from("media_features")
        .select("*")
        .order("order", { ascending: true });

      if (!error && data && data.length > 0) {
        setFeatures(data);
      }
    };

    fetchFeatures();
  }, []);

  return (
    <section ref={sectionRef} className="scroll-reveal featured-on-section">
      <div className="featured-on-inner">
        <div className="featured-on-header">
          <span className="section-label section-label--pill">FEATURED ON</span>
          <h2 className="heading-display featured-on-title">Paper, magazines & press</h2>
          <p className="subheading featured-on-sub">
            Recognition for design-led bamboo construction, hospitality spaces, and PAN India execution.
          </p>
        </div>

        <div className="featured-on-grid">
          {features.map((feature) => (
            <a
              key={`${feature.publication}-${feature.title}`}
              href={feature.url || "#"}
              target={feature.url && feature.url !== "#" ? "_blank" : undefined}
              rel={feature.url && feature.url !== "#" ? "noopener noreferrer" : undefined}
              className="featured-on-card"
            >
              <div className="featured-on-logo">
                {feature.logo_url ? (
                  <img src={feature.logo_url} alt={feature.publication} />
                ) : (
                  <span>{feature.publication.slice(0, 2).toUpperCase()}</span>
                )}
              </div>
              <span className="featured-on-category">{feature.category}</span>
              <h3>{feature.publication}</h3>
              <p>{feature.title}</p>
              {feature.excerpt && <small>{feature.excerpt}</small>}
            </a>
          ))}
        </div>

        <div className="featured-on-cta">
          <Link href="/blogs" className="pill-btn">
            Read latest insights
          </Link>
        </div>
      </div>
    </section>
  );
}
