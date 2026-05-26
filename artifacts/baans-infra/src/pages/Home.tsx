import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import MarqueeStrip from "../components/MarqueeStrip";
import FeaturedWorksCarousel from "../components/FeaturedWorksCarousel";
import ProcessSection from "../components/ProcessSection";
import OurWorkSection from "../components/OurWorkSection";
import WhyBambooSection from "../components/WhyBambooSection";
import FeelingCardsSection from "../components/FeelingCardsSection";
import LazyImage from "../components/LazyImage";
import SectionDivider from "../components/SectionDivider";
import SketchfabSection from "../components/SketchfabSection";
import TestimonialsSection from "../components/TestimonialsSection";
import ContactFormSection from "../components/ContactFormSection";
import { useScrollReveal } from "../hooks/useScrollReveal";
const FRAME_COUNT = 60;

function BambooUnderline({ width = 220 }: { width?: number }) {
  return (
    <LazyImage
      src="/bamboo-hor.png"
      alt=""
      style={{
        width: `${width}px`,
        height: "36px",
        objectFit: "cover",
        objectPosition: "center",
        display: "block",
        margin: "14px auto 0",
        borderRadius: 0,
      }}
    />
  );
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroProgressBarRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const heroLockedRef = useRef(true);
  const heroAccDeltaRef = useRef(0);
  const [heroTextVisible, setHeroTextVisible] = useState(true);
  const [heroUnlocked, setHeroUnlocked] = useState(false);

  // ── HERO — wheel-driven frame scrub with scroll lock ─────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const base = import.meta.env.BASE_URL.replace(/\/$/, "");

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();

    const drawFrame = (img: HTMLImageElement) => {
      if (!img || !img.complete || img.naturalWidth === 0) return;
      const r = Math.max(
        canvas.width / img.naturalWidth,
        canvas.height / img.naturalHeight,
      );
      const cx = (canvas.width - img.naturalWidth * r) / 2;
      const cy = (canvas.height - img.naturalHeight * r) / 2;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        img,
        0,
        0,
        img.naturalWidth,
        img.naturalHeight,
        cx,
        cy,
        img.naturalWidth * r,
        img.naturalHeight * r,
      );
    };

    ctx.fillStyle = "#1E1408";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Preload all frames
    const imgs: HTMLImageElement[] = Array.from(
      { length: FRAME_COUNT },
      (_, i) => {
        const img = new Image();
        img.src = `${base}/frames/ezgif-frame-${String(i + 1).padStart(3, "0")}.jpg`;
        return img;
      },
    );
    imgs[0].onload = () => drawFrame(imgs[0]);

    let lastFrameIdx = -1;
    const TOTAL_DELTA = 2500;

    const updateHeroTextTransform = () => {
      if (!heroTextRef.current) return;
      const scrollY = window.scrollY;
      const parallaxY = -(scrollY + heroAccDeltaRef.current) * 0.15;
      heroTextRef.current.style.transform = `translateY(${parallaxY}px)`;
      heroTextRef.current.style.transformOrigin = "center center";
    };

    const applyProgress = (p: number) => {
      if (heroProgressBarRef.current) {
        heroProgressBarRef.current.style.width = `${p * 100}%`;
      }
      const frameIdx = Math.min(FRAME_COUNT - 1, Math.floor(p * FRAME_COUNT));
      if (frameIdx !== lastFrameIdx) {
        lastFrameIdx = frameIdx;
        const img = imgs[frameIdx];
        if (img.complete && img.naturalWidth > 0) drawFrame(img);
        else img.onload = () => drawFrame(img);
      }
      setHeroTextVisible(p < 0.1);
      updateHeroTextTransform();

      if (p >= 1) {
        heroLockedRef.current = false;
        setHeroUnlocked(true);
      } else {
        heroLockedRef.current = true;
        setHeroUnlocked(false);
      }
    };

    const driveProgress = (delta: number) => {
      heroAccDeltaRef.current = Math.max(
        0,
        Math.min(TOTAL_DELTA, heroAccDeltaRef.current + delta),
      );
      const p = heroAccDeltaRef.current / TOTAL_DELTA;
      applyProgress(p);
    };

    const onScroll = () => {
      updateHeroTextTransform();
      if (window.scrollY <= 5 && heroAccDeltaRef.current < TOTAL_DELTA) {
        heroLockedRef.current = true;
        setHeroUnlocked(false);
      }
    };

    const onWheel = (e: WheelEvent) => {
      const atTop = window.scrollY <= 5;

      if (atTop && e.deltaY < 0 && heroAccDeltaRef.current > 0) {
        heroLockedRef.current = true;
        setHeroUnlocked(false);
        e.preventDefault();
        driveProgress(e.deltaY);
        return;
      }

      if (!heroLockedRef.current) {
        if (atTop && heroAccDeltaRef.current > 0 && heroAccDeltaRef.current < TOTAL_DELTA) {
          heroLockedRef.current = true;
          setHeroUnlocked(false);
          e.preventDefault();
          driveProgress(e.deltaY);
        }
        return;
      }

      if (!atTop) return;

      e.preventDefault();
      driveProgress(e.deltaY);
    };

    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!heroLockedRef.current) return;
      e.preventDefault();
      const dy = (touchY - e.touches[0].clientY) * 2.5;
      touchY = e.touches[0].clientY;
      driveProgress(dy);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (!heroLockedRef.current) return;
      const fwd = ["ArrowDown", "ArrowRight", "PageDown", " "];
      const bck = ["ArrowUp", "ArrowLeft", "PageUp"];
      if (fwd.includes(e.key)) {
        e.preventDefault();
        driveProgress(220);
      } else if (bck.includes(e.key)) {
        e.preventDefault();
        driveProgress(-220);
      }
    };

    const onResize = () => {
      setSize();
      applyProgress(heroAccDeltaRef.current / TOTAL_DELTA);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    applyProgress(0);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const portfolioRef = useScrollReveal<HTMLElement>();

  return (
    <div>
      {/* ── 1. HERO ── */}
      <div
        style={{
          position: "relative",
          height: "100svh",
          minHeight: "100svh",
          overflow: "hidden",
          backgroundColor: "#1E1408",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            display: "block",
          }}
        />

        {/* Top gradient so navbar links stay readable against the photo */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "140px",
            background: "linear-gradient(to bottom, rgba(0,0,0,0.42) 0%, transparent 100%)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        <div
          ref={heroTextRef}
          className="hero-text-block"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "0 24px",
            opacity: heroTextVisible ? 1 : 0,
            transition: "opacity 0.6s ease",
            transformOrigin: "center center",
            pointerEvents: heroTextVisible ? "auto" : "none",
            zIndex: 2,
          }}
        >
          <span
            className="section-label"
            style={{
              color: "var(--color-accent)",
              opacity: 0.85,
              marginBottom: "24px",
              textShadow: "0 1px 8px rgba(0,0,0,0.7)",
            }}
          >
            BAMBOO. CRAFTED. ALIVE.
          </span>

          <h1
            className="hero-title heading-editorial"
            style={{
              maxWidth: "1000px",
              marginBottom: "28px",
              textShadow: "0 2px 32px rgba(0,0,0,0.6)",
            }}
          >
            <span style={{ color: "var(--color-ivory)" }}>We Build With</span>
            <br />
            <span
              className="text-hollow hero-hollow-line"
              style={{ textShadow: "0 2px 20px rgba(0,0,0,0.4)" }}
            >
              Nature&apos;s Strongest Material.
            </span>
          </h1>

          <p
            className="hero-subtext subheading"
            style={{
              color: "rgba(250,247,242,0.8)",
              fontSize: "clamp(1rem, 2.2vw, 1.35rem)",
              textShadow: "0 1px 8px rgba(0,0,0,0.5)",
              fontStyle: "italic",
              fontWeight: 300,
            }}
          >
            Luxury bamboo resorts, villas &amp; pavilions — built across India.
          </p>
        </div>

        {!heroUnlocked && (
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "14px",
              zIndex: 2,
            }}
          >
            <span
              style={{
                fontSize: "10px",
                letterSpacing: "0.25em",
                color: "rgba(250,247,242,0.5)",
                textTransform: "uppercase",
                fontFamily: "Karla",
              }}
            >
              Scroll to reveal
            </span>
            <div
              style={{
                width: "160px",
                height: "2px",
                backgroundColor: "rgba(250,247,242,0.18)",
                borderRadius: "1px",
                overflow: "hidden",
              }}
            >
              <div
                ref={heroProgressBarRef}
                style={{
                  width: "0%",
                  height: "100%",
                  backgroundColor: "var(--color-accent)",
                  borderRadius: "1px",
                }}
              />
            </div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              style={{ color: "rgba(250,247,242,0.45)" }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 9L12 15L18 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          </div>
        )}
      </div>

      <SectionDivider fill="var(--color-off-white)" />

      <WhyBambooSection />

      <SectionDivider fill="var(--color-warm-section)" flip />

      <FeelingCardsSection />

      <MarqueeStrip />

      <SectionDivider fill="var(--color-warm-section)" flip />

      <div className="process-section-wrap">
        <ProcessSection />
      </div>

      <div className="portfolio-after-process">
        <section ref={portfolioRef} className="scroll-reveal section-off-white section-featured section-featured--tight">
          <div className="section-featured-header">
            <span className="section-label section-label--pill">PORTFOLIO</span>
            <h2 className="heading-display section-featured-title">Featured Works</h2>
            <BambooUnderline width={150} />
            <p className="subheading section-featured-sub">
              Swipe to explore — drag left or right
            </p>
          </div>

          <FeaturedWorksCarousel />

          <div className="section-featured-cta">
            <Link href="/projects" className="pill-btn primary card-hover">
              View All Projects →
            </Link>
          </div>
        </section>
      </div>

      <SectionDivider fill="var(--color-cream)" />

      <SketchfabSection />

      <SectionDivider fill="var(--color-off-white)" />

      <OurWorkSection />

      <SectionDivider fill="var(--color-forest-dark)" />

      <TestimonialsSection />

      <SectionDivider fill="var(--color-cream)" flip />

      <ContactFormSection />
    </div>
  );
}