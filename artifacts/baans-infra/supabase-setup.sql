-- =====================================================
-- BAANS INFRA - Supabase Database Setup
-- =====================================================
-- Safe to re-run: uses IF NOT EXISTS / DROP IF EXISTS
-- throughout so running this twice won't error.
-- =====================================================


-- =====================================================
-- 1. PROJECTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    location TEXT,
    state TEXT,
    type TEXT,
    year TEXT,
    duration TEXT,
    size TEXT,
    description TEXT,
    cover_image TEXT DEFAULT '',
    gallery_images TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Drop old CHECK constraint if it exists (from previous schema)
ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS projects_type_check;
-- Make previously NOT NULL columns nullable (safe to run on existing table)
ALTER TABLE public.projects ALTER COLUMN location DROP NOT NULL;
ALTER TABLE public.projects ALTER COLUMN state DROP NOT NULL;
ALTER TABLE public.projects ALTER COLUMN type DROP NOT NULL;
ALTER TABLE public.projects ALTER COLUMN year DROP NOT NULL;
ALTER TABLE public.projects ALTER COLUMN duration DROP NOT NULL;
ALTER TABLE public.projects ALTER COLUMN size DROP NOT NULL;
ALTER TABLE public.projects ALTER COLUMN description DROP NOT NULL;
ALTER TABLE public.projects ALTER COLUMN cover_image DROP NOT NULL;

CREATE INDEX IF NOT EXISTS idx_projects_slug       ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_type       ON public.projects(type);
CREATE INDEX IF NOT EXISTS idx_projects_state      ON public.projects(state);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to projects"          ON public.projects;
DROP POLICY IF EXISTS "Allow authenticated users to insert projects"  ON public.projects;
DROP POLICY IF EXISTS "Allow authenticated users to update projects"  ON public.projects;
DROP POLICY IF EXISTS "Allow authenticated users to delete projects"  ON public.projects;

CREATE POLICY "Allow public read access to projects"
    ON public.projects FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated users to insert projects"
    ON public.projects FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update projects"
    ON public.projects FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete projects"
    ON public.projects FOR DELETE TO authenticated USING (true);


-- =====================================================
-- 2. TEAM MEMBERS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    bio TEXT NOT NULL,
    image TEXT NOT NULL,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_team_members_order ON public.team_members("order");

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to team members"          ON public.team_members;
DROP POLICY IF EXISTS "Allow authenticated users to insert team members"  ON public.team_members;
DROP POLICY IF EXISTS "Allow authenticated users to update team members"  ON public.team_members;
DROP POLICY IF EXISTS "Allow authenticated users to delete team members"  ON public.team_members;

CREATE POLICY "Allow public read access to team members"
    ON public.team_members FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated users to insert team members"
    ON public.team_members FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update team members"
    ON public.team_members FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete team members"
    ON public.team_members FOR DELETE TO authenticated USING (true);


-- =====================================================
-- 3. CONTACT SUBMISSIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    message TEXT NOT NULL,
    budget TEXT,                          -- from home page form
    source TEXT DEFAULT 'contact_page',   -- 'contact_page' | 'home_page'
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add new columns if table already exists (safe to run on existing DB)
ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS budget TEXT;
ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'contact_page';

CREATE INDEX IF NOT EXISTS idx_contact_submissions_status     ON public.contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON public.contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email      ON public.contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_source     ON public.contact_submissions(source);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anyone to submit contact form"            ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated users to read submissions"  ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated users to update submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated users to delete submissions" ON public.contact_submissions;

CREATE POLICY "Allow anyone to submit contact form"
    ON public.contact_submissions FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read submissions"
    ON public.contact_submissions FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to update submissions"
    ON public.contact_submissions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete submissions"
    ON public.contact_submissions FOR DELETE TO authenticated USING (true);


