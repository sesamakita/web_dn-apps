/**
 * Theme Module
 * Handles dark/light mode toggle with system preference detection
 */

export function initTheme() {
    const themeToggles = document.querySelectorAll('.theme-toggle');
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

        // Update toggle button icons for all toggles
        updateToggleIcons(theme);
    }

    // Update toggle button icons for all theme toggles
    function updateToggleIcons(theme) {
        themeToggles.forEach(toggle => {
            const moonIcon = toggle.querySelector('.icon-moon');
            const sunIcon = toggle.querySelector('.icon-sun');

            if (theme === 'dark') {
                moonIcon?.style.setProperty('display', 'none');
                sunIcon?.style.setProperty('display', 'block');
            } else {
                moonIcon?.style.setProperty('display', 'block');
                sunIcon?.style.setProperty('display', 'none');
            }
        });
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

    // Event listeners for all theme toggles
    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', toggleTheme);
    });
    prefersDarkScheme.addEventListener('change', handleSystemThemeChange);

    // Initialize theme
    applyTheme(getStoredTheme());
}
