/**
 * DN Apps - Analytics Dashboard
 * Visualize web traffic data from Supabase
 */

let visitorTrendChart, deviceChart, topPagesChart;
let dateRange = 30; // Default 30 days

// Auth Guard
(async () => {
    const user = await getUser();
    if (!user) {
        window.location.href = '../login.html';
        return;
    }

    const { data: profile } = await supabaseClient
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin') {
        alert('Akses Ditolak.');
        window.location.href = '../dashboard.html';
        return;
    }

    document.getElementById('adminContainer').style.display = 'flex';

    // Initialize dashboard
    initDashboard();
})();

// Logout
document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    await signOut();
    window.location.href = '../login.html';
});

/**
 * Initialize dashboard
 */
async function initDashboard() {
    // Load initial data
    await loadAnalyticsData();

    // Set up date range filter
    document.getElementById('dateRange')?.addEventListener('change', async (e) => {
        dateRange = parseInt(e.target.value);
        await loadAnalyticsData();
    });

    // Refresh active users every 30 seconds
    setInterval(updateActiveUsers, 30000);
}

/**
 * Load analytics data from Supabase
 */
async function loadAnalyticsData() {
    try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - dateRange);

        // Fetch page views
        const { data: pageViews, error: pvError } = await supabaseClient
            .from('page_views')
            .select('*')
            .gte('viewed_at', startDate.toISOString())
            .order('viewed_at', { ascending: true });

        if (pvError) throw pvError;

        // Calculate metrics
        calculateMetrics(pageViews);

        // Update charts
        updateVisitorTrendChart(pageViews);
        updateDeviceChart(pageViews);
        updateTopPagesChart(pageViews);
        updateTopPagesTable(pageViews);
        updateReferrersTable(pageViews);

        // Update active users
        await updateActiveUsers();

    } catch (error) {
        console.error('Error loading analytics:', error);
    }
}

/**
 * Calculate overview metrics
 */
function calculateMetrics(pageViews) {
    const totalPageViews = pageViews.length;
    const uniqueVisitors = new Set(pageViews.map(pv => pv.session_id)).size;
    const avgPages = uniqueVisitors > 0 ? (totalPageViews / uniqueVisitors).toFixed(2) : 0;

    document.getElementById('totalPageViews').textContent = totalPageViews.toLocaleString();
    document.getElementById('uniqueVisitors').textContent = uniqueVisitors.toLocaleString();
    document.getElementById('avgPages').textContent = avgPages;
}

/**
 * Update active users count
 */
async function updateActiveUsers() {
    try {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

        const { data, error } = await supabaseClient
            .from('page_views')
            .select('session_id')
            .gte('viewed_at', fiveMinutesAgo.toISOString());

        if (error) throw error;

        const activeCount = new Set(data.map(pv => pv.session_id)).size;
        document.getElementById('activeUsers').textContent = activeCount;
    } catch (error) {
        console.error('Error updating active users:', error);
    }
}

/**
 * Update visitor trend chart (line chart)
 */
