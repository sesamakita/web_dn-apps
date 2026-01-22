/**
 * Navigation Module
 * Handles mobile menu, dropdowns, sticky header, and active states
 */

export function initNavigation() {
    const header = document.querySelector('.header');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileNav = document.querySelector('.nav-mobile');
    const navOverlay = document.querySelector('.nav-overlay');
    const mobileMenuItems = document.querySelectorAll('.nav-mobile-item');

    // Sticky header on scroll
    function handleScroll() {
        if (window.scrollY > 50) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }

        // Update scroll progress
        updateScrollProgress();
    }

    // Toggle mobile menu
    function toggleMobileMenu() {
        mobileToggle?.classList.toggle('active');
        mobileNav?.classList.toggle('active');
        navOverlay?.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    }

    // Close mobile menu
    function closeMobileMenu() {
        mobileToggle?.classList.remove('active');
        mobileNav?.classList.remove('active');
        navOverlay?.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    // Toggle mobile submenu
    function toggleSubmenu(item) {
        item.classList.toggle('open');
    }

    // Scroll progress indicator
    function updateScrollProgress() {
        const scrollProgress = document.querySelector('.scroll-progress');
        if (!scrollProgress) return;

        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;

        scrollProgress.style.width = scrolled + '%';
    }

    // Smooth scroll for anchor links
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    closeMobileMenu();

                    const headerHeight = header?.offsetHeight || 80;
                    const targetPosition = target.offsetTop - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Set active nav item based on current page
    function setActiveNav() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link, .nav-mobile-link');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath || (href === 'index.html' && currentPath === '/')) {
                link.classList.add('active');
            }
        });
    }

    // Event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    mobileToggle?.addEventListener('click', toggleMobileMenu);
    navOverlay?.addEventListener('click', closeMobileMenu);

    // Mobile submenu toggles
    mobileMenuItems.forEach(item => {
        const link = item.querySelector('.nav-mobile-link');
        if (item.querySelector('.nav-mobile-submenu')) {
            link?.addEventListener('click', (e) => {
                e.preventDefault();
                toggleSubmenu(item);
            });
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });

    // Initialize
    handleScroll();
    initSmoothScroll();
    setActiveNav();
}
