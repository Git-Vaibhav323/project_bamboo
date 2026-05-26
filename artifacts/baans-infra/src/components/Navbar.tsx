import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { navLinks } from '../data/data';
import { AnimatePresence, motion } from 'framer-motion';
import LazyImage from './LazyImage';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const isHome = location === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navClass = [
    'site-nav',
    isHome ? 'nav-on-hero' : '',
    scrolled ? 'nav-scrolled' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const useLightNav = isHome && !scrolled;

  return (
    <>
      <nav className={navClass}>
        <Link href="/" className="nav-brand">
          <LazyImage
            src="/logo.png"
            alt="BAANS INFRA"
            className="nav-logo-img"
            style={{
              filter: useLightNav ? 'brightness(0) invert(1)' : 'none',
            }}
          />
          <span className="nav-brand-name">Baans Infra</span>
        </Link>

        <div className="desktop-nav">
          {navLinks.map((link) => (
            <Link key={link.path} href={link.path}>
              <span
                className={`nav-link-text ${location === link.path ? 'nav-link-text--active' : ''} ${useLightNav ? 'nav-link-text--light' : ''}`}
              >
                {link.label}
              </span>
            </Link>
          ))}
          <Link href="/contact">
            <span className={`pill-btn nav-cta ${useLightNav ? 'nav-cta--light' : ''}`}>
              Start Your Project
            </span>
          </Link>
        </div>

        <button
          type="button"
          className="mobile-nav-toggle"
          aria-label="Open menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 12H21M3 6H21M3 18H21"
              stroke={useLightNav ? 'var(--color-off-white)' : 'var(--color-deep-bamboo)'}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </nav>

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
                  className={`mobile-nav-link ${location === link.path ? 'mobile-nav-link--active' : ''}`}
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
