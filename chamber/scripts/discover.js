// Discover page specific functionality

// Tracking visits to the discover page
function trackVisits() {
    const visitMessage = document.getElementById('visit-message');
    if (!visitMessage) return;
    
    let lastVisit = localStorage.getItem('lastVisit');
    const currentVisit = Date.now();
    
    if (!lastVisit) {
        // First visit
        visitMessage.textContent = "Welcome! Let us know if you have any questions.";
    } else {
        lastVisit = parseInt(lastVisit);
        const daysSinceLastVisit = Math.floor((currentVisit - lastVisit) / (1000 * 60 * 60 * 24));
        
        if (daysSinceLastVisit < 1) {
            visitMessage.textContent = "Back so soon! Awesome!";
        } else {
            const dayText = daysSinceLastVisit === 1 ? "day" : "days";
            visitMessage.textContent = `You last visited ${daysSinceLastVisit} ${dayText} ago.`;
        }
    }
    
    // Storing the current visit time
    localStorage.setItem('lastVisit', currentVisit.toString());
}

// Lazy loading for images
function setupLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src; // Trigger loading
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Initializing discover page
function initDiscover() {
    trackVisits();
    setupLazyLoading();
}

// Making functions available globally
window.trackVisits = trackVisits;
window.setupLazyLoading = setupLazyLoading;
window.initDiscover = initDiscover;

// Initializing when DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDiscover);
} else {
    initDiscover();
}
