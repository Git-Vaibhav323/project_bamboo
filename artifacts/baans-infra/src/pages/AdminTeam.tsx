import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase, TeamMember } from '../lib/supabase';
import { uploadImageToSupabase } from '../lib/imageCompression';
import { Link } from 'wouter';

export default function AdminTeam() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    order: 0,
  });

  const [memberImage, setMemberImage] = useState<File | null>(null);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    if (!supabase) { setLoading(false); return; }
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('order', { ascending: true });

    if (!error && data) {
      setTeamMembers(data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) { alert('Supabase is not configured.'); return; }
    setUploading(true);

    try {
      let imageUrl = editingMember?.image || '';

      // Upload member image
      if (memberImage) {
        const timestamp = Date.now();
        const path = `team/${formData.name.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.jpg`;
        imageUrl = await uploadImageToSupabase(memberImage, 'team-images', path);
      }

      const memberData = {
        ...formData,
        image: imageUrl,
      };

      if (editingMember) {
        await supabase!
          .from('team_members')
          .update(memberData)
          .eq('id', editingMember.id);
      } else {
        await supabase!.from('team_members').insert([memberData]);
      }

      await fetchTeamMembers();
      resetForm();
    } catch (error) {
      console.error('Error saving team member:', error);
      alert('Error saving team member. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;
    if (!supabase) return;
    await supabase.from('team_members').delete().eq('id', id);
    await fetchTeamMembers();
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio,
      order: member.order,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      bio: '',
      order: 0,
    });
    setMemberImage(null);
    setEditingMember(null);
    setShowForm(false);
  };

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)', paddingTop: '100px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <Link href="/admin">
              <span style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>← Back to Dashboard</span>
            </Link>
            <h1 style={{ fontSize: '48px', color: 'var(--color-text)', marginTop: '8px' }}>Manage Team</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="pill-btn primary"
            style={{ padding: '12px 24px' }}
          >
            {showForm ? 'Cancel' : '+ Add Team Member'}
          </button>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ backgroundColor: 'var(--color-ivory)', padding: '32px', borderRadius: '8px', marginBottom: '40px' }}
          >
            <h2 style={{ fontSize: '24px', marginBottom: '24px' }}>
              {editingMember ? 'Edit Team Member' : 'Add New Team Member'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Role *</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    required
                    placeholder="e.g., Founder & Chief Architect"
                    style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
              </div>

              <div style={{ marginTop: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Bio *</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  required
                  rows={4}
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ marginTop: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Display Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  Lower numbers appear first
                </p>
              </div>

              <div style={{ marginTop: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>
                  Photo {!editingMember && '*'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setMemberImage(e.target.files?.[0] || null)}
                  required={!editingMember}
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  Images will be automatically compressed to max 1MB
                </p>
              </div>

              <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
                <button
                  type="submit"
                  disabled={uploading}
                  className="pill-btn primary"
                  style={{ padding: '14px 32px' }}
                >
                  {uploading ? 'Saving...' : editingMember ? 'Update Member' : 'Add Member'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="pill-btn"
                  style={{ padding: '14px 32px' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {teamMembers.map((member) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ backgroundColor: 'var(--color-ivory)', padding: '24px', borderRadius: '8px' }}
            >
              <img
                src={member.image}
                alt={member.name}
                style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '4px', marginBottom: '16px' }}
              />
              <h3 style={{ fontSize: '20px', marginBottom: '4px' }}>{member.name}</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '12px' }}>{member.role}</p>
              <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                {member.bio.substring(0, 100)}...
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => handleEdit(member)}
                  className="pill-btn"
                  style={{ padding: '8px 16px', fontSize: '14px' }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  style={{ padding: '8px 16px', fontSize: '14px', backgroundColor: '#fee', color: '#c00', border: 'none', borderRadius: '99px', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
