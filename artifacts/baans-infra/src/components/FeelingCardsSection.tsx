import React, { useEffect, useRef } from "react";
import { Link } from "wouter";
import { projects } from "../data/data";
import { useScrollReveal } from "../hooks/useScrollReveal";
import LazyImage from "./LazyImage";

const feelingCards = [
  {
    tag: "MATERIAL",
    title: "Warm by nature",
    body: "Bamboo stays 8–10°C cooler than concrete in summer and holds warmth through winter nights.",
    img: "/samples/1.jpg",
    slug: projects[0].slug,
    size: "tall" as const,
    column: 0,
  },
  {
    tag: "CRAFT",
    title: "Hand-fitted, always",
    body: "Every joint is cut and fitted by our craftsmen. No CNC. No prefab. One-of-a-kind, always.",
    img: "/samples/2.jpg",
    slug: projects[1].slug,
    size: "tall" as const,
    column: 1,
  },
  {
    tag: "LONGEVITY",
    title: "Built for generations",
    body: "Properly treated bamboo lasts 25–50 years. Designed to outlast concrete.",
    img: "/samples/3.jpg",
    slug: projects[2].slug,
    size: "medium" as const,
    column: 2,
  },
  {
    tag: "PRESENCE",
    title: "Light that lives",
    body: "Spaces that glow at dusk — woven bamboo, open air, and warmth that invites you to stay.",
    img: "/samples/4.jpg",
    slug: projects[0].slug,
    size: "short" as const,
    column: 2,
  },
];

/** Hook: observe a column element and add .col-visible when it enters the viewport */
function useColReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("col-visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

export default function FeelingCardsSection() {
  const headerRef = useScrollReveal<HTMLDivElement>();
  const col0Ref = useColReveal<HTMLDivElement>();
  const col1Ref = useColReveal<HTMLDivElement>();
  const col2Ref = useColReveal<HTMLDivElement>();

  return (
    <section className="section-feeling">
      <div className="feeling-inner">
        <div ref={headerRef} className="scroll-reveal feeling-header">
          <h2 className="heading-editorial feeling-heading">
            <span>Not just a structure.</span>
            <br />
            <span className="text-hollow">A feeling.</span>
          </h2>
          <p className="feeling-intro">
            <strong>BAANS INFRA</strong> doesn&apos;t build walls. We weave spaces
            that breathe — adapting to their land, their light, and the people
            who live inside them.
          </p>
        </div>

        <div className="feeling-masonry">
          {/* Column 0 — slides in from left */}
          <div ref={col0Ref} className="feeling-col feeling-col--0 feeling-col-anim feeling-col-anim--left">
            {feelingCards
              .filter((c) => c.column === 0)
              .map((card, i) => (
                <FeelingCard key={card.title} card={card} index={i} />
              ))}
          </div>

          {/* Column 1 — rises from below (center, delayed) */}
          <div ref={col1Ref} className="feeling-col feeling-col--1 feeling-col-anim feeling-col-anim--up">
            {feelingCards
              .filter((c) => c.column === 1)
              .map((card, i) => (
                <FeelingCard key={card.title} card={card} index={i} />
              ))}
          </div>

          {/* Column 2 — slides in from right */}
          <div ref={col2Ref} className="feeling-col feeling-col--2 feeling-col-anim feeling-col-anim--right">
            {feelingCards
              .filter((c) => c.column === 2)
              .map((card, i) => (
                <FeelingCard key={card.title} card={card} index={i} />
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeelingCard({
  card,
  index,
}: {
  card: (typeof feelingCards)[number];
  index: number;
}) {
  return (
    <Link
      href={`/projects/${card.slug}`}
      className={`feeling-card image-card-pop feeling-card--${card.size}`}
      style={{ "--card-index": index } as React.CSSProperties}
    >
      <div className="feeling-card-media">
        <div className="card-image-shell">
          <LazyImage src={card.img} alt={card.title} className="feeling-card-img" />
        </div>
        <div className="card-image-gradient feeling-card-gradient" />
        <div className="card-image-overlay feeling-card-content">
          <span className="tag feeling-card-tag">{card.tag}</span>
          <p className="feeling-card-title">{card.title}</p>
          <p className="feeling-card-body">{card.body}</p>
          <span className="feeling-card-cta">View Project →</span>
        </div>
      </div>
    </Link>
  );
}