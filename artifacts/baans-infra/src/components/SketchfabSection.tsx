import React, { useEffect, useState } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";

const SKETCHFAB_SRC =
  "https://sketchfab.com/models/7adf5bc60e9e4904be4f8606362c88ff/embed?autospin=0&autostart=1&preload=1&transparent=0&ui_animations=0&ui_infos=0&ui_stop=0&ui_inspector=0&ui_watermark_link=0&ui_watermark=0&ui_ar=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_annotations=0&ui_logo=0";

export default function SketchfabSection() {
  const sectionRef = useScrollReveal<HTMLElement>();
  const [hintVisible, setHintVisible] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setHintVisible(false), 3000);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="explore-structure"
      className="scroll-reveal section-sketchfab"
    >
      <div className="sketchfab-split">
        <div className="sketchfab-left">
          <div className="sketchfab-left-inner">
            <span className="section-label section-label--sketchfab heading-editorial-label">
              <span>Let&apos;s </span>
              <span className="text-hollow">Interact</span>
            </span>
            <h2 className="heading-editorial heading-sketchfab">Explore Our Structure</h2>
            <p className="sketchfab-sub">Touch. Rotate. Explore.</p>
            <p className="body-muted sketchfab-desc">
              Step inside our bamboo glamping shelter — a full 3D model you can
              orbit, zoom, and inspect from every angle. See how natural curves,
              joinery, and open-air framing come together before we ever break
              ground on your site.
            </p>
          </div>
        </div>

        <div className="sketchfab-right">
          {hintVisible && (
            <div className="sketchfab-hint" aria-hidden>
              <span>Drag to rotate</span>
            </div>
          )}
          <div className="sketchfab-reveal-panel">
            <div className="sketchfab-embed-wrapper">
              <iframe
                title="BAMBOO GLAMPING SHELTER P2 BAKED"
                frameBorder={0}
                allowFullScreen
                // @ts-expect-error legacy attrs
                mozallowfullscreen="true"
                webkitallowfullscreen="true"
                allow="autoplay; fullscreen; xr-spatial-tracking"
                src={SKETCHFAB_SRC}
              />
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "56px",
                  background: "var(--color-cream)",
                  zIndex: 10,
                  pointerEvents: "none",
                }}
              />
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "52px",
                  background: "var(--color-cream)",
                  zIndex: 10,
                  pointerEvents: "none",
                }}
              />
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "80px",
                  height: "56px",
                  background: "var(--color-cream)",
                  zIndex: 11,
                  pointerEvents: "none",
                }}
              />
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "80px",
                  height: "52px",
                  background: "var(--color-cream)",
                  zIndex: 11,
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