function updateVisitorTrendChart(pageViews) {
    // Group by date
    const dailyData = {};
    pageViews.forEach(pv => {
        const date = new Date(pv.viewed_at).toLocaleDateString();
        if (!dailyData[date]) {
            dailyData[date] = {
                views: 0,
                visitors: new Set()
            };
        }
        dailyData[date].views++;
        dailyData[date].visitors.add(pv.session_id);
    });

    const labels = Object.keys(dailyData).sort();
    const viewsData = labels.map(date => dailyData[date].views);
    const visitorsData = labels.map(date => dailyData[date].visitors.size);

    // Destroy existing chart
    if (visitorTrendChart) {
        visitorTrendChart.destroy();
    }

    const ctx = document.getElementById('visitorTrendChart');
    visitorTrendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Page Views',
                    data: viewsData,
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Unique Visitors',
                    data: visitorsData,
                    borderColor: 'rgb(6, 182, 212)',
                    backgroundColor: 'rgba(6, 182, 212, 0.1)',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

/**
 * Update device distribution chart (pie chart)
 */
function updateDeviceChart(pageViews) {
    const deviceCounts = {};
    pageViews.forEach(pv => {
        const device = pv.device_type || 'Unknown';
        deviceCounts[device] = (deviceCounts[device] || 0) + 1;
    });

    const labels = Object.keys(deviceCounts);
    const data = Object.values(deviceCounts);

    if (deviceChart) {
        deviceChart.destroy();
    }

    const ctx = document.getElementById('deviceChart');
    deviceChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels.map(l => l.charAt(0).toUpperCase() + l.slice(1)),
            datasets: [{
                data: data,
                backgroundColor: [
                    'rgb(59, 130, 246)',
                    'rgb(6, 182, 212)',
                    'rgb(139, 92, 246)',
                    'rgb(236, 72, 153)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

/**
 * Update top pages chart (horizontal bar chart)
 */
function updateTopPagesChart(pageViews) {
    // Count pages
    const pageCounts = {};
    pageViews.forEach(pv => {
        const page = pv.page_path || '/';
        pageCounts[page] = (pageCounts[page] || 0) + 1;
    });

    // Sort and get top 5
    const sortedPages = Object.entries(pageCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const labels = sortedPages.map(([page]) => page.replace('/web_dn-apps/', '/'));
    const data = sortedPages.map(([, count]) => count);

    if (topPagesChart) {
        topPagesChart.destroy();
    }

    const ctx = document.getElementById('topPagesChart');
    topPagesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Views',
                data: data,
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    beginAtZero: true
                }
            }
        }
    });
}

/**
 * Update top pages table
 */
function updateTopPagesTable(pageViews) {
    const pageStats = {};

    pageViews.forEach(pv => {
        const page = pv.page_path || '/';
        if (!pageStats[page]) {
            pageStats[page] = {
                title: pv.page_title || page,
                views: 0,
                visitors: new Set()
            };
        }
        pageStats[page].views++;
        pageStats[page].visitors.add(pv.session_id);
    });

    const sortedPages = Object.entries(pageStats)
        .sort((a, b) => b[1].views - a[1].views)
        .slice(0, 10);

    const html = sortedPages.map(([page, stats]) => {
        const path = page.replace('/web_dn-apps/', '/');
        const avgViewsPerVisitor = (stats.views / stats.visitors.size).toFixed(2);

        return `
            <tr>
                <td>
                    <div style="display:flex; flex-direction:column; gap:4px">
                        <strong>${stats.title}</strong>
                        <span style="font-size:12px; color:var(--text-secondary)">${path}</span>
                    </div>
                </td>
                <td><span class="badge badge-info">${stats.views}</span></td>
                <td>${stats.visitors.size}</td>
                <td>${avgViewsPerVisitor}×</td>
            </tr>
        `;
    }).join('');

    document.getElementById('topPagesTable').innerHTML = html ||
        '<tr><td colspan="4" style="text-align:center">No data available</td></tr>';
}

/**
 * Update referrers table
 */
function updateReferrersTable(pageViews) {
    const referrerCounts = {};
    let totalViews = pageViews.length;

    pageViews.forEach(pv => {
        const ref = pv.referrer || 'direct';
        referrerCounts[ref] = (referrerCounts[ref] || 0) + 1;
    });

    const sortedReferrers = Object.entries(referrerCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    const html = sortedReferrers.map(([referrer, count]) => {
        const percentage = ((count / totalViews) * 100).toFixed(1);
        const displayRef = referrer === 'direct' ? '🔗 Direct (No Referrer)' : referrer;

        return `
            <tr>
                <td>${displayRef}</td>
                <td><span class="badge badge-info">${count}</span></td>
                <td>
                    <div style="display:flex; align-items:center; gap:8px">
                        <div class="progress-bar" style="flex:1">
                            <div class="progress-fill" style="width:${percentage}%"></div>
                        </div>
                        <span style="font-size:14px; min-width:50px">${percentage}%</span>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    document.getElementById('referrersTable').innerHTML = html ||
        '<tr><td colspan="3" style="text-align:center">No data available</td></tr>';
}
