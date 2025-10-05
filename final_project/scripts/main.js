// Navigation functionality
function setupNavigation() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const primaryNav = document.getElementById('primary-nav');
    
    if (hamburgerBtn && primaryNav) {
        hamburgerBtn.addEventListener('click', () => {
            primaryNav.classList.toggle('show');
        });
    }
    
    // Close mobile nav when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('nav') && primaryNav) {
            primaryNav.classList.remove('show');
        }
    });
}

// Update footer dates
function updateFooterDates() {
    const currentYear = document.getElementById('currentyear');
    const lastModified = document.getElementById('lastmodified');
    
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
    
    if (lastModified) {
        lastModified.textContent = document.lastModified;
    }
}

// Utility functions
const utils = {
    // Format movie data from API
    formatMovieData(movie) {
        return {
            id: movie.id,
            title: movie.title,
            year: movie.release_date ? movie.release_date.split('-')[0] : 'Unknown',
            rating: movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A',
            poster: movie.poster_path 
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : 'images/placeholder-poster.jpg',
            overview: movie.overview || 'No description available.',
            genreIds: movie.genre_ids || []
        };
    },
    
    // Create movie card HTML
    createMovieCard(movie) {
        return `
            <div class="movie-card" data-movie-id="${movie.id}">
                <img src="${movie.poster}" alt="${movie.title}" class="movie-poster" loading="lazy">
                <div class="movie-info">
                    <div class="movie-title">${movie.title}</div>
                    <div class="movie-year">${movie.year} • ⭐ ${movie.rating}</div>
                </div>
            </div>
        `;
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    updateFooterDates();
});
