// Global initialization
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Content Loader: Initializing dynamic fetching...');

    // Safety check for supabaseClient
    if (typeof supabaseClient === 'undefined') {
        console.error('Content Loader: supabaseClient is not defined!');
        const containers = ['servicesContainer', 'homeServicesList', 'portfolioList', 'homePortfolioList', 'blogList'];
        containers.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = '<p class="text-error">System Error: Unable to connect to data source.</p>';
        });
        return;
    }

    try {
        const results = await Promise.allSettled([
            loadDynamicServices(),
            loadDynamicPortfolio(),
            loadDynamicBlogs()
        ]);

        const errors = results.filter(r => r.status === 'rejected');
        if (errors.length > 0) {
            console.error('Content Loader: Some modules failed to load:', errors);
        } else {
            console.log('Content Loader: All modules fetched. Triggering animations...');
            if (window.initializeAnimations) {
                window.initializeAnimations();
            }

            const totalItems = (window.lastServiceCount || 0) + (window.lastProjectCount || 0) + (window.lastBlogCount || 0);
            if (totalItems === 0) {
                console.log('Content Loader: Connection successful, but tables are empty.');
            }
        }
    } catch (err) {
        console.error('Content Loader: Critical error during initialization:', err);
    }
});

/**
 * Load services and render them on the services.html page
 */
/**
 * Load services and render them on the services.html or index.html
 */
async function loadDynamicServices() {
    const detailContainer = document.getElementById('servicesContainer');
    const homeList = document.getElementById('homeServicesList');
    const tabsContainer = document.getElementById('servicesTabs');

    if (!detailContainer && !homeList) return;

    console.log('Content Loader: Fetching services...');
    const { data: services, error } = await supabaseClient
        .from('services')
        .select('*')
        .order('caption', { ascending: true });

    if (error) {
        console.error('Content Loader: Error fetching services:', error);
        const errHtml = `<div class="container py-20 text-center"><p class="text-error">Gagal memuat layanan: ${error.message}</p></div>`;
        if (detailContainer) detailContainer.innerHTML = errHtml;
        if (homeList) homeList.innerHTML = errHtml;
        return;
    }

    console.log(`Content Loader: Found ${services?.length || 0} services.`);

    // Handle index.html (Simple Cards)
    if (homeList && services && services.length > 0) {
        homeList.innerHTML = services.map((s, i) => `
            <div class="service-card reveal delay-${(i + 1) * 100}">
                <div class="service-card-icon">🌐</div>
                <h3>${s.title}</h3>
                <p>${(s.description || '').substring(0, 100)}${(s.description || '').length > 100 ? '...' : ''}</p>
                <a href="services.html#service-${s.id}" class="service-card-link">
                    Pelajari Lebih
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </a>
            </div>
        `).join('');
    }

    // Handle services.html (Detail Sections)
    if (detailContainer && services && services.length > 0) {
        detailContainer.innerHTML = '';
        if (tabsContainer) {
            tabsContainer.innerHTML = services.map((s, i) => `
                <a href="#service-${s.id}" class="services-tab ${i === 0 ? 'active' : ''}" data-target="service-${s.id}">
                    ${s.title}
                </a>
            `).join('');
        }

        detailContainer.innerHTML = services.map((service, index) => `
            <section class="service-detail ${index === 0 ? 'active' : ''}" id="service-${service.id}">
                <div class="container">
                    <div class="service-detail-grid">
                        <div class="service-detail-content reveal">
                            <span class="caption">${service.caption}</span>
                            <h3 class="animate-fade-in-up">${service.title}</h3>
                            <p class="lead">${service.description}</p>
                            <div class="mt-10">
                                <a href="contact.html" class="btn btn-primary btn-lg" style="box-shadow: var(--shadow-glow)">Konsultasi Gratis</a>
                            </div>
                        </div>
                        <div class="service-detail-visual reveal delay-100">
                            <div class="premium-image-wrapper">
                                <img src="${service.image_url || 'https://via.placeholder.com/600x400'}" alt="${service.title}" class="rounded-3xl shadow-2xl">
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `).join('');
        initServiceTabs();
        window.lastServiceCount = services.length;
    }

    if ((!services || services.length === 0) && !error) {
        const emptyHtml = '<div class="container py-20 text-center"><p>Belum ada data layanan.</p></div>';
        if (detailContainer) detailContainer.innerHTML = emptyHtml;
        if (homeList) homeList.innerHTML = emptyHtml;
    }
}

