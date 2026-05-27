import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase, Project } from '../lib/supabase';
import { uploadImageToSupabase } from '../lib/imageCompression';
import { Link } from 'wouter';

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px', border: '1px solid #ddd',
  borderRadius: '4px', fontSize: '14px', fontFamily: 'inherit',
};

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    state: '',
    type: '',           // free text — no forced options
    year: new Date().getFullYear().toString(),
    duration: '',
    size: '',
    description: '',
    tags: '',
  });

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    if (!supabase) { setLoading(false); return; }
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error('Fetch error:', error);
    if (data) setProjects(data as Project[]);
    setLoading(false);
  };

  const generateSlug = (name: string) =>
    name.toLowerCase().trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) { alert('Supabase is not configured.'); return; }
    if (!formData.name.trim()) { alert('Project name is required.'); return; }

    setUploading(true);
    setUploadStatus('Saving project...');

    const slug = editingProject?.slug || generateSlug(formData.name);

    try {
      let coverImageUrl = editingProject?.cover_image || '';
      let galleryImageUrls = editingProject?.gallery_images || [];

      if (coverImage) {
        setUploadStatus('Compressing & uploading cover image...');
        const path = `projects/${slug}-cover-${Date.now()}.jpg`;
        coverImageUrl = await uploadImageToSupabase(coverImage, 'project-images', path);
      }

      if (galleryImages.length > 0) {
        setUploadStatus(`Uploading ${galleryImages.length} gallery image(s)...`);
        const urls = await Promise.all(
          galleryImages.map((file, i) =>
            uploadImageToSupabase(file, 'project-images', `projects/${slug}-gallery-${i}-${Date.now()}.jpg`)
          )
        );
        galleryImageUrls = [...galleryImageUrls, ...urls];
      }

      setUploadStatus('Writing to database...');

      const projectData = {
        ...formData,
        slug,
        cover_image: coverImageUrl,
        gallery_images: galleryImageUrls,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      };

      if (editingProject) {
        const { error: updateError } = await supabase!
          .from('projects')
          .update(projectData)
          .eq('id', editingProject.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase!
          .from('projects')
          .insert([projectData]);
        if (insertError) throw insertError;
      }

      // Always re-fetch the full list so the UI is in sync with the DB
      await fetchProjects();
      resetForm();
    } catch (err: any) {
      console.error('Error saving project:', err);
      alert('Error saving project: ' + (err?.message || JSON.stringify(err)));
    } finally {
      setUploading(false);
      setUploadStatus('');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    if (!supabase) return;
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) { alert('Delete failed: ' + error.message); return; }
    await fetchProjects();
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      location: project.location,
      state: project.state,
      type: project.type,
      year: project.year,
      duration: project.duration,
      size: project.size,
      description: project.description,
      tags: (project.tags || []).join(', '),
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({ name: '', location: '', state: '', type: '', year: new Date().getFullYear().toString(), duration: '', size: '', description: '', tags: '' });
    setCoverImage(null);
    setGalleryImages([]);
    setEditingProject(null);
    setShowForm(false);
  };

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading projects...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)', paddingTop: '100px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <Link href="/admin">
              <span style={{ color: 'var(--color-text-muted)', fontSize: '14px', cursor: 'pointer' }}>← Back to Dashboard</span>
            </Link>
            <h1 style={{ fontSize: '40px', color: 'var(--color-text)', marginTop: '8px' }}>Manage Projects</h1>
          </div>
          <button onClick={() => { resetForm(); setShowForm(s => !s); }} className="pill-btn primary" style={{ padding: '12px 24px' }}>
            {showForm ? 'Cancel' : '+ Add Project'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
            style={{ backgroundColor: 'var(--color-ivory)', padding: '32px', borderRadius: '8px', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '22px', marginBottom: '24px' }}>
              {editingProject ? 'Edit Project' : 'Add New Project'}
            </h2>

            <form onSubmit={handleSubmit}>
              {/* Name — only truly required field */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600 }}>
                  Project Name <span style={{ color: '#c00' }}>*</span>
                </label>
                <input style={inputStyle} type="text" value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })} />
                {formData.name && (
                  <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    URL: /projects/{generateSlug(formData.name)}
                  </p>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600 }}>Location</label>
                  <input style={inputStyle} type="text" placeholder="e.g. Assagao, North Goa"
                    value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600 }}>State</label>
                  <input style={inputStyle} type="text" placeholder="e.g. Goa"
                    value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600 }}>
                    Type
                    <span style={{ fontWeight: 400, color: 'var(--color-text-muted)', marginLeft: '6px', fontSize: '11px' }}>
                      (free text — write anything)
                    </span>
                  </label>
                  <input style={inputStyle} type="text"
                    placeholder="e.g. Resorts, Villas, Pavilions, Rammed Earth, Café, Yogashala..."
                    value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600 }}>Year</label>
                  <input style={inputStyle} type="text" value={formData.year}
                    onChange={e => setFormData({ ...formData, year: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600 }}>Duration</label>
                  <input style={inputStyle} type="text" placeholder="e.g. 4 months"
                    value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600 }}>Size</label>
                  <input style={inputStyle} type="text" placeholder="e.g. 2,400 sq ft"
                    value={formData.size} onChange={e => setFormData({ ...formData, size: e.target.value })} />
                </div>
              </div>

              <div style={{ marginTop: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600 }}>Description</label>
                <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={4}
                  value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
              </div>

              <div style={{ marginTop: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600 }}>Tags (comma-separated)</label>
                <input style={inputStyle} type="text" placeholder="e.g. Eco Resort, Airbnb, River-facing"
                  value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} />
              </div>

              <div style={{ marginTop: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600 }}>
                  Cover Image {!editingProject && <span style={{ color: '#c00' }}>*</span>}
                </label>
                <input style={inputStyle} type="file" accept="image/*"
                  onChange={e => setCoverImage(e.target.files?.[0] || null)} />
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  Auto-compressed to max 1 MB before upload
                </p>
              </div>

              <div style={{ marginTop: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600 }}>Gallery Images</label>
                <input style={inputStyle} type="file" accept="image/*" multiple
                  onChange={e => setGalleryImages(Array.from(e.target.files || []))} />
              </div>

              {/* Upload progress */}
              {uploading && uploadStatus && (
                <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f0f7ff', borderRadius: '4px', fontSize: '13px', color: '#1565C0' }}>
                  {uploadStatus}
                </div>
              )}

              <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                <button type="submit" disabled={uploading} className="pill-btn primary" style={{ padding: '12px 28px' }}>
                  {uploading ? 'Saving...' : editingProject ? 'Update Project' : 'Create Project'}
                </button>
                <button type="button" onClick={resetForm} className="pill-btn" style={{ padding: '12px 28px' }}>
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Project list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {projects.length === 0 && (
            <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '40px' }}>
              No projects yet. Click "+ Add Project" to create one.
            </p>
          )}
          {projects.map(project => (
            <div key={project.id}
              style={{ backgroundColor: 'var(--color-ivory)', padding: '20px', borderRadius: '8px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              {project.cover_image && (
                <img src={project.cover_image} alt={project.name}
                  style={{ width: '160px', height: '120px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontSize: '20px', marginBottom: '4px' }}>{project.name}</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginBottom: '8px' }}>
                  {[project.location, project.type, project.year].filter(Boolean).join(' · ')}
                </p>
                {project.description && (
                  <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                    {project.description.substring(0, 120)}...
                  </p>
                )}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => handleEdit(project)} className="pill-btn" style={{ padding: '6px 16px', fontSize: '13px' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(project.id)}
                    style={{ padding: '6px 16px', fontSize: '13px', backgroundColor: '#fee2e2', color: '#b91c1c', border: 'none', borderRadius: '99px', cursor: 'pointer' }}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
