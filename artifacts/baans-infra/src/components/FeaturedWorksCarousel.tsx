import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { projects } from '../data/data';
import LazyImage from './LazyImage';

export default function FeaturedWorksCarousel() {
  const [activeIdx, setActiveIdx] = useState(0);
  const dragStartX = useRef(0);
  const isDragging = useRef(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    isDragging.current = true;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const diff = dragStartX.current - e.clientX;
    if (diff > 60 && activeIdx < projects.length - 1) setActiveIdx(i => i + 1);
    if (diff < -60 && activeIdx > 0) setActiveIdx(i => i - 1);
  };

  const handlePointerCancel = () => {
    isDragging.current = false;
  };

  return (
    <div className="featured-carousel-wrap">
      <div
        className="featured-carousel-stage"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        {projects.map((project, idx) => {
          const diff = idx - activeIdx;
          const isCenter = diff === 0;
          const isVisible = Math.abs(diff) <= 2;

          return (
            <motion.div
              key={project.slug}
              className="featured-carousel-item"
              animate={{
                x: `calc(-50% + ${diff * 680}px)`,
                y: '-50%',
                scale: isCenter ? 1 : Math.abs(diff) === 1 ? 0.72 : 0.52,
                zIndex: isCenter ? 10 : 10 - Math.abs(diff),
                opacity: isVisible ? (isCenter ? 1 : Math.abs(diff) === 1 ? 0.65 : 0.28) : 0,
              }}
              transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
              onClick={() => {
                if (!isCenter) setActiveIdx(idx);
              }}
            >
              <div className={`featured-card ${isCenter ? 'featured-card--center' : 'featured-card--side'}`}>
                <div className="card-image-shell featured-card-shell">
                  <LazyImage
                    src={project.coverImage}
                    alt={project.name}
                    className="featured-card-img"
                  />
                </div>
                <div className="card-image-gradient" />
                {isCenter && (
                  <div className="card-image-overlay featured-card-overlay">
                    <h3 className="card-overlay-title">{project.name}</h3>
                    <p className="card-overlay-location">{project.location}</p>
                    <Link href={`/projects/${project.slug}`} className="card-overlay-link">
                      View →
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="featured-carousel-dots">
        {projects.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to project ${i + 1}`}
            onClick={() => setActiveIdx(i)}
            className={`featured-dot ${i === activeIdx ? 'featured-dot--active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
