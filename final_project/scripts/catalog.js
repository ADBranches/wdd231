// Catalog Page Functionality - Using ES Modules with Enhanced Features
import movieManager, { movieCardUtils } from './movies.js';
import modalManager from './modal.js';
import storageManager from './storage.js';
import { fetchGenres } from './movies-api.js';

// Global variables
let currentMovies = [];
let currentFilters = {
    search: '',
    genre: '',
    year: '',
    rating: '0',
    sort: 'popularity'
};

// Initialize catalog page
async function initCatalog() {
    setupNavigation();
    updateFooterDates();
    setupFilters();
    setupViewToggle();
    setupMovieSuggestionForm();
    setupModal();
    await loadInitialMovies();
}

// Load initial movies
async function loadInitialMovies() {
    const loadingElement = document.getElementById('movies-grid');
    if (loadingElement) {
        loadingElement.innerHTML = '<div class="loading">Loading movies...</div>';
    }
    
    try {
        const movies = await movieManager.loadInitialMovies();
        currentMovies = movies;
        displayMovies(currentMovies);
        updateResultsCount(currentMovies.length);
        await populateFilterOptions();
    } catch (error) {
        console.error('Error loading movies:', error);
        showError('Failed to load movies. Please try again later.');
    }
}

// Display movies in grid/list view
function displayMovies(movies) {
    const container = document.getElementById('movies-grid');
    if (!container) return;
    
    if (movies.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <h3>No movies found</h3>
                <p>Try adjusting your filters or search terms.</p>
            </div>
        `;
        return;
    }
    
    const isListView = container.classList.contains('view-list');
    movieCardUtils.renderMoviesGrid(movies, container, isListView);
    
    // Add click events to movie cards
    setupMovieCardEvents();
}

// Setup movie card click events
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

// Setup filters functionality
function setupFilters() {
    const searchFilter = document.getElementById('search-filter');
    const genreFilter = document.getElementById('genre-filter');
    const yearFilter = document.getElementById('year-filter');
    const ratingFilter = document.getElementById('rating-filter');
    const sortFilter = document.getElementById('sort-filter');
    const applyButton = document.getElementById('apply-filters');
    const resetButton = document.getElementById('reset-filters');
    
    if (searchFilter) {
        searchFilter.addEventListener('input', debounce((e) => {
            currentFilters.search = e.target.value;
            applyFilters();
        }, 300));
    }
    
    if (genreFilter) {
        genreFilter.addEventListener('change', (e) => {
            currentFilters.genre = e.target.value;
            applyFilters();
        });
    }
    
    if (yearFilter) {
        yearFilter.addEventListener('change', (e) => {
            currentFilters.year = e.target.value;
            applyFilters();
        });
    }
    
    if (ratingFilter) {
        ratingFilter.addEventListener('change', (e) => {
            currentFilters.rating = e.target.value;
            applyFilters();
        });
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', (e) => {
            currentFilters.sort = e.target.value;
            applyFilters();
        });
    }
    
    if (applyButton) {
        applyButton.addEventListener('click', applyFilters);
    }
    
    if (resetButton) {
        resetButton.addEventListener('click', resetFilters);
    }
}

// Apply filters using movieManager
function applyFilters() {
    const filteredMovies = movieManager.filterMovies(currentFilters);
    displayMovies(filteredMovies);
    updateResultsCount(filteredMovies.length);
}

// Reset all filters
function resetFilters() {
    currentFilters = {
        search: '',
        genre: '',
        year: '',
        rating: '0',
        sort: 'popularity'
    };
    
    const searchFilter = document.getElementById('search-filter');
    const genreFilter = document.getElementById('genre-filter');
    const yearFilter = document.getElementById('year-filter');
    const ratingFilter = document.getElementById('rating-filter');
    const sortFilter = document.getElementById('sort-filter');
    
    if (searchFilter) searchFilter.value = '';
    if (genreFilter) genreFilter.value = '';
    if (yearFilter) yearFilter.value = '';
    if (ratingFilter) ratingFilter.value = '0';
    if (sortFilter) sortFilter.value = 'popularity';
    
    displayMovies(currentMovies);
    updateResultsCount(currentMovies.length);
}

// Populate filter options with enhanced data
async function populateFilterOptions() {
    const genreFilter = document.getElementById('genre-filter');
    const yearFilter = document.getElementById('year-filter');
    
    try {
        // Use movieManager for genres, fallback to API if needed
        let genres = movieManager.getGenres ? movieManager.getGenres() : [];
        
        if (genres.length === 0) {
            genres = await fetchGenres();
        }
        
        if (genreFilter && genres.length > 0) {
            const genresHTML = genres.map(genre => 
                `<option value="${genre.id}">${genre.name}</option>`
            ).join('');
            genreFilter.innerHTML = `<option value="">All Genres</option>${genresHTML}`;
        }
        
        if (yearFilter) {
            const currentYear = new Date().getFullYear();
            const yearsHTML = Array.from({length: 30}, (_, i) => 
                `<option value="${currentYear - i}">${currentYear - i}</option>`
            ).join('');
            yearFilter.innerHTML = `<option value="">All Years</option>${yearsHTML}`;
        }
    } catch (error) {
        console.error('Error populating filter options:', error);
    }
}

// Setup view toggle (grid/list)
function setupViewToggle() {
    const gridViewBtn = document.getElementById('grid-view');
    const listViewBtn = document.getElementById('list-view');
    const moviesGrid = document.getElementById('movies-grid');
    
    if (gridViewBtn && listViewBtn && moviesGrid) {
        gridViewBtn.addEventListener('click', () => {
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
            moviesGrid.classList.remove('view-list');
            moviesGrid.classList.add('view-grid');
            displayMovies(currentMovies);
        });
        
        listViewBtn.addEventListener('click', () => {
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
            moviesGrid.classList.remove('view-grid');
            moviesGrid.classList.add('view-list');
            displayMovies(currentMovies);
        });
    }
}

// Update results count display
function updateResultsCount(count) {
    const resultsCount = document.getElementById('results-count');
    if (resultsCount) {
        resultsCount.textContent = `${count} ${count === 1 ? 'movie' : 'movies'} found`;
    }
}

// Setup modal using modalManager
function setupModal() {
    modalManager.registerModal('movie-modal', {
        contentContainer: document.getElementById('modal-content'),
        backdropClose: true,
        escapeClose: true,
        autoClear: true
    });
}

// Show movie details using modalManager with enhanced UI
async function showMovieDetails(movieId) {
    const movie = movieManager.getMovieById(movieId);
    if (!movie) {
        showNotification('Movie details not available.');
        return;
    }
    
    const movieDetailHTML = movieCardUtils.createMovieDetailView 
        ? movieCardUtils.createMovieDetailView(movie)
        : createFallbackMovieDetail(movie);
    
    modalManager.updateModalContent('movie-modal', movieDetailHTML);
    
    // Setup interactive elements in modal
    setTimeout(() => {
        const favoriteBtn = document.querySelector('.btn-favorite');
        const closeBtn = document.querySelector('.btn-close-detail');
        
        if (favoriteBtn) {
            const isFavorite = storageManager.isInFavorites 
                ? storageManager.isInFavorites(movie.id)
                : checkLocalStorageFavorites(movie.id);
                
            if (isFavorite) {
                favoriteBtn.textContent = '❤️ Already in Favorites';
                favoriteBtn.disabled = true;
            } else {
                favoriteBtn.addEventListener('click', () => {
                    const result = storageManager.addToFavorites 
                        ? storageManager.addToFavorites(movie)
                        : addToFavorites(movie);
                    
                    showNotification(result?.message || 'Movie added to favorites!');
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

// Fallback movie detail creation
function createFallbackMovieDetail(movie) {
    return `
        <div class="movie-detail">
            <div class="detail-header">
                <img src="${movie.poster}" alt="${movie.title}" class="detail-poster">
                <div class="detail-info">
                    <h2>${movie.title}</h2>
                    <p class="detail-meta">${movie.year} • ⭐ ${movie.rating}/10</p>
                    <p class="detail-overview">${movie.overview}</p>
                    <div class="detail-actions">
                        <button class="btn-favorite" data-movie-id="${movie.id}">❤️ Add to Favorites</button>
                        <button class="btn-close-detail">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Fallback favorites check
function checkLocalStorageFavorites(movieId) {
    try {
        const favorites = JSON.parse(localStorage.getItem('movieFavorites') || '[]');
        return favorites.some(fav => fav.id === movieId);
    } catch (error) {
        return false;
    }
}

// Fallback add to favorites
function addToFavorites(movie) {
    try {
        const favorites = JSON.parse(localStorage.getItem('movieFavorites') || '[]');
        
        if (!favorites.some(fav => fav.id === movie.id)) {
            favorites.push(movie);
            localStorage.setItem('movieFavorites', JSON.stringify(favorites));
            return { success: true, message: 'Movie added to favorites!' };
        } else {
            return { success: false, message: 'Movie is already in favorites!' };
        }
    } catch (error) {
        console.error('Error adding to favorites:', error);
        return { success: false, message: 'Error adding to favorites.' };
    }
}

// ============================================================================
// MOVIE SUGGESTION FORM FUNCTIONALITY
// ============================================================================

function setupMovieSuggestionForm() {
    const form = document.getElementById('movie-suggestion-form');
    if (!form) return;
    
    setFormMetadata();
    setupFormValidation();
    
    form.addEventListener('submit', function(e) {
        if (this.checkValidity()) {
            setFormMetadata();
            console.log('Form submitted successfully');
        } else {
            e.preventDefault();
            showFormValidationErrors();
        }
    });
    
    form.addEventListener('reset', function() {
        setTimeout(setFormMetadata, 0);
    });
}

function setFormMetadata() {
    const timestampField = document.getElementById('submission-timestamp');
    const submissionIdField = document.getElementById('submission-id');
    
    if (timestampField) {
        timestampField.value = new Date().toLocaleString();
    }
    
    if (submissionIdField && !submissionIdField.value) {
        submissionIdField.value = generateFormSubmissionId();
    }
}

function generateFormSubmissionId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `FORM-${timestamp}-${random}`.toUpperCase();
}

function setupFormValidation() {
    const yearInput = document.getElementById('release-year');
    const titleInput = document.getElementById('movie-title');
    
    if (yearInput) {
        yearInput.addEventListener('input', function() {
            const currentYear = new Date().getFullYear();
            const year = parseInt(this.value);
            
            if (year && (year < 1900 || year > currentYear + 5)) {
                this.setCustomValidity(`Please enter a year between 1900 and ${currentYear + 5}`);
            } else {
                this.setCustomValidity('');
            }
        });
    }
    
    if (titleInput) {
        titleInput.addEventListener('input', function() {
            if (this.value.length > 0 && this.value.length < 2) {
                this.setCustomValidity('Movie title must be at least 2 characters long');
            } else {
                this.setCustomValidity('');
            }
        });
    }
}

function showFormValidationErrors() {
    const form = document.getElementById('movie-suggestion-form');
    const invalidFields = form.querySelectorAll(':invalid');
    
    invalidFields.forEach(field => {
        field.style.borderColor = '#dc3545';
        
        field.addEventListener('input', function() {
            if (this.checkValidity()) {
                this.style.borderColor = '';
            }
        });
    });
    
    if (invalidFields.length > 0) {
        invalidFields[0].focus();
        showFormError('Please fix the errors highlighted above before submitting.');
    }
}

function showFormError(message) {
    const existingError = document.querySelector('.form-error-message');
    if (existingError) {
        existingError.remove();
    }
    
    const errorMessage = document.createElement('div');
    errorMessage.className = 'form-error-message';
    errorMessage.innerHTML = `<p>❌ ${message}</p>`;
    
    errorMessage.style.cssText = `
        background: #f8d7da;
        color: #721c24;
        padding: var(--spacing-md);
        border-radius: var(--border-radius);
        margin: var(--spacing-md) 0;
        text-align: center;
        border: 1px solid #f5c6cb;
    `;
    
    const form = document.getElementById('movie-suggestion-form');
    form.parentNode.insertBefore(errorMessage, form);
    
    setTimeout(() => {
        if (errorMessage.parentNode) {
            errorMessage.remove();
        }
    }, 5000);
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

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

function showError(message) {
    const container = document.getElementById('movies-grid');
    if (container) {
        container.innerHTML = `
            <div class="error-message">
                <h3>😞 Something went wrong</h3>
                <p>${message}</p>
                <button onclick="location.reload()" class="btn-primary">Try Again</button>
            </div>
        `;
    }
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

// Navigation and footer functions (to be implemented or imported)
function setupNavigation() {
    // Navigation setup logic
}

function updateFooterDates() {
    // Footer date update logic
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initCatalog);

// Make functions available globally for HTML onclick handlers
window.showMovieDetails = showMovieDetails;
window.applyFilters = applyFilters;
window.resetFilters = resetFilters;
