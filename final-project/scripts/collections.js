// Collections Page Functionality
import movieManager, { movieCardUtils } from './movies.js';
import modalManager from './modal.js';
import storageManager from './storage.js';
import { fetchMoviesByGenre } from './movies-api.js';

// Initialize collections page
async function initCollections() {
    setupNavigation();
    updateFooterDates();
    setupModal();
    setupCollectionNavigation();
    await loadCollectionPreviews();
}

// Load previews for each collection
async function loadCollectionPreviews() {
    const collections = [
        { id: 'oscar-winners', name: 'Oscar Winners', genreId: null, description: 'Academy Award winning masterpieces' },
        { id: '90s-classics', name: '90s Classics', decade: '1990s', description: 'Iconic films from the 1990s' },
        { id: '2000s-hits', name: '2000s Hits', decade: '2000s', description: 'Blockbusters from the new millennium' },
        { id: 'sci-fi', name: 'Sci-Fi Adventures', genreId: 878, description: 'Journey to futuristic worlds' },
        { id: 'comedy', name: 'Comedy Gold', genreId: 35, description: 'Laugh-out-loud hilarious films' },
        { id: 'favorites', name: 'Your Favorites', type: 'favorites', description: 'Movies you\'ve saved and loved' }
    ];

    for (const collection of collections) {
        await loadCollectionPreview(collection);
    }
}

// Load preview for a specific collection
async function loadCollectionPreview(collection) {
    const previewContainer = document.getElementById(`${collection.id}-preview`);
    if (!previewContainer) return;

    try {
        let movies = [];

        if (collection.type === 'favorites') {
            movies = storageManager.getFavorites().slice(0, 3);
        } else if (collection.genreId) {
            const genreMovies = await fetchMoviesByGenre(collection.genreId);
            movies = genreMovies.slice(0, 3);
        } else {
            // For Oscar winners and decades, use popular movies as placeholder
            const allMovies = await movieManager.loadInitialMovies();
            movies = allMovies.slice(0, 3);
        }

        if (movies.length > 0) {
            const previewHTML = movies.map(movie => 
                createCollectionPreviewCard(movie)
            ).join('');
            previewContainer.innerHTML = previewHTML;
        } else {
            previewContainer.innerHTML = `
                <div class="empty-state">
                    <p>No movies available</p>
                </div>
            `;
        }

        // Setup click events for preview cards
        setupPreviewCardEvents(previewContainer);

    } catch (error) {
        console.error(`Error loading ${collection.name} preview:`, error);
        previewContainer.innerHTML = `
            <div class="error-state">
                <p>Failed to load movies</p>
            </div>
        `;
    }
}

// Create preview card for collection
function createCollectionPreviewCard(movie) {
    return `
        <div class="preview-card" data-movie-id="${movie.id}">
            <img src="${movie.poster}" alt="${movie.title}" loading="lazy">
            <div class="preview-info">
                <div class="preview-title">${movie.title}</div>
                <div class="preview-year">${movie.year}</div>
            </div>
        </div>
    `;
}

// Setup events for preview cards
function setupPreviewCardEvents(container) {
    const previewCards = container.querySelectorAll('.preview-card');
    
    previewCards.forEach(card => {
        card.addEventListener('click', () => {
            const movieId = card.dataset.movieId;
            showMovieDetails(movieId);
        });
    });
}

// Setup collection navigation
function setupCollectionNavigation() {
    const viewButtons = document.querySelectorAll('.view-collection-btn');
    const backButton = document.getElementById('back-to-collections');
    const collectionsGrid = document.querySelector('.collections-grid');
    const collectionDetail = document.getElementById('collection-detail');

    viewButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            const collectionId = button.dataset.collection;
            await showFullCollection(collectionId);
            
            // Switch to detail view
            collectionsGrid.classList.add('hidden');
            collectionDetail.classList.remove('hidden');
        });
    });

    if (backButton) {
        backButton.addEventListener('click', () => {
            // Switch back to grid view
            collectionDetail.classList.add('hidden');
            collectionsGrid.classList.remove('hidden');
        });
    }
}

// Show full collection
async function showFullCollection(collectionId) {
    const collectionTitle = document.getElementById('collection-detail-title');
    const collectionDescription = document.getElementById('collection-detail-description');
    const moviesContainer = document.getElementById('collection-movies-full');

    if (!collectionTitle || !collectionDescription || !moviesContainer) return;

    try {
        let movies = [];
        let title = '';
        let description = '';

        // Define collection data
        const collectionData = {
            'oscar-winners': { 
                title: '🏆 Oscar Winners', 
                description: 'Academy Award winning masterpieces throughout cinema history',
                type: 'oscar'
            },
            '90s-classics': { 
                title: '📼 90s Classics', 
                description: 'Iconic films that defined the 1990s era',
                type: 'decade',
                decade: '1990s'
            },
            '2000s-hits': { 
                title: '🎯 2000s Hits', 
                description: 'Blockbusters and cultural phenomena from the new millennium',
                type: 'decade',
                decade: '2000s'
            },
            'sci-fi': { 
                title: '🚀 Sci-Fi Adventures', 
                description: 'Journey to futuristic worlds and explore the unknown',
                type: 'genre',
                genreId: 878
            },
            'comedy': { 
                title: '😂 Comedy Gold', 
                description: 'Laugh-out-loud hilarious films for every mood',
                type: 'genre',
                genreId: 35
            },
            'favorites': { 
                title: '❤️ Your Favorites', 
                description: 'Movies you\'ve saved and loved',
                type: 'favorites'
            }
        };

        const collection = collectionData[collectionId];
        if (!collection) return;

        collectionTitle.textContent = collection.title;
        collectionDescription.textContent = collection.description;

        // Load appropriate movies
        if (collection.type === 'favorites') {
            movies = storageManager.getFavorites();
        } else if (collection.type === 'genre' && collection.genreId) {
            movies = await fetchMoviesByGenre(collection.genreId);
        } else {
            // For Oscar winners and decades, use popular movies
            movies = await movieManager.loadInitialMovies();
        }

        // Display movies
        if (movies.length > 0) {
            movieCardUtils.renderMoviesGrid(movies, moviesContainer, false);
            setupMovieCardEvents();
        } else {
            moviesContainer.innerHTML = `
                <div class="no-results">
                    <h3>No movies in this collection</h3>
                    <p>${collectionId === 'favorites' ? 'Start adding movies to your favorites!' : 'Check back later for updates.'}</p>
                </div>
            `;
        }

    } catch (error) {
        console.error('Error loading full collection:', error);
        moviesContainer.innerHTML = `
            <div class="error-message">
                <h3>Failed to load collection</h3>
                <p>Please try again later.</p>
            </div>
        `;
    }
}

// Setup movie card events
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

// Setup modal
function setupModal() {
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

// Navigation and footer functions
function setupNavigation() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const primaryNav = document.getElementById('primary-nav');
    
    if (hamburgerBtn && primaryNav) {
        hamburgerBtn.addEventListener('click', () => {
            primaryNav.classList.toggle('show');
        });
    }
    
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
document.addEventListener('DOMContentLoaded', initCollections);
