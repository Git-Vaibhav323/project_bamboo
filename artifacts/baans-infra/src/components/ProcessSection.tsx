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

    const ctx = gsap.context(() => {
      const plants = gsap.utils.toArray<HTMLElement>('.process-plant-img');
      const steps = gsap.utils.toArray<HTMLElement>('.process-step-cell');
      const dots = gsap.utils.toArray<HTMLElement>('.process-step-dot');

      if (!plants.length) return;

      gsap.set(plants, {
        scaleY: 0,
        transformOrigin: 'bottom center',
        opacity: 0,
      });

      gsap.set(steps, {
        opacity: 0.12,
        y: 20,
        filter: 'blur(5px)',
      });

      gsap.set(dots, {
        opacity: 0,
        scale: 0.4,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: `+=${processSteps.length * 350}`,
          pin: true,
          pinSpacing: true, // 🔥 IMPORTANT FIX
          scrub: 2,
          anticipatePin: 1,
        },
      });

      processSteps.forEach((_, i) => {
        const o = i * 1.5;

        tl.to(
          plants[i],
          {
            scaleY: 1,
            opacity: 1,
            duration: 1.2,
            ease: 'power2.out',
          },
          o
        );

        tl.to(
          steps[i],
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.9,
            ease: 'power3.out',
          },
          o + 0.5
        );

        tl.to(
          dots[i],
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: 'back.out(2)',
          },
          o + 0.65
        );
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="process-scroll-track"
      style={{
        position: 'relative',
        overflowX: 'hidden', // 🔥 FIX (prevents fake double scroll)
      }}
    >
      <div
        className="process-sticky-panel"
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* HEADER */}
        <div className="process-heading-wrap">
  
          <h2
            className="heading-editorial process-heading"
            style={{ marginTop: '1px' }}
          >
            <span>How We Build?</span>
          </h2>
        </div>

        {/* CONTENT */}
        <div
          className="process-content"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* STEPS */}
          <div
            className="process-steps-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${processSteps.length}, 1fr)`,
            }}
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

          {/* STALK */}
          <div className="process-stalk-stage">
            <div
              style={{
                height: '30px',
                background:
                  'linear-gradient(180deg, #9B7820 0%, #7A5A10 35%, #8B6914 65%, #5C4209 100%)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow:
                  '0 6px 28px rgba(30,20,8,0.28), inset 0 2px 0 rgba(255,220,80,0.18)',
              }}
            >
              {processSteps.map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: `${((i + 1) / (processSteps.length + 1)) * 100}%`,
                    width: '3px',
                    background: 'rgba(0,0,0,0.22)',
                  }}
                />
              ))}
            </div>

            {/* PLANTS */}
            <div
              className="process-plants-row"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${processSteps.length}, 1fr)`,
              }}
            >
              {processSteps.map((step, i) => {
                const staggerY = [-4, -10, 0, -14, -8][i % 5];

                return (
                  <div key={step.number} className="process-plant-cell">
                    <span
                      className="process-step-dot"
                      style={{
                        transform: `translate(-50%, calc(8px + ${staggerY}px))`,
                      }}
                    >
                      {step.number}
                    </span>

                    <div
                      className="process-plant-grow"
                      style={{
                        transform: `translateX(-50%) translateY(${staggerY}px)`,
                      }}
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