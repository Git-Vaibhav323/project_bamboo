import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { projects } from '../data/data';
import LazyImage from './LazyImage';

export default function FeaturedWorksCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);
  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const updateActive = () => {
      const cards = Array.from(track.querySelectorAll<HTMLElement>('.featured-train-card'));
      const center = track.scrollLeft + track.clientWidth / 2;
      let closest = 0;
      let closestDistance = Infinity;

      cards.forEach((card, idx) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(cardCenter - center);
        if (distance < closestDistance) {
          closest = idx;
          closestDistance = distance;
        }
      });

      setActiveIdx(closest);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      isDragging.current = true;
      hasDragged.current = false;
      dragStartX.current = event.clientX;
      dragStartScroll.current = track.scrollLeft;
      track.classList.add('is-dragging');
      track.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!isDragging.current) return;
      const delta = event.clientX - dragStartX.current;
      if (Math.abs(delta) > 6) hasDragged.current = true;
      track.scrollLeft = dragStartScroll.current - delta;
    };

    const stopDrag = (event: PointerEvent) => {
      if (!isDragging.current) return;
      isDragging.current = false;
      track.classList.remove('is-dragging');
      if (track.hasPointerCapture(event.pointerId)) {
        track.releasePointerCapture(event.pointerId);
      }
      window.setTimeout(updateActive, 120);
    };

    updateActive();
    track.addEventListener('scroll', updateActive, { passive: true });
    track.addEventListener('pointerdown', onPointerDown);
    track.addEventListener('pointermove', onPointerMove);
    track.addEventListener('pointerup', stopDrag);
    track.addEventListener('pointercancel', stopDrag);
    window.addEventListener('resize', updateActive);

    return () => {
      track.removeEventListener('scroll', updateActive);
      track.removeEventListener('pointerdown', onPointerDown);
      track.removeEventListener('pointermove', onPointerMove);
      track.removeEventListener('pointerup', stopDrag);
      track.removeEventListener('pointercancel', stopDrag);
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

  return (
    <div className="featured-carousel-wrap" aria-label="Featured projects">
      <div className="featured-carousel-stage">
        <div ref={trackRef} className="featured-train featured-train--draggable">
          {projects.map((project, idx) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className={`featured-train-card${idx === activeIdx ? ' featured-train-card--active' : ''}`}
              aria-label={`View ${project.name}`}
              draggable={false}
              onClick={(event) => {
                if (hasDragged.current) {
                  event.preventDefault();
                  hasDragged.current = false;
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
                  <span className="card-overlay-link">View Project</span>
                </div>
              </article>
            </Link>
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
