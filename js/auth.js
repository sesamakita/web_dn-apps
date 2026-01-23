// ============================================
// Authentication Helper Functions
// ============================================

/**
 * Check if user is currently logged in
 * @returns {Promise<object|null>} User object or null
 */
async function getUser() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    return user;
}

/**
 * Get current session
 * @returns {Promise<object|null>} Session object or null
 */
async function getSession() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    return session;
}

/**
 * Sign up with email and password
 * @param {string} email 
 * @param {string} password 
 * @param {object} metadata - Additional user data (first_name, last_name, phone)
 * @returns {Promise<object>} Result object with data or error
 */
async function signUp(email, password, metadata = {}) {
    const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
            data: metadata
        }
    });

    if (error) {
        return { success: false, error: error.message };
    }

    // Create profile entry
    if (data.user) {
        await supabaseClient.from('profiles').insert({
            id: data.user.id,
            first_name: metadata.first_name || '',
            last_name: metadata.last_name || '',
            phone: metadata.phone || ''
        });
    }

    return { success: true, data };
}

/**
 * Sign in with email and password
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<object>} Result object with data or error
 */
async function signIn(email, password) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true, data };
}

/**
 * Sign out current user
 * @returns {Promise<object>} Result object
 */
async function signOut() {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}

/**
 * Require authentication - redirect to login if not authenticated
 * @param {string} redirectUrl - URL to redirect after login
 */
async function requireAuth(redirectUrl = 'login.html') {
    const user = await getUser();
    if (!user) {
        window.location.href = redirectUrl;
        return false;
    }
    return true;
}

/**
 * Redirect if already authenticated
 * @param {string} redirectUrl - URL to redirect to
 */
async function redirectIfAuthenticated(redirectUrl = 'dashboard.html') {
    const user = await getUser();
    if (user) {
        window.location.href = redirectUrl;
        return true;
    }
    return false;
}

/**
 * Get user profile from profiles table
 * @returns {Promise<object|null>} Profile object or null
 */
async function getUserProfile() {
    const user = await getUser();
    if (!user) return null;

    const { data, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error) {
        console.error('Error fetching profile:', error);
        return null;
    }

    return data;
}

/**
 * Update user profile
 * @param {object} updates - Fields to update
 * @returns {Promise<object>} Result object
 */
async function updateProfile(updates) {
    const user = await getUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const { data, error } = await supabaseClient
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true, data };
}

/**
 * Submit contact form to database
 * @param {object} contactData - Contact form data
 * @returns {Promise<object>} Result object
 */
async function submitContact(contactData) {
    const { data, error } = await supabaseClient
        .from('contacts')
        .insert(contactData)
        .select()
        .single();

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true, data };
}

// Listen for auth state changes
supabaseClient.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event);

    // Update UI based on auth state
    updateAuthUI(session?.user);
});

/**
 * Update UI elements based on authentication state
 * @param {object|null} user - User object or null
 */
function updateAuthUI(user) {
    const loginBtn = document.querySelector('.btn-login');
    const signupBtn = document.querySelector('.btn-signup');
    const userMenu = document.querySelector('.user-menu');

    if (user) {
        // User is logged in
        if (loginBtn) loginBtn.style.display = 'none';
        if (signupBtn) signupBtn.textContent = 'Dashboard';
        if (signupBtn) signupBtn.href = 'dashboard.html';
    } else {
        // User is not logged in
        if (loginBtn) loginBtn.style.display = '';
        if (signupBtn) signupBtn.textContent = 'Daftar';
        if (signupBtn) signupBtn.href = 'signup.html';
    }
}

// Initialize auth UI on page load
document.addEventListener('DOMContentLoaded', async () => {
    const user = await getUser();
    updateAuthUI(user);
});
