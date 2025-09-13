// About page specific functionality

// Initialize timeline animation
function setupTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        });
    }, { threshold: 0.1 });
    
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        item.style.transitionDelay = `${index * 0.2}s`;
        
        observer.observe(item);
    });
}

// Initialize team member hover effects
function setupTeamHoverEffects() {
    const teamMembers = document.querySelectorAll('.board-member, .staff-member');
    
    teamMembers.forEach(member => {
        member.addEventListener('mouseenter', function() {
            this.style.boxShadow = 'var(--shadow-lg)';
        });
        
        member.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
    });
}

// Initialize value item animations
function setupValueAnimations() {
    const valueItems = document.querySelectorAll('.value-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    valueItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        item.style.transitionDelay = `${index * 0.1}s`;
        
        observer.observe(item);
    });
}

// Initialize about page
function initAbout() {
    setupTimelineAnimation();
    setupTeamHoverEffects();
    setupValueAnimations();
}

// Make functions available globally
window.setupTimelineAnimation = setupTimelineAnimation;
window.setupTeamHoverEffects = setupTeamHoverEffects;
window.setupValueAnimations = setupValueAnimations;
window.initAbout = initAbout;

// Initialize when DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAbout);
} else {
    initAbout();
}