/**
 * Load portfolio and render on portfolio.html or index.html
 */
async function loadDynamicPortfolio() {
    const fullGrid = document.querySelector('.portfolio-grid');
    const homeList = document.getElementById('homePortfolioList');

    if (!fullGrid && !homeList) return;

    console.log('Content Loader: Fetching portfolio...');
    const { data: projects, error } = await supabaseClient
        .from('portfolio')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Content Loader: Error fetching portfolio:', error);
        const errHtml = `<p class="col-span-full text-center text-error">Error: ${error.message}</p>`;
        if (fullGrid) fullGrid.innerHTML = errHtml;
        if (homeList) homeList.innerHTML = errHtml;
        return;
    }

    const projectsToRender = homeList ? projects.slice(0, 3) : projects;
    const target = fullGrid || homeList;

    if (projectsToRender && projectsToRender.length > 0) {
        window.lastProjectCount = projectsToRender.length;
        target.innerHTML = projectsToRender.map((p, i) => `
            <div class="portfolio-card reveal delay-${(i % 3) * 100}" data-category="${p.category}">
                <div class="portfolio-card-image">
                    <img src="${p.image_url || 'https://via.placeholder.com/600x400'}" alt="${p.title}">
                </div>
                <div class="portfolio-card-overlay">
                    <div class="portfolio-card-content">
                        <span class="portfolio-card-category">${p.category_display}</span>
                        <h3 class="portfolio-card-title">${p.title}</h3>
                        <div class="portfolio-card-tech">
                            <span>Dynamic</span>
                            <span>Scalable</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    } else {
        target.innerHTML = '<p class="col-span-full text-center">Belum ada karya untuk ditampilkan.</p>';
    }
}

/**
 * Load blogs and render on blog.html
 */
async function loadDynamicBlogs() {
    const grid = document.querySelector('.blog-grid');
    if (!grid) return;

    console.log('Content Loader: Fetching blogs...');
    const { data: posts, error } = await supabaseClient
        .from('blogs')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

    if (error) {
        console.error('Content Loader: Error fetching blogs:', error);
        grid.innerHTML = `<p class="col-span-full text-center text-error">Error: ${error.message}</p>`;
        return;
    }

    if (posts && posts.length > 0) {
        grid.innerHTML = posts.map((b, i) => `
            <article class="blog-card reveal delay-${(i % 3) * 100}">
                <div class="blog-card-image">
                    <img src="${b.image_url || 'https://via.placeholder.com/400x250'}" alt="${b.title}">
                </div>
                <div class="blog-card-body">
                    <div class="blog-card-meta">
                        <span class="blog-card-category">${b.category}</span>
                        <span class="blog-card-date">${new Date(b.published_at || b.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <h3 class="text-xl font-bold mb-3"><a href="blog-detail.html?slug=${b.slug}" class="hover:text-primary-500 transition-colors">${b.title}</a></h3>
                    <p class="text-secondary line-clamp-3">${b.excerpt || ''}</p>
                </div>
            </article>
        `).join('');
        window.lastBlogCount = posts.length;
    } else {
        grid.innerHTML = '<p class="col-span-full text-center">Belum ada artikel yang dipublikasikan.</p>';
    }
}

/**
 * Initialize tab switching logic for the services page
 */
function initServiceTabs() {
    const tabs = document.querySelectorAll('.services-tab');
    const sections = document.querySelectorAll('.service-detail');

    if (!tabs.length || !sections.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const target = tab.getAttribute('data-target');

            tabs.forEach(t => t.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            tab.classList.add('active');
            const targetEl = document.getElementById(target);
            if (targetEl) targetEl.classList.add('active');
        });
    });
}
