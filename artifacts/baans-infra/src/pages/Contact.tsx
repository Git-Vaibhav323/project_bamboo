import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { contactContent } from '../data/data';
import { supabase } from '../lib/supabase';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    budget: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (supabase) {
        const { error: submitError } = await supabase
          .from('contact_submissions')
          .insert([{
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            company: formData.company || null,
            budget: formData.budget || null,
            message: formData.message,
            source: 'contact_page',
            status: 'new'
          }]);

        if (submitError) throw submitError;
      }
      
      setSubmitted(true);
    } catch (err: any) {
      console.error('Error submitting form:', err);
      setError('Failed to submit. Please try again or email us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '16px 0',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(0,0,0,0.2)',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '16px',
    color: 'var(--color-text)',
    outline: 'none',
    transition: 'border-color 0.3s'
  };

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh', paddingTop: '120px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '80px' }}>
          
          {/* Left Col - Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="tag" style={{ color: 'var(--color-primary)' }}>Get in Touch</span>
            <h1 style={{ fontSize: 'clamp(40px, 6vw, 56px)', margin: '16px 0 24px', lineHeight: 1.1 }}>{contactContent.headline}</h1>
            <p className="subheading" style={{ fontSize: '20px', color: 'var(--color-text-muted)', marginBottom: '48px', maxWidth: '400px' }}>
              {contactContent.subtext}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '60px' }}>
              <div>
                <p className="tag" style={{ color: 'var(--color-text-muted)', fontSize: '11px', marginBottom: '4px' }}>Email</p>
                <a href={`mailto:${contactContent.email}`} style={{ color: 'var(--color-text)', textDecoration: 'none', fontSize: '18px', fontWeight: 500 }}>{contactContent.email}</a>
              </div>
              <div>
                <p className="tag" style={{ color: 'var(--color-text-muted)', fontSize: '11px', marginBottom: '4px' }}>Phone</p>
                <a href={`tel:${contactContent.phone}`} style={{ color: 'var(--color-text)', textDecoration: 'none', fontSize: '18px', fontWeight: 500 }}>{contactContent.phone}</a>
              </div>
            </div>

            {/* Map Placeholder */}
            <div style={{ width: '100%', height: '250px', backgroundColor: '#E8E2D5', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(var(--color-primary) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Col - Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ backgroundColor: 'var(--color-ivory)', padding: '60px 40px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }}
          >
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                style={{ textAlign: 'center', padding: '60px 0' }}
              >
                <div style={{
                  width: '72px', height: '72px', borderRadius: '50%',
                  backgroundColor: 'var(--color-leaf)', margin: '0 auto 24px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '32px', color: 'var(--color-primary)', marginBottom: '16px' }}>Message Received!</h3>
                <p style={{ color: 'var(--color-text-muted)' }}>We'll review your message and get back to you within 48 hours.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {error && (
                  <div style={{ padding: '12px', backgroundColor: '#fee', color: '#c00', borderRadius: '4px', fontSize: '14px' }}>
                    {error}
                  </div>
                )}

                <div>
                  <input 
                    type="text" 
                    placeholder="Full Name *" 
                    required 
                    style={inputStyle} 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.2)'}
                  />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <input 
                    type="email" 
                    placeholder="Email Address *" 
                    required 
                    style={inputStyle}
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                  <input 
                    type="tel" 
                    placeholder="Phone Number *" 
                    required
                    style={inputStyle}
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>

                <div>
                  <input 
                    type="text" 
                    placeholder="Company / Project Name (optional)" 
                    style={inputStyle}
                    value={formData.company}
                    onChange={e => setFormData({...formData, company: e.target.value})}
                  />
                </div>

                <div>
                  <input 
                    type="text" 
                    placeholder="Budget Range (optional) — e.g. ₹20L–₹50L" 
                    style={inputStyle}
                    value={formData.budget}
                    onChange={e => setFormData({...formData, budget: e.target.value})}
                  />
                </div>

                <div>
                  <textarea 
                    placeholder="Tell us about your project or inquiry... *" 
                    rows={5} 
                    required 
                    style={{...inputStyle, resize: 'vertical'}}
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="pill-btn primary" 
                  style={{ width: '100%', marginTop: '16px', padding: '20px', fontSize: '14px' }}
                >
                  {submitting ? 'Sending...' : 'Send Message →'}
                </button>
              </form>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}