-- =====================================================
-- 4. UPDATED_AT TRIGGER
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON public.projects;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.team_members;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.team_members
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.contact_submissions;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.contact_submissions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- =====================================================
-- 4A. FEATURED ON / MEDIA FEATURES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.media_features (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    publication TEXT NOT NULL,
    category TEXT DEFAULT '',
    url TEXT DEFAULT '',
    logo_url TEXT DEFAULT '',
    excerpt TEXT DEFAULT '',
    published_at DATE,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_media_features_order ON public.media_features("order");

ALTER TABLE public.media_features ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to media features"          ON public.media_features;
DROP POLICY IF EXISTS "Allow authenticated users to insert media features"  ON public.media_features;
DROP POLICY IF EXISTS "Allow authenticated users to update media features"  ON public.media_features;
DROP POLICY IF EXISTS "Allow authenticated users to delete media features"  ON public.media_features;

CREATE POLICY "Allow public read access to media features"
    ON public.media_features FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated users to insert media features"
    ON public.media_features FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update media features"
    ON public.media_features FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete media features"
    ON public.media_features FOR DELETE TO authenticated USING (true);

DROP TRIGGER IF EXISTS set_updated_at ON public.media_features;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.media_features
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- =====================================================
-- 4B. BLOGS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image TEXT DEFAULT '',
    author TEXT DEFAULT 'BAANS INFRA Studio',
    category TEXT DEFAULT '',
    published_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_published_at ON public.blogs(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_is_published ON public.blogs(is_published);

ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to published blogs" ON public.blogs;
DROP POLICY IF EXISTS "Allow authenticated users to read all blogs" ON public.blogs;
DROP POLICY IF EXISTS "Allow authenticated users to insert blogs"   ON public.blogs;
DROP POLICY IF EXISTS "Allow authenticated users to update blogs"   ON public.blogs;
DROP POLICY IF EXISTS "Allow authenticated users to delete blogs"   ON public.blogs;

CREATE POLICY "Allow public read access to published blogs"
    ON public.blogs FOR SELECT TO public USING (is_published = true);

CREATE POLICY "Allow authenticated users to read all blogs"
    ON public.blogs FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert blogs"
    ON public.blogs FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update blogs"
    ON public.blogs FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete blogs"
    ON public.blogs FOR DELETE TO authenticated USING (true);

DROP TRIGGER IF EXISTS set_updated_at ON public.blogs;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.blogs
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- =====================================================
-- 4C. SITE SETTINGS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to site settings"          ON public.site_settings;
DROP POLICY IF EXISTS "Allow authenticated users to insert site settings"  ON public.site_settings;
DROP POLICY IF EXISTS "Allow authenticated users to update site settings"  ON public.site_settings;
DROP POLICY IF EXISTS "Allow authenticated users to delete site settings"  ON public.site_settings;

CREATE POLICY "Allow public read access to site settings"
    ON public.site_settings FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated users to insert site settings"
    ON public.site_settings FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update site settings"
    ON public.site_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete site settings"
    ON public.site_settings FOR DELETE TO authenticated USING (true);

DROP TRIGGER IF EXISTS set_updated_at ON public.site_settings;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.site_settings
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- =====================================================
-- 4D. INSTAGRAM GALLERY TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.instagram_gallery (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    image_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

DO $$
BEGIN
    IF to_regclass('public.instagram_posts') IS NOT NULL THEN
        INSERT INTO public.instagram_gallery (image_url, display_order, is_active)
        SELECT old_posts.image_url, old_posts.display_order, old_posts.is_active
        FROM public.instagram_posts AS old_posts
        WHERE old_posts.image_url IS NOT NULL
          AND NOT EXISTS (
              SELECT 1
              FROM public.instagram_gallery
              WHERE public.instagram_gallery.image_url = old_posts.image_url
          );
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_instagram_gallery_active_order
    ON public.instagram_gallery(is_active, display_order);

ALTER TABLE public.instagram_gallery ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read active instagram gallery" ON public.instagram_gallery;
DROP POLICY IF EXISTS "Authenticated users manage instagram gallery" ON public.instagram_gallery;

CREATE POLICY "Public can read active instagram gallery"
    ON public.instagram_gallery FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users manage instagram gallery"
    ON public.instagram_gallery FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- =====================================================
-- 5. STORAGE BUCKETS
-- =====================================================
-- Create these manually in Supabase Dashboard > Storage:
--
--   Bucket name : project-images   Public: YES
--   Bucket name : team-images      Public: YES
--
-- Then run section 6 below.


-- =====================================================
-- 6. STORAGE POLICIES
-- =====================================================

-- project-images
DROP POLICY IF EXISTS "Public read access for project images"            ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload project images"    ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update project images"    ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete project images"    ON storage.objects;

CREATE POLICY "Public read access for project images"
    ON storage.objects FOR SELECT TO public
    USING (bucket_id = 'project-images');

CREATE POLICY "Authenticated users can upload project images"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'project-images');

CREATE POLICY "Authenticated users can update project images"
    ON storage.objects FOR UPDATE TO authenticated
    USING (bucket_id = 'project-images');

CREATE POLICY "Authenticated users can delete project images"
    ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'project-images');

-- team-images
DROP POLICY IF EXISTS "Public read access for team images"            ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload team images"    ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update team images"    ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete team images"    ON storage.objects;

CREATE POLICY "Public read access for team images"
    ON storage.objects FOR SELECT TO public
    USING (bucket_id = 'team-images');

CREATE POLICY "Authenticated users can upload team images"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'team-images');

CREATE POLICY "Authenticated users can update team images"
    ON storage.objects FOR UPDATE TO authenticated
    USING (bucket_id = 'team-images');

CREATE POLICY "Authenticated users can delete team images"
    ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'team-images');


-- =====================================================
-- 7. SAMPLE DATA
-- =====================================================

INSERT INTO public.team_members (name, role, bio, image, "order")
VALUES (
    'Chandan Kasturwar',
    'Founder & Chief Architect',
    'Studied bamboo construction in Bali and Kerala. Believes a building should feel like a place, not a product. With over 10 years of experience in sustainable architecture, Chandan has pioneered bamboo construction techniques across India.',
    'https://picsum.photos/seed/chandan/400/400',
    0
) ON CONFLICT DO NOTHING;


-- =====================================================
-- SETUP INSTRUCTIONS
-- =====================================================
--
-- 1. Create a Supabase project at https://supabase.com
-- 2. Go to SQL Editor and run this entire script
-- 3. Go to Storage and create two PUBLIC buckets:
--      project-images
--      team-images
-- 4. Go to Authentication > Users > Add User (your admin)
-- 5. Go to Settings > API, copy Project URL + anon key
-- 6. Create .env in the project root:
--      VITE_SUPABASE_URL=your_project_url
--      VITE_SUPABASE_ANON_KEY=your_anon_key
-- 7. pnpm install && pnpm dev
-- 8. Visit /admin and log in
-- =====================================================
