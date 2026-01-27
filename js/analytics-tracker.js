/**
 * DN Apps - Analytics Tracker
 * Custom page view tracking with Supabase
 */

(function () {
    'use strict';

    // Configuration
    const SESSION_KEY = 'dn_analytics_session';
    const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes

    /**
     * Get or create session ID
     */
    function getSessionId() {
        let session = localStorage.getItem(SESSION_KEY);
        const now = Date.now();

        if (session) {
            try {
                const sessionData = JSON.parse(session);
                // Check if session is still valid
                if (now - sessionData.lastActivity < SESSION_DURATION) {
                    // Update last activity
                    sessionData.lastActivity = now;
                    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
                    return sessionData.id;
                }
            } catch (e) {
                console.error('Error parsing session:', e);
            }
        }

        // Create new session
        const newSessionId = generateSessionId();
        const newSession = {
            id: newSessionId,
            lastActivity: now
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
        return newSessionId;
    }

    /**
     * Generate unique session ID
     */
    function generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Detect device type
     */
    function getDeviceType() {
        const ua = navigator.userAgent;
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            return 'tablet';
        }
        if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
            return 'mobile';
        }
        return 'desktop';
    }

    /**
     * Get browser name
     */
    function getBrowserName() {
        const ua = navigator.userAgent;
        let browser = 'Unknown';

        if (ua.indexOf('Firefox') > -1) browser = 'Firefox';
        else if (ua.indexOf('SamsungBrowser') > -1) browser = 'Samsung Browser';
        else if (ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1) browser = 'Opera';
        else if (ua.indexOf('Trident') > -1) browser = 'IE';
        else if (ua.indexOf('Edge') > -1) browser = 'Edge';
        else if (ua.indexOf('Chrome') > -1) browser = 'Chrome';
        else if (ua.indexOf('Safari') > -1) browser = 'Safari';

        return browser;
    }

    /**
     * Track page view
     */
    async function trackPageView() {
        // Check if Supabase is available
        if (typeof supabaseClient === 'undefined') {
            console.warn('Analytics: Supabase client not initialized');
            return;
        }

        try {
            const sessionId = getSessionId();
            const pageData = {
                session_id: sessionId,
                page_path: window.location.pathname,
                page_title: document.title,
                referrer: document.referrer || 'direct',
                browser: getBrowserName(),
                device_type: getDeviceType(),
                screen_width: window.screen.width,
                screen_height: window.screen.height,
                viewed_at: new Date().toISOString()
            };

            // Insert page view
            const { error: pageViewError } = await supabaseClient
                .from('page_views')
                .insert([pageData]);

            if (pageViewError) {
                console.error('Analytics tracking error:', pageViewError);
                return;
            }

            // Update or insert visitor session
            const { data: existingSession } = await supabaseClient
                .from('visitor_sessions')
                .select('id')
                .eq('session_id', sessionId)
                .single();

            if (existingSession) {
                // Update last_seen
                await supabaseClient
                    .from('visitor_sessions')
                    .update({ last_seen: new Date().toISOString() })
                    .eq('session_id', sessionId);
            } else {
                // Insert new session
                await supabaseClient
                    .from('visitor_sessions')
                    .insert([{
                        session_id: sessionId,
                        first_seen: new Date().toISOString(),
                        last_seen: new Date().toISOString()
                    }]);
            }

            console.log('Analytics: Page view tracked successfully');
        } catch (error) {
            console.error('Analytics tracking error:', error);
        }
    }

    /**
     * Initialize tracking on page load
     */
    function initAnalytics() {
        // Wait for Supabase to be ready
        if (typeof supabaseClient === 'undefined') {
            // Retry after a short delay
            setTimeout(initAnalytics, 500);
            return;
        }

        // Track page view
        trackPageView();

        // Track single page app navigation (if applicable)
        // Listen for URL changes
        let lastUrl = window.location.href;
        const observer = new MutationObserver(() => {
            if (lastUrl !== window.location.href) {
                lastUrl = window.location.href;
                trackPageView();
            }
        });

        observer.observe(document.querySelector('body'), {
            childList: true,
            subtree: true
        });
    }

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAnalytics);
    } else {
        initAnalytics();
    }

    // Export for manual tracking if needed
    window.dnAnalytics = {
        trackPageView: trackPageView
    };
})();
