// Initialize app
let links = JSON.parse(localStorage.getItem('links')) || [];
let currentShortUrl = '';

// Show section
function showSection(section) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(`${section}-section`).classList.add('active');
    
    if (section === 'links') {
        displayLinks();
    }
}

// Generate random short code
function generateShortCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// Check if slug exists
function slugExists(slug) {
    return links.some(link => link.slug === slug);
}

// Form submission
document.getElementById('shortener-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const originalUrl = document.getElementById('original-url').value.trim();
    const customSlug = document.getElementById('custom-slug').value.trim();
    
    // Validate URL
    try {
        new URL(originalUrl);
    } catch (e) {
        showToast('Please enter a valid URL');
        return;
    }
    
    // Generate or use custom slug
    let slug = customSlug;
    if (!slug) {
        do {
            slug = generateShortCode();
        } while (slugExists(slug));
    } else {
        // Validate custom slug
        if (!/^[a-zA-Z0-9-_]+$/.test(slug)) {
            showToast('Custom alias can only contain letters, numbers, hyphens, and underscores');
            return;
        }
        if (slugExists(slug)) {
            showToast('This custom alias is already taken');
            return;
        }
    }
    
    // Create link object
    const link = {
        id: Date.now(),
        originalUrl: originalUrl,
        slug: slug,
        shortUrl: `link-snap-short.vercel.app/${slug}`,
        clicks: 0,
        createdAt: new Date().toISOString()
    };
    
    // Save to storage
    links.unshift(link);
    localStorage.setItem('links', JSON.stringify(links));
    
    // Show result
    currentShortUrl = link.shortUrl;
    document.getElementById('short-url-link').textContent = link.shortUrl;
    document.getElementById('short-url-link').href = originalUrl;
    
    document.getElementById('shortener-form').style.display = 'none';
    document.getElementById('result-container').classList.remove('hidden');
});

// Copy to clipboard
function copyToClipboard() {
    const shortUrl = document.getElementById('short-url-link').textContent;
    navigator.clipboard.writeText(shortUrl).then(() => {
        showToast('Link copied to clipboard! 🎉');
    }).catch(() => {
        showToast('Failed to copy link');
    });
}

// Create another link
function createAnother() {
    document.getElementById('shortener-form').reset();
    document.getElementById('shortener-form').style.display = 'block';
    document.getElementById('result-container').classList.add('hidden');
}

// Display links
function displayLinks() {
    const container = document.getElementById('links-container');
    
    if (links.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <h3>No links yet</h3>
                <p>Create your first shortened link to get started</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = links.map(link => `
        <div class="link-card" data-id="${link.id}">
            <div class="link-header">
                <div class="link-info">
                    <div class="link-short">${link.shortUrl}</div>
                    <div class="link-original">${link.originalUrl}</div>
                </div>
                <div class="link-actions">
                    <button class="btn-icon" onclick="copyLink('${link.shortUrl}')" title="Copy link">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M8 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V14C4 14.5304 4.21071 15.0391 4.58579 15.4142C4.96086 15.7893 5.46957 16 6 16H14C14.5304 16 15.0391 15.7893 15.4142 15.4142C15.7893 15.0391 16 14.5304 16 14V12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <button class="btn-icon" onclick="deleteLink(${link.id})" title="Delete link">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M6 4H14M8 4V3C8 2.44772 8.44772 2 9 2H11C11.5523 2 12 2.44772 12 3V4M4 6H16M15 6L14.5 15C14.5 15.5304 14.2893 16.0391 13.9142 16.4142C13.5391 16.7893 13.0304 17 12.5 17H7.5C6.96957 17 6.46086 16.7893 6.08579 16.4142C5.71071 16.0391 5.5 15.5304 5.5 15L5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="link-stats">
                <div class="stat">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2 7.33333L7.33333 12.6667L14 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span><span class="stat-value">${link.clicks}</span> clicks</span>
                </div>
                <div class="stat">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="currentColor" stroke-width="1.5"/>
                        <path d="M8 4V8L10.6667 9.33333" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                    <span>${formatDate(link.createdAt)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Copy link
function copyLink(url) {
    navigator.clipboard.writeText(url).then(() => {
        showToast('Link copied! 🎉');
    });
}

// Delete link
function deleteLink(id) {
    if (confirm('Are you sure you want to delete this link?')) {
        links = links.filter(link => link.id !== id);
        localStorage.setItem('links', JSON.stringify(links));
        displayLinks();
        showToast('Link deleted');
    }
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
}

// Show toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    // Set default active section
    showSection('shortener');
});
