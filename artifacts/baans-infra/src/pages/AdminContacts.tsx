import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase, ContactSubmission } from '../lib/supabase';
import { Link } from 'wouter';

type StatusFilter = 'all' | 'new' | 'read' | 'replied' | 'archived';
type SourceFilter = 'all' | 'contact_page' | 'home_page';

export default function AdminContacts() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    if (!supabase) { setLoading(false); return; }

    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setSubmissions(data);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: ContactSubmission['status']) => {
    if (!supabase) return;
    await supabase.from('contact_submissions').update({ status }).eq('id', id);
    await fetchSubmissions();
  };

  const deleteSubmission = async (id: string) => {
    if (!confirm('Delete this submission?')) return;
    if (!supabase) return;
    await supabase.from('contact_submissions').delete().eq('id', id);
    await fetchSubmissions();
  };

  const filtered = submissions
    .filter(s => statusFilter === 'all' || s.status === statusFilter)
    .filter(s => sourceFilter === 'all' || s.source === sourceFilter);

  const countByStatus = (st: string) => submissions.filter(s => s.status === st).length;
  const newCount = countByStatus('new');

  const statusColor: Record<string, string> = {
    new: '#4CAF50',
    read: '#2196F3',
    replied: '#9C27B0',
    archived: '#9E9E9E',
  };

  const sourceLabel: Record<string, string> = {
    home_page: 'Home Form',
    contact_page: 'Contact Page',
  };

  const sourceBg: Record<string, string> = {
    home_page: '#FFF3E0',
    contact_page: '#E3F2FD',
  };

  const sourceColor: Record<string, string> = {
    home_page: '#E65100',
    contact_page: '#1565C0',
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading…
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)', paddingTop: '100px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px' }}>

        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <Link href="/admin">
            <span style={{ color: 'var(--color-text-muted)', fontSize: '14px', cursor: 'pointer' }}>
              ← Back to Dashboard
            </span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginTop: '8px' }}>
            <h1 style={{ fontSize: '48px', color: 'var(--color-text)', margin: 0 }}>Contact Submissions</h1>
            {newCount > 0 && (
              <span style={{
                backgroundColor: '#4CAF50', color: '#fff',
                borderRadius: '99px', padding: '4px 12px',
                fontSize: '13px', fontWeight: 700
              }}>
                {newCount} new
              </span>
            )}
          </div>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '8px' }}>
            {submissions.length} total · {submissions.filter(s => s.source === 'home_page').length} from home form · {submissions.filter(s => s.source === 'contact_page').length} from contact page
          </p>
        </div>

        {/* Filters row */}
        <div style={{ display: 'flex', gap: '32px', marginBottom: '32px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {/* Status filter */}
          <div>
            <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(['all', 'new', 'read', 'replied', 'archived'] as StatusFilter[]).map(f => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '99px',
                    border: '1px solid',
                    borderColor: statusFilter === f ? 'var(--color-primary)' : '#ddd',
                    backgroundColor: statusFilter === f ? 'var(--color-primary)' : 'transparent',
                    color: statusFilter === f ? '#fff' : 'var(--color-text)',
                    fontSize: '13px',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                  }}
                >
                  {f}{f !== 'all' ? ` (${countByStatus(f)})` : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Source filter */}
          <div>
            <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Source</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['all', 'home_page', 'contact_page'] as SourceFilter[]).map(f => (
                <button
                  key={f}
                  onClick={() => setSourceFilter(f)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '99px',
                    border: '1px solid',
                    borderColor: sourceFilter === f ? 'var(--color-primary)' : '#ddd',
                    backgroundColor: sourceFilter === f ? 'var(--color-primary)' : 'transparent',
                    color: sourceFilter === f ? '#fff' : 'var(--color-text)',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  {f === 'all' ? 'All Sources' : sourceLabel[f]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submissions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'var(--color-ivory)', borderRadius: '8px' }}>
              <p style={{ color: 'var(--color-text-muted)' }}>No submissions match the current filters.</p>
            </div>
          ) : (
            filtered.map(sub => (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  backgroundColor: 'var(--color-ivory)',
                  padding: '24px',
                  borderRadius: '8px',
                  borderLeft: `4px solid ${statusColor[sub.status] ?? '#ccc'}`,
                }}
              >
                {/* Top row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '20px', margin: 0 }}>{sub.name}</h3>

                      {/* Status badge */}
                      <span style={{
                        padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 700,
                        textTransform: 'uppercase',
                        backgroundColor: (statusColor[sub.status] ?? '#ccc') + '22',
                        color: statusColor[sub.status] ?? '#333',
                      }}>
                        {sub.status}
                      </span>

                      {/* Source badge */}
                      <span style={{
                        padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 600,
                        backgroundColor: sourceBg[sub.source] ?? '#eee',
                        color: sourceColor[sub.source] ?? '#333',
                      }}>
                        {sourceLabel[sub.source] ?? sub.source}
                      </span>
                    </div>

                    {/* Contact details */}
                    <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '6px', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                        <a href={`mailto:${sub.email}`} style={{ color: 'inherit' }}>{sub.email}</a>
                      </span>
                      {sub.phone && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                          {sub.phone}
                        </span>
                      )}
                      {sub.company && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                          {sub.company}
                        </span>
                      )}
                      {sub.budget && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                          {sub.budget}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {formatDate(sub.created_at)}
                    </p>
                  </div>
                </div>

                {/* Message */}
                <div style={{
                  padding: '14px 16px',
                  backgroundColor: '#f7f5f0',
                  borderRadius: '6px',
                  marginBottom: '16px',
                  fontSize: '14px',
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap',
                  color: 'var(--color-text)',
                }}>
                  {sub.message}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {sub.status !== 'read' && (
                    <button onClick={() => updateStatus(sub.id, 'read')} className="pill-btn" style={{ padding: '6px 14px', fontSize: '13px' }}>
                      Mark Read
                    </button>
                  )}
                  {sub.status !== 'replied' && (
                    <button onClick={() => updateStatus(sub.id, 'replied')} className="pill-btn" style={{ padding: '6px 14px', fontSize: '13px' }}>
                      Mark Replied
                    </button>
                  )}
                  {sub.status !== 'archived' && (
                    <button onClick={() => updateStatus(sub.id, 'archived')} className="pill-btn" style={{ padding: '6px 14px', fontSize: '13px' }}>
                      Archive
                    </button>
                  )}
                  {sub.status === 'archived' && (
                    <button onClick={() => updateStatus(sub.id, 'new')} className="pill-btn" style={{ padding: '6px 14px', fontSize: '13px' }}>
                      Restore
                    </button>
                  )}
                  <a
                    href={`mailto:${sub.email}?subject=Re: Your enquiry to BAANS INFRA`}
                    className="pill-btn primary"
                    style={{ padding: '6px 14px', fontSize: '13px', textDecoration: 'none' }}
                    onClick={() => updateStatus(sub.id, 'replied')}
                  >
                    Reply via Email
                  </a>
                  <button
                    onClick={() => deleteSubmission(sub.id)}
                    style={{ padding: '6px 14px', fontSize: '13px', backgroundColor: '#fee2e2', color: '#b91c1c', border: 'none', borderRadius: '99px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
