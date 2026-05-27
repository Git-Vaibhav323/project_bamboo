import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { navLinks, siteConfig } from '../data/data';
import { AnimatePresence, motion } from 'framer-motion';
import LazyImage from './LazyImage';
import { FaInstagram, FaLinkedinIn } from 'react-icons/fa';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const isHome = location === '/';
  const indicatorRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Close mobile menu on route change
  useEffect(() => { setMobileMenuOpen(false); }, [location]);

  // Scroll detection for glass effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Sliding indicator under active nav link
  useEffect(() => {
    if (!navRef.current || !indicatorRef.current) return;
    const activeEl = navRef.current.querySelector<HTMLElement>('.nav-link-text--active');
    if (!activeEl) { indicatorRef.current.style.opacity = '0'; return; }
    const navRect = navRef.current.getBoundingClientRect();
    const elRect  = activeEl.getBoundingClientRect();
    indicatorRef.current.style.opacity  = '1';
    indicatorRef.current.style.left     = `${elRect.left - navRect.left}px`;
    indicatorRef.current.style.width    = `${elRect.width}px`;
  }, [location]);

  const isTransparent = isHome && !scrolled;

  return (
    <>
      <nav
        className={['site-nav', isHome ? 'nav-on-hero' : '', scrolled ? 'nav-scrolled' : ''].filter(Boolean).join(' ')}
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 200,
          padding: scrolled ? '10px clamp(20px,3vw,48px)' : '14px clamp(20px,3vw,48px)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'background 0.5s ease, backdrop-filter 0.5s ease, padding 0.4s ease, box-shadow 0.4s ease',
          background: isTransparent
            ? 'transparent'
            : scrolled
              ? 'rgba(245,239,224,0.96)'
              : 'rgba(250,247,242,0.94)',
          backdropFilter: isTransparent ? 'none' : 'blur(20px)',
          WebkitBackdropFilter: isTransparent ? 'none' : 'blur(20px)',
          borderBottom: isTransparent ? '1px solid transparent' : '1px solid rgba(58,47,30,0.07)',
          boxShadow: scrolled && !isTransparent ? '0 2px 24px rgba(58,47,30,0.08)' : 'none',
        }}
      >
        {/* Brand */}
        <Link href="/" className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <LazyImage
            src="/logo.png"
            alt="BAANS INFRA"
            className="nav-logo-img"
            style={{
              height: scrolled ? '64px' : '80px',
              width: 'auto',
              transition: 'height 0.4s ease',
              filter: isTransparent ? 'brightness(0) invert(1)' : 'none',
            }}
          />
          <span
            className="nav-brand-name"
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '1.05rem',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: isTransparent ? 'rgba(250,247,242,0.92)' : 'var(--color-text)',
              transition: 'color 0.4s ease',
            }}
          >
            Baans Infra
          </span>
        </Link>

        {/* Desktop nav */}
        <div
          ref={navRef}
          className="desktop-nav"
          style={{ display: 'flex', alignItems: 'center', gap: 'clamp(20px,2.8vw,40px)', position: 'relative' }}
        >
          {/* Sliding active indicator */}
          <div
            ref={indicatorRef}
            style={{
              position: 'absolute',
              bottom: '-6px',
              height: '1px',
              background: isTransparent ? 'rgba(200,169,110,0.8)' : 'var(--color-warm-sand)',
              transition: 'left 0.35s cubic-bezier(0.25,0.46,0.45,0.94), width 0.35s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.25s ease',
              borderRadius: '1px',
              pointerEvents: 'none',
            }}
          />

          {navLinks.map((link) => {
            const isActive = location === link.path;
            return (
              <Link key={link.path} href={link.path}>
                <span
                  className={[
                    'nav-link-text',
                    isActive ? 'nav-link-text--active' : '',
                    isTransparent ? 'nav-link-text--light' : '',
                  ].filter(Boolean).join(' ')}
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '0.72rem',
                    fontWeight: isActive ? 700 : 500,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: isTransparent
                      ? isActive ? '#C8A96E' : 'rgba(250,247,242,0.85)'
                      : isActive ? 'var(--color-primary)' : 'var(--color-text)',
                    transition: 'color 0.25s ease, transform 0.2s ease',
                    display: 'inline-block',
                    padding: '6px 0',
                    position: 'relative',
                  }}
                >
                  {link.label}
                </span>
              </Link>
            );
          })}

          {/* Divider */}
          <div style={{
            width: '1px',
            height: '18px',
            background: isTransparent ? 'rgba(250,247,242,0.2)' : 'rgba(58,47,30,0.15)',
            transition: 'background 0.4s ease',
          }} />

          {/* Social icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {[
              { href: siteConfig.socialLinks.instagram, label: 'Instagram', Icon: FaInstagram },
              { href: siteConfig.socialLinks.linkedin,  label: 'LinkedIn',  Icon: FaLinkedinIn },
            ].map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '34px', height: '34px',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: '50%',
                  border: `1px solid ${isTransparent ? 'rgba(250,247,242,0.3)' : 'rgba(58,47,30,0.15)'}`,
                  color: isTransparent ? 'rgba(250,247,242,0.8)' : 'var(--color-text)',
                  textDecoration: 'none',
                  fontSize: '13px',
                  transition: 'transform 0.25s ease, color 0.25s ease, border-color 0.25s ease, background 0.25s ease',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.transform = 'translateY(-2px)';
                  el.style.color = '#C8A96E';
                  el.style.borderColor = '#C8A96E';
                  el.style.background = 'rgba(200,169,110,0.08)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.transform = '';
                  el.style.color = isTransparent ? 'rgba(250,247,242,0.8)' : 'var(--color-text)';
                  el.style.borderColor = isTransparent ? 'rgba(250,247,242,0.3)' : 'rgba(58,47,30,0.15)';
                  el.style.background = '';
                }}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="mobile-nav-toggle"
          aria-label="Open menu"
          onClick={() => setMobileMenuOpen(v => !v)}
          style={{
            background: 'none', border: 'none', padding: '8px',
            color: isTransparent ? 'rgba(250,247,242,0.9)' : 'var(--color-text)',
            transition: 'color 0.3s ease',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            {mobileMenuOpen ? (
              <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M3 7H21M3 12H21M3 17H21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed', inset: 0, zIndex: 199,
              background: 'rgba(20,14,8,0.97)',
              backdropFilter: 'blur(24px)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: '8px',
            }}
          >
            {/* Decorative top line */}
            <div style={{
              position: 'absolute', top: '80px', left: '40px', right: '40px',
              height: '1px', background: 'rgba(200,169,110,0.15)',
            }} />

            {navLinks.map((link, i) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link href={link.path}>
                  <span
                    className={`mobile-nav-link ${location === link.path ? 'mobile-nav-link--active' : ''}`}
                    style={{
                      fontFamily: 'Cormorant Garamond, serif',
                      fontSize: 'clamp(36px, 8vw, 52px)',
                      fontWeight: 500,
                      letterSpacing: '-0.01em',
                      color: location === link.path ? '#C8A96E' : 'rgba(250,247,242,0.55)',
                      display: 'block',
                      padding: '10px 0',
                      textAlign: 'center',
                      transition: 'color 0.25s ease, letter-spacing 0.25s ease',
                    }}
                  >
                    {link.label}
                  </span>
                </Link>
              </motion.div>
            ))}

            {/* Social in mobile menu */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              style={{ display: 'flex', gap: '20px', marginTop: '32px' }}
            >
              <a href={siteConfig.socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                style={{ color: 'rgba(200,169,110,0.7)', fontSize: '18px', textDecoration: 'none' }}>
                <FaInstagram />
              </a>
              <a href={siteConfig.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                style={{ color: 'rgba(200,169,110,0.7)', fontSize: '18px', textDecoration: 'none' }}>
                <FaLinkedinIn />
              </a>
            </motion.div>

            {/* Decorative bottom line */}
            <div style={{
              position: 'absolute', bottom: '80px', left: '40px', right: '40px',
              height: '1px', background: 'rgba(200,169,110,0.15)',
            }} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
