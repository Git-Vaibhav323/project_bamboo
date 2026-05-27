import React, { useEffect, useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { galleryImages } from '../data/data';

const rotations = [-4, 2, -2, 5, -3, 2, -5, 3, -1];
const stringHeights = [48, 36, 60, 44, 52, 38, 56, 42, 50];
const imgHeights = [200, 240, 180, 220, 190, 230, 210, 200, 220];

export default function GallerySection() {
  const headerRef = useScrollReveal<HTMLDivElement>();
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = gridRef.current;
    if (!root) return;
    const items = root.querySelectorAll('.scroll-reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="section-gallery">
      <SectionDivider fill="var(--color-forest-dark)" />

      <div ref={headerRef} className="scroll-reveal section-inner" style={{ paddingBottom: '40px' }}>
        <div style={{ textAlign: 'center' }}>
          <span className="tag" style={{ color: 'var(--color-warm-sand)', fontSize: '11px' }}>
            THE WORK
          </span>
          <h2 className="heading-display heading-light" style={{ marginTop: '12px' }}>
            Craft in Focus
          </h2>
        </div>
      </div>

      <div
        style={{
          height: '56px',
          background: 'linear-gradient(90deg, var(--color-warm-sand), var(--color-earth), var(--color-warm-sand))',
          opacity: 0.35,
          position: 'relative',
          zIndex: 2,
        }}
        aria-hidden
      />

      <div
        ref={gridRef}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '0 40px 120px',
          background: 'var(--color-forest-dark)',
          position: 'relative',
        }}
      >
        {galleryImages.map((img, idx) => {
          const rotation = rotations[idx % rotations.length];
          const stringH = stringHeights[idx % stringHeights.length];
          const imgH = imgHeights[idx % imgHeights.length];

          return (
            <div
              key={idx}
              className="scroll-reveal gallery-hanging"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transformOrigin: 'top center',
                transform: `rotate(${rotation}deg)`,
                transition: 'transform 0.3s ease',
              }}
            >
              <div
                style={{
                  width: '1.5px',
                  height: `${stringH}px`,
                  background:
                    'linear-gradient(to bottom, rgba(200,169,110,0.6), rgba(139,94,60,0.4))',
                }}
              />
              <div
                className="card-hover"
                style={{
                  backgroundColor: 'rgba(250,247,242,0.95)',
                  padding: '8px 8px 24px',
                  boxShadow: '2px 8px 28px rgba(0,0,0,0.45)',
                  borderRadius: '2px',
                  width: '150px',
                  flexShrink: 0,
                }}
              >
                {img.isPlaceholder ? (
                  <div
                    className="photo-placeholder"
                    data-label={img.alt}
                    style={{
                      width: '100%',
                      height: `${imgH}px`,
                      borderRadius: '1px',
                      fontSize: '11px',
                      padding: '8px',
                    }}
                  >
                    {img.alt}
                  </div>
                ) : (
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: `${imgH}px`,
                      objectFit: 'cover',
                      borderRadius: '1px',
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SectionDivider({ fill }: { fill: string }) {
  return (
    <div style={{ lineHeight: 0, marginTop: '-1px' }} aria-hidden>
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        style={{ display: 'block', width: '100%', height: '80px' }}
      >
        <path
          d="M0,40 C360,90 720,0 1080,50 C1260,70 1380,60 1440,35 L1440,80 L0,80 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}
