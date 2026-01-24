-- ============================================
-- SEED DATA: Migrasi Konten Statis ke Database
-- ============================================

-- 1. Bersihkan data lama (Opsional - Hati-hati!)
-- DELETE FROM public.services;
-- DELETE FROM public.portfolio;
-- DELETE FROM public.blogs;

-- 2. Masukkan Data Services (Layanan)
INSERT INTO public.services (caption, title, description, image_url) VALUES
('01', 'Web Development', 'Kami membangun website dan aplikasi web modern yang responsif, cepat, dan SEO-friendly. Dari landing page hingga aplikasi enterprise kompleks.', 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&h=400&fit=crop'),
('02', 'Mobile App Development', 'Aplikasi mobile native dan cross-platform untuk iOS dan Android. Performa tinggi dengan user experience yang optimal.', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop'),
('03', 'UI/UX Design', 'Desain yang tidak hanya indah, tetapi juga fungsional. Kami fokus pada pengalaman pengguna yang optimal untuk meningkatkan konversi.', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop'),
('04', 'Cloud Services', 'Infrastruktur cloud yang scalable, aman, dan andal. Dari deployment hingga maintenance, kami handle semuanya.', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop');

-- 3. Masukkan Data Portfolio (Proyek)
INSERT INTO public.portfolio (title, category, category_display, image_url) VALUES
('TechStore E-Commerce', 'ecommerce', 'E-Commerce', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop'),
('HealthCare Mobile App', 'mobile', 'Mobile App', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop'),
('Business Analytics Dashboard', 'web', 'Web App', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop'),
('Mobile Banking Redesign', 'uiux', 'UI/UX Design', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop'),
('Corporate Website Redesign', 'web', 'Website', 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop'),
('Digital Wallet App', 'mobile', 'Fintech', 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=600&h=400&fit=crop'),
('Fashion Marketplace', 'ecommerce', 'E-Commerce', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop'),
('Travel Booking App Design', 'uiux', 'UI/UX Design', 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600&h=400&fit=crop'),
('News & Media Portal', 'web', 'Web App', 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&h=400&fit=crop'),
('Fitness Tracker App', 'mobile', 'Mobile App', 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&h=400&fit=crop'),
('Food Delivery Platform', 'ecommerce', 'E-Commerce', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop'),
('HR Management System', 'web', 'Web App', 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&h=400&fit=crop'),
('Social Media App Redesign', 'uiux', 'UI/UX Design', 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&h=400&fit=crop'),
('E-Learning Platform', 'mobile', 'Mobile App', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop'),
('Online Grocery Store', 'ecommerce', 'E-Commerce', 'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=600&h=400&fit=crop');

-- 4. Masukkan Data Blog (Artikel)
INSERT INTO public.blogs (title, slug, category, excerpt, content, image_url, status, published_at) VALUES
('Bagaimana AI Mengubah Cara Bisnis Beroperasi di 2026', 'ai-bisnis-2026', 'AI & Technology', 'Artificial Intelligence bukan lagi teknologi masa depan. Pelajari bagaimana bisnis di Indonesia sudah memanfaatkan AI...', 'Konten lengkap mengenai AI di bisnis di sini...', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop', 'published', NOW()),
('Apa yang Baru di React 19?', 'react-19-new-features', 'Web Development', 'Fitur-fitur terbaru React 19 yang wajib Anda ketahui untuk pengembangan aplikasi modern.', 'Konten lengkap mengenai React 19 di sini...', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop', 'published', NOW()),
('Flutter vs React Native: Mana yang Lebih Baik?', 'flutter-vs-react-native', 'Mobile App', 'Perbandingan mendalam antara dua framework mobile development terpopuler.', 'Konten perbandingan lengkap...', 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=250&fit=crop', 'published', NOW()),
('Trend Desain UI 2026 yang Wajib Diketahui', 'ui-trend-2026', 'UI/UX', 'Dari glassmorphism hingga 3D elements, ini dia trend desain tahun ini.', 'Konten desain sistem...', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop', 'published', NOW()),
('Migrasi ke Cloud: Panduan untuk UMKM', 'cloud-umkm-guide', 'Cloud', 'Langkah-langkah praktis untuk memindahkan bisnis Anda ke cloud.', 'Konten cloud guide...', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop', 'published', NOW()),
('Belajar TypeScript dari Nol', 'typescript-basic-guide', 'Tutorial', 'Tutorial lengkap TypeScript untuk pemula yang ingin upgrade skill.', 'Isi materi TS...', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop', 'published', NOW()),
('Membangun E-Commerce dengan Next.js', 'ecommerce-nextjs-tutorial', 'Web Development', 'Panduan membangun toko online modern dengan performa tinggi.', 'Materi Next.js...', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop', 'published', NOW());
