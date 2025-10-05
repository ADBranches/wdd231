// Local storage management utilities
class StorageManager {
    constructor() {
        this.prefix = 'moviecatalog_';
        this.init();
    }

    init() {
        // Migrate old data if needed
        this.migrateOldData();
    }

    // Generic storage methods
    set(key, value) {
        try {
            const storageKey = this.prefix + key;
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(storageKey, serializedValue);
            return true;
        } catch (error) {
            console.error('Error saving to storage:', error);
            return false;
        }
    }

    get(key, defaultValue = null) {
        try {
            const storageKey = this.prefix + key;
            const item = localStorage.getItem(storageKey);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error reading from storage:', error);
            return defaultValue;
        }
    }

    remove(key) {
        try {
            const storageKey = this.prefix + key;
            localStorage.removeItem(storageKey);
            return true;
        } catch (error) {
            console.error('Error removing from storage:', error);
            return false;
        }
    }

    clear() {
        try {
            // Only remove keys with our prefix
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.prefix)) {
                    keysToRemove.push(key);
                }
            }
            
            keysToRemove.forEach(key => localStorage.removeItem(key));
            return true;
        } catch (error) {
            console.error('Error clearing storage:', error);
            return false;
        }
    }

    // Movie favorites management
    getFavorites() {
        return this.get('favorites', []);
    }

    addToFavorites(movie) {
        const favorites = this.getFavorites();
        
        // Check if movie already exists
        const exists = favorites.some(fav => fav.id === movie.id);
        if (exists) {
            return { success: false, message: 'Movie already in favorites' };
        }

        // Add movie to favorites
        favorites.push({
            id: movie.id,
            title: movie.title,
            year: movie.year,
            rating: movie.rating,
            poster: movie.poster,
            overview: movie.overview,
            addedAt: new Date().toISOString()
        });

        const success = this.set('favorites', favorites);
        
        return { 
            success, 
            message: success ? 'Movie added to favorites' : 'Failed to add to favorites'
        };
    }

    removeFromFavorites(movieId) {
        const favorites = this.getFavorites();
        const initialLength = favorites.length;
        
        const updatedFavorites = favorites.filter(fav => fav.id !== movieId);
        
        if (updatedFavorites.length === initialLength) {
            return { success: false, message: 'Movie not found in favorites' };
        }

        const success = this.set('favorites', updatedFavorites);
        
        return { 
            success, 
            message: success ? 'Movie removed from favorites' : 'Failed to remove from favorites'
        };
    }

    isFavorite(movieId) {
        const favorites = this.getFavorites();
        return favorites.some(fav => fav.id === movieId);
    }

    // User preferences
    getUserPreferences() {
        return this.get('userPreferences', {
            theme: 'light',
            viewMode: 'grid',
            itemsPerPage: 20,
            language: 'en-US'
        });
    }

    updateUserPreferences(preferences) {
        const currentPreferences = this.getUserPreferences();
        const updatedPreferences = { ...currentPreferences, ...preferences };
        return this.set('userPreferences', updatedPreferences);
    }

    // Search history
    getSearchHistory() {
        return this.get('searchHistory', []);
    }

    addToSearchHistory(query) {
        if (!query || query.trim().length === 0) return;
        
        const history = this.getSearchHistory();
        const normalizedQuery = query.trim().toLowerCase();
        
        // Remove existing entry if it exists
        const filteredHistory = history.filter(item => 
            item.query.toLowerCase() !== normalizedQuery
        );
        
        // Add new entry at the beginning
        filteredHistory.unshift({
            query: query.trim(),
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 10 searches
        const trimmedHistory = filteredHistory.slice(0, 10);
        
        this.set('searchHistory', trimmedHistory);
        return trimmedHistory;
    }

    clearSearchHistory() {
        return this.set('searchHistory', []);
    }

    // Movie suggestions (form submissions)
    getMovieSuggestions() {
        return this.get('movieSuggestions', []);
    }

    saveMovieSuggestion(suggestion) {
        const suggestions = this.getMovieSuggestions();
        
        const newSuggestion = {
            id: this.generateSuggestionId(),
            ...suggestion,
            submittedAt: new Date().toISOString(),
            status: 'pending'
        };
        
        suggestions.push(newSuggestion);
        const success = this.set('movieSuggestions', suggestions);
        
        return { 
            success, 
            suggestion: newSuggestion,
            message: success ? 'Suggestion saved successfully' : 'Failed to save suggestion'
        };
    }

    // Watchlist functionality
    getWatchlist() {
        return this.get('watchlist', []);
    }

    addToWatchlist(movie) {
        const watchlist = this.getWatchlist();
        
        const exists = watchlist.some(item => item.id === movie.id);
        if (exists) {
            return { success: false, message: 'Movie already in watchlist' };
        }

        watchlist.push({
            id: movie.id,
            title: movie.title,
            year: movie.year,
            rating: movie.rating,
            poster: movie.poster,
            addedAt: new Date().toISOString(),
            watched: false
        });

        const success = this.set('watchlist', watchlist);
        
        return { 
            success, 
            message: success ? 'Movie added to watchlist' : 'Failed to add to watchlist'
        };
    }

    markAsWatched(movieId) {
        const watchlist = this.getWatchlist();
        const movieIndex = watchlist.findIndex(item => item.id === movieId);
        
        if (movieIndex === -1) {
            return { success: false, message: 'Movie not found in watchlist' };
        }

        watchlist[movieIndex].watched = true;
        watchlist[movieIndex].watchedAt = new Date().toISOString();
        
        const success = this.set('watchlist', watchlist);
        
        return { 
            success, 
            message: success ? 'Movie marked as watched' : 'Failed to update watchlist'
        };
    }

    // Utility methods
    generateSuggestionId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `SUGGEST-${timestamp}-${random}`.toUpperCase();
    }

    migrateOldData() {
        // Migrate from non-prefixed keys to prefixed keys
        const oldKeys = ['favorites', 'userPreferences', 'searchHistory'];
        
        oldKeys.forEach(key => {
            const oldValue = localStorage.getItem(key);
            if (oldValue) {
                this.set(key, JSON.parse(oldValue));
                localStorage.removeItem(key);
            }
        });
    }

    // Storage statistics
    getStorageStats() {
        let totalSize = 0;
        let itemCount = 0;

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.prefix)) {
                const value = localStorage.getItem(key);
                totalSize += (key.length + (value ? value.length : 0)) * 2; // Approximate size in bytes
                itemCount++;
            }
        }

        return {
            itemCount,
            totalSize: this.formatBytes(totalSize),
            usagePercentage: ((totalSize / (5 * 1024 * 1024)) * 100).toFixed(2) + '%' // 5MB limit
        };
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Create singleton instance
const storageManager = new StorageManager();

export default storageManager;
