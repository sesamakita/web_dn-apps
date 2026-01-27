-- ========================================
-- DN Apps - Web Analytics Setup
-- ========================================
-- Tables untuk tracking page views dan visitor sessions

-- 1. Create visitor_sessions table
CREATE TABLE IF NOT EXISTS public.visitor_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT UNIQUE NOT NULL,
    first_seen TIMESTAMPTZ DEFAULT NOW(),
    last_seen TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create page_views table
CREATE TABLE IF NOT EXISTS public.page_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    page_path TEXT NOT NULL,
    page_title TEXT,
    referrer TEXT,
    browser TEXT,
    device_type TEXT,
    screen_width INTEGER,
    screen_height INTEGER,
    viewed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON public.page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_page_path ON public.page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_page_views_viewed_at ON public.page_views(viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_session_id ON public.visitor_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_last_seen ON public.visitor_sessions(last_seen DESC);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.visitor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies

-- Allow anonymous users to INSERT their own page views
CREATE POLICY "Allow anonymous insert on page_views"
ON public.page_views
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow anonymous users to INSERT visitor sessions
CREATE POLICY "Allow anonymous insert on visitor_sessions"
ON public.visitor_sessions
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow anonymous users to UPDATE their own sessions (for last_seen)
CREATE POLICY "Allow anonymous update on visitor_sessions"
ON public.visitor_sessions
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

-- Allow authenticated users (admins) to SELECT all analytics data
CREATE POLICY "Allow authenticated select on page_views"
ON public.page_views
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated select on visitor_sessions"
ON public.visitor_sessions
FOR SELECT
TO authenticated
USING (true);

-- 6. Create a function to get analytics summary
CREATE OR REPLACE FUNCTION get_analytics_summary(
    start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days',
    end_date TIMESTAMPTZ DEFAULT NOW()
)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_page_views', (
            SELECT COUNT(*) 
            FROM page_views 
            WHERE viewed_at BETWEEN start_date AND end_date
        ),
        'unique_visitors', (
            SELECT COUNT(DISTINCT session_id) 
            FROM page_views 
            WHERE viewed_at BETWEEN start_date AND end_date
        ),
        'top_pages', (
            SELECT json_agg(row_to_json(t))
            FROM (
                SELECT 
                    page_path,
                    page_title,
                    COUNT(*) as views,
                    COUNT(DISTINCT session_id) as unique_visitors
                FROM page_views
                WHERE viewed_at BETWEEN start_date AND end_date
                GROUP BY page_path, page_title
                ORDER BY views DESC
                LIMIT 10
            ) t
        ),
        'device_stats', (
            SELECT json_agg(row_to_json(t))
            FROM (
                SELECT 
                    device_type,
                    COUNT(*) as count
                FROM page_views
                WHERE viewed_at BETWEEN start_date AND end_date
                GROUP BY device_type
            ) t
        ),
        'daily_views', (
            SELECT json_agg(row_to_json(t))
            FROM (
                SELECT 
                    DATE(viewed_at) as date,
                    COUNT(*) as views,
                    COUNT(DISTINCT session_id) as unique_visitors
                FROM page_views
                WHERE viewed_at BETWEEN start_date AND end_date
                GROUP BY DATE(viewed_at)
                ORDER BY date DESC
            ) t
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_analytics_summary(TIMESTAMPTZ, TIMESTAMPTZ) TO authenticated;

-- 7. Create function to get active users (last 5 minutes)
CREATE OR REPLACE FUNCTION get_active_users()
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(DISTINCT session_id)
        FROM page_views
        WHERE viewed_at > NOW() - INTERVAL '5 minutes'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION get_active_users() TO authenticated;

-- ========================================
-- Setup Complete!
-- ========================================
-- Next steps:
-- 1. Run this script in your Supabase SQL Editor
-- 2. Verify tables are created in Table Editor
-- 3. Deploy the tracking script to your website
