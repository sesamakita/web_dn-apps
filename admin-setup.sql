-- ============================================
-- DN Apps - Admin Dashboard Setup
-- Run this SQL in Supabase SQL Editor
-- ============================================

-- 1. Add role to profiles
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='role') THEN
        ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'user';
    END IF;
END $$;

-- 2. Create Services table
CREATE TABLE IF NOT EXISTS services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    caption TEXT, -- e.g. "01"
    features JSONB DEFAULT '[]', -- List of features
    tech_stack JSONB DEFAULT '[]', -- List of tech stack (name/icon)
    image_url TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Portfolio table
CREATE TABLE IF NOT EXISTS portfolio (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT, -- Slug for filtering (e.g. 'web', 'mobile')
    category_display TEXT, -- Display name (e.g. 'Web Development')
    description TEXT,
    tech_stack JSONB DEFAULT '[]', -- Array of tags
    image_url TEXT,
    project_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Blogs table
CREATE TABLE IF NOT EXISTS blogs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT,
    excerpt TEXT,
    category TEXT,
    author_name TEXT,
    author_avatar_url TEXT,
    image_url TEXT,
    status TEXT DEFAULT 'draft', -- 'draft' or 'published'
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies - PUBLIC READ
DROP POLICY IF EXISTS "Public can view services" ON services;
CREATE POLICY "Public can view services" ON services FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view portfolio" ON portfolio;
CREATE POLICY "Public can view portfolio" ON portfolio FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view published blogs" ON blogs;
CREATE POLICY "Public can view published blogs" ON blogs FOR SELECT USING (status = 'published' OR (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')));

-- 7. RLS Policies - ADMIN CRUD
-- Note: Replace 'admin' with your role check logic
DROP POLICY IF EXISTS "Admins can manage services" ON services;
CREATE POLICY "Admins can manage services" ON services 
FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admins can manage portfolio" ON portfolio;
CREATE POLICY "Admins can manage portfolio" ON portfolio 
FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admins can manage blogs" ON blogs;
CREATE POLICY "Admins can manage blogs" ON blogs 
FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- 8. Storage Buckets (Run this via Supabase UI or API)
-- Bucket: 'content', Public: true
