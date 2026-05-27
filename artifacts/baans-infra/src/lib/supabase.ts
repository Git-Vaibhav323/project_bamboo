import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Only create the client when credentials are present.
// Pages that use supabase will gracefully fall back to static data when it's null.
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database types
export interface Project {
  id: string;
  slug: string;
  name: string;
  location: string;
  state: string;
  type: string;
  year: string;
  duration: string;
  size: string;
  description: string;
  cover_image: string;
  gallery_images: string[];
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  budget?: string;
  source: 'contact_page' | 'home_page';
  status: 'new' | 'read' | 'replied' | 'archived';
  created_at: string;
  updated_at: string;
}
