import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { navLinks } from '../data/data';
import { AnimatePresence, motion } from 'framer-motion';
import LazyImage from './LazyImage';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const isHome = location === '/';

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navClass = [
    'site-nav',
    isHome ? 'nav-on-hero' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const useLightNav = isHome;

  return (
    <>
      {/* NON-STICKY NAVBAR (make sure CSS is NOT fixed/sticky) */}
      <nav className={navClass}>

        {/* BRAND */}
        <Link href="/" className="nav-brand">
          <LazyImage
            src="/logo.png"
            alt="BAANS INFRA"
            className="nav-logo-img"
            style={{
              height: '72px',   // BIGGER LOGO
              width: 'auto',
              filter: useLightNav ? 'brightness(0) invert(1)' : 'none',
            }}
          />
          <span className="nav-brand-name">Baans Infra</span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="desktop-nav">
          {navLinks.map((link) => (
            <Link key={link.path} href={link.path}>
              <span
                className={`nav-link-text ${
                  location === link.path ? 'nav-link-text--active' : ''
                } ${useLightNav ? 'nav-link-text--light' : ''}`}
                style={{
                  fontWeight: 700,        // BOLDER
                  fontSize: '1.05rem',    // SLIGHTLY LARGER
                  letterSpacing: '0.5px', // MORE AIRY
                  padding: '10px 14px',   // BROADER CLICK AREA
                }}
              >
                {link.label}
              </span>
            </Link>
          ))}

          <Link href="/contact">
            <span
              className={`pill-btn nav-cta ${
                useLightNav ? 'nav-cta--light' : ''
              }`}
              style={{
                fontWeight: 800,
                padding: '12px 18px',
              }}
            >
              Start Your Project
            </span>
          </Link>
        </div>

        {/* MOBILE TOGGLE */}
        <button
          type="button"
          className="mobile-nav-toggle"
          aria-label="Open menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 12H21M3 6H21M3 18H21"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mobile-nav-panel"
          >
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path}>
                <span
                  className={`mobile-nav-link ${
                    location === link.path
                      ? 'mobile-nav-link--active'
                      : ''
                  }`}
                  style={{
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    padding: '14px 10px',
                    display: 'block',
                  }}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}