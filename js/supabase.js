// ============================================
// Supabase Client Configuration
// ============================================

const SUPABASE_URL = 'https://imgpbjtqribcvvjhuoxu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltZ3BianRxcmliY3Z2amh1b3h1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxMTEyNzEsImV4cCI6MjA4NDY4NzI3MX0.OxDxyXNg4bi59Bm9U36gOFUhtY_Ze7q1IQSIgcU3CSg';

// Initialize Supabase Client
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other files
window.supabaseClient = supabaseClient;

/**
 * Recovery/Invite Link Redirector
 * If user lands on a page with #access_token=...&type=recovery, move them to reset-password.html
 * This handles cases where Supabase redirects to the Site URL (homepage) instead of the specific redirectTo URL
 */
(function () {
    const hash = window.location.hash;
    const search = window.location.search;
    const path = window.location.pathname;

    // Detect recovery/invite in hash OR search
    const isAuthRequest = (hash + search).includes('type=recovery') ||
        (hash + search).includes('type=invite') ||
        (hash + search).includes('access_token=') ||
        (hash + search).includes('error_description=');

    if (isAuthRequest) {
        // Only redirect if NOT already on the reset-password page
        if (!path.includes('reset-password')) {
            console.log('Auth action detected, redirecting to reset-password.html...');
            const target = 'reset-password.html' + hash + search;
            window.location.href = target;
        }
    }
})();
