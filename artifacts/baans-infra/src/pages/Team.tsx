import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase, TeamMember } from '../lib/supabase';
import { aboutContent } from '../data/data';

export default function Team() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg)' }}>
        <p style={{ fontSize: '18px', color: 'var(--color-text-muted)' }}>Loading team...</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ 
        height: '60vh', 
        minHeight: '100px',
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
          <span className="tag" style={{ color: 'var(--color-leaf)' }}>Our Team</span>
          <h1 style={{ fontSize: 'clamp(52px, 9vw, 88px)', marginTop: '16px', maxWidth: '900px', lineHeight: 1.05 }}>
            The People Behind BAANS INFRA
          </h1>
        </motion.div>
      </div>

      {/* Team Grid */}
      <section style={{ padding: '120px 40px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <p className="subheading" style={{ fontSize: '18px', color: 'var(--color-text-muted)', maxWidth: '700px', margin: '0 auto' }}>
            Meet the craftsmen, architects, and visionaries who bring bamboo structures to life across India.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px' }}>
          {displayTeam.map((member, idx) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              style={{ 
                backgroundColor: 'var(--color-ivory)', 
                borderRadius: '16px', 
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
              }}
            >
              <div style={{ position: 'relative', paddingTop: '120%', overflow: 'hidden' }}>
                <img 
                  src={member.image} 
                  alt={member.name} 
                  style={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease'
                  }} 
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
              </div>
              <div style={{ padding: '32px' }}>
                <span className="tag" style={{ color: 'var(--color-leaf)', fontSize: '11px' }}>{member.role}</span>
                <h3 style={{ fontSize: '28px', margin: '8px 0 16px', color: 'var(--color-text)', fontFamily: 'Cormorant Garamond, serif' }}>
                  {member.name}
                </h3>
                <p style={{ fontSize: '15px', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
                  {member.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', padding: '80px 40px 120px', backgroundColor: 'var(--color-bg-dark)' }}>
        <h2 style={{ fontSize: '48px', marginBottom: '16px', color: 'var(--color-ivory)' }}>Want to work with us?</h2>
        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', marginBottom: '32px' }}>
          We're always looking for talented craftsmen and architects passionate about sustainable design.
        </p>
        <a href="/contact" className="pill-btn primary">Get in Touch</a>
      </section>
    </div>
  );
}
