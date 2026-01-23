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
