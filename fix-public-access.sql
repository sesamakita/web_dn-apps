-- 1. Grant Schema Usage
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT USAGE ON SCHEMA public TO postgres;

-- 2. Grant Table Selects
GRANT SELECT ON public.services TO anon, authenticated;
GRANT SELECT ON public.portfolio TO anon, authenticated;
GRANT SELECT ON public.blogs TO anon, authenticated;
GRANT SELECT ON public.profiles TO anon, authenticated;

-- 3. Reset RLS Policies
-- Services
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view services" ON public.services;
CREATE POLICY "Public can view services" ON public.services FOR SELECT USING (true);

-- Portfolio
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view portfolio" ON public.portfolio;
CREATE POLICY "Public can view portfolio" ON public.portfolio FOR SELECT USING (true);

-- Blogs
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view published blogs" ON public.blogs;
CREATE POLICY "Public can view published blogs" ON public.blogs 
FOR SELECT USING (status = 'published' OR (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')));

-- 4. Enable Realtime if not already enabled
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        CREATE PUBLICATION supabase_realtime;
    END IF;
END $$;

-- 5. Add tables to realtime in a safer way
DO $$
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.contacts;
    EXCEPTION WHEN others THEN NULL;
    END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.blogs;
    EXCEPTION WHEN others THEN NULL;
    END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.services;
    EXCEPTION WHEN others THEN NULL;
    END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.portfolio;
    EXCEPTION WHEN others THEN NULL;
    END;
END $$;
