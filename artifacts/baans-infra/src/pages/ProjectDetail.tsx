import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'wouter';
import { projects as staticProjects } from '../data/data';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

interface ProjectData {
  slug: string;
  name: string;
  location: string;
  type: string;
  size: string;
  duration: string;
  year: string;
  description: string;
  coverImage: string;
  galleryImages: string[];
  tags: string[];
}

function mapSupabaseProject(p: any): ProjectData {
  return {
    slug: p.slug,
    name: p.name,
    location: p.location,
    type: p.type,
    size: p.size || '',
    duration: p.duration || '',
    year: p.year || '',
    description: p.description || '',
    coverImage: p.cover_image || '',
    galleryImages: p.gallery_images || [],
    tags: p.tags || [],
  };
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [allSlugs, setAllSlugs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProject();
  }, [slug]);

  const fetchProject = async () => {
    setLoading(true);

    // 1. Try Supabase first
    if (supabase) {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .single();

      if (data) {
        setProject(mapSupabaseProject(data));

        // Also fetch all slugs for "Next Project" navigation
        const { data: slugData } = await supabase
          .from('projects')
          .select('slug')
          .order('created_at', { ascending: false });
        setAllSlugs((slugData || []).map((r: any) => r.slug));
        setLoading(false);
        return;
      }
    }

    // 2. Fall back to static data
    const found = staticProjects.find(p => p.slug === slug);
    if (found) {
      setProject({
        ...found,
        coverImage: found.coverImage,
        galleryImages: found.galleryImages,
      });
      setAllSlugs(staticProjects.map(p => p.slug));
    } else {
      setProject(null);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg)' }}>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '18px' }}>Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div style={{ padding: '200px 40px', textAlign: 'center' }}>
        <p style={{ fontSize: '20px', color: 'var(--color-text-muted)', marginBottom: '24px' }}>Project not found</p>
        <Link href="/projects" className="pill-btn primary">← Back to Projects</Link>
      </div>
    );
  }

  const currentIndex = allSlugs.indexOf(project.slug);
  const nextSlug = allSlugs[(currentIndex + 1) % allSlugs.length];
  const nextName = nextSlug
    ? (staticProjects.find(p => p.slug === nextSlug)?.name || nextSlug)
    : null;

  return (
    <div className="project-detail-page" style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>
      {/* Hero */}
      <div className="project-detail-hero" style={{
        height: '88vh',
        minHeight: '560px',
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '80px 40px',
        backgroundImage: `linear-gradient(rgba(28,31,26,0.05), rgba(28,31,26,0.85)), url(${project.coverImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'var(--color-ivory)'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}
        >
          <Link href="/projects" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.8)', textDecoration: 'none', marginBottom: '24px', fontFamily: 'DM Sans', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '12px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to Projects
          </Link>
<h1
  style={{
    fontSize: 'clamp(48px, 8vw, 80px)',
    lineHeight: 1.1,
    marginBottom: '16px',
    color: '#ffffff',
    fontWeight: 800,
    letterSpacing: '-0.03em'
  }}
>
  {project.name}
</h1>          <p className="tag" style={{ color: 'var(--color-leaf)' }}>{project.location}</p>
        </motion.div>
      </div>
{/* Details */}
<div
  className="project-detail-content"
  style={{
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '64px 40px'
  }}
>
  {/* Top Details Row */}
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '32px',
      alignItems: 'center',
      paddingBottom: '24px',
      marginBottom: '36px',
      borderBottom: '1px solid rgba(255,255,255,0.08)'
    }}
  >
    {project.location && (
      <div>
        <p
          className="tag"
          style={{
            fontSize: '10px',
            marginBottom: '4px',
            color: 'var(--color-text-muted)'
          }}
        >
          Location
        </p>

        <p style={{ fontSize: '15px', fontWeight: 600 }}>
          {project.location}
        </p>
      </div>
    )}

    {project.type && (
      <div>
        <p
          className="tag"
          style={{
            fontSize: '10px',
            marginBottom: '4px',
            color: 'var(--color-text-muted)'
          }}
        >
          Type
        </p>

        <p style={{ fontSize: '15px', fontWeight: 600 }}>
          {project.type}
        </p>
      </div>
    )}

    {project.size && (
      <div>
        <p
          className="tag"
          style={{
            fontSize: '10px',
            marginBottom: '4px',
            color: 'var(--color-text-muted)'
          }}
        >
          Size
        </p>

        <p style={{ fontSize: '15px', fontWeight: 600 }}>
          {project.size}
        </p>
      </div>
    )}

    {project.duration && (
      <div>
        <p
          className="tag"
          style={{
            fontSize: '10px',
            marginBottom: '4px',
            color: 'var(--color-text-muted)'
          }}
        >
          Duration
        </p>

        <p style={{ fontSize: '15px', fontWeight: 600 }}>
          {project.duration}
        </p>
      </div>
    )}

    {project.year && (
      <div>
        <p
          className="tag"
          style={{
            fontSize: '10px',
            marginBottom: '4px',
            color: 'var(--color-text-muted)'
          }}
        >
          Year
        </p>

        <p style={{ fontSize: '15px', fontWeight: 600 }}>
          {project.year}
        </p>
      </div>
    )}
  </motion.div>

  {/* Description */}
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
  >
    <h2
      className="subheading"
      style={{
        fontSize: '28px',
        marginBottom: '18px',
        color: 'var(--color-primary)'
      }}
    >
      The Vision
    </h2>

    <p
      style={{
        fontSize: '17px',
        color: 'var(--color-text-muted)',
        lineHeight: 1.9,
        maxWidth: '900px'
      }}
    >
      {project.description}
    </p>

    {project.tags.length > 0 && (
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginTop: '28px'
        }}
      >
        {project.tags.map(tag => (
          <span
            key={tag}
            style={{
              padding: '6px 12px',
              borderRadius: '999px',
              fontSize: '11px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'var(--color-primary)'
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    )}
  </motion.div>
       {/* Gallery */}
{project.galleryImages.length > 0 && (
  <div className="project-detail-gallery" style={{ marginTop: '140px' }}>
    <h3
      className="subheading"
      style={{
        fontSize: '36px',
        marginBottom: '56px',
        textAlign: 'center',
        fontStyle: 'italic'
      }}
    >
      Gallery
    </h3>

    <div
      className="project-gallery-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))',
        gap: '36px'
      }}
    >
      {project.galleryImages.map((img, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: (idx % 3) * 0.12,
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1]
          }}
          style={{
            overflow: 'hidden',
            borderRadius: '20px'
          }}
          className="project-gallery-item"
        >
          <motion.img
            className="project-gallery-img"
            src={img}
            alt={`${project.name} gallery ${idx + 1}`}
            whileHover={{ scale: 1.05 }}
            transition={{
              duration: 0.75,
              ease: [0.22, 1, 0.36, 1]
            }}
            style={{
              width: '100%',
              height: idx % 3 === 1 ? '680px' : '560px',
              objectFit: 'cover',
              display: 'block'
            }}
            loading="lazy"
          />
        </motion.div>
      ))}
    </div>
  </div>
)}

        {/* Next Project */}
        {nextSlug && nextSlug !== project.slug && (
          <div style={{ marginTop: '120px', textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '80px' }}>
            <span className="tag" style={{ color: 'var(--color-text-muted)' }}>Next Project</span>
            <Link href={`/projects/${nextSlug}`} style={{ display: 'block', textDecoration: 'none', marginTop: '16px' }}>
              <motion.h2
                whileHover={{ color: 'var(--color-primary)' }}
                style={{ fontSize: '48px', color: 'var(--color-text)', transition: 'color 0.3s' }}
              >
                {nextName} →
              </motion.h2>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
