/**
 * storage.js
 * Manages local storage persistence for the horror movie collection,
 * including personal ratings, watch statuses, reviews, and import/export.
 */

const STORAGE_KEY = 'horror_movie_collection';

window.HorrorStorage = {
    /**
     * Get all movies in the collection.
     * @returns {Array} List of movie objects
     */
    getCollection: function() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error reading from localStorage', e);
            return [];
        }
    },

    /**
     * Get a specific movie from the collection by its TMDB ID.
     * @param {number|string} movieId 
     * @returns {Object|null} The movie object if found, otherwise null
     */
    getMovieFromCollection: function(movieId) {
        const collection = this.getCollection();
        const id = parseInt(movieId, 10);
        return collection.find(movie => movie.id === id) || null;
    },

    /**
     * Save or update a movie in the collection.
     * @param {Object} movieData 
     */
    saveMovie: function(movieData) {
        if (!movieData || !movieData.id) {
            console.error('Cannot save movie without a valid ID');
            return;
        }

        const collection = this.getCollection();
        const id = parseInt(movieData.id, 10);
        const existingIndex = collection.findIndex(m => m.id === id);

        const updatedMovie = {
            id,
            title: movieData.title,
            poster_path: movieData.poster_path,
            backdrop_path: movieData.backdrop_path,
            release_date: movieData.release_date,
            vote_average: movieData.vote_average,
            runtime: movieData.runtime || null,
            genres: movieData.genres || [],
            production_countries: movieData.production_countries || [],
            watchStatus: movieData.watchStatus || 'watchlist', // 'watchlist', 'watching', 'watched'
            personalRating: movieData.personalRating !== undefined ? movieData.personalRating : null,
            review: movieData.review || '',
            imdbRating: movieData.imdbRating || null,
            rtRating: movieData.rtRating || null,
            updatedAt: new Date().toISOString()
        };

        if (existingIndex > -1) {
            collection[existingIndex] = {
                ...collection[existingIndex],
                ...updatedMovie
            };
        } else {
            updatedMovie.createdAt = new Date().toISOString();
            collection.push(updatedMovie);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(collection));
    },

    /**
     * Remove a movie from the collection.
     * @param {number|string} movieId 
     */
    removeMovie: function(movieId) {
        const collection = this.getCollection();
        const id = parseInt(movieId, 10);
        const filteredCollection = collection.filter(movie => movie.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredCollection));
    },

    /**
     * Get simple statistics of the collection.
     * @returns {Object} Statistics object
     */
    getStats: function() {
        const collection = this.getCollection();
        const total = collection.length;
        const watched = collection.filter(m => m.watchStatus === 'watched').length;
        const watching = collection.filter(m => m.watchStatus === 'watching').length;
        const watchlist = collection.filter(m => m.watchStatus === 'watchlist').length;
        
        const ratedMovies = collection.filter(m => m.personalRating !== null && m.personalRating > 0);
        const avgRating = ratedMovies.length > 0 
            ? (ratedMovies.reduce((sum, m) => sum + parseFloat(m.personalRating), 0) / ratedMovies.length).toFixed(1)
            : '0.0';

        return {
            total,
            watched,
            watching,
            watchlist,
            avgRating
        };
    },

    /**
     * Export the collection as a JSON string.
     * @returns {string} JSON string of the collection
     */
    exportCollection: function() {
        const collection = this.getCollection();
        return JSON.stringify(collection, null, 2);
    },

    /**
     * Import a collection from a JSON string.
     * @param {string} jsonString 
     * @returns {boolean} True if import succeeded, false otherwise
     */
    importCollection: function(jsonString) {
        try {
            const parsed = JSON.parse(jsonString);
            if (Array.isArray(parsed)) {
                const isValid = parsed.every(item => item && item.id && item.title);
                if (isValid) {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
                    return true;
                }
            }
            return false;
        } catch (e) {
            console.error('Failed to import collection data', e);
            return false;
        }
    },

    /**
     * Get all custom marathon playlists.
     * @returns {Array} List of playlists
     */
    getPlaylists: function() {
        try {
            const data = localStorage.getItem('horror_movie_playlists');
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error reading playlists from localStorage', e);
            return [];
        }
    },

    /**
     * Save or update a playlist.
     * @param {Object} playlistData 
     */
    savePlaylist: function(playlistData) {
        if (!playlistData || !playlistData.id) return;
        const playlists = this.getPlaylists();
        const existingIndex = playlists.findIndex(p => p.id === playlistData.id);
        
        const updatedPlaylist = {
            id: playlistData.id,
            name: playlistData.name,
            description: playlistData.description || '',
            movieIds: playlistData.movieIds || [],
            updatedAt: new Date().toISOString()
        };

        if (existingIndex > -1) {
            playlists[existingIndex] = {
                ...playlists[existingIndex],
                ...updatedPlaylist
            };
        } else {
            updatedPlaylist.createdAt = new Date().toISOString();
            playlists.push(updatedPlaylist);
        }
        localStorage.setItem('horror_movie_playlists', JSON.stringify(playlists));
    },

    /**
     * Remove a playlist by its ID.
     * @param {string} playlistId 
     */
    removePlaylist: function(playlistId) {
        const playlists = this.getPlaylists();
        const filtered = playlists.filter(p => p.id !== playlistId);
        localStorage.setItem('horror_movie_playlists', JSON.stringify(filtered));
    }
};
