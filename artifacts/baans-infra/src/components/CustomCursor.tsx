import React, { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const mouse    = useRef({ x: 0, y: 0 });
  const dotPos   = useRef({ x: 0, y: 0 });
  const ringPos  = useRef({ x: 0, y: 0 });
  const hovering = useRef(false);
  // Smoothly interpolated scale values so there's no CSS transition fighting the RAF
  const dotScale  = useRef(1);
  const ringScale = useRef(1);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      hovering.current = !!(
        t.tagName === 'A' ||
        t.tagName === 'BUTTON' ||
        t.closest('a') ||
        t.closest('button')
      );
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);

    let rafId: number;

    const render = () => {
      const targetDotScale  = hovering.current ? 1.5 : 1;
      const targetRingScale = hovering.current ? 1.8 : 1;

      // Lerp scales — smooth, no CSS transition conflict
      dotScale.current  += (targetDotScale  - dotScale.current)  * 0.18;
      ringScale.current += (targetRingScale - ringScale.current) * 0.14;

      // Dot snaps to cursor
      dotPos.current.x = mouse.current.x;
      dotPos.current.y = mouse.current.y;

      // Ring lags behind
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * 0.15;
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * 0.15;

      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0) scale(${dotScale.current.toFixed(3)})`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) scale(${ringScale.current.toFixed(3)})`;
      }

      rafId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const sharedStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    pointerEvents: 'none',
    zIndex: 9999,
    willChange: 'transform',
    // NO transition on transform — RAF handles it
  };

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        style={{
          ...sharedStyle,
          width: 12,
          height: 12,
          marginTop: -6,
          marginLeft: -6,
          borderRadius: '50%',
          backgroundColor: 'var(--color-primary)',
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        style={{
          ...sharedStyle,
          zIndex: 9998,
          width: 28,
          height: 28,
          marginTop: -14,
          marginLeft: -14,
          borderRadius: '50%',
          border: '1.5px solid var(--color-primary)',
          opacity: 0.45,
        }}
      />
    </>
  );
}
