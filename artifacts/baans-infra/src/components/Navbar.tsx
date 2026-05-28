import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { navLinks, siteConfig } from '../data/data';
import { AnimatePresence, motion } from 'framer-motion';
import LazyImage from './LazyImage';
import { FaInstagram, FaLinkedinIn } from 'react-icons/fa';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const idleTimerRef = useRef<number>(0);
  const [location] = useLocation();
  const isHome = location === '/';
  const leftLinks = navLinks.slice(0, 3);
  const rightLinks = navLinks.slice(3);

  // Close mobile menu on route change
  useEffect(() => { setMobileMenuOpen(false); }, [location]);

  // Scroll detection for glass effect
  useEffect(() => {
    let lastY = window.scrollY;
    let revealFromY = window.scrollY;

    const scheduleIdleHide = (currentY: number) => {
      window.clearTimeout(idleTimerRef.current);

      if (currentY <= 24 || mobileMenuOpen) return;

      idleTimerRef.current = window.setTimeout(() => {
        revealFromY = window.scrollY;
        setHidden(true);
      }, 900);
    };

    const onScroll = () => {
      const currentY = window.scrollY;
      const revealDistance = window.innerHeight * 0.1;
      setScrolled(currentY > 48);

      if (currentY <= 24) {
        setHidden(false);
        revealFromY = currentY;
        window.clearTimeout(idleTimerRef.current);
      } else if (currentY > lastY + 4) {
        revealFromY = Math.max(revealFromY, currentY);
        setHidden(true);
        scheduleIdleHide(currentY);
      } else if (currentY < lastY - 4) {
        if (revealFromY - currentY >= revealDistance) {
          setHidden(false);
        }
        scheduleIdleHide(currentY);
      }

      if (Math.abs(currentY - lastY) > 4) {
        lastY = currentY;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(idleTimerRef.current);
    };
  }, [mobileMenuOpen]);

  const isTransparent = isHome && !scrolled;

  const renderNavLink = (link: (typeof navLinks)[number]) => {
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
            color: isTransparent
              ? isActive ? '#C8A96E' : 'rgba(250,247,242,0.9)'
              : isActive ? 'var(--color-primary)' : 'var(--color-text)',
          }}
        >
          {link.label}
        </span>
      </Link>
    );
  };

  return (
    <>
      <nav
        className={['site-nav', isHome ? 'nav-on-hero' : '', scrolled ? 'nav-scrolled' : '', hidden ? 'nav-hidden' : ''].filter(Boolean).join(' ')}
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 200,
          padding: scrolled ? '4px clamp(18px,2.8vw,44px)' : '6px clamp(18px,2.8vw,44px)',
          display: 'grid',
          alignItems: 'center',
          columnGap: 'clamp(24px, 3.2vw, 58px)',
          transform: hidden ? 'translateY(-115%)' : 'translateY(0)',
          transition: 'background 0.5s ease, backdrop-filter 0.5s ease, padding 0.4s ease, box-shadow 0.4s ease, transform 0.42s cubic-bezier(0.22, 1, 0.36, 1)',
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
        <div className="desktop-nav desktop-nav--left">
          {leftLinks.map(renderNavLink)}
        </div>

        {/* Brand */}
        <Link href="/" className="nav-brand" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0', textDecoration: 'none', justifySelf: 'center' }}>
          <span className="nav-logo-crop">
            <LazyImage
              src="/logo.png"
              alt="BAANS INFRA"
              className="nav-logo-img"
              style={{
                filter: isTransparent ? 'brightness(0) invert(1)' : 'none',
              }}
            />
          </span>
        </Link>

        {/* Desktop nav */}
        <div
          className="desktop-nav desktop-nav--right"
        >
          {rightLinks.map(renderNavLink)}

          {/* Divider */}
          <div style={{
            width: '1px',
            height: '26px',
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
                  width: '46px', height: '46px',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: '50%',
                  border: `1px solid ${isTransparent ? 'rgba(250,247,242,0.3)' : 'rgba(58,47,30,0.15)'}`,
                  color: isTransparent ? 'rgba(250,247,242,0.8)' : 'var(--color-text)',
                  textDecoration: 'none',
                  fontSize: '20px',
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
