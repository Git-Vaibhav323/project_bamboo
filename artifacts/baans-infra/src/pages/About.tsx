import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Link } from 'wouter';
import { aboutContent } from '../data/data';
import { supabase, TeamMember } from '../lib/supabase';
import { applyWordStagger } from '../hooks/useScrollReveal';

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
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const storyRef = useRef<HTMLParagraphElement>(null);

  // Word-stagger hero title
  useEffect(() => {
    if (heroTitleRef.current) applyWordStagger(heroTitleRef.current, 300, 75);
  }, []);

  // Story paragraph reveal
  useEffect(() => {
    if (!storyRef.current) return;
    const el = storyRef.current;
    el.classList.add('about-story-text');
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.classList.add('is-visible');
        observer.disconnect();
      }
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Stat counter golden border reveal
  useEffect(() => {
    const counters = document.querySelectorAll<HTMLElement>('[id^="counter-"]');
    if (!counters.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    counters.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [loading]);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('order', { ascending: true });

      if (!error && data && data.length > 0) {
        setTeamMembers(data);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  // Use Supabase data if available, otherwise fallback to static data
  const displayTeam = teamMembers.length > 0 ? teamMembers : aboutContent.team;

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
          <h1
            ref={heroTitleRef}
            style={{ fontSize: 'clamp(52px, 9vw, 88px)', marginTop: '16px', maxWidth: '900px', lineHeight: 1.05, color: '#ffffff' }}
          >
            Building spaces that belong.
          </h1>
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
          <p
            ref={storyRef}
            style={{ fontSize: '20px', color: 'var(--color-text-muted)', lineHeight: 1.8 }}
            dangerouslySetInnerHTML={{ __html: aboutContent.story.replace('BAANS INFRA', '<strong>BAANS INFRA</strong>') }}
          />
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section style={{ backgroundColor: 'var(--color-bg-dark)', padding: '100px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px' }}>
          <Counter from={0} to={50} suffix="+" label="Projects Completed" />
          <Counter from={0} to={10} suffix="+" label="Years of Craft" />
          <Counter from={0} to={8} suffix="+" label="States Across India" />
          <Counter from={0} to={22} suffix="K" label="Community Members" />
        </div>
      </section>

      {/* Values Grid */}
      <section style={{ padding: '120px 40px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '72px' }}>
          <span className="tag" style={{ color: 'var(--color-primary)' }}>What Guides Us</span>
          <h2 style={{ fontSize: 'clamp(36px, 5vw, 56px)', marginTop: '16px' }}>Our Core Values</h2>
        </div>

        <div className="values-grid">
          {[
            {
              title: 'Craft',
              body: 'Every joint is hand-fitted. Every culm is individually selected. We don\'t use CNC machines or prefab panels. Real craft takes real time.',
              number: '01',
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
              ),
            },
            {
              title: 'Sustainability',
              body: 'We track our carbon footprint per project. We plant 10 bamboo culms for every 1 we harvest. Sustainability is not a marketing claim — it\'s a balance sheet.',
              number: '02',
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 22 C2 22 8 16 12 12 C16 8 22 2 22 2 C22 2 16 8 12 12 C8 16 2 22 2 22Z"/>
                  <path d="M12 12 C12 12 8 8 6 4 C4 0 2 2 2 2 C2 2 4 4 6 8 C8 12 12 12 12 12Z"/>
                </svg>
              ),
            },
            {
              title: 'Permanence',
              body: 'Our structures are designed to outlast concrete alternatives. Properly treated bamboo lasts 25–50 years. We build for the next generation.',
              number: '03',
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="9" width="18" height="13" rx="2"/>
                  <path d="M8 9V7a4 4 0 0 1 8 0v2"/>
                  <circle cx="12" cy="15" r="1" fill="currentColor"/>
                </svg>
              ),
            },
          ].map((value, idx) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="value-card-new"
            >
              {/* Number */}
              <span className="value-card-number">{value.number}</span>

              {/* Icon circle */}
              <div className="value-card-icon">
                {value.icon}
              </div>

              {/* Content */}
              <h3 className="value-card-title">{value.title}</h3>
              <p className="value-card-body">{value.body}</p>

              {/* Bottom accent line */}
              <div className="value-card-line" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section style={{ padding: '0 40px 120px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span className="tag" style={{ color: 'var(--color-primary)' }}>Meet the Team</span>
          <h2 style={{ fontSize: 'clamp(36px, 5vw, 56px)', marginTop: '16px' }}>The People Behind BAANS INFRA</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
          {displayTeam.map((member, idx) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              className="team-card"
              style={{ backgroundColor: '#2A2D27', color: 'var(--color-ivory)', borderRadius: '24px', padding: '32px', textAlign: 'center' }}
            >
              <img
                src={member.image}
                alt={member.name}
                style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '50%', margin: '0 auto 24px' }}
              />
              <span className="tag" style={{ color: 'var(--color-leaf)', fontSize: '11px' }}>{member.role}</span>
              <h3
                className="team-member-name"
                style={{ fontSize: '28px', margin: '8px 0 16px' }}
              >
                {member.name}
              </h3>
              <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.8 }}>"{member.bio}"</p>
            </motion.div>
          ))}
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
