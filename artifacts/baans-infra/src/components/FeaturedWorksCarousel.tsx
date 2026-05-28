import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { projects } from '../data/data';
import LazyImage from './LazyImage';

export default function FeaturedWorksCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);
  const isDragging = useRef(false);
  // Pixels moved during the current press — distinguishes tap from drag
  const dragDelta = useRef(0);
  const [activeIdx, setActiveIdx] = useState(0);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const updateActive = () => {
      const cards = Array.from(track.querySelectorAll<HTMLElement>('.featured-train-card'));
      const center = track.scrollLeft + track.clientWidth / 2;
      let closest = 0;
      let closestDistance = Infinity;
      cards.forEach((card, i) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const dist = Math.abs(cardCenter - center);
        if (dist < closestDistance) { closest = i; closestDistance = dist; }
      });
      setActiveIdx(closest);
    };

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      isDragging.current = true;
      dragDelta.current = 0;
      dragStartX.current = e.clientX;
      dragStartScroll.current = track.scrollLeft;
      track.style.cursor = 'grabbing';
      track.style.userSelect = 'none';
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const delta = e.clientX - dragStartX.current;
      dragDelta.current = Math.abs(delta);
      track.scrollLeft = dragStartScroll.current - delta;
    };

    const onMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      track.style.cursor = 'grab';
      track.style.userSelect = '';
      window.setTimeout(updateActive, 80);
    };

    updateActive();
    track.addEventListener('scroll', updateActive, { passive: true });
    track.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('resize', updateActive);

    return () => {
      track.removeEventListener('scroll', updateActive);
      track.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', updateActive);
    };
  }, []);

  const scrollToCard = (idx: number) => {
    const track = trackRef.current;
    const card = track?.querySelectorAll<HTMLElement>('.featured-train-card')[idx];
    if (!track || !card) return;
    track.scrollTo({
      left: card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2,
      behavior: 'smooth',
    });
    setActiveIdx(idx);
  };

  const handleCardClick = (slug: string) => {
    // Only navigate if the user didn't drag (i.e. it was a real tap/click)
    if (dragDelta.current <= 6) {
      setLocation(`/projects/${slug}`);
    }
    dragDelta.current = 0;
  };

  return (
    <div className="featured-carousel-wrap" aria-label="Featured projects">
      <div className="featured-carousel-stage">
        <div
          ref={trackRef}
          className="featured-train featured-train--draggable"
          style={{ cursor: 'grab' }}
        >
          {projects.map((project, idx) => (
            <div
              key={project.slug}
              className={`featured-train-card${idx === activeIdx ? ' featured-train-card--active' : ''}`}
              role="button"
              tabIndex={0}
              aria-label={`View project: ${project.name}`}
              style={{ cursor: 'pointer', pointerEvents: 'all' }}
              onMouseDown={(e) => {
                // Record start position on the card itself for accurate delta tracking
                dragStartX.current = e.clientX;
                dragDelta.current = 0;
              }}
              onClick={() => handleCardClick(project.slug)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setLocation(`/projects/${project.slug}`);
                }
              }}
            >
              <article className="featured-card">
                <div className="card-image-shell featured-card-shell">
                  <LazyImage
                    src={project.coverImage}
                    alt={project.name}
                    className="featured-card-img"
                  />
                </div>
                <div className="card-image-gradient" />
                <div className="featured-card-sheen" aria-hidden />
                <div className="card-image-overlay featured-card-overlay">
                  <span className="featured-card-index">{String(idx + 1).padStart(2, '0')}</span>
                  <h3 className="card-overlay-title">{project.name}</h3>
                  <p className="card-overlay-location">{project.location}</p>
                  <span className="card-overlay-link">View Project →</span>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>

      <div className="featured-train-dots" aria-label="Featured project navigation">
        {projects.map((project, idx) => (
          <button
            key={project.slug}
            type="button"
            className={`featured-train-dot${idx === activeIdx ? ' featured-train-dot--active' : ''}`}
            onClick={() => scrollToCard(idx)}
            aria-label={`Show ${project.name}`}
          />
        ))}
      </div>
    </div>
  );
}
