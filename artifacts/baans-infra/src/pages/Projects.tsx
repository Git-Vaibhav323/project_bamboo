import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { projects as staticProjects } from '../data/data';
import { supabase } from '../lib/supabase';

export default function Projects() {
  const [filter, setFilter] = useState('All');
  const [projects, setProjects] = useState(staticProjects);
  const [loading, setLoading] = useState(true);

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
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '32px' }}
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
