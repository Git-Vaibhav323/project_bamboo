import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase, Project } from '../lib/supabase';
import { uploadImageToSupabase } from '../lib/imageCompression';
import { Link } from 'wouter';

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    state: '',
    type: 'Resorts',
    year: new Date().getFullYear().toString(),
    duration: '',
    size: '',
    description: '',
    tags: '',
  });

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    if (!supabase) { setLoading(false); return; }
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProjects(data);
    }
    setLoading(false);
  };

  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) { alert('Supabase is not configured.'); return; }
    setUploading(true);

    // Auto-generate slug from name; keep existing slug when editing
    const slug = editingProject?.slug || generateSlug(formData.name);

    try {
      let coverImageUrl = editingProject?.cover_image || '';
      let galleryImageUrls = editingProject?.gallery_images || [];

      // Upload cover image
      if (coverImage) {
        const timestamp = Date.now();
        const path = `projects/${slug}-cover-${timestamp}.jpg`;
        coverImageUrl = await uploadImageToSupabase(coverImage, 'project-images', path);
      }

      // Upload gallery images
      if (galleryImages.length > 0) {
        const uploadPromises = galleryImages.map(async (file, index) => {
          const timestamp = Date.now();
          const path = `projects/${slug}-gallery-${index}-${timestamp}.jpg`;
          return uploadImageToSupabase(file, 'project-images', path);
        });
        const newGalleryUrls = await Promise.all(uploadPromises);
        galleryImageUrls = [...galleryImageUrls, ...newGalleryUrls];
      }

      const projectData = {
        ...formData,
        slug,
        cover_image: coverImageUrl,
        gallery_images: galleryImageUrls,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      };

      if (editingProject) {
        await supabase!
          .from('projects')
          .update(projectData)
          .eq('id', editingProject.id);
      } else {
        await supabase!.from('projects').insert([projectData]);
      }

      await fetchProjects();
      resetForm();
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Error saving project. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    if (!supabase) return;
    await supabase.from('projects').delete().eq('id', id);
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
      tags: project.tags.join(', '),
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      state: '',
      type: 'Resorts',
      year: new Date().getFullYear().toString(),
      duration: '',
      size: '',
      description: '',
      tags: '',
    });
    setCoverImage(null);
    setGalleryImages([]);
    setEditingProject(null);
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
            <h1 style={{ fontSize: '48px', color: 'var(--color-text)', marginTop: '8px' }}>Manage Projects</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="pill-btn primary"
            style={{ padding: '12px 24px' }}
          >
            {showForm ? 'Cancel' : '+ Add Project'}
          </button>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ backgroundColor: 'var(--color-ivory)', padding: '32px', borderRadius: '8px', marginBottom: '40px' }}
          >
            <h2 style={{ fontSize: '24px', marginBottom: '24px' }}>
              {editingProject ? 'Edit Project' : 'Add New Project'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Project Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                  {formData.name && (
                    <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                      URL: <code>/projects/{generateSlug(formData.name)}</code>
                    </p>
                  )}
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Location *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                    style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>State *</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    required
                    style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    required
                    style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}
                  >
                    <option value="Resorts">Resorts</option>
                    <option value="Villas">Villas</option>
                    <option value="Pavilions & Commercial">Pavilions & Commercial</option>
                    <option value="Rammed Earth">Rammed Earth</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Year *</label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    required
                    style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Duration *</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                    placeholder="e.g., 4 months"
                    style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Size *</label>
                  <input
                    type="text"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    required
                    placeholder="e.g., 2,400 sq ft"
                    style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
              </div>

              <div style={{ marginTop: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ marginTop: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="e.g., Eco Resort, Airbnb, River-facing"
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>

              <div style={{ marginTop: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>
                  Cover Image {!editingProject && '*'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                  required={!editingProject}
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  Images will be automatically compressed to max 1MB
                </p>
              </div>

              <div style={{ marginTop: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Gallery Images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setGalleryImages(Array.from(e.target.files || []))}
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>

              <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
                <button
                  type="submit"
                  disabled={uploading}
                  className="pill-btn primary"
                  style={{ padding: '14px 32px' }}
                >
                  {uploading ? 'Saving...' : editingProject ? 'Update Project' : 'Create Project'}
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

        <div style={{ display: 'grid', gap: '24px' }}>
          {projects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ backgroundColor: 'var(--color-ivory)', padding: '24px', borderRadius: '8px', display: 'flex', gap: '24px' }}
            >
              <img
                src={project.cover_image}
                alt={project.name}
                style={{ width: '200px', height: '150px', objectFit: 'cover', borderRadius: '4px' }}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '24px', marginBottom: '8px' }}>{project.name}</h3>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                  {project.location} • {project.type} • {project.year}
                </p>
                <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                  {project.description.substring(0, 150)}...
                </p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => handleEdit(project)}
                    className="pill-btn"
                    style={{ padding: '8px 16px', fontSize: '14px' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    style={{ padding: '8px 16px', fontSize: '14px', backgroundColor: '#fee', color: '#c00', border: 'none', borderRadius: '99px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
