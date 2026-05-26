import React from "react";
import { testimonials } from "../data/data";
import { useScrollReveal } from "../hooks/useScrollReveal";

type Testimonial = (typeof testimonials)[number];

function StarRating({ count }: { count: number }) {
  return (
    <div className="star-rating" aria-label={`${count} stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="var(--color-warm-sand)">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="testimonial-card">
      <StarRating count={t.stars} />
      <p className="testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
      <div className="testimonial-author">
        <div
          className="testimonial-avatar"
          style={t.avatar ? { backgroundImage: `url(${t.avatar})` } : undefined}
        >
          {!t.avatar && <span>{t.clientName.charAt(0)}</span>}
        </div>
        <div>
          <p className="tag testimonial-name">{t.clientName}</p>
          <p className="testimonial-meta">
            {t.projectType}, {t.location}
          </p>
        </div>
      </div>
    </div>
  );
}

function MarqueeRow({
  items,
  reverse = false,
}: {
  items: Testimonial[];
  reverse?: boolean;
}) {
  const doubled = [...items, ...items];
  return (
    <div className={`testimonial-marquee ${reverse ? "testimonial-marquee--reverse" : ""}`}>
      <div className="testimonial-marquee-track">
        {doubled.map((t, i) => (
          <TestimonialCard key={`${t.clientName}-${i}`} t={t} />
        ))}
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const headerRef = useScrollReveal<HTMLDivElement>();
  const rowA = [...testimonials, ...testimonials.slice(0, 2)];
  const rowB = [...testimonials].reverse();

  return (
    <section className="section-testimonials">
      <div className="testimonials-pattern" aria-hidden />

      <div ref={headerRef} className="scroll-reveal testimonials-header-wrap">
        <div className="testimonials-header">
          <span className="section-label" style={{ color: "var(--color-warm-sand)" }}>
            WHAT CLIENTS SAY
          </span>
          <h2 className="heading-editorial heading-light">
            <span>Words from</span>
            <br />
            <span className="text-hollow">the people we built for.</span>
          </h2>
        </div>
      </div>

      <div className="testimonials-marquees">
        <MarqueeRow items={rowA} />
        <MarqueeRow items={rowB} reverse />
      </div>
    </section>
  );
}
