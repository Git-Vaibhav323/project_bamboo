import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Warm bamboo-brown palette — no green
const NODE_POSITIONS = [0.13, 0.27, 0.41, 0.55, 0.69, 0.83];

interface Leaf { nodeIdx: number; side: 'top' | 'bottom'; delay: number; }
const LEAVES: Leaf[] = [
  { nodeIdx: 1, side: 'top',    delay: 0 },
  { nodeIdx: 3, side: 'bottom', delay: 0.06 },
  { nodeIdx: 5, side: 'top',    delay: 0.05 },
];

export default function LoadingScreen() {
  const [visible, setVisible]   = useState(true);
  const [progress, setProgress] = useState(0);
  const rafRef   = useRef<number>(0);
  const startRef = useRef<number>(0);
  const DURATION = 2400;

  useEffect(() => {
    startRef.current = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - startRef.current) / DURATION);
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(eased);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setVisible(false), 700);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const TRACK_W = Math.min(window.innerWidth * 0.48, 420);
  const STALK_H = 14;  // bolder stalk
  const filledW = progress * TRACK_W;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'radial-gradient(ellipse at 50% 40%, #2A1A0A 0%, #140C04 50%, #0A0602 100%)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '32px',  // tighter — logo closer to stalk
          }}
        >
          {/* Logo */}
          <motion.img
            src="/logo.png"
            alt="BAANS INFRA"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: '80px', width: 'auto', filter: 'brightness(0) invert(1)' }}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />

          {/* Stalk + counter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0' }}
          >
            {/* Stalk container — extra vertical padding so leaves never clip into counter */}
            <div
              aria-hidden
              style={{
                position: 'relative',
                width: `${TRACK_W}px`,
                /* 28px top padding for top leaves, 28px bottom padding for bottom leaves */
                paddingTop: '28px',
                paddingBottom: '28px',
              }}
            >
              {/* Background track */}
              <div style={{
                position: 'absolute',
                top: '28px', left: 0, right: 0,
                height: `${STALK_H}px`,
                borderRadius: '7px',
                background: 'rgba(200,169,110,0.10)',
                border: '1px solid rgba(200,169,110,0.08)',
              }} />

              {/* Growing bamboo culm */}
              <div style={{
                position: 'absolute',
                top: '28px', left: 0,
                height: `${STALK_H}px`,
                width: `${filledW}px`,
                borderRadius: '7px',
                overflow: 'visible',
                background: `linear-gradient(to bottom, #C8A96E 0%, #A07840 30%, #7B5A28 65%, #5C3E18 100%)`,
                boxShadow: '0 3px 14px rgba(90,60,20,0.55), inset 0 1px 0 rgba(220,185,120,0.4)',
                transition: 'width 0.04s linear',
              }}>
                <div style={{
                  position: 'absolute', top: '1px', left: '6px', right: '6px',
                  height: '3px', borderRadius: '2px',
                  background: 'rgba(240,210,150,0.5)',
                  pointerEvents: 'none',
                }} />
                <div style={{
                  position: 'absolute', bottom: '1px', left: '6px', right: '6px',
                  height: '1px', borderRadius: '1px',
                  background: 'rgba(0,0,0,0.28)',
                  pointerEvents: 'none',
                }} />
              </div>

              {/* Node joints */}
              {NODE_POSITIONS.map((frac, i) => {
                const nodeX = frac * TRACK_W;
                const isVis = filledW >= nodeX - 2;
                return (
                  <motion.div
                    key={i}
                    initial={false}
                    animate={isVis ? { opacity: 1, scaleY: 1 } : { opacity: 0, scaleY: 0.3 }}
                    transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
                    style={{
                      position: 'absolute',
                      top: `${28 - 4}px`,
                      left: `${nodeX - 4}px`,
                      width: '8px',
                      height: `${STALK_H + 8}px`,
                      borderRadius: '4px',
                      background: 'linear-gradient(to bottom, #E8C880, #A07840, #6B4A20)',
                      boxShadow: '0 0 8px rgba(200,160,80,0.5), inset 0 1px 0 rgba(255,230,150,0.3)',
                      transformOrigin: 'center center',
                      zIndex: 2,
                    }}
                  />
                );
              })}

              {/* Leaves — positioned within the padded area */}
              {LEAVES.map((leaf, i) => {
                const nodeX = NODE_POSITIONS[leaf.nodeIdx] * TRACK_W;
                const isVis = filledW >= nodeX + 6;
                const isTop = leaf.side === 'top';
                return (
                  <motion.div
                    key={`leaf-${i}`}
                    initial={false}
                    animate={isVis
                      ? { opacity: 1, rotate: isTop ? -32 : 32, scale: 1 }
                      : { opacity: 0, rotate: isTop ? -65 : 65, scale: 0.1 }
                    }
                    transition={{ duration: 0.5, delay: leaf.delay, ease: [0.34, 1.56, 0.64, 1] }}
                    style={{
                      position: 'absolute',
                      left: `${nodeX - 3}px`,
                      /* top leaves sit in the top padding zone, bottom leaves in bottom padding zone */
                      top: isTop ? '4px' : `${28 + STALK_H + 4}px`,
                      transformOrigin: 'bottom left',
                      zIndex: 3, pointerEvents: 'none',
                    }}
                  >
                    <svg width="30" height="16" viewBox="0 0 30 16" fill="none">
                      <path d="M1 15 C5 8, 18 1, 29 1 C29 1, 21 12, 1 15Z" fill="#8B6A30" opacity="0.85" />
                      <path d="M1 15 C10 9, 20 5, 29 1" stroke="#C8A050" strokeWidth="0.7" fill="none" opacity="0.6" />
                    </svg>
                  </motion.div>
                );
              })}
            </div>

            {/* Counter — sits below the padded stalk container with clear breathing room */}
            <div style={{ marginTop: '20px' }}>
              <span style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '10px',
                letterSpacing: '0.32em',
                textTransform: 'uppercase',
                color: 'rgba(200,169,110,0.55)',
                fontVariantNumeric: 'tabular-nums',
              }}>
                Building with nature&nbsp;&nbsp;{Math.round(progress * 100)}%
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
