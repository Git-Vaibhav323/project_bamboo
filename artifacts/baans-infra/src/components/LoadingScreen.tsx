import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const DURATION = 1900;

  useEffect(() => {
    startRef.current = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - startRef.current) / DURATION);
      setProgress(p);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setVisible(false), 500);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const rows = [1, 2, 3, 4, 5];
  const totalTiles = rows.reduce((sum, n) => sum + n, 0);
  let tileIndex = 0;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'radial-gradient(circle at 50% 35%, #3B2F1E 0%, #1E1408 58%, #0f0a04 100%)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '34px',
          }}
        >
          <motion.img
            src="/logo.png"
            alt="BAANS INFRA"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              height: '116px',
              width: 'auto',
              filter: 'brightness(0) invert(1)',
              borderRadius: 0,
            }}
            onError={(e) => {
              const t = e.currentTarget;
              t.style.display = 'none';
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px' }}>
            <div className="loading-bamboo-stack" aria-hidden>
              {rows.map((count, rowIndex) => (
                <div key={rowIndex} className="loading-bamboo-row">
                  {Array.from({ length: count }).map((_, colIndex) => {
                    const visibleAt = tileIndex / totalTiles;
                    const isLoaded = progress >= visibleAt;
                    tileIndex += 1;

                    return (
                      <motion.div
                        key={`${rowIndex}-${colIndex}`}
                        className="loading-bamboo-tile"
                        initial={false}
                        animate={{
                          opacity: isLoaded ? 1 : 0.16,
                          y: isLoaded ? 0 : 12,
                          filter: isLoaded ? 'saturate(1)' : 'saturate(0.2)',
                        }}
                        transition={{ duration: 0.28, ease: 'easeOut' }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>

            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{
                fontFamily: 'Karla, sans-serif',
                fontSize: '10px',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: 'rgba(250,247,242,0.62)',
              }}
            >
              Building with nature {Math.round(progress * 100)}%
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
