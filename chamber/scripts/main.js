// updating footer with current year and last modified date
function updateFooterDates() {
    const currentYear = new Date().getFullYear();
    
    const lastModified = document.lastModified;
    
    // Updating the elements in the DOM
    const currentYearElement = document.getElementById('currentyear');
    const lastModifiedElement = document.getElementById('lastmodified');
    
    if (currentYearElement) {
        currentYearElement.textContent = currentYear;
    }
    
    if (lastModifiedElement) {
        lastModifiedElement.textContent = lastModified;
    }
}

// handling mobile navigation
function setupMobileNavigation() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const primaryNav = document.getElementById('primary-nav');
    
    if (hamburgerBtn && primaryNav) {
        hamburgerBtn.addEventListener('click', () => {
            primaryNav.classList.toggle('show');
            
            // Updating hamburger button icon
            if (primaryNav.classList.contains('show')) {
                hamburgerBtn.textContent = '✕';
            } else {
                hamburgerBtn.textContent = '☰';
            }
        });
    }
}

// setting active navigation link based on current page
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('#primary-nav a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        // Removing active class from all links
        link.classList.remove('active');
        
        // Adding active class to current page link
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === '../index.html') ||
            (currentPage === 'directory.html' && linkPage === 'directory.html')) {
            link.classList.add('active');
        }
    });
}

// Initializng when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    updateFooterDates();
    setupMobileNavigation();
    setActiveNavLink();
    
    // Closing mobile navigation when clicking outside
    document.addEventListener('click', (e) => {
        const hamburgerBtn = document.getElementById('hamburger-btn');
        const primaryNav = document.getElementById('primary-nav');
        
        if (primaryNav && primaryNav.classList.contains('show') && 
            !primaryNav.contains(e.target) && 
            e.target !== hamburgerBtn) {
            primaryNav.classList.remove('show');
            hamburgerBtn.textContent = '☰';
        }
    });
});

// Exporting functions for use in other modules (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { updateFooterDates, setupMobileNavigation, setActiveNavLink };
}
