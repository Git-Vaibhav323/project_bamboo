import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Link, useLocation } from 'wouter';

export default function Admin() {
  const [, setLocation] = useLocation();
  const [session, setSession] = useState<any>(null);
  // Start as false — we check session immediately, no spinner on first load
  const [loading, setLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!supabase) return;

    // Get current session synchronously from local storage first (no network call)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth state changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoginLoading(false); // stop spinner as soon as auth state resolves
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoginLoading(true);

    if (!supabase) {
      setError('Supabase is not configured. Please add your credentials to the .env file.');
      setLoginLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoginLoading(false);
    }
    // On success, onAuthStateChange fires → sets session → setLoginLoading(false)
  };

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    setLocation('/');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--color-text-muted)' }}>Loading...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg)', padding: '40px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ maxWidth: '400px', width: '100%', backgroundColor: 'var(--color-ivory)', padding: '48px', borderRadius: '8px' }}
        >
          <h1 style={{ fontSize: '32px', marginBottom: '8px', color: 'var(--color-text)' }}>Admin Login</h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px' }}>Access the BAANS INFRA admin panel</p>

          {!supabase && (
            <div style={{ padding: '12px 16px', backgroundColor: '#fff8e1', color: '#7a5c00', borderRadius: '4px', marginBottom: '20px', fontSize: '13px', lineHeight: 1.5, border: '1px solid #ffe082' }}>
              <strong>Supabase not configured.</strong><br />
              Create a <code>.env</code> file with:<br />
              <code>VITE_SUPABASE_URL=...</code><br />
              <code>VITE_SUPABASE_ANON_KEY=...</code><br />
              Then restart the dev server.
            </div>
          )}

          {error && (
            <div style={{ padding: '12px', backgroundColor: '#fee', color: '#c00', borderRadius: '4px', marginBottom: '20px', fontSize: '14px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }}
              />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }}
              />
            </div>
            <button
              type="submit"
              disabled={loginLoading}
              className="pill-btn primary"
              style={{ width: '100%', padding: '14px', fontSize: '16px', fontWeight: 700 }}
            >
              {loginLoading ? 'Signing in...' : 'Login'}
            </button>
          </form>

          <Link href="/">
            <span style={{ display: 'block', textAlign: 'center', marginTop: '20px', color: 'var(--color-text-muted)', fontSize: '14px', cursor: 'pointer' }}>
              ← Back to site
            </span>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)', paddingTop: '100px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '48px', color: 'var(--color-text)' }}>Admin Dashboard</h1>
          <button onClick={handleLogout} className="pill-btn" style={{ padding: '12px 24px' }}>
            Logout
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <Link href="/admin/projects">
            <motion.div whileHover={{ scale: 1.02 }} style={{ backgroundColor: 'var(--color-ivory)', padding: '32px', borderRadius: '8px', cursor: 'pointer' }}>
              <h2 style={{ fontSize: '24px', marginBottom: '12px', color: 'var(--color-text)' }}>Manage Projects</h2>
              <p style={{ color: 'var(--color-text-muted)' }}>Add, edit, or remove projects from the portfolio</p>
            </motion.div>
          </Link>

          <Link href="/admin/team">
            <motion.div whileHover={{ scale: 1.02 }} style={{ backgroundColor: 'var(--color-ivory)', padding: '32px', borderRadius: '8px', cursor: 'pointer' }}>
              <h2 style={{ fontSize: '24px', marginBottom: '12px', color: 'var(--color-text)' }}>Manage Team</h2>
              <p style={{ color: 'var(--color-text-muted)' }}>Update team member information and photos</p>
            </motion.div>
          </Link>

          <Link href="/admin/contacts">
            <motion.div whileHover={{ scale: 1.02 }} style={{ backgroundColor: 'var(--color-ivory)', padding: '32px', borderRadius: '8px', cursor: 'pointer' }}>
              <h2 style={{ fontSize: '24px', marginBottom: '12px', color: 'var(--color-text)' }}>Contact Submissions</h2>
              <p style={{ color: 'var(--color-text-muted)' }}>View and manage contact form submissions</p>
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  );
}
