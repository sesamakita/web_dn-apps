-- ============================================
-- Promote User to Admin
-- Ganti 'EMAIL_ANDA' dengan email yang ingin Anda jadikan Admin
-- ============================================

UPDATE profiles 
SET role = 'admin' 
WHERE id IN (
    SELECT id 
    FROM auth.users 
    WHERE email = 'deniindrayana@gmail.com'
);

-- Verifikasi perubahan:
-- SELECT p.role, u.email 
-- FROM profiles p 
-- JOIN auth.users u ON p.id = u.id 
-- WHERE u.email = 'EMAIL_ANDA';
