import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import InstagramGridSection from "../components/InstagramGridSection";
import TestimonialsSection from "../components/TestimonialsSection";
import ContactFormSection from "../components/ContactFormSection";
import FeaturedOnSection from "../components/FeaturedOnSection";
import { useScrollReveal } from "../hooks/useScrollReveal";

const FRAME_COUNT = 60;

// Bamboo thread particle — a single flying fibre
function BambooThread({ delay, x, angle, length }: { delay: number; x: number; angle: number; length: number }) {
  return (
    <motion.div
      aria-hidden
      style={{
        position: "absolute",
        left: `${x}%`,
        top: "50%",
        width: `${length}px`,
        height: "1.5px",
        background: "linear-gradient(90deg, transparent, rgba(200,169,110,0.9), transparent)",
        borderRadius: "2px",
        rotate: angle,
        originX: 0,
        originY: 0.5,
        pointerEvents: "none",
      }}
      initial={{ opacity: 0, x: 0, y: 0, scale: 0.2 }}
      animate={{
        opacity: [0, 0.9, 0.7, 0],
        x: [0, (Math.random() - 0.5) * 180],
        y: [0, -120 - Math.random() * 80],
        scale: [0.2, 1, 0.8, 0.3],
        rotate: [angle, angle + (Math.random() - 0.5) * 90],
      }}
      transition={{
        duration: 1.8 + Math.random() * 0.8,
        delay,
        ease: "easeOut",
        repeat: Infinity,
        repeatDelay: 2.5 + Math.random() * 1.5,
      }}
    />
  );
}

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

