// Movie API functionality using TMDB
import CONFIG from './config.js';

const { TMDB_API_KEY, TMDB_BASE_URL } = CONFIG;

// Fetch popular movies
export async function fetchMovies(page = 1) {
    try {
        const response = await fetch(
            `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`
        );
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.results.map(movie => ({
            id: movie.id,
            title: movie.title,
            year: movie.release_date ? movie.release_date.split('-')[0] : 'Unknown',
            rating: movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A',
            poster: movie.poster_path 
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : 'images/placeholder-poster.jpg',
            overview: movie.overview || 'No description available.',
            genreIds: movie.genre_ids || []
        }));
    } catch (error) {
        console.error('Error fetching movies:', error);
        throw error;
    }
}

// Fetch movie genres
export async function fetchGenres() {
    try {
        const response = await fetch(
            `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.genres;
    } catch (error) {
        console.error('Error fetching genres:', error);
        return [];
    }
}

// Fetch movies by genre
export async function fetchMoviesByGenre(genreId, page = 1) {
    try {
        const response = await fetch(
            `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&page=${page}`
        );
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.results.map(movie => ({
            id: movie.id,
            title: movie.title,
            year: movie.release_date ? movie.release_date.split('-')[0] : 'Unknown',
            rating: movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A',
            poster: movie.poster_path 
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : 'images/placeholder-poster.jpg',
            overview: movie.overview || 'No description available.',
            genreIds: movie.genre_ids || []
        }));
    } catch (error) {
        console.error('Error fetching movies by genre:', error);
        throw error;
    }
}

// Search movies
export async function searchMovies(query, page = 1) {
    try {
        const response = await fetch(
            `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
        );
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.results.map(movie => ({
            id: movie.id,
            title: movie.title,
            year: movie.release_date ? movie.release_date.split('-')[0] : 'Unknown',
            rating: movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A',
            poster: movie.poster_path 
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : 'images/placeholder-poster.jpg',
            overview: movie.overview || 'No description available.',
            genreIds: movie.genre_ids || []
        }));
    } catch (error) {
        console.error('Error searching movies:', error);
        throw error;
    }
}
