const SOURCES = [
    { id: 'ft', name: 'Financial Times', url: 'https://www.ft.com/?format=rss', color: '#fcd0b4' },
    { id: 'cnbc', name: 'CNBC', url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10000664', color: '#005594' },
    { id: 'wsj', name: 'Wall Street Journal', url: 'https://feeds.a.dj.com/rss/WSJcomUSBusiness.xml', color: '#000000' },
    { id: 'yahoo', name: 'Yahoo Finance (Reuters/BBG Proxy)', url: 'https://finance.yahoo.com/news/rss', color: '#430297' },
    { id: 'economist', name: 'The Economist', url: 'https://www.economist.com/finance-and-economics/rss.xml', color: '#e3120b' }
];

let activeFilters = SOURCES.map(s => s.id);
let allNews = [];

const filterListEl = document.getElementById('filterList');
const newsGridEl = document.getElementById('newsGrid');
const loaderEl = document.getElementById('loader');

// Initialize
function init() {
    renderFilters();
    fetchAllNews();
    
    // Theme Toggle Logic
    const themeToggleBtn = document.getElementById('themeToggle');
    let isLightMode = false;
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            isLightMode = !isLightMode;
            if (isLightMode) {
                document.documentElement.setAttribute('data-theme', 'light');
                themeToggleBtn.innerText = '🌙 Dark Mode';
            } else {
                document.documentElement.removeAttribute('data-theme');
                themeToggleBtn.innerText = '☀️ Light Mode';
            }
        });
    }
    
    // Auto refresh every 60 seconds (1 minute)
    setInterval(fetchAllNews, 60000);
}

// Render Checkboxes
function renderFilters() {
    filterListEl.innerHTML = '';
    SOURCES.forEach(source => {
        const div = document.createElement('div');
        div.className = 'filter-item';
        div.innerHTML = `
            <input type="checkbox" id="filter-${source.id}" class="filter-checkbox" value="${source.id}" checked>
            <label for="filter-${source.id}" class="filter-label">${source.name}</label>
        `;
        
        div.querySelector('input').addEventListener('change', (e) => {
            if (e.target.checked) {
                activeFilters.push(source.id);
            } else {
                activeFilters = activeFilters.filter(id => id !== source.id);
            }
            renderNews();
        });
        
        filterListEl.appendChild(div);
    });
}

// Fetch via CORS proxy
async function fetchRSS(source) {
    try {
        const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source.url)}`;
        const response = await fetch(proxyUrl);
        const data = await response.json();
        
        if (data.status !== 'ok') {
            console.warn(`Could not load feed for ${source.name}`);
            return [];
        }
        
        const parsedNews = [];
        data.items.forEach(item => {
            const title = item.title || '';
            const link = item.link || '';
            let description = item.description || '';
            const pubDate = item.pubDate || '';
            
            // Clean up description (remove HTML tags)
            description = description.replace(/(<([^>]+)>)/gi, "").trim();
            
            if (title && link) {
                parsedNews.push({
                    sourceId: source.id,
                    sourceName: source.name,
                    title,
                    link,
                    description: description.substring(0, 150) + (description.length > 150 ? '...' : ''),
                    pubDate: new Date(pubDate),
                    timestamp: new Date(pubDate).getTime()
                });
            }
        });
        return parsedNews;
    } catch (error) {
        console.error(`Error fetching ${source.name}:`, error);
        return [];
    }
}

// Fetch all and sort
async function fetchAllNews() {
    loaderEl.style.display = 'block';
    
    const promises = SOURCES.map(source => fetchRSS(source));
    const results = await Promise.all(promises);
    
    // Flatten array
    allNews = results.flat();
    
    // Sort by newest first
    allNews.sort((a, b) => b.timestamp - a.timestamp);
    
    loaderEl.style.display = 'none';
    
    // Update the last updated time text
    const lastUpdateEl = document.getElementById('lastUpdate');
    if (lastUpdateEl) {
        lastUpdateEl.innerText = 'Last updated: ' + new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'});
    }
    
    renderNews();
}

// Format Date
function formatTime(dateObj) {
    if (isNaN(dateObj.getTime())) return 'Unknown Date';
    const now = new Date();
    const diffMins = Math.floor((now - dateObj) / 60000);
    
    if (diffMins < 60) return `${diffMins} mins ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    return dateObj.toLocaleDateString('en-US');
}

// Render News Grid
function renderNews() {
    newsGridEl.innerHTML = '';
    
    const filteredNews = allNews.filter(news => activeFilters.includes(news.sourceId));
    
    if (filteredNews.length === 0) {
        newsGridEl.innerHTML = '<p style="color: var(--text-secondary); grid-column: 1/-1;">No news found from selected sources.</p>';
        return;
    }
    
    filteredNews.forEach(news => {
        const a = document.createElement('a');
        a.href = news.link;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.className = 'card';
        
        a.innerHTML = `
            <div class="card-header">
                <span class="source-badge">${news.sourceName}</span>
                <span>${formatTime(news.pubDate)}</span>
            </div>
            <h3 class="card-title">${news.title}</h3>
            <p class="card-snippet">${news.description}</p>
            <div class="card-footer">
                <span class="read-more">Read Full Article ↗</span>
            </div>
        `;
        
        newsGridEl.appendChild(a);
    });
}

// Start
document.addEventListener('DOMContentLoaded', init);