// Pre-generate stable thread data so it doesn't re-randomize on re-render
const THREADS = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  delay: i * 0.18,
  x: 5 + (i / 22) * 90,
  angle: -20 + Math.sin(i * 1.7) * 40,
  length: 28 + Math.abs(Math.sin(i * 2.3)) * 48,
}));

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroProgressBarRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const heroLockedRef = useRef(true);
  const heroAccDeltaRef = useRef(0);

  // 0 = first title visible, 1 = transitioning, 2 = second title visible
  const [heroPhase, setHeroPhase] = useState<0 | 1 | 2>(0);
  const [heroUnlocked, setHeroUnlocked] = useState(false);
  const [showThreads, setShowThreads] = useState(true);

  const heroTextVisible = heroPhase === 0;

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
        img, 0, 0, img.naturalWidth, img.naturalHeight,
        cx, cy, img.naturalWidth * r, img.naturalHeight * r,
      );
    };

    ctx.fillStyle = "#1E1408";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const imgs: HTMLImageElement[] = Array.from({ length: FRAME_COUNT }, (_, i) => {
      const img = new Image();
      img.src = `${base}/frames/ezgif-frame-${String(i + 1).padStart(3, "0")}.jpg`;
      return img;
    });
    imgs[0].onload = () => drawFrame(imgs[0]);

    let lastFrameIdx = -1;
    const TOTAL_DELTA = 2500;
    // Title disappears at 8% progress, second title shows at 12%
    const TITLE_FADE_START = 0.07;
    const SECOND_TITLE_AT = 0.13;

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

      // Phase transitions
      if (p < TITLE_FADE_START) {
        setHeroPhase(0);
        setShowThreads(true);
      } else if (p >= TITLE_FADE_START && p < SECOND_TITLE_AT) {
        setHeroPhase(1);
        setShowThreads(false);
      } else if (p >= SECOND_TITLE_AT) {
        setHeroPhase(2);
        setShowThreads(false);
      }

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
      heroAccDeltaRef.current = Math.max(0, Math.min(TOTAL_DELTA, heroAccDeltaRef.current + delta));
      applyProgress(heroAccDeltaRef.current / TOTAL_DELTA);
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
    const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0].clientY; };
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
      if (fwd.includes(e.key)) { e.preventDefault(); driveProgress(220); }
      else if (bck.includes(e.key)) { e.preventDefault(); driveProgress(-220); }
    };

    const onResize = () => { setSize(); applyProgress(heroAccDeltaRef.current / TOTAL_DELTA); };

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
      <div style={{
        position: "relative",
        height: "100svh",
        minHeight: "100svh",
        overflow: "hidden",
        backgroundColor: "#1E1408",
      }}>
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0, display: "block" }}
        />

        {/* Top gradient */}
        <div aria-hidden style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "140px",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.42) 0%, transparent 100%)",
          pointerEvents: "none", zIndex: 1,
        }} />

        {/* ── FIRST TITLE: "We Build With / Nature's Strongest Material." (filled, no hollow) ── */}
        <AnimatePresence>
          {heroPhase === 0 && (
            <motion.div
              ref={heroTextRef}
              key="title-one"
              className="hero-text-block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.55, ease: "easeInOut" }}
              style={{
                position: "absolute", inset: 0,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                textAlign: "center", padding: "0 24px",
                pointerEvents: "auto", zIndex: 2,
                transformOrigin: "center center",
              }}
            >
              <span className="section-label" style={{
                color: "var(--color-accent)", opacity: 0.85,
                marginBottom: "24px", textShadow: "0 1px 8px rgba(0,0,0,0.7)",
              }}>
                BAMBOO. CRAFTED. ALIVE.
              </span>

              <h1 className="hero-title heading-editorial" style={{
                maxWidth: "1000px", marginBottom: "28px",
                textShadow: "0 2px 32px rgba(0,0,0,0.6)",
                position: "relative",
              }}>
                <span style={{ color: "var(--color-ivory)" }}>We Build With</span>
                <br />
                {/* FILLED — no hollow, warm gold colour */}
                <span style={{
                  color: "var(--color-warm-sand)",
                  WebkitTextStroke: "0",
                  textShadow: "0 2px 20px rgba(0,0,0,0.4)",
                  position: "relative",
                  display: "inline-block",
                }}>
                  Nature&apos;s Strongest Material.

                  {/* Flying bamboo threads — sit behind the text in z */}
                  {showThreads && (
                    <span aria-hidden style={{
                      position: "absolute", inset: 0,
                      pointerEvents: "none", zIndex: -1,
                      overflow: "visible",
                    }}>
                      {THREADS.map(t => (
                        <BambooThread key={t.id} delay={t.delay} x={t.x} angle={t.angle} length={t.length} />
                      ))}
                    </span>
                  )}
                </span>
              </h1>

              <p className="hero-subtext subheading" style={{
                color: "rgba(250,247,242,0.8)",
                fontSize: "clamp(1rem, 2.2vw, 1.35rem)",
                textShadow: "0 1px 8px rgba(0,0,0,0.5)",
                fontStyle: "italic", fontWeight: 300,
                marginBottom: "30px",
              }}>
                Luxury bamboo resorts, villas &amp; pavilions — PAN India.
              </p>
              <Link href="/contact" className="hero-journey-cta">
                Start your journey with us now
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── SECOND TITLE: "Let's shape something that breathes." ── */}
        <AnimatePresence>
          {heroPhase === 2 && (
            <motion.div
              key="title-two"
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: "absolute", inset: 0,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                textAlign: "center", padding: "0 clamp(24px, 6vw, 80px)",
                pointerEvents: "auto", zIndex: 2,
              }}
            >
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(3.2rem, 9vw, 9rem)",
                fontWeight: 500,
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
                color: "var(--color-ivory)",
                margin: 0,
                textShadow: "0 2px 40px rgba(0,0,0,0.5)",
              }}>
                Let&apos;s shape{" "}
                <em style={{
                  fontStyle: "italic",
                  color: "var(--color-warm-sand)",
                }}>
                  something
                </em>
                <br />
                that breathes.
              </h2>
              <Link href="/contact" className="hero-journey-cta hero-journey-cta--second">
                Start your journey with us now
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll indicator */}
        {!heroUnlocked && (
          <div style={{
            position: "absolute", bottom: "40px", left: "50%",
            transform: "translateX(-50%)",
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: "14px", zIndex: 3,
          }}>
            <span style={{
              fontSize: "10px", letterSpacing: "0.25em",
              color: "rgba(250,247,242,0.5)", textTransform: "uppercase",
              fontFamily: "Karla",
            }}>
              Scroll to reveal
            </span>
            <div style={{
              width: "160px", height: "2px",
              backgroundColor: "rgba(250,247,242,0.18)",
              borderRadius: "1px", overflow: "hidden",
            }}>
              <div ref={heroProgressBarRef} style={{
                width: "0%", height: "100%",
                backgroundColor: "var(--color-accent)", borderRadius: "1px",
              }} />
            </div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              style={{ color: "rgba(250,247,242,0.45)" }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round" />
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
      <InstagramGridSection />
      <SectionDivider fill="var(--color-forest-dark)" />
      <TestimonialsSection />
      <SectionDivider fill="var(--color-off-white)" flip />
      <FeaturedOnSection />
      <SectionDivider fill="var(--color-cream)" flip />
      <ContactFormSection />
    </div>
  );
}
