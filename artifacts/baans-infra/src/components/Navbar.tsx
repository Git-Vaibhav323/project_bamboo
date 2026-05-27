import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { navLinks } from '../data/data';
import { AnimatePresence, motion } from 'framer-motion';
import LazyImage from './LazyImage';
import { FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { siteConfig } from '../data/data';

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
              height: '92px',
              width: 'auto',
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
                } ${isHome ? 'nav-link-text--light' : ''}`}
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

          <div className="nav-socials" aria-label="Social links">
            <a href={siteConfig.socialLinks.instagram} aria-label="Instagram" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href={siteConfig.socialLinks.linkedin} aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
              <FaLinkedinIn />
            </a>
          </div>
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
