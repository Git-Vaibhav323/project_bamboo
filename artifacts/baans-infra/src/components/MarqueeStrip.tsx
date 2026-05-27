import React from 'react';

export default function MarqueeStrip() {
  return (
    <div className="marquee-strip" style={{
      width: '100%',
      height: '48px',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
    }}>
      <div
        className="marquee-strip-inner"
        style={{
          display: 'flex',
          whiteSpace: 'nowrap',
          color: 'var(--color-off-white)',
          fontFamily: 'Karla, sans-serif',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          fontSize: '13px',
        }}
      >
        {[0, 1, 2, 3].map((n) => (
          <span key={n} style={{ paddingRight: '50px' }}>
            BAMBOO CONSTRUCTION  ·  BALI-INSPIRED VILLAS  ·  ECO RESORTS  ·  RAMMED EARTH  ·  PAN-INDIA BUILDS  ·  LUXURY THAT BREATHES  ·
          </span>
        ))}
      </div>
    </div>
  );
}
