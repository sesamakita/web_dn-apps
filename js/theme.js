/**
 * Theme Module
 * Handles dark/light mode toggle with system preference detection
 */

export function initTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    // Get stored theme or system preference
    function getStoredTheme() {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            return storedTheme;
        }
        return prefersDarkScheme.matches ? 'dark' : 'light';
    }

    // Apply theme to document
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        // Update toggle button icon
        updateToggleIcon(theme);
    }

    // Update toggle button icon
    function updateToggleIcon(theme) {
        const moonIcon = themeToggle?.querySelector('.icon-moon');
        const sunIcon = themeToggle?.querySelector('.icon-sun');

        if (theme === 'dark') {
            moonIcon?.style.setProperty('display', 'none');
            sunIcon?.style.setProperty('display', 'block');
        } else {
            moonIcon?.style.setProperty('display', 'block');
            sunIcon?.style.setProperty('display', 'none');
        }
    }

    // Toggle theme
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    }

    // Listen for system preference changes
    function handleSystemThemeChange(e) {
        // Only apply if no stored preference
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    }

    // Event listeners
    themeToggle?.addEventListener('click', toggleTheme);
    prefersDarkScheme.addEventListener('change', handleSystemThemeChange);

    // Initialize theme
    applyTheme(getStoredTheme());
}
