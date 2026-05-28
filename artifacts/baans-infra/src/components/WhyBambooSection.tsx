import React, { useEffect, useRef, useState } from "react";
import { whyBambooReasons } from "../data/data";
import { Link } from "wouter";

const WHY_BAMBOO_DISPLAY = whyBambooReasons.slice(0, 3);
import { useScrollReveal } from "../hooks/useScrollReveal";
import LazyImage from "./LazyImage";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function WhyBambooSection() {
  const revealRef = useScrollReveal<HTMLElement>();
  const sectionRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const revealPanelRef = useRef<HTMLDivElement>(null);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const revealProgressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    featureRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setRevealed((prev) => ({ ...prev, [i]: true }));
            obs.unobserve(el);
          }
        },
        { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  useEffect(() => {
    const updateTarget = () => {
      const visual = visualRef.current;
      if (visual) {
        const rect = visual.getBoundingClientRect();
        const vh = window.innerHeight;
        const raw = (vh * 0.75 - rect.top) / (vh * 0.95);
        targetProgressRef.current = Math.max(0, Math.min(1, raw));
      }

      let closest = 0;
      let minDist = Infinity;
      featureRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dist = Math.abs(r.top + r.height / 2 - window.innerHeight * 0.42);
        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      });
      setActiveIndex(closest);
    };

    const animateReveal = () => {
      const reveal = revealPanelRef.current;
      if (reveal) {
        revealProgressRef.current = lerp(
          revealProgressRef.current,
          targetProgressRef.current,
          0.1,
        );
        const p = revealProgressRef.current;
        const inset = 100 - p * 100;
        reveal.style.clipPath = `inset(${inset}% 0 0 0)`;
        reveal.style.setProperty("--gate-reveal", String(p));
      }
      rafRef.current = requestAnimationFrame(animateReveal);
    };

    window.addEventListener("scroll", updateTarget, { passive: true });
    window.addEventListener("resize", updateTarget, { passive: true });
    updateTarget();
    rafRef.current = requestAnimationFrame(animateReveal);

    return () => {
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", updateTarget);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section
      ref={(el) => {
        if (revealRef && 'current' in revealRef) {
          (revealRef as React.MutableRefObject<HTMLElement | null>).current = el;
        }
        sectionRef.current = el;
      }}
      className="scroll-reveal why-bamboo-section"
    >
      <div className="why-bamboo-split">
        <div className="why-bamboo-left">
          <div className="why-bamboo-left-inner">
            <span className="section-label section-label--why">Why Choose Us?</span>
            <h2 className="heading-editorial heading-why-bamboo">
              <span>Built on proof,</span>
              <br />
              <span className="text-hollow">not promises.</span>
            </h2>

            <div className="why-bamboo-features">
              {WHY_BAMBOO_DISPLAY.map((r, i) => (
                <div
                  key={r.number}
                  ref={(el) => {
                    featureRefs.current[i] = el;
                  }}
                  className={`why-feature-item ${revealed[i] ? "is-revealed" : ""} ${activeIndex === i ? "is-active" : ""}`}
                  style={{ transitionDelay: `${i * 0.08}s` }}
                >
                  <span
                    className={`why-feature-number ${revealed[i] ? "is-revealed" : ""}`}
                  >
                    {r.number}
                  </span>
                  <div className="why-feature-copy">
                    <h3>{r.heading}</h3>
                    <p>{r.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/contact" className="pill-btn primary why-bamboo-cta">
              Start your journey with us now
            </Link>
          </div>
        </div>

        <div ref={visualRef} className="why-bamboo-visual">
          <div className="why-bamboo-gate-frame">
            <div ref={revealPanelRef} className="why-bamboo-gate-reveal">
              <div className="why-bamboo-gate arch-image-wrap">
                <LazyImage
                  src="/samples/1.jpg"
                  alt="Bamboo architecture viewed through an arched gateway"
                  className="arch-image why-bamboo-gate-img"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
