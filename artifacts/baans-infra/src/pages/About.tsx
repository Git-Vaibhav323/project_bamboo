import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Link } from 'wouter';
import { aboutContent } from '../data/data';

function Counter({ from, to, suffix, label }: { from: number, to: number, suffix: string, label: string }) {
  const [count, setCount] = useState(from);
  const controls = useAnimation();

  useEffect(() => {
    let startTime: number;
    const duration = 2000;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      // easeOutExpo
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(from + (to - from) * ease));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    // Simple intersection observer trigger
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        requestAnimationFrame(animate);
        observer.disconnect();
      }
    });
    
    const element = document.getElementById(`counter-${label.replace(/\s+/g, '')}`);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [from, to, label]);

  return (
      <div id={`counter-${label.replace(/\s+/g, '')}`} style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 'clamp(56px, 8vw, 80px)', color: 'var(--color-accent)', lineHeight: 1 }}>
          {count}{suffix}
        </div>
        <div className="tag" style={{ color: 'rgba(250,247,242,0.55)', fontSize: '11px', marginTop: '12px', letterSpacing: '0.2em' }}>
          {label}
        </div>
      </div>
  );
}

export default function About() {
  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ 
        height: '80vh', 
        minHeight: '560px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'linear-gradient(rgba(28,31,26,0.35), rgba(28,31,26,0.72)), url(/about-hero.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'var(--color-ivory)',
        textAlign: 'center'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="tag" style={{ color: 'var(--color-leaf)' }}>Our Philosophy</span>
          <h1 style={{ fontSize: 'clamp(52px, 9vw, 88px)', marginTop: '16px', maxWidth: '900px', lineHeight: 1.05 }}>Building spaces that belong.</h1>
        </motion.div>
      </div>

      {/* Story */}
      <section style={{ padding: '120px 40px', maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="subheading" style={{ fontSize: '32px', color: 'var(--color-primary)', marginBottom: '32px' }}>Our Story</h2>
          <p style={{ fontSize: '20px', color: 'var(--color-text-muted)', lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: aboutContent.story.replace('BAANS INFRA', '<strong>BAANS INFRA</strong>') }} />
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section style={{ backgroundColor: 'var(--color-bg-dark)', padding: '100px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px' }}>
          <Counter from={0} to={50} suffix="+" label="Projects Completed" />
          <Counter from={0} to={10} suffix="+" label="Years of Craft" />
          <Counter from={0} to={8} suffix="" label="States Across India" />
          <Counter from={0} to={22} suffix="K" label="Community Members" />
        </div>
      </section>

      {/* Values Grid */}
      <section style={{ padding: '120px 40px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <span className="tag" style={{ color: 'var(--color-primary)' }}>What Guides Us</span>
          <h2 style={{ fontSize: 'clamp(36px, 5vw, 56px)', marginTop: '16px' }}>Our Core Values</h2>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
          {aboutContent.values.map((value, idx) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
              style={{ backgroundColor: 'var(--color-ivory)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)' }}
            >
              <h3 style={{ fontSize: '28px', color: 'var(--color-primary)', marginBottom: '16px' }}>{value.title}</h3>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{value.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section style={{ padding: '0 40px 120px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ backgroundColor: '#2A2D27', color: 'var(--color-ivory)', borderRadius: '32px', padding: '60px', display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'center' }}>
          <div style={{ flex: '1 1 300px' }}>
            <img src={aboutContent.team[0].image} alt={aboutContent.team[0].name} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: '50%' }} />
          </div>
          <div style={{ flex: '2 1 400px' }}>
            <span className="tag" style={{ color: 'var(--color-leaf)' }}>{aboutContent.team[0].role}</span>
            <h3 style={{ fontSize: '40px', margin: '8px 0 24px', color: 'var(--color-accent)' }}>{aboutContent.team[0].name}</h3>
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>"{aboutContent.team[0].bio}"</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', padding: '80px 40px 120px' }}>
        <h2 style={{ fontSize: '48px', marginBottom: '32px' }}>Ready to build something real?</h2>
        <Link href="/contact" className="pill-btn primary">Let's Talk</Link>
      </section>
    </div>
  );
}
