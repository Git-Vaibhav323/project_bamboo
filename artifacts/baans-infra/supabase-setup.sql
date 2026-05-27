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
