import React, { useEffect, useRef } from 'react';
import { processSteps } from '../data/data';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ProcessSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Wait for DOM to settle
    const ctx = gsap.context(() => {
      const plants = gsap.utils.toArray<HTMLElement>('.process-plant-img');
      const steps = gsap.utils.toArray<HTMLElement>('.process-step-cell');
      const dots = gsap.utils.toArray<HTMLElement>('.process-step-dot');

      if (!plants.length) return;

      gsap.set(plants, { scaleY: 0, transformOrigin: 'bottom center', opacity: 0 });
      gsap.set(steps, { opacity: 0.12, y: 20, filter: 'blur(5px)' });
      gsap.set(dots, { opacity: 0, scale: 0.4 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: `+=${processSteps.length * 350}`,
          pin: true,
          pinSpacing: true,
          scrub: 2,
          anticipatePin: 1,
        },
      });

      processSteps.forEach((_, i) => {
        const o = i * 1.5;

        tl.to(plants[i], {
          scaleY: 1,
          opacity: 1,
          duration: 1.2,
          ease: 'power2.out',
        }, o);

        tl.to(steps[i], {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.9,
          ease: 'power3.out',
        }, o + 0.5);

        tl.to(dots[i], {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: 'back.out(2)',
        }, o + 0.65);
      });

    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="process-scroll-track">
      <div className="process-sticky-panel">

        <div className="process-heading-wrap">
          <span className="section-label" style={{ color: 'var(--color-primary)' }}>
            HOW WE BUILD
          </span>
          <h2 className="heading-editorial process-heading" style={{ marginTop: '12px' }}>
            <span>From an idea to</span>
            <br />
            <span className="text-golden">opening day.</span>
          </h2>
        </div>

        <div className="process-content">

          <div
            className="process-steps-grid"
            style={{ gridTemplateColumns: `repeat(${processSteps.length}, 1fr)` }}
          >
            {processSteps.map((step) => (
              <div key={step.number} className="process-step-cell">
                <span
                  className="tag process-step-tag"
                  style={{
                    display: 'inline-block',
                    backgroundColor: 'rgba(30,20,8,0.12)',
                    color: 'var(--color-text)',
                    padding: '3px 12px',
                    borderRadius: '99px',
                    fontSize: '10px',
                    marginBottom: '8px',
                  }}
                >
                  {step.duration}
                </span>
                <h3 className="process-step-title">{step.title}</h3>
                <p className="process-step-desc">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="process-stalk-stage">

            {/* CSS bamboo stalk — no image watermark */}
            <div style={{
              height: '80px',
              background: 'linear-gradient(180deg, #9B7820 0%, #7A5A10 35%, #8B6914 65%, #5C4209 100%)',
              position: 'relative',
              zIndex: 1,
              overflow: 'hidden',
              boxShadow: '0 6px 28px rgba(30,20,8,0.28), inset 0 2px 0 rgba(255,220,80,0.18)',
            }}>
              {processSteps.map((_, i) => (
                <div key={i} style={{
                  position: 'absolute',
                  top: 0, bottom: 0,
                  left: `${((i + 1) / (processSteps.length + 1)) * 100}%`,
                  width: '4px',
                  background: 'rgba(0,0,0,0.22)',
                }} />
              ))}
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0,
                height: '45%',
                background: 'linear-gradient(180deg, rgba(255,230,100,0.14) 0%, transparent 100%)',
                pointerEvents: 'none',
              }} />
            </div>

            {/* Plants */}
            <div
              className="process-plants-row"
              style={{ gridTemplateColumns: `repeat(${processSteps.length}, 1fr)` }}
            >
              {processSteps.map((step, i) => {
                const staggerY = [-4, -10, 0, -14, -8][i % 5];
                return (
                  <div key={step.number} className="process-plant-cell">
                    <span
                      className="process-step-dot"
                      style={{ transform: `translate(-50%, calc(8px + ${staggerY}px))` }}
                    >
                      {step.number}
                    </span>
                    <div
                      className="process-plant-grow"
                      style={{ transform: `translateX(-50%) translateY(${staggerY}px)` }}
                    >
                      <img
                        src="/bamboo-plant.png"
                        alt=""
                        className="process-plant-img"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          objectPosition: 'bottom center',
                          display: 'block',
                          transformOrigin: 'bottom center',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}