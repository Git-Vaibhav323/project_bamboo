import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { projects } from '../data/data';

export default function Projects() {
  const [filter, setFilter] = useState('All');

  const filters = ['All', 'Resorts', 'Villas', 'Pavilions & Commercial', 'Rammed Earth'];

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.type === filter);

  return (
    <div style={{ paddingTop: '80px', backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ 
        position: 'relative', 
        height: '72vh', 
        minHeight: '480px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'linear-gradient(rgba(28,31,26,0.4), rgba(28,31,26,0.82)), url(https://picsum.photos/seed/projecthero/1920/1080)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'var(--color-ivory)',
        textAlign: 'center',
        padding: '0 40px'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="tag" style={{ color: 'var(--color-leaf)' }}>Our Portfolio</span>
          <h1 style={{ fontSize: 'clamp(52px, 9vw, 80px)', marginTop: '16px', lineHeight: 1.0 }}>Every Structure Has a Story.</h1>
        </motion.div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '80px 40px' }}>
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

        {/* Grid */}
        <motion.div 
          layout
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '48px' }}
        >
          <AnimatePresence>
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.slug}
                layout
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: 'block', textDecoration: 'none' }}
              >
                <Link href={`/projects/${project.slug}`}>
                  <div style={{ position: 'relative', borderRadius: '0', overflow: 'hidden', marginBottom: '28px', aspectRatio: '3/4' }}>
                    <motion.img 
                      src={project.coverImage} 
                      alt={project.name}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                    <motion.div 
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.35 }}
                      style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14,9,3,0.92) 0%, rgba(20,14,6,0.4) 50%, transparent 100%)', display: 'flex', alignItems: 'flex-end', padding: '40px 32px' }}
                    >
                      <span className="pill-btn primary" style={{ fontSize: '0.75rem', padding: '14px 32px' }}>View Project →</span>
                    </motion.div>
                  </div>
                </Link>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '0 4px' }}>
                  <div>
                    <h3 style={{ fontSize: '26px', marginBottom: '6px', color: 'var(--color-text)', fontFamily: 'Cormorant Garamond, serif', fontWeight: 600 }}>{project.name}</h3>
                    <p className="tag" style={{ fontSize: '11px', color: 'var(--color-text-muted)', opacity: 0.8 }}>{project.location}</p>
                  </div>
                  <span style={{ backgroundColor: 'var(--color-leaf)', color: 'var(--color-primary)', padding: '6px 14px', borderRadius: '99px', fontSize: '10px', fontFamily: 'DM Sans', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, flexShrink: 0, marginTop: '4px' }}>
                    {project.type}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
