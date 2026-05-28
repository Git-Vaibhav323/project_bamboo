import React, { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import LazyImage from "./LazyImage";
import { projects } from "../data/data";

const cards = [
  { tag: "MATERIAL", title: "Warm by nature", img: "/samples/1.jpg", slug: projects[0].slug },
  { tag: "CRAFT", title: "Hand-fitted", img: "/samples/2.jpg", slug: projects[1].slug },
  { tag: "LONGEVITY", title: "Built for generations", img: "/samples/3.jpg", slug: projects[2].slug },
  { tag: "PRESENCE", title: "Light that lives", img: "/samples/4.jpg", slug: projects[0].slug },
];

export default function FeelingCardsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const [titleVisible, setTitleVisible] = useState(false);

  const progress = useRef(0);
  const targetProgress = useRef(0);
  const locked = useRef(false);
  const snapping = useRef(false);
  const rafId = useRef<number>(0);
  const tickRunning = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    const center = centerRef.current;
    if (!section || !center) return;

    const mobileOrReducedMotion = window.matchMedia('(max-width: 768px), (prefers-reduced-motion: reduce)').matches;
    if (mobileOrReducedMotion) {
      document.documentElement.style.setProperty("--lx", "0px");
      document.documentElement.style.setProperty("--rx", "0px");
      center.style.transform = "";
      setTitleVisible(true);
      return;
    }

    const lockScroll = () => { document.body.style.overflow = "hidden"; };
    const unlockScroll = () => { document.body.style.overflow = ""; };

    // Calculate the scale needed to fill the entire viewport from the center card's size
    const getMaxScale = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const cardW = center.offsetWidth;
      const cardH = center.offsetHeight;
      const scaleX = vw / cardW;
      const scaleY = vh / cardH;
      // Use whichever axis needs more scaling, plus a small buffer
      return Math.max(scaleX, scaleY) * 1.05;
    };

    const render = () => {
      const p = progress.current;

      // Side cards exit — move out fast in first 40% of progress
      const sideT = Math.min(p / 40, 1);
      const move = Math.pow(sideT, 1.4) * 700;
      document.documentElement.style.setProperty("--lx", `-${move}px`);
      document.documentElement.style.setProperty("--rx", `${move}px`);

      // Center zoom — ease-out so it decelerates as it fills screen
      const maxScale = getMaxScale();
      const zoomT = Math.min(p / 100, 1);
      const eased = 1 - Math.pow(1 - zoomT, 2.4);
      const scale = 1 + eased * (maxScale - 1);
      center.style.transform = `translate(-50%, -50%) scale(${scale})`;

      // Title appears when zoom is nearly complete
      if (p >= 96) {
        setTitleVisible(true);
      } else {
        setTitleVisible(false);
      }
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const startTick = () => {
      if (tickRunning.current) return;
      tickRunning.current = true;

      const tick = () => {
        const diff = Math.abs(targetProgress.current - progress.current);
        if (diff > 0.02) {
          progress.current = lerp(progress.current, targetProgress.current, 0.09);
          render();
          rafId.current = requestAnimationFrame(tick);
        } else {
          progress.current = targetProgress.current;
          render();
          tickRunning.current = false;
        }
      };
      rafId.current = requestAnimationFrame(tick);
    };

    // Snap the section into view — scroll so section.top === 0
    const snapSectionIntoView = (onDone: () => void) => {
      if (snapping.current) return;
      snapping.current = true;
      lockScroll();

      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const startY = window.scrollY;
      const endY = sectionTop;
      const duration = 550; // ms
      const startTime = performance.now();

      const easeInOutCubic = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const animateSnap = (now: number) => {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        const eased = easeInOutCubic(t);
        window.scrollTo(0, startY + (endY - startY) * eased);

        if (t < 1) {
          requestAnimationFrame(animateSnap);
        } else {
          snapping.current = false;
          onDone();
        }
      };

      requestAnimationFrame(animateSnap);
    };

    const onWheel = (e: WheelEvent) => {
      if (!locked.current) return;
      e.preventDefault();
      e.stopPropagation();

      targetProgress.current += Math.sign(e.deltaY) * 4;
      if (targetProgress.current < 0) targetProgress.current = 0;

      if (targetProgress.current >= 100) {
        targetProgress.current = 100;
        startTick();
        // Unlock after animation settles
        setTimeout(() => {
          locked.current = false;
          unlockScroll();
          window.removeEventListener("wheel", onWheel, true);
        }, 500);
        return;
      }

      startTick();
    };

    // Only trigger when section is >= 99% visible (fully in viewport)
    const observer = new IntersectionObserver(
      ([entry]) => {
        const fullyVisible = entry.intersectionRatio >= 0.99;

        if (fullyVisible && !locked.current && progress.current < 99) {
          locked.current = true;
          lockScroll();
          window.addEventListener("wheel", onWheel, { passive: false, capture: true });
        } else if (!fullyVisible && !snapping.current) {
          // Section partially visible + user scrolled into it from above or below
          // → snap it fully into view and begin animation
          if (
            entry.isIntersecting &&
            entry.intersectionRatio > 0.15 &&
            entry.intersectionRatio < 0.99 &&
            !locked.current &&
            progress.current < 5
          ) {
            snapSectionIntoView(() => {
              locked.current = true;
              window.addEventListener("wheel", onWheel, { passive: false, capture: true });
            });
          } else if (!entry.isIntersecting) {
            locked.current = false;
            unlockScroll();
            window.removeEventListener("wheel", onWheel, true);
          }
        }
      },
      {
        threshold: [0, 0.15, 0.5, 0.99, 1.0],
      }
    );

    observer.observe(section);

    // Initial render
    render();

    return () => {
      observer.disconnect();
      window.removeEventListener("wheel", onWheel, true);
      cancelAnimationFrame(rafId.current);
      unlockScroll();
    };
  }, []);

  return (
    <section ref={sectionRef} className="feeling-section">

      {/* SIDE CARDS */}
      <div className="side left-top"><Card card={cards[0]} /></div>
      <div className="side left-bottom"><Card card={cards[1]} /></div>
      <div className="side right-top"><Card card={cards[2]} /></div>
      <div className="side right-bottom"><Card card={cards[3]} /></div>

      {/* CENTER IMAGE */}
      <div ref={centerRef} className="center">
        <Card card={cards[0]} />
      </div>
{/* TITLE — appears top-right after zoom completes */}
<div className={`feeling-zoom-title ${titleVisible ? "feeling-zoom-title--visible" : ""}`}>

  <span className="feeling-zoom-title__label">
    Featured Project
  </span>

  <h2 className="feeling-zoom-title__heading">
    Bali Style<br />
    <em>Airbnb Villa</em>
  </h2>

  <Link href={`/projects/${cards[0].slug}`} className="feeling-zoom-title__cta">
    View Project →
  </Link>

</div>
    </section>
  );
}

function Card({ card }: any) {
  return (
    <Link href={`/projects/${card.slug}`} className="card">
      <LazyImage src={card.img} className="img" />
      <div className="overlay">
        <span>{card.tag}</span>
        <h3>{card.title}</h3>
      </div>
    </Link>
  );
}
