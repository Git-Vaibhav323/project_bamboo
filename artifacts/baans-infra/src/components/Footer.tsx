import React from "react";
import { Link } from "wouter";
import {
  siteConfig,
  navLinks,
  footerContent,
  footerRegions,
  aboutContent,
} from "../data/data";
import LazyImage from "./LazyImage";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer-bg-pattern" aria-hidden>
        <svg width="600" height="600" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M50 100 L45 0 M55 100 L60 0 M30 100 L40 0 M70 100 L60 0"
            stroke="var(--color-warm-sand)"
            strokeWidth="2"
          />
          <path
            d="M40 20 L60 15 M42 40 L58 35 M44 60 L56 55 M46 80 L54 75"
            stroke="var(--color-warm-sand)"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div className="site-footer-inner">
        <div className="site-footer-hero">
          <LazyImage src="/logo.png" alt="BAANS INFRA" className="site-footer-logo" />
          <p className="site-footer-legal-name">{siteConfig.legalName}</p>
          <p className="site-footer-about">{footerContent.about}</p>
          <p className="site-footer-founder">{footerContent.founderLine}</p>
          <p className="site-footer-closing">{footerContent.closing}</p>
          <Link href="/contact" className="pill-btn site-footer-cta">
            {footerContent.cta}
          </Link>
        </div>

        <div className="site-footer-grid">
          <div className="site-footer-col">
            <h4 className="site-footer-heading">What We Create</h4>
            <ul className="site-footer-feature-list">
              {footerContent.whatWeCreate.map((item) => (
                <li key={item.title}>
                  <strong>{item.title}</strong>
                  <span>{item.body}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="site-footer-col">
            <h4 className="site-footer-heading">Our USP</h4>
            <ul className="site-footer-feature-list">
              {footerContent.usp.map((item) => (
                <li key={item.title}>
                  <strong>{item.title}</strong>
                  <span>{item.body}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="site-footer-col">
            <h4 className="site-footer-heading">Our Vision</h4>
            <p className="site-footer-vision">{footerContent.vision}</p>
            <h4 className="site-footer-heading site-footer-heading--sub">Navigate</h4>
            <nav className="site-footer-links" aria-label="Footer navigation">
              {navLinks.map((link) => (
                <Link key={link.path} href={link.path}>
                  {link.label}
                </Link>
              ))}
              <Link href="/projects">All Projects</Link>
              <Link href="/#explore-structure">3D Structure Tour</Link>
            </nav>
          </div>

          <div className="site-footer-col site-footer-col--contact">
            <h4 className="site-footer-heading">Contact</h4>
            <p className="site-footer-leader">
              <span>Led by</span> {siteConfig.founder}
            </p>
            <a href={`mailto:${siteConfig.email}`} className="site-footer-contact-line">
              {siteConfig.email}
            </a>
            <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="site-footer-contact-line">
              {siteConfig.phone}
            </a>
            <p className="site-footer-contact-line">{siteConfig.address}</p>
            <p className="site-footer-hours">
              <span className="site-footer-hours-label">Studio hours</span>
              {siteConfig.hours}
            </p>

            <h4 className="site-footer-heading site-footer-heading--sub">Regions</h4>
            <ul className="site-footer-list site-footer-list--regions">
              {footerRegions.map((region) => (
                <li key={region}>{region}</li>
              ))}
            </ul>

            <div className="site-footer-social">
              <a href={siteConfig.socialLinks.instagram} aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
              <a href={siteConfig.socialLinks.linkedin} aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <div className="site-footer-stats">
          {aboutContent.stats.map((stat) => (
            <div key={stat.label} className="site-footer-stat">
              <span className="site-footer-stat-value">{stat.value}</span>
              <span className="site-footer-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="site-footer-bottom">
          <p className="site-footer-copy">
            © {year} {siteConfig.name} · {siteConfig.legalName}. All rights reserved.
          </p>
          <div className="site-footer-legal">
            <a href="/contact">Privacy</a>
            <span aria-hidden>·</span>
            <a href="/contact">Terms</a>
            <span aria-hidden>·</span>
            <a href="/about">Sustainability</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
