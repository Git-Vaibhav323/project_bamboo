import React, { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  
  const [isHovering, setIsHovering] = useState(false);
  
  const mouse = useRef({ x: 0, y: 0 });
  const dotPos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
    useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'a' || 
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') || 
        target.closest('button')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    
    let rafId: number;
    const render = () => {
      // Dot follows exactly
      dotPos.current.x = mouse.current.x;
      dotPos.current.y = mouse.current.y;
      
      // Ring follows smoothly
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * 0.15;
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * 0.15;
      
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }
      
      rafId = requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div 
        ref={dotRef}
        style={{
          position: 'fixed',
          top: -6,
          left: -6,
          width: 12,
          height: 12,
          borderRadius: '50%',
          backgroundColor: isHovering ? 'var(--color-accent)' : 'var(--color-primary)',
          pointerEvents: 'none',
          zIndex: 9999,
          transition: 'background-color 0.3s ease, transform 0.1s ease',
          transform: `scale(${isHovering ? 1.5 : 1})`,
        }}
      />
      <div 
        ref={ringRef}
        style={{
          position: 'fixed',
          top: -14,
          left: -14,
          width: 28,
          height: 28,
          borderRadius: '50%',
          border: `1px solid ${isHovering ? 'var(--color-accent)' : 'var(--color-primary)'}`,
          opacity: 0.5,
          pointerEvents: 'none',
          zIndex: 9998,
          transition: 'border-color 0.3s ease, transform 0.2s ease',
          transform: `scale(${isHovering ? 1.2 : 1})`,
        }}
      />
    </>
  );
}
