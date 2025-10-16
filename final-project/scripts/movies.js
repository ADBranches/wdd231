// Movies data and utility functions
import { fetchMovies, fetchGenres, fetchMoviesByGenre, searchMovies } from './movies-api.js';

// Movie data management
class MovieManager {
    constructor() {
        this.currentMovies = [];
        this.currentPage = 1;
        this.genres = [];
    }

    // Load initial movies
    async loadInitialMovies() {
        try {
            this.currentMovies = await fetchMovies(this.currentPage);
            this.genres = await fetchGenres();
            return this.currentMovies;
        } catch (error) {
            console.error('Error loading movies:', error);
            throw error;
        }
    }

    // Search movies
    async searchMovies(query) {
        try {
            this.currentMovies = await searchMovies(query);
            return this.currentMovies;
        } catch (error) {
            console.error('Error searching movies:', error);
            throw error;
        }
    }

    // Get movies by genre
    async getMoviesByGenre(genreId) {
        try {
            this.currentMovies = await fetchMoviesByGenre(genreId);
            return this.currentMovies;
        } catch (error) {
            console.error('Error fetching movies by genre:', error);
            throw error;
        }
    }

    // Filter movies
    filterMovies(filters) {
        let filteredMovies = [...this.currentMovies];

        // Search filter
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filteredMovies = filteredMovies.filter(movie => 
                movie.title.toLowerCase().includes(searchTerm) ||
                movie.overview.toLowerCase().includes(searchTerm)
            );
        }

        // Genre filter
        if (filters.genre) {
            filteredMovies = filteredMovies.filter(movie => 
                movie.genreIds.includes(parseInt(filters.genre))
            );
        }

        // Year filter
        if (filters.year) {
            filteredMovies = filteredMovies.filter(movie => 
                movie.year === filters.year
            );
        }

        // Rating filter
        if (filters.rating !== '0') {
            const minRating = parseFloat(filters.rating);
            filteredMovies = filteredMovies.filter(movie => 
                parseFloat(movie.rating) >= minRating
            );
        }

        return this.sortMovies(filteredMovies, filters.sort);
    }

    // Sort movies
    sortMovies(movies, sortBy) {
        const sortedMovies = [...movies];
        
        switch (sortBy) {
            case 'release_date':
                return sortedMovies.sort((a, b) => b.year - a.year);
            case 'vote_average':
                return sortedMovies.sort((a, b) => b.rating - a.rating);
            case 'title':
                return sortedMovies.sort((a, b) => a.title.localeCompare(b.title));
            case 'popularity':
            default:
                return sortedMovies;
        }
    }

    // Get movie by ID
    getMovieById(movieId) {
        return this.currentMovies.find(movie => movie.id == movieId);
    }

    // Get genre name by ID
    getGenreName(genreId) {
        const genre = this.genres.find(g => g.id === genreId);
        return genre ? genre.name : 'Unknown';
    }

    // Get all genres
    getGenres() {
        return this.genres;
    }

    // Format movie data for display
    formatMovieForDisplay(movie) {
        return {
            ...movie,
            genreNames: movie.genreIds.map(id => this.getGenreName(id)).join(', ')
        };
    }
}

// Movie card creation utilities
export const movieCardUtils = {
    // Create movie card HTML
    createMovieCard(movie, isListView = false) {
        const viewClass = isListView ? 'list-view' : '';
        const truncatedOverview = movie.overview.length > 150 
            ? movie.overview.substring(0, 150) + '...' 
            : movie.overview;

        return `
            <div class="movie-card ${viewClass}" data-movie-id="${movie.id}">
                <img src="${movie.poster}" alt="${movie.title}" class="movie-poster" loading="lazy">
                <div class="movie-info">
                    <div class="movie-title">${movie.title}</div>
                    <div class="movie-year">${movie.year} • ⭐ ${movie.rating}</div>
                    <div class="movie-overview">${truncatedOverview}</div>
                    <button class="movie-details-btn" data-movie-id="${movie.id}">View Details</button>
                </div>
            </div>
        `;
    },

    // Create detailed movie view HTML
    createMovieDetailView(movie) {
        const genreNames = movie.genreIds.map(id => {
            const genre = movieManager.getGenres().find(g => g.id === id);
            return genre ? genre.name : 'Unknown';
        }).join(', ');

        return `
            <div class="movie-detail">
                <div class="detail-header">
                    <img src="${movie.poster}" alt="${movie.title}" class="detail-poster">
                    <div class="detail-info">
                        <h2>${movie.title}</h2>
                        <p class="detail-meta">${movie.year} • ⭐ ${movie.rating}/10</p>
                        <p class="detail-genres"><strong>Genres:</strong> ${genreNames}</p>
                        <p class="detail-overview">${movie.overview}</p>
                        <div class="detail-actions">
                            <button class="btn-favorite" data-movie-id="${movie.id}">
                                ❤️ Add to Favorites
                            </button>
                            <button class="btn-close-detail">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Render movies grid
    renderMoviesGrid(movies, container, isListView = false) {
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

        const moviesHTML = movies.map(movie => 
            this.createMovieCard(movie, isListView)
        ).join('');
        
        container.innerHTML = moviesHTML;
    }
};

// Create singleton instance
const movieManager = new MovieManager();

export default movieManager;
