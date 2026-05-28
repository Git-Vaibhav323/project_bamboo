import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { projects as staticProjects } from '../data/data';
import { supabase } from '../lib/supabase';
import { applyWordStagger } from '../hooks/useScrollReveal';

export default function Projects() {
  const [filter, setFilter] = useState('All');
  const [projects, setProjects] = useState(staticProjects);
  const [loading, setLoading] = useState(true);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroLabelRef = useRef<HTMLSpanElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Word-stagger hero title on mount
  useEffect(() => {
    if (heroTitleRef.current) applyWordStagger(heroTitleRef.current, 380, 80);
  }, []);

  // Card scroll-reveal via IntersectionObserver
  useEffect(() => {
    if (loading) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const cards = gridRef.current?.querySelectorAll<HTMLElement>('.project-card-wrapper');
    if (!cards) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).classList.add('card-enter--visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    cards.forEach(card => observer.observe(card));
    return () => observer.disconnect();
  }, [loading, projects]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      if (!supabase) {
        // No Supabase configured — use static data
        setProjects(staticProjects);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        // Map Supabase data to match the expected format
        const mappedProjects = data.map(project => ({
          slug: project.slug,
          name: project.name,
          location: project.location,
          state: project.state,
          type: project.type,
          year: project.year,
          duration: project.duration,
          size: project.size,
          description: project.description,
          coverImage: project.cover_image,
          galleryImages: project.gallery_images || [],
          tags: project.tags || []
        }));
        setProjects(mappedProjects);
      } else {
        // Use static data as fallback
        setProjects(staticProjects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      // Use static data as fallback
      setProjects(staticProjects);
    } finally {
      setLoading(false);
    }
  };

  const filters = ['All', 'Resorts', 'Villas', 'Pavilions & Commercial', 'Rammed Earth'];

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.type === filter);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg)' }}>
        <p style={{ fontSize: '18px', color: 'var(--color-text-muted)' }}>Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="projects-page" style={{ paddingTop: '80px', backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>
      {/* Hero */}
      <div className="projects-hero" style={{ 
        position: 'relative', 
        height: '72vh', 
        minHeight: '480px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'linear-gradient(rgba(20,14,6,0.38), rgba(12,8,3,0.78)), url(/bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
        color: 'var(--color-ivory)',
        textAlign: 'center',
        padding: '0 40px'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <span
            ref={heroLabelRef}
            className="tag projects-hero-label"
            style={{ color: 'var(--color-leaf)' }}
          >
            Our Portfolio
          </span>
          <h1
            ref={heroTitleRef}
            className="projects-hero-title"
            style={{ fontSize: 'clamp(52px, 9vw, 80px)', marginTop: '16px', lineHeight: 1.0, color: '#ffffff' }}
          >
            Every Structure Has a Story.
          </h1>
        </motion.div>
      </div>

      <div className="projects-page-inner">
        {/* Filters */}
        <div className="hide-scrollbar" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '60px' }}>
          {filters.map(f => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`pill-btn filter-pill-btn ${filter === f ? 'filter-pill-btn--active' : ''}`}
            >
              {f}
            </button>
          ))}
        </div>

        <motion.div
          ref={gridRef}
          className="projects-grid projects-list-grid"
          layout
        >
          <AnimatePresence>
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.slug}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="project-card-wrapper card-enter"
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <Link
                  href={`/projects/${project.slug}`}
                  className="project-card image-card-pop"
                  style={{ display: 'block', textDecoration: 'none' }}
                >
                  <div className="project-img-wrap" style={{ aspectRatio: '4/5' }}>
                    <div className="card-image-shell" style={{ height: '100%' }}>
                      <img
                        src={project.coverImage}
                        alt={project.name}
                        className="project-img"
                        loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </div>
                    <div className="card-image-gradient" />
                    <div className="card-image-overlay project-overlay">
                      <h3 className="card-overlay-title project-title">{project.name}</h3>
                      <p className="card-overlay-location project-location">{project.location}</p>
                      <span className="project-tag">{project.type}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
