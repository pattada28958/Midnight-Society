/**
 * tmdb.js
 * Handles all communications with the TMDB API.
 */

const API_KEY = 'd05521f5c71cc160d76bbb403a460e61';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

window.HorrorTMDB = {
    HORROR_GENRE_ID: '27|53',
    
    // Mapping of sub-genres (TMDB genre IDs that commonly overlap with horror)
    SUB_GENRES: {
        27: 'Horror (ทั่วไป)',
        28: 'Action Horror (แอคชัน)',
        12: 'Adventure Horror (ผจญภัย)',
        35: 'Comedy Horror (ตลกสยองขวัญ)',
        80: 'Crime (อาชญากรรม)',
        99: 'Documentary (สารคดี)',
        18: 'Drama (ดราม่า)',
        14: 'Fantasy (แฟนตาซี)',
        9648: 'Mystery (ลึกลับสืบสวน)',
        878: 'Sci-Fi (ไซไฟ)',
        53: 'Thriller (ระทึกขวัญ)',
        10752: 'War (สงคราม)'
    },

    /**
     * Helper function for fetch requests
     * @param {string} endpoint 
     * @param {Object} params 
     * @returns {Promise<Object>}
     */
    fetchFromTMDB: async function(endpoint, params = {}) {
        const queryParams = new URLSearchParams({
            api_key: API_KEY,
            language: 'th-TH', // Prefer Thai translation
            ...params
        });

        const url = `${BASE_URL}${endpoint}?${queryParams.toString()}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching from TMDB endpoint ${endpoint}:`, error);
            throw error;
        }
    },

    /**
     * Get popular horror movies
     * @param {number} page 
     * @param {string} sortBy - sorting criteria
     * @returns {Promise<Object>}
     */
    getPopularHorrorMovies: async function(page = 1, sortBy = 'popularity.desc') {
        return this.fetchFromTMDB('/discover/movie', {
            with_genres: this.HORROR_GENRE_ID,
            sort_by: sortBy,
            page: page
        });
    },

    /**
     * Search movies by query, filtering only for Horror (genre 27)
     * @param {string} query 
     * @param {number} page 
     * @returns {Promise<Object>}
     */
    searchHorrorMovies: async function(query, page = 1) {
        if (!query || query.trim() === '') {
            return this.getPopularHorrorMovies(page);
        }
        
        // First, search all movies matching the query
        const results = await this.fetchFromTMDB('/search/movie', {
            query: query,
            page: page
        });

        // Filter results to only keep movies that belong to the Horror (27) or Thriller (53) genre
        results.results = results.results.filter(movie => 
            movie.genre_ids && (movie.genre_ids.includes(27) || movie.genre_ids.includes(53))
        );

        return results;
    },

    /**
     * Get detailed information about a movie, including cast and videos (trailers)
     * @param {number|string} movieId 
     * @returns {Promise<Object>}
     */
    getMovieDetails: async function(movieId) {
        try {
            const movieDetails = await this.fetchFromTMDB(`/movie/${movieId}`, {
                append_to_response: 'credits,videos,images',
                include_image_language: 'en,null',
                include_video_language: 'th,en,null'
            });

            // Fallback: If no videos were returned, explicitly fetch videos in English
            if (!movieDetails.videos || !movieDetails.videos.results || movieDetails.videos.results.length === 0) {
                try {
                    const fallbackVideos = await this.fetchFromTMDB(`/movie/${movieId}/videos`, {
                        language: 'en-US'
                    });
                    movieDetails.videos = fallbackVideos;
                } catch (videoError) {
                    console.warn(`Could not load fallback trailers for movie ${movieId}:`, videoError);
                }
            }

            // If overview is missing in Thai, fetch the English one
            if (!movieDetails.overview) {
                const englishDetails = await this.fetchFromTMDB(`/movie/${movieId}`, {
                    language: 'en-US'
                });
                movieDetails.overview = englishDetails.overview;
            }

            return movieDetails;
        } catch (error) {
            console.error(`Error loading movie details for ID ${movieId}`, error);
            throw error;
        }
    },

    /**
     * Get movie credits for a person (actor)
     * @param {number|string} personId 
     * @returns {Promise<Object>}
     */
    getActorCredits: async function(personId) {
        return this.fetchFromTMDB(`/person/${personId}/movie_credits`);
    },

    /**
     * Get the full image URL from TMDB path
     * @param {string} path - e.g. "/or06Ex5J2Vw23R35i6z86plPb1L.jpg"
     * @param {string} size - e.g. "w500", "w342", "original"
     * @returns {string} Fully qualified image URL or placeholder
     */
    getImageUrl: function(path, size = 'w500') {
        if (!path) {
            // Return a sleek placeholder if image is missing
            return 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=500&auto=format&fit=crop';
        }
        return `${IMAGE_BASE_URL}/${size}${path}`;
    }
};
