// Home Page Functionality
import movieManager, { movieCardUtils } from './movies.js';
import modalManager from './modal.js';
import storageManager from './storage.js';

// Initialize home page
async function initHome() {
    setupNavigation();
    updateFooterDates();
    setupSearch();
    setupCategoryCards();
    await loadFeaturedMovies();
    setupModal();
}

// Load featured movies for home page
async function loadFeaturedMovies() {
    const container = document.getElementById('featured-movies-container');
    if (!container) return;
    
    try {
        const movies = await movieManager.loadInitialMovies();
        const featuredMovies = movies.slice(0, 8); // Show first 8 movies as featured
        
        if (featuredMovies.length > 0) {
            movieCardUtils.renderMoviesGrid(featuredMovies, container, false);
            setupMovieCardEvents();
        } else {
            container.innerHTML = '<div class="no-results">No featured movies available.</div>';
        }
    } catch (error) {
        console.error('Error loading featured movies:', error);
        container.innerHTML = '<div class="error">Failed to load featured movies.</div>';
    }
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    if (searchInput && searchBtn) {
        // Search on button click
        searchBtn.addEventListener('click', () => {
            performSearch(searchInput.value);
        });
        
        // Search on Enter key
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch(searchInput.value);
            }
        });
        
        // Real-time search suggestions (optional enhancement)
        searchInput.addEventListener('input', debounce((e) => {
            // Could implement search suggestions here
        }, 300));
    }
}

// Perform search and redirect to catalog
function performSearch(query) {
    if (!query || query.trim().length === 0) {
        showNotification('Please enter a search term');
        return;
    }
    
    // Save search to history
    storageManager.addToSearchHistory(query);
    
    // Redirect to catalog page with search parameter
    const encodedQuery = encodeURIComponent(query.trim());
    window.location.href = `catalog.html?search=${encodedQuery}`;
}

// Setup category cards
function setupCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const genreId = card.dataset.genre;
            const genreName = card.querySelector('h3').textContent;
            
            // Redirect to catalog with genre filter
            window.location.href = `catalog.html?genre=${genreId}&genreName=${encodeURIComponent(genreName)}`;
        });
        
        // Add hover effects
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
}

// Setup movie card events for home page
function setupMovieCardEvents() {
    const movieCards = document.querySelectorAll('.movie-card');
    const detailButtons = document.querySelectorAll('.movie-details-btn');
    
    movieCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('movie-details-btn')) {
                const movieId = card.dataset.movieId;
                showMovieDetails(movieId);
            }
        });
    });
    
    detailButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const movieId = button.dataset.movieId;
            showMovieDetails(movieId);
        });
    });
}

// Show movie details modal
async function showMovieDetails(movieId) {
    const movie = movieManager.getMovieById(movieId);
    if (!movie) {
        showNotification('Movie details not available.');
        return;
    }
    
    const movieDetailHTML = movieCardUtils.createMovieDetailView(movie);
    modalManager.updateModalContent('movie-modal', movieDetailHTML);
    
    // Setup interactive elements in modal
    setTimeout(() => {
        const favoriteBtn = document.querySelector('.btn-favorite');
        const closeBtn = document.querySelector('.btn-close-detail');
        
        if (favoriteBtn) {
            const isFavorite = storageManager.isFavorite(movie.id);
                
            if (isFavorite) {
                favoriteBtn.textContent = '❤️ Already in Favorites';
                favoriteBtn.disabled = true;
            } else {
                favoriteBtn.addEventListener('click', () => {
                    const result = storageManager.addToFavorites(movie);
                    showNotification(result.message);
                    favoriteBtn.textContent = '❤️ Added to Favorites!';
                    favoriteBtn.disabled = true;
                });
            }
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modalManager.closeModal(document.getElementById('movie-modal'));
            });
        }
    }, 0);
    
    modalManager.openModal('movie-modal');
}

// Setup modal for home page
function setupModal() {
    // Create modal for home page if it doesn't exist
    if (!document.getElementById('movie-modal')) {
        const modalHTML = `
            <dialog id="movie-modal" class="modal">
                <div class="modal-content">
                    <button class="close-btn" aria-label="Close modal">×</button>
                    <div id="modal-content"></div>
                </div>
            </dialog>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    modalManager.registerModal('movie-modal', {
        contentContainer: document.getElementById('modal-content'),
        backdropClose: true,
        escapeClose: true,
        autoClear: true
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--accent-color);
        color: white;
        padding: var(--spacing-md);
        border-radius: var(--border-radius);
        z-index: 1000;
        box-shadow: var(--shadow);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Navigation and footer functions (import from main.js or define here)
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initHome);
