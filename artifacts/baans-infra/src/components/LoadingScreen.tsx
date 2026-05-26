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
            backgroundColor: '#1E1408',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '48px',
          }}
        >
          <motion.img
            src="/logo.png"
            alt="BAANS INFRA"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              height: '72px',
              filter: 'brightness(0) invert(1)',
              borderRadius: 0,
            }}
            onError={(e) => {
              const t = e.currentTarget;
              t.style.display = 'none';
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            {/* Bamboo rod loading bar */}
            <div
              style={{
                width: '260px',
                height: '26px',
                backgroundColor: 'rgba(250,247,242,0.08)',
                borderRadius: '4px',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  right: `${(1 - progress) * 100}%`,
                  backgroundImage: 'url(/bamboo-hor.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center left',
                  transition: 'right 0.04s linear',
                  borderRadius: '4px',
                }}
              />
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
                color: 'rgba(250,247,242,0.4)',
              }}
            >
              {Math.round(progress * 100)}%
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
