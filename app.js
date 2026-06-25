/**
 * app.js
 * Main controller for the Midnight Society Horror Movie Collection Web Application.
 */

// Grab global storage and TMDB objects defined in storage.js and tmdb.js
const Storage = window.HorrorStorage;
const TMDB = window.HorrorTMDB;

// --- FALLBACK DATABASE (If TMDB API is offline or slow) ---
const DEFAULT_HERO_MOVIES = [
    {
        id: 138843,
        title: 'เดอะ คอนเจอริ่ง คนเรียกผี (The Conjuring)',
        release_date: '2013-07-18',
        runtime: 112,
        vote_average: 7.5,
        overview: 'เรื่องราวของคู่สามีภรรยานักปราบผี เอ็ด และ ลอเรน วอร์เรน ที่ถูกเชิญไปช่วยครอบครัวหนึ่งที่เพิ่งย้ายเข้าไปอยู่ในบ้านหลังใหม่ในรัฐโรดไอส์แลนด์ และพบกับปรากฏการณ์เหนือธรรมชาติที่น่าสะพรึงกลัวที่สุดในชีวิตของพวกเขา',
        backdrop_path: '/r7w1tIeM43RL5u48jOiEp4mCc0.jpg',
        poster_path: '/w19R39d892pA77N44bE28QcK1S.jpg',
        videos: {
            results: [
                { site: 'YouTube', type: 'Trailer', key: 'k10ETZ74FM4' }
            ]
        }
    },
    {
        id: 1008042,
        title: 'จับมือผี (Talk to Me)',
        release_date: '2022-10-30',
        runtime: 95,
        vote_average: 7.2,
        overview: 'เมื่อกลุ่มเพื่อนซี้ค้นพบวิธีปลุกวิญญาณด้วยมือสตาฟสุดลึกลับ พวกเขาจึงเริ่มสนุกกับความตื่นเต้นท้าทายใหม่ จนกระทั่งหนึ่งในนั้นก้าวข้ามเส้นขอบเขตและปลดปล่อยพลังงานดำมืดที่น่าสะพรึงกลัวออกมา',
        backdrop_path: '/or06Ex5J2Vw23R35i6z86plPb1L.jpg',
        poster_path: '/kdPMhk6ICcl16WvWQv6mfsr6cUr.jpg',
        videos: {
            results: [
                { site: 'YouTube', type: 'Trailer', key: 'aLg4AV60C_g' }
            ]
        }
    }
];

const FALLBACK_POPULAR_MOVIES = [
    {
        id: 138843,
        title: 'เดอะ คอนเจอริ่ง คนเรียกผี (The Conjuring)',
        release_date: '2013-07-18',
        vote_average: 7.5,
        poster_path: '/w19R39d892pA77N44bE28QcK1S.jpg',
        backdrop_path: '/r7w1tIeM43RL5u48jOiEp4mCc0.jpg'
    },
    {
        id: 1008042,
        title: 'จับมือผี (Talk to Me)',
        release_date: '2022-10-30',
        vote_average: 7.2,
        poster_path: '/kdPMhk6ICcl16WvWQv6mfsr6cUr.jpg',
        backdrop_path: '/or06Ex5J2Vw23R35i6z86plPb1L.jpg'
    },
    {
        id: 520763,
        title: 'ดินแดนไร้เสียง (A Quiet Place)',
        release_date: '2018-04-03',
        vote_average: 7.4,
        poster_path: '/nAU74GvXw7JNDgdIYwS2Y7gi00C.jpg',
        backdrop_path: '/roYmq6ir67G5H21w4G5gG7gG9.jpg'
    },
    {
        id: 419430,
        title: 'ลวงร่างสะกดสยอง (Get Out)',
        release_date: '2017-02-24',
        vote_average: 7.6,
        poster_path: '/tww4apPM40fE2.jpg',
        backdrop_path: '/lh5nhjeS.jpg'
    },
    {
        id: 536554,
        title: 'เมแกน (M3GAN)',
        release_date: '2022-12-28',
        vote_average: 7.0,
        poster_path: '/d9154UY.jpg',
        backdrop_path: '/dlr231s.jpg'
    },
    {
        id: 346364,
        title: 'อิท โผล่จากนรก (IT)',
        release_date: '2017-09-05',
        vote_average: 7.2,
        poster_path: '/9E2n6e.jpg',
        backdrop_path: '/nMKd.jpg'
    }
];

// --- STATE MANAGEMENT ---
let activeTab = 'collection'; // 'collection', 'playlists' or 'discover'
let currentSearchQuery = '';
let discoverPage = 1;
let discoverTotalPages = 1;
let discoverMoviesList = []; // Cache of currently shown TMDB search results

// Shared Profile Mode State
let isSharedProfileMode = false;
let sharedCollectionData = [];

// Modal State
let selectedMovieData = null;
let activeMovieRating = 0; // 0-10
let activeMovieWatchStatus = 'watchlist'; // 'watchlist', 'watching', 'watched'

// Additional Gothic States
let activePlaylistFilterId = null;
let idleTimer = null;
let fogAnimationId = null;
let featuredMovies = [];
let currentHeroIndex = 0;
let heroAutoSlideTimer = null;

// --- DOM ELEMENTS ---
const tabCollection = document.getElementById('tab-collection');
const tabDiscover = document.getElementById('tab-discover');
const shareBtn = document.getElementById('share-btn');
const exportBtn = document.getElementById('export-btn');
const importBtnTrigger = document.getElementById('import-btn-trigger');
const importFileInput = document.getElementById('import-file-input');

// Settings elements
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const settingsCloseBtn = document.getElementById('settings-close-btn');
const settingsOmdbKey = document.getElementById('settings-omdb-key');
const settingsSaveBtn = document.getElementById('settings-save-btn');

// Shared Mode Banner Elements
const sharedBanner = document.getElementById('shared-banner');
const exitSharedBtn = document.getElementById('exit-shared-btn');

// Hero Banner Elements
const heroBanner = document.getElementById('hero-banner');
const heroPrevBtn = document.getElementById('hero-prev-btn');
const heroNextBtn = document.getElementById('hero-next-btn');
const heroIndicators = document.getElementById('hero-indicators');
const heroPosterWrapper = document.getElementById('hero-poster-wrapper');
const heroBannerContent = document.getElementById('hero-banner-content');

// Stats Elements
const statTotal = document.getElementById('stat-total');
const statWatched = document.getElementById('stat-watched');
const statWatchlist = document.getElementById('stat-watchlist');
const statAvg = document.getElementById('stat-avg');

// Search & Filter Elements
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const genreFilter = document.getElementById('genre-filter');
const yearFilter = document.getElementById('year-filter');
const countryFilter = document.getElementById('country-filter');
const sortFilter = document.getElementById('sort-filter');
const sectionTitle = document.getElementById('section-title');
const movieGrid = document.getElementById('movie-grid');

// Layout Mode Containers
const slidersModeContainer = document.getElementById('sliders-mode-container');
const gridModeContainer = document.getElementById('grid-mode-container');
const sliderTrending = document.getElementById('slider-trending');
const sliderUpcoming = document.getElementById('slider-upcoming');
const sliderPopularDiscover = document.getElementById('slider-popular-discover');

// Pagination Elements
const paginationContainer = document.getElementById('pagination-container');
const prevPageBtn = document.getElementById('prev-page-btn');
const nextPageBtn = document.getElementById('next-page-btn');
const pageNumberLabel = document.getElementById('page-number');

// Modal Elements
const movieDetailModal = document.getElementById('movie-detail-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalBackdrop = document.getElementById('modal-backdrop');
const modalPoster = document.getElementById('modal-poster');
const modalTagline = document.getElementById('modal-tagline');
const modalTitle = document.getElementById('modal-title');
const modalYear = document.getElementById('modal-year');
const modalRuntime = document.getElementById('modal-runtime');
const modalCountry = document.getElementById('modal-country');
const modalTmdbRating = document.getElementById('modal-tmdb-rating');
const modalOverview = document.getElementById('modal-overview');
const modalCastContainer = document.getElementById('modal-cast-container');
const modalTrailerBtn = document.getElementById('modal-trailer-btn');

// Trailer Modal Elements
const trailerModal = document.getElementById('trailer-modal');
const trailerCloseBtn = document.getElementById('trailer-close-btn');
const trailerVideo = document.getElementById('trailer-video');
const trailerExternalBtn = document.getElementById('trailer-external-btn');

// Modal Interactive Controls
const statusBtnWatchlist = document.getElementById('status-btn-watchlist');
const statusBtnWatching = document.getElementById('status-btn-watching');
const statusBtnWatched = document.getElementById('status-btn-watched');
const starsContainer = document.getElementById('modal-stars-container');
const currentRatingVal = document.getElementById('current-rating-val');
const modalReviewText = document.getElementById('modal-review-text');
const modalSaveBtn = document.getElementById('modal-save-btn');
const modalDeleteBtn = document.getElementById('modal-delete-btn');

// Genres container display
const modalGenresContainer = document.getElementById('modal-genres-container');

// Gallery & Lightbox Elements
const modalGalleryContainer = document.getElementById('modal-gallery-container');
const lightboxModal = document.getElementById('lightbox-modal');
const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
const lightboxImg = document.getElementById('lightbox-img');

// New Tab and Playlist Elements
const tabPlaylists = document.getElementById('tab-playlists');
const playlistsTabContainer = document.getElementById('playlists-tab-container');
const playlistsGrid = document.getElementById('playlists-grid');
const tabCharacters = document.getElementById('tab-characters');
const charactersTabContainer = document.getElementById('characters-tab-container');
const charactersGrid = document.getElementById('characters-grid');
const createPlaylistBtn = document.getElementById('create-playlist-btn');
const playlistModal = document.getElementById('playlist-modal');
const playlistCloseBtn = document.getElementById('playlist-close-btn');
const playlistNameInput = document.getElementById('playlist-name');
const playlistDescInput = document.getElementById('playlist-desc');
const playlistMovieSelection = document.getElementById('playlist-movie-selection');
const playlistSaveBtn = document.getElementById('playlist-save-btn');
const playlistEditId = document.getElementById('playlist-edit-id');
const playlistModalTitle = document.getElementById('playlist-modal-title');

// Analytics and Jumpscare Elements
const analyticsToggleBtn = document.getElementById('analytics-toggle-btn');
const analyticsPanel = document.getElementById('analytics-panel');
const jumpscareOverlay = document.getElementById('jumpscare-overlay');
const settingsJumpscareToggle = document.getElementById('settings-jumpscare-toggle');
const controlPanel = document.querySelector('.control-panel');
const achievementsGrid = document.getElementById('achievements-grid');

// Ticket Generator Elements
const modalTicketBtn = document.getElementById('modal-ticket-btn');
const ticketModal = document.getElementById('ticket-modal');
const ticketCloseBtn = document.getElementById('ticket-close-btn');
const ticketOwnerName = document.getElementById('ticket-owner-name');
const ticketSeatNo = document.getElementById('ticket-seat-no');
const ticketRandomSeatBtn = document.getElementById('ticket-random-seat-btn');
const ticketCanvas = document.getElementById('ticket-canvas');
const ticketDownloadBtn = document.getElementById('ticket-download-btn');

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // 1. Build rating stars in the modal sidebar
    buildRatingStars();

    // 2. Set up event listeners
    setupEventListeners();

    // 3. Check for Shared Profile parameter in URL
    checkSharedProfileLink();

    // 4. Load the Cinematic Hero Banner dynamically from TMDB
    loadHeroBanner();

    // 5. Render initial state
    updateStatsDashboard();
    
    // Check for shared playlist link
    checkSharedPlaylistLink();
    
    if (activeTab === 'collection') {
        renderMyCollection();
    }
    
    // Initialize fog loop
    initFogEffect();
    
    // Initialize Jumpscare Idle
    initJumpscareIdleDetector();
    
    // Initialize Soundscape
    initSoundscapeState();
}

function initSoundscapeState() {
    const soundscapeActive = localStorage.getItem('settings-soundscape-active') === 'true';
    if (soundscapeActive) {
        // Sync UI state immediately even before first click interaction starts the audio context
        const soundscapeBtn = document.getElementById('soundscape-btn');
        const soundscapeToggle = document.getElementById('settings-soundscape-toggle');
        if (soundscapeBtn) {
            soundscapeBtn.classList.add('active');
            const icon = soundscapeBtn.querySelector('i');
            if (icon) {
                icon.className = 'fa-solid fa-volume-high';
            }
        }
        if (soundscapeToggle) {
            soundscapeToggle.checked = true;
        }

        const startOnFirstClick = () => {
            if (localStorage.getItem('settings-soundscape-active') === 'true') {
                SoundscapeEngine.startAmbient();
            }
            document.body.removeEventListener('click', startOnFirstClick);
            document.body.removeEventListener('keydown', startOnFirstClick);
        };
        document.body.addEventListener('click', startOnFirstClick);
        document.body.addEventListener('keydown', startOnFirstClick);
    }
}

// --- CHECK SHARED LINK ---
function checkSharedProfileLink() {
    const urlParams = new URLSearchParams(window.location.search);
    const shareParam = urlParams.get('share');
    
    if (shareParam) {
        try {
            const decodedData = decodeCollectionData(shareParam);
            if (Array.isArray(decodedData) && decodedData.length > 0) {
                isSharedProfileMode = true;
                sharedCollectionData = decodedData;

                // Show Shared Banner
                sharedBanner.style.display = 'block';

                // Hide modify buttons from header to avoid confusion
                shareBtn.style.display = 'none';
                exportBtn.style.display = 'none';
                importBtnTrigger.style.display = 'none';
                
                // Set default views
                activeTab = 'collection';
                tabDiscover.style.display = 'none'; // Hide discover in shared mode
            }
        } catch (error) {
            console.error('Failed to parse share parameter', error);
            alert('ลิงก์แชร์ไม่ถูกต้อง หรือมีข้อมูลที่ชำรุดเสียหาย');
            isSharedProfileMode = false;
        }
    }
}

// --- DYNAMIC HERO BANNER LOADER & CAROUSEL ---
function renderHeroBannerData(details) {
    if (!heroBanner || !details) return;

    const heroTitle = document.getElementById('hero-title');
    const heroYear = document.getElementById('hero-year');
    const heroRuntime = document.getElementById('hero-runtime');
    const heroRating = document.getElementById('hero-rating');
    const heroDescription = document.getElementById('hero-description');
    const heroDetailsBtn = document.getElementById('hero-details-btn');
    const heroTrailerBtn = document.getElementById('hero-trailer-btn');
    const heroPoster = document.getElementById('hero-poster');
    
    // Populate text content
    heroTitle.textContent = details.title || 'หวีดสุดขีด';
    
    const year = details.release_date ? details.release_date.split('-')[0] : '-';
    heroYear.innerHTML = `<i class="fa-regular fa-calendar"></i> ${year}`;
    
    const runtime = details.runtime ? `${details.runtime} นาที` : '-';
    heroRuntime.innerHTML = `<i class="fa-regular fa-clock"></i> ${runtime}`;
    
    let voteAverage = '-.-';
    if (details.vote_average !== undefined && details.vote_average !== null) {
        const numVal = parseFloat(details.vote_average);
        if (!isNaN(numVal)) {
            voteAverage = numVal.toFixed(1);
        }
    }
    heroRating.innerHTML = `<i class="fa-solid fa-star"></i> TMDB ${voteAverage}`;
    
    heroDescription.textContent = details.overview || 'ไม่มีคำแนะนำเรื่องย่อสำหรับภาพยนตร์เรื่องนี้';
    
    // Set poster image if element is present
    if (heroPoster) {
        heroPoster.src = TMDB.getImageUrl(details.poster_path, 'w342');
    }
    
    // Set backdrop image
    if (details.backdrop_path) {
        // Preload image to avoid visual flash or blank screen
        const bgImg = new Image();
        bgImg.src = TMDB.getImageUrl(details.backdrop_path, 'original');
        bgImg.onload = () => {
            heroBanner.style.backgroundImage = `url('${bgImg.src}')`;
        };
    } else {
        heroBanner.style.backgroundImage = 'radial-gradient(circle, #25090f 0%, #08080c 100%)';
    }
    
    // Clone details button to clear previous event listeners cleanly
    const newDetailsBtn = heroDetailsBtn.cloneNode(true);
    heroDetailsBtn.parentNode.replaceChild(newDetailsBtn, heroDetailsBtn);
    newDetailsBtn.addEventListener('click', () => {
        openMovieModal(details.id);
    });
    
    // Configure trailer watch button on the hero banner
    let trailerFound = false;
    if (details.videos && details.videos.results && details.videos.results.length > 0) {
        const trailer = details.videos.results.find(v => v.site === 'YouTube' && v.type === 'Trailer') ||
                        details.videos.results.find(v => v.site === 'YouTube');
        if (trailer) {
            const newTrailerBtn = heroTrailerBtn.cloneNode(true);
            heroTrailerBtn.parentNode.replaceChild(newTrailerBtn, heroTrailerBtn);
            newTrailerBtn.dataset.videoKey = trailer.key;
            newTrailerBtn.style.display = 'block';
            newTrailerBtn.addEventListener('click', () => {
                playMovieTrailerFromKey(trailer.key);
            });
            trailerFound = true;
        }
    }
    
    if (!trailerFound) {
        heroTrailerBtn.style.display = 'none';
    }
    
    // Make the banner visible
    heroBanner.style.display = 'flex';
}

async function loadHeroBanner() {
    if (!heroBanner) return;
    
    // Load fallbacks as featured movies initially
    featuredMovies = [...DEFAULT_HERO_MOVIES];
    currentHeroIndex = 0;
    renderHeroBannerData(featuredMovies[0]);
    buildHeroIndicators();
    startHeroAutoSlide();
    
    try {
        // Fetch trending horror movies page 1
        const trending = await TMDB.getPopularHorrorMovies(1);
        if (trending && trending.results && trending.results.length > 0) {
            // Take top 5 trending movies
            featuredMovies = trending.results.slice(0, 5);
            currentHeroIndex = 0;
            
            // Fetch full details of the first movie dynamically (trailers/runtime)
            const details = await TMDB.getMovieDetails(featuredMovies[0].id);
            featuredMovies[0] = details; // Cache details back
            
            // Render trending movie details over the fallback
            renderHeroBannerData(details);
            buildHeroIndicators();
            startHeroAutoSlide();
        }
    } catch (err) {
        console.error("Failed to load trending hero banner, keeping fallback", err);
    }
}

function buildHeroIndicators() {
    if (!heroIndicators || featuredMovies.length <= 1) {
        if (heroIndicators) heroIndicators.innerHTML = '';
        return;
    }
    
    heroIndicators.innerHTML = '';
    featuredMovies.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.className = `hero-dot ${idx === currentHeroIndex ? 'active' : ''}`;
        dot.addEventListener('click', () => {
            if (idx === currentHeroIndex) return;
            SoundscapeEngine.playClickSFX();
            switchHeroSlide(idx);
        });
        heroIndicators.appendChild(dot);
    });
}

function startHeroAutoSlide() {
    stopHeroAutoSlide();
    if (featuredMovies.length <= 1) return;
    
    heroAutoSlideTimer = setInterval(() => {
        const nextIndex = (currentHeroIndex + 1) % featuredMovies.length;
        switchHeroSlide(nextIndex);
    }, 8000); // Rotate every 8 seconds
}

function stopHeroAutoSlide() {
    if (heroAutoSlideTimer) {
        clearInterval(heroAutoSlideTimer);
        heroAutoSlideTimer = null;
    }
}

async function switchHeroSlide(index) {
    if (index < 0 || index >= featuredMovies.length) return;
    
    stopHeroAutoSlide(); // Pause timer while fetching/loading
    
    currentHeroIndex = index;
    
    // 1. Add fade-out transition classes
    if (heroPosterWrapper) heroPosterWrapper.classList.add('hero-fade-out');
    if (heroBannerContent) heroBannerContent.classList.add('hero-fade-out');
    
    // Update dots indicators immediately for a snappy feel
    if (heroIndicators) {
        const dots = heroIndicators.querySelectorAll('.hero-dot');
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentHeroIndex);
        });
    }
    
    // Wait for the fade-out CSS transition (400ms)
    setTimeout(async () => {
        try {
            const movie = featuredMovies[currentHeroIndex];
            
            // Check if details are full or need to fetch dynamically
            let details = movie;
            if (!movie.runtime && !movie.tagline) {
                details = await TMDB.getMovieDetails(movie.id);
                featuredMovies[currentHeroIndex] = details; // Cache details back
            }
            
            renderHeroBannerData(details);
            
        } catch (err) {
            console.error("Failed to load hero slide details", err);
        } finally {
            // 2. Remove fade-out class to trigger fade-in transition
            if (heroPosterWrapper) heroPosterWrapper.classList.remove('hero-fade-out');
            if (heroBannerContent) heroBannerContent.classList.remove('hero-fade-out');
            
            // Restart the auto-slide timer
            startHeroAutoSlide();
        }
    }, 400);
}

function playMovieTrailerFromKey(videoKey) {
    if (videoKey) {
        trailerVideo.src = `https://www.youtube-nocookie.com/embed/${videoKey}?autoplay=1`;
        if (trailerExternalBtn) {
            trailerExternalBtn.href = `https://www.youtube.com/watch?v=${videoKey}`;
        }
        trailerModal.classList.add('active');
    }
}

// --- EVENT LISTENERS ---
function setupEventListeners() {
    // Soundscape Toggle Button
    const soundscapeBtn = document.getElementById('soundscape-btn');
    if (soundscapeBtn) {
        soundscapeBtn.addEventListener('click', () => toggleSoundscapeState());
    }

    // Hero Banner Carousel Navigation Arrows
    if (heroPrevBtn) {
        heroPrevBtn.addEventListener('click', () => {
            SoundscapeEngine.playClickSFX();
            const prevIdx = (currentHeroIndex - 1 + featuredMovies.length) % featuredMovies.length;
            switchHeroSlide(prevIdx);
        });
    }
    if (heroNextBtn) {
        heroNextBtn.addEventListener('click', () => {
            SoundscapeEngine.playClickSFX();
            const nextIdx = (currentHeroIndex + 1) % featuredMovies.length;
            switchHeroSlide(nextIdx);
        });
    }

    // Tab switching
    tabCollection.addEventListener('click', () => switchTab('collection'));
    if (tabPlaylists) tabPlaylists.addEventListener('click', () => switchTab('playlists'));
    if (tabCharacters) tabCharacters.addEventListener('click', () => switchTab('characters'));
    tabDiscover.addEventListener('click', () => switchTab('discover'));

    // Search trigger
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    // Filters & Sorting triggers
    genreFilter.addEventListener('change', handleFilterChange);
    yearFilter.addEventListener('change', handleFilterChange);
    countryFilter.addEventListener('change', handleFilterChange);
    sortFilter.addEventListener('change', handleFilterChange);

    // Modal Close
    modalCloseBtn.addEventListener('click', closeMovieModal);
    movieDetailModal.addEventListener('click', (e) => {
        if (e.target === movieDetailModal) closeMovieModal();
    });

    // Trailer Modal triggers
    modalTrailerBtn.addEventListener('click', playMovieTrailer);
    trailerCloseBtn.addEventListener('click', stopMovieTrailer);
    trailerModal.addEventListener('click', (e) => {
        if (e.target === trailerModal) stopMovieTrailer();
    });

    // Modal Saving / Deleting (Only if not in Shared mode)
    modalSaveBtn.addEventListener('click', saveActiveMovie);
    modalDeleteBtn.addEventListener('click', deleteActiveMovie);

    // Watch Status selection inside Modal
    const statusBtns = [statusBtnWatchlist, statusBtnWatching, statusBtnWatched];
    statusBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (isSharedProfileMode) return; // Read-only
            statusBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeMovieWatchStatus = btn.dataset.status;
        });
    });

    // Pagination (Discover page only)
    prevPageBtn.addEventListener('click', () => changeDiscoverPage(-1));
    nextPageBtn.addEventListener('click', () => changeDiscoverPage(1));

    // Share link button click
    shareBtn.addEventListener('click', handleShareLinkGeneration);

    // Backup & Restore
    exportBtn.addEventListener('click', handleExport);
    importBtnTrigger.addEventListener('click', () => importFileInput.click());
    importFileInput.addEventListener('change', handleImport);

    // Exit Shared view button
    exitSharedBtn.addEventListener('click', () => {
        // Clear query parameters and reload
        window.location.href = window.location.pathname;
    });

    // Settings modal listeners
    settingsBtn.addEventListener('click', openSettingsModal);
    settingsCloseBtn.addEventListener('click', closeSettingsModal);
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) closeSettingsModal();
    });
    settingsSaveBtn.addEventListener('click', saveSettings);

    // Actor filmography modal listeners
    const actorMoviesCloseBtn = document.getElementById('actor-movies-close-btn');
    const actorMoviesModal = document.getElementById('actor-movies-modal');
    if (actorMoviesCloseBtn && actorMoviesModal) {
        actorMoviesCloseBtn.addEventListener('click', closeActorMoviesModal);
        actorMoviesModal.addEventListener('click', (e) => {
            if (e.target === actorMoviesModal) closeActorMoviesModal();
        });
    }

    // Lightbox modal listeners
    if (lightboxCloseBtn && lightboxModal) {
        lightboxCloseBtn.addEventListener('click', closeLightbox);
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) closeLightbox();
        });
    }

    // Character detail modal listeners
    const characterCloseBtn = document.getElementById('character-detail-close-btn');
    const characterDetailModal = document.getElementById('character-detail-modal');
    if (characterCloseBtn && characterDetailModal) {
        characterCloseBtn.addEventListener('click', closeCharacterModal);
        characterDetailModal.addEventListener('click', (e) => {
            if (e.target === characterDetailModal) closeCharacterModal();
        });
    }

    // Playlist modal listeners
    if (createPlaylistBtn) createPlaylistBtn.addEventListener('click', () => openPlaylistModal());
    if (playlistCloseBtn) playlistCloseBtn.addEventListener('click', closePlaylistModal);
    if (playlistModal) {
        playlistModal.addEventListener('click', (e) => {
            if (e.target === playlistModal) closePlaylistModal();
        });
    }
    if (playlistSaveBtn) playlistSaveBtn.addEventListener('click', savePlaylistData);

    // Analytics toggle
    if (analyticsToggleBtn) analyticsToggleBtn.addEventListener('click', toggleAnalyticsPanel);

    // Ticket Generator listeners
    if (modalTicketBtn) modalTicketBtn.addEventListener('click', openTicketModal);
    if (ticketCloseBtn) ticketCloseBtn.addEventListener('click', closeTicketModal);
    if (ticketModal) {
        ticketModal.addEventListener('click', (e) => {
            if (e.target === ticketModal) closeTicketModal();
        });
    }
    if (ticketRandomSeatBtn) ticketRandomSeatBtn.addEventListener('click', handleRandomSeatClick);
    if (ticketOwnerName) ticketOwnerName.addEventListener('input', handleTicketOwnerInput);
    if (ticketDownloadBtn) ticketDownloadBtn.addEventListener('click', handleTicketDownloadClick);
}

// --- TAB NAVIGATION ---
function switchTab(tabName) {
    if (activeTab === tabName) return;
    
    activeTab = tabName;
    
    // Update active UI classes on tabs
    tabCollection.classList.toggle('active', activeTab === 'collection');
    if (tabPlaylists) tabPlaylists.classList.toggle('active', activeTab === 'playlists');
    if (tabCharacters) tabCharacters.classList.toggle('active', activeTab === 'characters');
    tabDiscover.classList.toggle('active', activeTab === 'discover');

    // Reset controls input values on tab switch
    searchInput.value = '';
    currentSearchQuery = '';
    genreFilter.value = '';
    yearFilter.value = '';
    countryFilter.value = '';
    
    // Adjust Sort Option for Collection vs Discover
    const sortOptLatest = document.getElementById('sort-opt-latest');
    const sortOptPersonal = document.getElementById('sort-opt-personal');
    
    // Hide controls and playlists by default
    if (playlistsTabContainer) playlistsTabContainer.style.display = 'none';
    if (charactersTabContainer) charactersTabContainer.style.display = 'none';
    if (controlPanel) controlPanel.style.display = 'flex';
    
    if (activeTab === 'collection') {
        if (heroBanner) heroBanner.style.display = 'flex';
        sortFilter.value = 'latest_added';
        if (sortOptLatest) sortOptLatest.style.display = 'block';
        if (sortOptPersonal) sortOptPersonal.style.display = 'block';
        
        // Hide sliders & pagination
        slidersModeContainer.style.display = 'none';
        gridModeContainer.style.display = 'block';
        paginationContainer.style.display = 'none';
        
        renderMyCollection();
    } else if (activeTab === 'playlists') {
        if (heroBanner) heroBanner.style.display = 'none';
        if (controlPanel) controlPanel.style.display = 'none';
        slidersModeContainer.style.display = 'none';
        gridModeContainer.style.display = 'none';
        paginationContainer.style.display = 'none';
        
        if (playlistsTabContainer) playlistsTabContainer.style.display = 'block';
        renderPlaylists();
    } else if (activeTab === 'characters') {
        if (heroBanner) heroBanner.style.display = 'none';
        if (controlPanel) controlPanel.style.display = 'none';
        slidersModeContainer.style.display = 'none';
        gridModeContainer.style.display = 'none';
        paginationContainer.style.display = 'none';
        
        if (charactersTabContainer) charactersTabContainer.style.display = 'block';
        renderCharacters();
    } else {
        if (heroBanner) heroBanner.style.display = 'flex';
        sortFilter.value = 'tmdb_desc'; // Default TMDB sort
        if (sortOptLatest) sortOptLatest.style.display = 'none';
        if (sortOptPersonal) sortOptPersonal.style.display = 'none';
        
        slidersModeContainer.style.display = 'block';
        gridModeContainer.style.display = 'none';
        paginationContainer.style.display = 'none';
        
        discoverPage = 1;
        fetchAndRenderDiscover();
    }
}

// --- STATS SYSTEM ---
function updateStatsDashboard() {
    if (isSharedProfileMode) {
        // Stats for shared profile data
        const total = sharedCollectionData.length;
        const watched = sharedCollectionData.filter(m => m.watchStatus === 'watched').length;
        const watchlist = sharedCollectionData.filter(m => m.watchStatus === 'watching' || m.watchStatus === 'watchlist').length;
        const ratedMovies = sharedCollectionData.filter(m => m.personalRating !== null && m.personalRating > 0);
        const avgRating = ratedMovies.length > 0 
            ? (ratedMovies.reduce((sum, m) => sum + parseFloat(m.personalRating), 0) / ratedMovies.length).toFixed(1)
            : '0.0';

        statTotal.textContent = total;
        statWatched.textContent = watched;
        statWatchlist.textContent = watchlist;
        statAvg.textContent = avgRating;
    } else {
        // Normal stats
        const stats = Storage.getStats();
        statTotal.textContent = stats.total;
        statWatched.textContent = stats.watched;
        statWatchlist.textContent = stats.watching + stats.watchlist;
        statAvg.textContent = stats.avgRating;

        // Auto-refresh analytics and achievements if expanded
        if (analyticsPanel && analyticsPanel.style.display !== 'none') {
            renderHorrorAnalytics();
        }
    }
}

// --- SEARCH & FILTER HANDLING ---
function handleSearch() {
    currentSearchQuery = searchInput.value.trim();
    
    // Hide Hero Banner when searching to make room for results
    if (heroBanner) {
        heroBanner.style.display = currentSearchQuery ? 'none' : 'flex';
    }

    if (activeTab === 'collection') {
        renderMyCollection();
    } else {
        discoverPage = 1;
        fetchAndRenderDiscover();
    }
}

function handleFilterChange() {
    if (activeTab === 'collection') {
        renderMyCollection();
    } else {
        discoverPage = 1;
        fetchAndRenderDiscover();
    }
}

// --- DECADE / YEAR HELPER ---
function matchesYearFilter(releaseDate, filterValue) {
    if (!filterValue) return true;
    if (!releaseDate) return false;
    
    const year = parseInt(releaseDate.split('-')[0], 10);
    if (isNaN(year)) return false;

    switch (filterValue) {
        case '2020': return year >= 2020;
        case '2010': return year >= 2010 && year <= 2019;
        case '2000': return year >= 2000 && year <= 2009;
        case '1990': return year >= 1990 && year <= 1999;
        case '1980': return year >= 1980 && year <= 1989;
        case '1970': return year >= 1970 && year <= 1979;
        case '1960': return year < 1970;
        default: return true;
    }
}

// --- COUNTRY HELPER ---
function matchesCountryFilter(countries, filterValue) {
    if (!filterValue) return true;
    if (!countries || countries.length === 0) return false;
    
    const countryCodes = countries.map(c => typeof c === 'object' ? c.iso_3166_1 : c).filter(Boolean);

    if (filterValue === 'OTHER') {
        const commonCountries = ['TH', 'US', 'JP', 'KR', 'GB', 'ES'];
        return !countryCodes.some(code => commonCountries.includes(code.toUpperCase()));
    }

    return countryCodes.some(code => code.toUpperCase() === filterValue.toUpperCase());
}

// --- SORTING COLLECTION ---
function sortMovies(movies, sortBy) {
    return [...movies].sort((a, b) => {
        const titleA = a.title || '';
        const titleB = b.title || '';
        
        switch (sortBy) {
            case 'latest_added':
                return new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0);
            
            case 'title_asc':
                return titleA.localeCompare(titleB, 'th');
                
            case 'personal_desc':
                const ratingA = a.personalRating !== null ? a.personalRating : -1;
                const ratingB = b.personalRating !== null ? b.personalRating : -1;
                return ratingB - ratingA;
                
            case 'tmdb_desc':
                return (b.vote_average || 0) - (a.vote_average || 0);
                
            case 'year_desc':
                const yearA = a.release_date ? parseInt(a.release_date.split('-')[0], 10) : 0;
                const yearB = b.release_date ? parseInt(b.release_date.split('-')[0], 10) : 0;
                return yearB - yearA;
                
            case 'year_asc':
                const yrA = a.release_date ? parseInt(a.release_date.split('-')[0], 10) : 9999;
                const yrB = b.release_date ? parseInt(b.release_date.split('-')[0], 10) : 9999;
                return yrA - yrB;

            default:
                return 0;
        }
    });
}

// --- RENDER COLLECTION VIEW ---
function renderMyCollection() {
    try {
        movieGrid.innerHTML = '';
        
        // Choose source data (LocalStorage vs URL Shared Data)
        let collection = isSharedProfileMode ? sharedCollectionData : Storage.getCollection();
        
        // Handle playlist filtering
        let activePlaylist = null;
        if (activePlaylistFilterId) {
            const playlists = Storage.getPlaylists();
            activePlaylist = playlists.find(p => p.id === activePlaylistFilterId);
            if (activePlaylist) {
                collection = collection.filter(m => activePlaylist.movieIds.includes(m.id));
            }
        }
        
        // Apply client-side filters with defensive checks to prevent any undefined crashes
        let filteredList = collection.filter(movie => {
            if (!movie) return false;
            
            // Search filter
            const movieTitle = movie.title || '';
            const matchesSearch = !currentSearchQuery || 
                movieTitle.toLowerCase().includes(currentSearchQuery.toLowerCase());
                
            // Genre filter
            let matchesGenre = true;
            if (genreFilter.value) {
                const reqGenreId = parseInt(genreFilter.value, 10);
                matchesGenre = movie.genres && movie.genres.some(g => {
                    const gId = typeof g === 'object' ? g.id : parseInt(g, 10);
                    return gId === reqGenreId;
                });
            }

            // Year filter
            const matchesYear = matchesYearFilter(movie.release_date, yearFilter.value);

            // Country filter
            const matchesCountry = matchesCountryFilter(movie.production_countries, countryFilter.value);

            return matchesSearch && matchesGenre && matchesYear && matchesCountry;
        });

        // Sort
        const sortedList = sortMovies(filteredList, sortFilter.value);
        
        // Update Title
        if (activePlaylistFilterId && activePlaylist) {
            sectionTitle.innerHTML = `<i class="fa-solid fa-skull"></i> มาราธอน: ${activePlaylist.name} (${sortedList.length} เรื่อง) <button class="btn-primary" id="clear-playlist-filter-btn" style="padding: 0.3rem 0.60rem; font-size: 0.75rem; border-radius: 6px; margin-left: 0.75rem; box-shadow: none; width: fit-content; display: inline-flex; align-items: center; gap: 0.3rem;"><i class="fa-solid fa-arrow-left"></i> แสดงทั้งหมด</button>`;
            
            // Bind back button
            const clearBtn = document.getElementById('clear-playlist-filter-btn');
            if (clearBtn) {
                clearBtn.addEventListener('click', () => {
                    activePlaylistFilterId = null;
                    renderMyCollection();
                });
            }
        } else {
            const titlePrefix = isSharedProfileMode ? 'คอลเล็กชันของเพื่อน' : 'คอลเล็กชันของฉัน';
            sectionTitle.innerHTML = `<i class="fa-solid fa-skull"></i> ${titlePrefix} (${sortedList.length} เรื่อง)`;
        }

        if (sortedList.length === 0) {
            renderEmptyState(isSharedProfileMode ? 'ไม่มีหนังสยองขวัญในเพลย์ลิสต์หรือตัวกรองที่ตรงความต้องการ' : 'ไม่พบภาพยนตร์ในคอลเล็กชันของคุณ ลองปรับปรุงตัวกรอง หรือเปลี่ยนไปแท็บ "ค้นหาหนังใหม่"');
            return;
        }

        // Render Cards with card-specific error catcher
        sortedList.forEach(movie => {
            try {
                const card = createMovieCard(movie, true);
                movieGrid.appendChild(card);
            } catch (cardErr) {
                console.error("Failed to render individual movie card:", movie, cardErr);
            }
        });
    } catch (err) {
        console.error("Error rendering collection:", err);
        movieGrid.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-triangle-exclamation text-danger"></i>
                <h3>เกิดข้อผิดพลาดในการโหลดคอลเล็กชัน</h3>
                <p style="font-size: 0.9rem; margin-top: 0.5rem; color: var(--text-secondary);">${err.message}</p>
            </div>
        `;
    }
}

// --- RENDER DISCOVER (SLIDERS & GRID SEARCH) ---
async function fetchAndRenderDiscover() {
    const hasFilters = genreFilter.value || yearFilter.value || countryFilter.value;
    
    // If a search query is active OR filters are active, we display in Grid mode
    if (currentSearchQuery || hasFilters) {
        slidersModeContainer.style.display = 'none';
        gridModeContainer.style.display = 'block';
        
        movieGrid.innerHTML = '<div class="empty-state"><i class="fa-solid fa-circle-notch fa-spin"></i><h3>กำลังค้นหาขุมทรัพย์ความสยอง...</h3></div>';
        
        try {
            let discoverMovies = [];
            let totalPages = 1;
            
            // Scenario A: Search query is active (we use search API + client-side filters)
            if (currentSearchQuery) {
                const response = await TMDB.searchHorrorMovies(currentSearchQuery, discoverPage);
                sectionTitle.innerHTML = `<i class="fa-solid fa-ghost"></i> ผลลัพธ์การค้นหาสำหรับ "${currentSearchQuery}"`;
                
                let results = response.results || [];
                
                // Apply sub-genre filter client-side
                if (genreFilter.value) {
                    const reqGenreId = parseInt(genreFilter.value, 10);
                    results = results.filter(movie => 
                        movie.genre_ids && movie.genre_ids.includes(reqGenreId)
                    );
                }
                
                // Apply year filter client-side
                if (yearFilter.value) {
                    results = results.filter(movie => 
                        matchesYearFilter(movie.release_date, yearFilter.value)
                    );
                }
                
                // Apply country filter client-side
                if (countryFilter.value) {
                    results = results.filter(movie => {
                        const langMap = { TH: 'th', US: 'en', JP: 'ja', KR: 'ko', GB: 'en', ES: 'es' };
                        const reqLang = langMap[countryFilter.value];
                        if (countryFilter.value === 'OTHER') {
                            return !['th', 'en', 'ja', 'ko', 'es'].includes(movie.original_language);
                        }
                        return movie.original_language === reqLang;
                    });
                }
                
                discoverMovies = results;
                totalPages = Math.min(response.total_pages || 1, 500);
            } 
            // Scenario B: No search query, but filters are active (we query discover API directly with filters)
            else {
                sectionTitle.innerHTML = `<i class="fa-solid fa-ghost"></i> ค้นพบภาพยนตร์ตามตัวเลือกของคุณ`;
                
                const discoverParams = {
                    with_genres: '27',
                    page: discoverPage
                };
                
                if (genreFilter.value) {
                    discoverParams.with_genres = `27,${genreFilter.value}`;
                }
                
                if (yearFilter.value) {
                    const yearVal = yearFilter.value;
                    if (yearVal === '2020') {
                        discoverParams['primary_release_date.gte'] = '2020-01-01';
                    } else if (yearVal === '2010') {
                        discoverParams['primary_release_date.gte'] = '2010-01-01';
                        discoverParams['primary_release_date.lte'] = '2019-12-31';
                    } else if (yearVal === '2000') {
                        discoverParams['primary_release_date.gte'] = '2000-01-01';
                        discoverParams['primary_release_date.lte'] = '2009-12-31';
                    } else if (yearVal === '1990') {
                        discoverParams['primary_release_date.gte'] = '1990-01-01';
                        discoverParams['primary_release_date.lte'] = '1999-12-31';
                    } else if (yearVal === '1980') {
                        discoverParams['primary_release_date.gte'] = '1980-01-01';
                        discoverParams['primary_release_date.lte'] = '1989-12-31';
                    } else if (yearVal === '1970') {
                        discoverParams['primary_release_date.gte'] = '1970-01-01';
                        discoverParams['primary_release_date.lte'] = '1979-12-31';
                    } else if (yearVal === '1960') {
                        discoverParams['primary_release_date.lte'] = '1969-12-31';
                    }
                }
                
                if (countryFilter.value) {
                    const countryVal = countryFilter.value;
                    if (countryVal !== 'OTHER') {
                        discoverParams.with_origin_country = countryVal;
                    }
                }
                
                if (sortFilter.value) {
                    const sortVal = sortFilter.value;
                    if (sortVal === 'tmdb_desc') {
                        discoverParams.sort_by = 'popularity.desc';
                    } else if (sortVal === 'year_desc') {
                        discoverParams.sort_by = 'primary_release_date.desc';
                    } else if (sortVal === 'year_asc') {
                        discoverParams.sort_by = 'primary_release_date.asc';
                    }
                }
                
                const response = await TMDB.fetchFromTMDB('/discover/movie', discoverParams);
                let results = response.results || [];
                
                // If country is OTHER, filter client-side
                if (countryFilter.value === 'OTHER') {
                    results = results.filter(movie => {
                        const majorCountries = ['TH', 'US', 'JP', 'KR', 'GB', 'ES'];
                        const originCountries = movie.origin_country || [];
                        return !originCountries.some(c => majorCountries.includes(c.toUpperCase()));
                    });
                }
                
                discoverMovies = results;
                totalPages = Math.min(response.total_pages || 1, 500);
            }
            
            movieGrid.innerHTML = '';
            discoverMoviesList = discoverMovies;
            discoverTotalPages = totalPages;
            
            if (discoverMovies.length === 0) {
                renderEmptyState('ไม่พบผลลัพธ์จาก TMDB ลองค้นหาชื่ออื่นๆ หรือเปลี่ยนตัวกรอง');
                paginationContainer.style.display = 'none';
                return;
            }
            
            discoverMovies.forEach(movie => {
                const savedRecord = Storage.getMovieFromCollection(movie.id);
                const card = createMovieCard(savedRecord || movie, !!savedRecord);
                movieGrid.appendChild(card);
            });
            
            paginationContainer.style.display = 'flex';
            pageNumberLabel.textContent = `หน้า ${discoverPage} / ${discoverTotalPages}`;
            prevPageBtn.disabled = discoverPage <= 1;
            nextPageBtn.disabled = discoverPage >= discoverTotalPages;
        } catch (e) {
            console.error(e);
            renderEmptyState('เกิดข้อผิดพลาดในการโหลดผลการค้นหา');
            paginationContainer.style.display = 'none';
        }
    } 
    // No search query and no filters active -> Netflix-style sliders
    else {
        gridModeContainer.style.display = 'none';
        paginationContainer.style.display = 'none';
        slidersModeContainer.style.display = 'block';
        sectionTitle.innerHTML = `<i class="fa-solid fa-ghost"></i> แนะนำภาพยนตร์สำหรับค่ำคืนนี้`;
        
        // Load Sliders with placeholders/spinners
        sliderTrending.innerHTML = '<div style="padding: 2rem; color: var(--text-dark);"><i class="fa-solid fa-circle-notch fa-spin"></i> กำลังโหลด...</div>';
        sliderUpcoming.innerHTML = '<div style="padding: 2rem; color: var(--text-dark);"><i class="fa-solid fa-circle-notch fa-spin"></i> กำลังโหลด...</div>';
        sliderPopularDiscover.innerHTML = '<div style="padding: 2rem; color: var(--text-dark);"><i class="fa-solid fa-circle-notch fa-spin"></i> กำลังโหลด...</div>';
        
        try {
            // 1. Trending Now Slider
            const trendingResp = await TMDB.getPopularHorrorMovies(1, 'popularity.desc');
            renderMoviesToSlider(trendingResp.results, sliderTrending);
            
            // 2. Upcoming Horror Slider (Release date >= today)
            const todayStr = new Date().toISOString().split('T')[0];
            const upcomingResp = await TMDB.fetchFromTMDB('/discover/movie', {
                with_genres: TMDB.HORROR_GENRE_ID,
                'primary_release_date.gte': todayStr,
                sort_by: 'primary_release_date.asc',
                page: 1
            });
            renderMoviesToSlider(upcomingResp.results, sliderUpcoming);
            
            // 3. Popular Hits (Sort by Vote Average)
            const popularResp = await TMDB.fetchFromTMDB('/discover/movie', {
                with_genres: TMDB.HORROR_GENRE_ID,
                'vote_count.gte': 100, 
                sort_by: 'vote_average.desc',
                page: 1
            });
            renderMoviesToSlider(popularResp.results, sliderPopularDiscover);
            
        } catch (error) {
            console.error('Failed to load sliders', error);
            // Render beautiful local fallback movies so the Discover tab is not blank
            renderMoviesToSlider(FALLBACK_POPULAR_MOVIES, sliderTrending);
            renderMoviesToSlider(FALLBACK_POPULAR_MOVIES.slice().reverse(), sliderPopularDiscover);
            sliderUpcoming.innerHTML = '<div style="padding: 2rem; color: var(--text-secondary); text-align: center;"><i class="fa-solid fa-wifi-slash"></i> ไม่สามารถเชื่อมต่อกับฐานข้อมูลภาพยนตร์ออนไลน์ได้ชั่วคราว แต่คุณยังสามารถค้นหาและจัดการหนังในคอลเล็กชันส่วนตัวของคุณได้ตามปกติครับ 🩸</div>';
        }
    }
}

function renderMoviesToSlider(moviesList, sliderElement) {
    sliderElement.innerHTML = '';
    if (!moviesList || moviesList.length === 0) {
        sliderElement.innerHTML = '<div style="padding: 2rem; color: var(--text-dark);">ไม่มีข้อมูลหนังสยองขวัญในหมวดหมู่นี้</div>';
        return;
    }

    const itemsToShow = moviesList.slice(0, 12);
    itemsToShow.forEach(movie => {
        const savedRecord = Storage.getMovieFromCollection(movie.id);
        const card = createMovieCard(savedRecord || movie, !!savedRecord);
        sliderElement.appendChild(card);
    });
}

function changeDiscoverPage(delta) {
    const targetPage = discoverPage + delta;
    if (targetPage >= 1 && targetPage <= discoverTotalPages) {
        discoverPage = targetPage;
        fetchAndRenderDiscover();
        document.querySelector('main').scrollIntoView({ behavior: 'smooth' });
    }
}

// --- CREATING MOVIE CARD & 3D TILT EFFECT ---
function createMovieCard(movie, isSaved) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.dataset.id = movie.id;

    // Defensive variables fallback
    const titleText = movie.title || 'ไม่มีชื่อเรื่อง';
    const posterUrl = TMDB.getImageUrl(movie.poster_path, 'w342');
    const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'ไม่ระบุปี';
    
    // Check vote_average type safely
    let voteAverage = '-.-';
    if (movie.vote_average !== undefined && movie.vote_average !== null) {
        const numVal = parseFloat(movie.vote_average);
        if (!isNaN(numVal)) {
            voteAverage = numVal.toFixed(1);
        }
    }

    let badgeHTML = '';
    let personalRatingHTML = '';
    
    if (isSaved) {
        let statusText = 'อยากดู';
        if (movie.watchStatus === 'watched') statusText = 'ดูแล้ว';
        if (movie.watchStatus === 'watching') statusText = 'กำลังดู';
        
        badgeHTML = `<span class="status-badge ${movie.watchStatus}">${statusText}</span>`;
        
        if (movie.personalRating && movie.personalRating > 0) {
            personalRatingHTML = `
                <div class="personal-rating-display">
                    <i class="fa-solid fa-star"></i>
                    <span>${movie.personalRating}/10</span>
                </div>
            `;
        }
    } else {
        // Disallow adding in shared profile mode
        if (!isSharedProfileMode) {
            badgeHTML = `
                <div class="add-collection-hover-btn" title="เพิ่มลงคอลเล็กชัน">
                    <i class="fa-solid fa-plus"></i>
                </div>
            `;
        }
    }
    
    let genreBadgesHTML = '';
    const genreIds = movie.genre_ids || movie.genres || [];
    if (genreIds.length > 0) {
        // Sort so 27 (Horror) is always first
        const sortedIds = [...genreIds].sort((a, b) => {
            if (a === 27) return -1;
            if (b === 27) return 1;
            return 0;
        });
        
        // Take up to 2 genres to display combined main & sub-genres
        const displayIds = sortedIds.slice(0, 2);
        const genreNames = displayIds.map(id => {
            const name = TMDB.SUB_GENRES[id] || '';
            return name.replace(/\s*\(.*?\)\s*/g, ''); // Remove descriptions like (ทั่วไป)
        }).filter(Boolean);
        
        if (genreNames.length > 0) {
            const combinedName = genreNames.join(' • ');
            genreBadgesHTML = `<span class="rating-badge genre-badge"><i class="fa-solid fa-ghost"></i> <span class="genre-text">${combinedName}</span></span>`;
        }
    }

    card.innerHTML = `
        <div class="card-badges">
            <span class="rating-badge"><i class="fa-solid fa-star"></i> TMDB ${voteAverage}</span>
        </div>
        <div class="poster-wrapper">
            <img src="${posterUrl}" class="movie-poster" alt="${titleText}" loading="lazy">
            <div class="card-overlay">
                <div class="movie-title-card">${titleText}</div>
                <div class="movie-meta-details">
                    <span><i class="fa-regular fa-calendar"></i> ${releaseYear}</span>
                </div>
                ${personalRatingHTML}
            </div>
        </div>
        <div class="card-bottom-info">
            ${genreBadgesHTML}
            ${isSaved ? badgeHTML : ''}
        </div>
        ${!isSaved ? badgeHTML : ''}
    `;

    // 3D TILT EFFECT LISTENERS
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left - width / 2;
        const mouseY = e.clientY - rect.top - height / 2;
        
        const tiltX = -(mouseY / (height / 2)) * 12;
        const tiltY = (mouseX / (width / 2)) * 12;
        
        card.style.transform = `translateY(-8px) scale(1.03) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1) rotateX(0) rotateY(0)';
    });

    card.addEventListener('click', () => {
        SoundscapeEngine.playClickSFX();
        openMovieModal(movie.id);
    });

    return card;
}

function renderEmptyState(message) {
    movieGrid.innerHTML = `
        <div class="empty-state">
            <i class="fa-solid fa-ghost"></i>
            <h3>ไม่พบข้อมูล</h3>
            <p>${message}</p>
        </div>
    `;
}

// --- MOVIE DETAILS MODAL LOGIC ---
async function openMovieModal(movieId) {
    // Play dark cinematic boom SFX
    SoundscapeEngine.playModalOpenSFX();

    // Show modal loading template
    movieDetailModal.classList.add('active');
    document.body.style.overflow = 'hidden'; 

    modalTitle.textContent = 'กำลังโหลดข้อมูล...';
    modalTagline.textContent = '';
    modalYear.innerHTML = '<i class="fa-regular fa-calendar"></i> Loading...';
    modalRuntime.innerHTML = '<i class="fa-regular fa-clock"></i> Loading...';
    modalCountry.innerHTML = '<i class="fa-solid fa-earth-americas"></i> Loading...';
    modalTmdbRating.innerHTML = '<i class="fa-solid fa-star"></i> TMDB -';
    modalOverview.textContent = 'กรุณารอสักครู่...';
    modalPoster.src = 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=500&auto=format&fit=crop';
    modalBackdrop.style.backgroundImage = 'none';
    modalCastContainer.innerHTML = '';
    if (modalGalleryContainer) modalGalleryContainer.innerHTML = '';
    
    // Hide buttons initially
    modalSaveBtn.disabled = true;
    modalDeleteBtn.style.display = 'none';
    modalTrailerBtn.style.display = 'none';
    if (modalTicketBtn) modalTicketBtn.style.display = 'none';

    try {
        // Fetch details from TMDB (with local offline fallbacks)
        let details;
        try {
            details = await TMDB.getMovieDetails(movieId);
        } catch (tmdbErr) {
            console.warn("Failed to fetch movie details online, checking fallbacks:", tmdbErr);
            const fallbackMatch = DEFAULT_HERO_MOVIES.find(m => m.id === parseInt(movieId, 10)) ||
                                  FALLBACK_POPULAR_MOVIES.find(m => m.id === parseInt(movieId, 10));
            if (fallbackMatch) {
                details = fallbackMatch;
            } else {
                const savedMatch = Storage.getMovieFromCollection(movieId);
                if (savedMatch) {
                    details = {
                        ...savedMatch,
                        genres: savedMatch.genres ? savedMatch.genres.map(id => ({ id, name: TMDB.SUB_GENRES[id] || 'สยองขวัญ' })) : [],
                        production_countries: savedMatch.production_countries ? savedMatch.production_countries.map(iso => ({ iso_3166_1: iso, name: iso === 'TH' ? 'ประเทศไทย' : 'ต่างประเทศ' })) : []
                    };
                } else {
                    throw tmdbErr;
                }
            }
        }
        selectedMovieData = details;

        // Check if there is already a record locally (or in shared data)
        const savedMovie = isSharedProfileMode 
            ? sharedCollectionData.find(m => m.id === parseInt(movieId, 10)) 
            : Storage.getMovieFromCollection(movieId);
            
        // Try fetching OMDB ratings automatically if key is set and imdb_id exists
        let omdbData = null;
        const omdbKey = localStorage.getItem('omdb_api_key') || '3415cfd0';
        if (omdbKey && details.imdb_id) {
            try {
                const omdbResp = await fetch(`https://www.omdbapi.com/?i=${details.imdb_id}&apikey=${omdbKey}`);
                if (omdbResp.ok) {
                    const parsed = await omdbResp.json();
                    if (parsed.Response === "True") {
                        omdbData = parsed;
                    }
                }
            } catch (omdbErr) {
                console.warn("Failed to fetch automatically from OMDb:", omdbErr);
            }
        }

        // Fill in basic TMDB info
        modalTitle.textContent = details.title;
        modalTagline.textContent = details.tagline || '';
        
        const year = details.release_date ? details.release_date.split('-')[0] : 'ไม่ระบุปี';
        modalYear.innerHTML = `<i class="fa-regular fa-calendar"></i> ${year}`;
        
        const runtime = details.runtime ? `${details.runtime} นาที` : 'ไม่ทราบเวลาฉาย';
        modalRuntime.innerHTML = `<i class="fa-regular fa-clock"></i> ${runtime}`;
        
        const countryList = details.production_countries && details.production_countries.length > 0 
            ? details.production_countries.map(c => c.name).join(', ') 
            : 'ไม่ระบุประเทศ';
        modalCountry.innerHTML = `<i class="fa-solid fa-earth-americas"></i> ${countryList}`;
        
        const tmdbVote = details.vote_average ? details.vote_average.toFixed(1) : '-.-';
        modalTmdbRating.innerHTML = `<i class="fa-solid fa-star"></i> TMDB ${tmdbVote}/10`;
        
        modalOverview.textContent = details.overview || 'ไม่มีเรื่องย่อภาษาไทยสำหรับภาพยนตร์เรื่องนี้';
        
        modalPoster.src = TMDB.getImageUrl(details.poster_path, 'w342');
        
        if (details.backdrop_path) {
            modalBackdrop.style.backgroundImage = `url('${TMDB.getImageUrl(details.backdrop_path, 'original')}')`;
        } else {
            modalBackdrop.style.backgroundImage = 'radial-gradient(circle, #25090f 0%, #08080c 100%)';
        }

        // Configure Trailer Watch Button
        if (details.videos && details.videos.results && details.videos.results.length > 0) {
            const trailer = details.videos.results.find(v => v.site === 'YouTube' && v.type === 'Trailer') ||
                            details.videos.results.find(v => v.site === 'YouTube');
            if (trailer) {
                modalTrailerBtn.dataset.videoKey = trailer.key;
                modalTrailerBtn.style.display = 'block';
            }
        }

        // Render main cast (max 8 cast members)
        modalCastContainer.innerHTML = '';
        if (details.credits && details.credits.cast && details.credits.cast.length > 0) {
            const mainCast = details.credits.cast.slice(0, 8);
            mainCast.forEach(actor => {
                const avatar = TMDB.getImageUrl(actor.profile_path, 'w185');
                const castCard = document.createElement('div');
                castCard.className = 'cast-card';
                castCard.dataset.personId = actor.id;
                castCard.dataset.personName = actor.name;
                castCard.dataset.personProfile = actor.profile_path;
                castCard.innerHTML = `
                    <div class="cast-avatar-wrapper">
                        <img src="${avatar}" alt="${actor.name}" loading="lazy">
                    </div>
                    <div class="cast-name" title="${actor.name}">${actor.name}</div>
                    <div class="cast-character" title="${actor.character}">${actor.character}</div>
                `;
                
                // Clicking an actor card opens their horror filmography modal
                castCard.addEventListener('click', () => {
                    openActorMoviesModal(actor.id, actor.name, actor.profile_path);
                });
                
                modalCastContainer.appendChild(castCard);
            });
        } else {
            modalCastContainer.innerHTML = '<span style="color: var(--text-dark); font-size: 0.9rem;">ไม่มีข้อมูลรายชื่อนักแสดง</span>';
        }

        // Render movie genres & sub-genres
        modalGenresContainer.innerHTML = '';
        if (details.genres && details.genres.length > 0) {
            details.genres.forEach(genre => {
                const badge = document.createElement('span');
                if (genre.id === 27) {
                    badge.className = 'status-badge watched';
                    badge.innerHTML = `<i class="fa-solid fa-skull"></i> ประเภทหลัก: ${genre.name}`;
                } else {
                    badge.className = 'status-badge watchlist';
                    badge.innerHTML = `<i class="fa-solid fa-ghost"></i> ${genre.name}`;
                }
                modalGenresContainer.appendChild(badge);
            });
        } else if (details.genre_ids && details.genre_ids.length > 0) {
            details.genre_ids.forEach(id => {
                const genreName = TMDB.SUB_GENRES[id] || 'สยองขวัญ';
                const cleanName = genreName.replace(/\s*\(.*?\)\s*/g, '');
                const badge = document.createElement('span');
                if (id === 27) {
                    badge.className = 'status-badge watched';
                    badge.innerHTML = `<i class="fa-solid fa-skull"></i> ประเภทหลัก: ${cleanName}`;
                } else {
                    badge.className = 'status-badge watchlist';
                    badge.innerHTML = `<i class="fa-solid fa-ghost"></i> ${cleanName}`;
                }
                modalGenresContainer.appendChild(badge);
            });
        } else {
            modalGenresContainer.innerHTML = '<span style="color: var(--text-dark); font-size: 0.8rem;">ไม่ระบุหมวดหมู่</span>';
        }

        // Render movie gallery images
        if (modalGalleryContainer) {
            modalGalleryContainer.innerHTML = '';
            let backdrops = [];
            
            if (details.images && details.images.backdrops && details.images.backdrops.length > 0) {
                backdrops = details.images.backdrops;
            } else if (details.backdrop_path) {
                // Fallback: use main backdrop if backdrop list is empty
                backdrops = [{ file_path: details.backdrop_path }];
            }
            
            if (backdrops.length > 0) {
                // Show up to 8 images
                const itemsToRender = backdrops.slice(0, 8);
                itemsToRender.forEach(backdrop => {
                    const card = document.createElement('div');
                    card.className = 'gallery-photo-card';
                    card.innerHTML = `<img src="${TMDB.getImageUrl(backdrop.file_path, 'w500')}" alt="Movie Scene" loading="lazy">`;
                    
                    card.addEventListener('click', () => {
                        openLightbox(backdrop.file_path);
                    });
                    modalGalleryContainer.appendChild(card);
                });
            } else {
                modalGalleryContainer.innerHTML = '<span style="color: var(--text-dark); font-size: 0.85rem;">ไม่มีภาพฉากหลังแกลเลอรีสำหรับภาพยนตร์เรื่องนี้</span>';
            }
        }

        // Populate user review values
        if (savedMovie) {
            activeMovieWatchStatus = savedMovie.watchStatus || 'watchlist';
            activeMovieRating = savedMovie.personalRating || 0;
            modalReviewText.value = savedMovie.review || '';
            
            modalSaveBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> อัปเดตข้อมูล';
            if (!isSharedProfileMode) modalDeleteBtn.style.display = 'block';
        } else {
            activeMovieWatchStatus = 'watchlist';
            activeMovieRating = 0;
            modalReviewText.value = '';
            
            modalSaveBtn.innerHTML = '<i class="fa-solid fa-plus"></i> เพิ่มลงคอลเล็กชัน';
            modalDeleteBtn.style.display = 'none';
        }

        // Read-only configurations for shared profile view
        if (isSharedProfileMode) {
            modalSaveBtn.style.display = 'none';
            modalDeleteBtn.style.display = 'none';
            modalReviewText.disabled = true;
            modalReviewText.placeholder = 'ผู้ใช้รายนี้ไม่ได้เขียนรีวิวไว้...';
        } else {
            modalSaveBtn.style.display = 'block';
            modalReviewText.disabled = false;
            modalReviewText.placeholder = 'เขียนความเห็นของคุณเกี่ยวกับหนังสยองขวัญเรื่องนี้ตรงนี้...';
        }

        // Update interactive UI elements
        updateWatchStatusButtonsUI();
        updateStarsUI();
        
        modalSaveBtn.disabled = false;
        if (modalTicketBtn) modalTicketBtn.style.display = 'block';

    } catch (error) {
        console.error('Error opening movie details modal', error);
        modalTitle.textContent = 'เกิดข้อผิดพลาด';
        modalOverview.textContent = 'ไม่สามารถดึงข้อมูลรายละเอียดจาก TMDB ได้สำเร็จ';
    }
}

function closeMovieModal() {
    movieDetailModal.classList.remove('active');
    document.body.style.overflow = ''; 
    selectedMovieData = null;
}

// --- RATING STARS PICKER LOGIC ---
function buildRatingStars() {
    starsContainer.innerHTML = '';
    for (let i = 1; i <= 10; i++) {
        const star = document.createElement('i');
        star.className = 'fa-regular fa-star star-input';
        star.dataset.value = i;
        
        // Hover behaviors
        star.addEventListener('mouseenter', () => {
            if (isSharedProfileMode) return;
            highlightStarsToValue(i);
        });
        
        star.addEventListener('mouseleave', () => {
            if (isSharedProfileMode) return;
            highlightStarsToValue(activeMovieRating);
        });
        
        // Click to set rating
        star.addEventListener('click', () => {
            if (isSharedProfileMode) return;
            if (activeMovieRating === i) {
                activeMovieRating = 0;
            } else {
                activeMovieRating = i;
            }
            updateStarsUI();
        });
        
        starsContainer.appendChild(star);
    }
}

function highlightStarsToValue(val) {
    const stars = starsContainer.querySelectorAll('.star-input');
    stars.forEach((star, index) => {
        const starVal = index + 1;
        if (starVal <= val) {
            star.className = 'fa-solid fa-star star-input active';
        } else {
            star.className = 'fa-regular fa-star star-input';
        }
    });
}

function updateStarsUI() {
    highlightStarsToValue(activeMovieRating);
    currentRatingVal.textContent = activeMovieRating;
}

function updateWatchStatusButtonsUI() {
    const statusBtns = [statusBtnWatchlist, statusBtnWatching, statusBtnWatched];
    statusBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.status === activeMovieWatchStatus);
    });
}

// --- YOUTUBE TRAILER ACTIONS ---
function playMovieTrailer() {
    const videoKey = modalTrailerBtn.dataset.videoKey;
    if (videoKey) {
        trailerVideo.src = `https://www.youtube-nocookie.com/embed/${videoKey}?autoplay=1`;
        if (trailerExternalBtn) {
            trailerExternalBtn.href = `https://www.youtube.com/watch?v=${videoKey}`;
        }
        trailerModal.classList.add('active');
    }
}

function stopMovieTrailer() {
    trailerVideo.src = '';
    if (trailerExternalBtn) {
        trailerExternalBtn.href = '';
    }
    trailerModal.classList.remove('active');
}

// --- SAVE / DELETE ACTIONS (ONLY IN LOCAL COLLECTION MODE) ---
function saveActiveMovie() {
    if (!selectedMovieData || isSharedProfileMode) return;

    const dataToSave = {
        id: selectedMovieData.id,
        title: selectedMovieData.title,
        poster_path: selectedMovieData.poster_path,
        backdrop_path: selectedMovieData.backdrop_path,
        release_date: selectedMovieData.release_date,
        vote_average: selectedMovieData.vote_average,
        runtime: selectedMovieData.runtime,
        genres: selectedMovieData.genres ? selectedMovieData.genres.map(g => g.id) : [],
        production_countries: selectedMovieData.production_countries ? selectedMovieData.production_countries.map(c => c.iso_3166_1) : [],
        
        // Custom user fields
        watchStatus: activeMovieWatchStatus,
        personalRating: activeMovieRating > 0 ? activeMovieRating : null,
        review: modalReviewText.value.trim()
    };

    Storage.saveMovie(dataToSave);
    
    updateStatsDashboard();
    if (activeTab === 'collection') {
        renderMyCollection();
    } else {
        fetchAndRenderDiscover();
    }

    closeMovieModal();
}

function deleteActiveMovie() {
    if (!selectedMovieData || isSharedProfileMode) return;

    const confirmDelete = confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบเรื่อง "${selectedMovieData.title}" ออกจากคอลเล็กชันสยองขวัญของคุณ?`);
    if (confirmDelete) {
        Storage.removeMovie(selectedMovieData.id);
        
        updateStatsDashboard();
        if (activeTab === 'collection') {
            renderMyCollection();
        } else {
            fetchAndRenderDiscover();
        }
        
        closeMovieModal();
    }
}

// --- BACKUP, RESTORE & SHARE SYSTEM ---
function handleShareLinkGeneration() {
    const collection = Storage.getCollection();
    
    if (collection.length === 0) {
        alert('กรุณาเพิ่มภาพยนตร์ลงในคอลเล็กชันของคุณอย่างน้อย 1 เรื่องก่อนทำการแชร์คอลเล็กชันนี้ครับ! 🩸');
        return;
    }

    try {
        const encodedData = encodeCollectionData(collection);
        
        // Create full public sharing link
        const shareUrl = `${window.location.origin}${window.location.pathname}?share=${encodedData}`;
        
        // Copy to clipboard
        navigator.clipboard.writeText(shareUrl).then(() => {
            alert('คัดลอกลิงก์สำหรับแชร์คอลเล็กชันสยองขวัญส่วนตัวเรียบร้อยแล้ว! 🩸\nส่งต่อลิงก์นี้ให้เพื่อนใน Line หรือ Facebook เพื่อเปิดดูได้ทันทีเลยครับ');
        }).catch(err => {
            console.error('Failed to copy', err);
            // Fallback: prompt to copy
            prompt('คัดลอกลิงก์แชร์ตรงนี้:', shareUrl);
        });
    } catch (e) {
        console.error(e);
        alert('เกิดข้อผิดพลาดในการสร้างลิงก์สำหรับแชร์ข้อมูล');
    }
}

// UNICODE BASE64 ENCODERS FOR ZERO-SETUP SHARING
function encodeCollectionData(collection) {
    const compact = collection.map(m => ({
        id: m.id,
        t: m.title,
        p: m.poster_path,
        b: m.backdrop_path,
        y: m.release_date,
        s: m.watchStatus,
        r: m.personalRating,
        c: m.review,
        im: m.imdbRating,
        rt: m.rtRating
    }));
    const jsonStr = JSON.stringify(compact);
    return btoa(unescape(encodeURIComponent(jsonStr)));
}

function decodeCollectionData(base64Str) {
    const jsonStr = decodeURIComponent(escape(atob(base64Str)));
    const parsed = JSON.parse(jsonStr);
    
    return parsed.map(m => ({
        id: m.id,
        title: m.t,
        poster_path: m.p,
        backdrop_path: m.b,
        release_date: m.y,
        watchStatus: m.s,
        personalRating: m.r,
        review: m.c,
        imdbRating: m.im,
        rtRating: m.rt,
        genres: [], 
        production_countries: [] 
    }));
}

function handleExport() {
    const collectionData = Storage.exportCollection();
    const blob = new Blob([collectionData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `midnightsociety_collection_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
        const content = evt.target.result;
        const success = Storage.importCollection(content);
        if (success) {
            alert('นำเข้าคอลเล็กชันหนังสยองขวัญสำเร็จแล้ว! 🩸');
            updateStatsDashboard();
            if (activeTab === 'collection') {
                renderMyCollection();
            } else {
                fetchAndRenderDiscover();
            }
        } else {
            alert('ล้มเหลวในการนำเข้าข้อมูล: รูปแบบไฟล์ JSON ไม่ถูกต้องสำหรับคอลเล็กชันนี้');
        }
    };
    reader.readAsText(file);
    e.target.value = '';
}

// --- SETTINGS MODAL ACTIONS ---
function openSettingsModal() {
    settingsOmdbKey.value = localStorage.getItem('omdb_api_key') || '3415cfd0';
    if (settingsJumpscareToggle) {
        settingsJumpscareToggle.checked = localStorage.getItem('jumpscare_enabled') !== 'false';
    }
    const soundscapeToggle = document.getElementById('settings-soundscape-toggle');
    if (soundscapeToggle) {
        soundscapeToggle.checked = localStorage.getItem('settings-soundscape-active') === 'true';
    }
    settingsModal.classList.add('active');
}

function closeSettingsModal() {
    settingsModal.classList.remove('active');
}

function saveSettings() {
    const keyVal = settingsOmdbKey.value.trim();
    localStorage.setItem('omdb_api_key', keyVal);
    if (settingsJumpscareToggle) {
        localStorage.setItem('jumpscare_enabled', settingsJumpscareToggle.checked ? 'true' : 'false');
    }
    const soundscapeToggle = document.getElementById('settings-soundscape-toggle');
    if (soundscapeToggle) {
        toggleSoundscapeState(soundscapeToggle.checked);
    }
    alert('บันทึกการตั้งค่าเรียบร้อยแล้ว! 🩸');
    closeSettingsModal();
    
    // Refresh active movie details if modal is open to query OMDb ratings immediately
    if (selectedMovieData) {
        openMovieModal(selectedMovieData.id);
    }
}

// --- ACTOR MOVIES POPUP SUB-MODAL ---
async function openActorMoviesModal(personId, personName, profilePath) {
    const actorMoviesModal = document.getElementById('actor-movies-modal');
    const actorProfileImg = document.getElementById('actor-profile-img');
    const actorMoviesTitle = document.getElementById('actor-movies-title');
    const actorMoviesList = document.getElementById('actor-movies-list');
    
    if (!actorMoviesModal || !actorMoviesList) return;
    
    // Set basic info
    actorMoviesTitle.textContent = personName;
    actorProfileImg.src = TMDB.getImageUrl(profilePath, 'w185');
    
    // Show modal loading state
    actorMoviesModal.classList.add('active');
    actorMoviesList.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--text-secondary);"><i class="fa-solid fa-circle-notch fa-spin"></i> กำลังค้นหาผลงานสยองขวัญ...</div>';
    
    try {
        const credits = await TMDB.getActorCredits(personId);
        if (credits && credits.cast && credits.cast.length > 0) {
            // Filter only Horror movies (genre_ids contains 27)
            let horrorMovies = credits.cast.filter(m => 
                m.genre_ids && m.genre_ids.includes(TMDB.HORROR_GENRE_ID)
            );
            
            // Exclude the currently opened movie in details modal to avoid redundancy
            if (selectedMovieData) {
                horrorMovies = horrorMovies.filter(m => m.id !== selectedMovieData.id);
            }
            
            // Sort by popularity desc
            horrorMovies.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
            
            actorMoviesList.innerHTML = '';
            
            if (horrorMovies.length === 0) {
                actorMoviesList.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--text-dark);"><i class="fa-solid fa-ghost"></i> ไม่พบผลงานเรื่องอื่นในหมวดหนังสยองขวัญ</div>';
                return;
            }
            
            // Show max 15 movies
            const moviesToShow = horrorMovies.slice(0, 15);
            moviesToShow.forEach(movie => {
                const posterUrl = TMDB.getImageUrl(movie.poster_path, 'w92');
                const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'ไม่ระบุปี';
                const characterName = movie.character ? `รับบทเป็น ${movie.character}` : 'ร่วมแสดง';
                
                const item = document.createElement('div');
                item.className = 'actor-movie-item';
                item.dataset.movieId = movie.id;
                item.innerHTML = `
                    <img src="${posterUrl}" class="actor-movie-poster" alt="${movie.title}">
                    <div class="actor-movie-details">
                        <div class="actor-movie-title">${movie.title}</div>
                        <div class="actor-movie-character">${characterName} (${releaseYear})</div>
                    </div>
                    <button class="btn-primary" style="padding: 0.35rem 0.75rem; font-size: 0.75rem; border-radius: 6px; box-shadow: none;">
                        <i class="fa-solid fa-eye"></i> ดูข้อมูล
                    </button>
                `;
                
                item.addEventListener('click', () => {
                    // Close actor movies modal
                    closeActorMoviesModal();
                    // Open details modal for this movie!
                    openMovieModal(movie.id);
                });
                
                actorMoviesList.appendChild(item);
            });
        } else {
            actorMoviesList.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--text-dark);"><i class="fa-solid fa-ghost"></i> ไม่พบประวัติผลงานการแสดง</div>';
        }
    } catch (err) {
        console.error("Failed to load actor credits", err);
        actorMoviesList.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--primary);">เกิดข้อผิดพลาดในการดึงข้อมูล</div>';
    }
}

function closeActorMoviesModal() {
    const actorMoviesModal = document.getElementById('actor-movies-modal');
    if (actorMoviesModal) {
        actorMoviesModal.classList.remove('active');
    }
}

// --- LIGHTBOX GALLERY ACTIONS ---
function openLightbox(filePath) {
    if (lightboxImg && lightboxModal) {
        lightboxImg.src = TMDB.getImageUrl(filePath, 'original');
        lightboxModal.classList.add('active');
    }
}

function closeLightbox() {
    if (lightboxModal) {
        lightboxModal.classList.remove('active');
        // Clear src after fade out transition to avoid visual jump next time it opens
        setTimeout(() => {
            if (lightboxImg) lightboxImg.src = '';
        }, 300);
    }
}

// --- MARATHON PLAYLISTS SYSTEM ---
function renderPlaylists() {
    if (!playlistsGrid) return;
    playlistsGrid.innerHTML = '';
    
    const playlists = Storage.getPlaylists();
    if (playlists.length === 0) {
        playlistsGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fa-solid fa-ghost"></i>
                <h3>ไม่มีเพลย์ลิสต์มาราธอน</h3>
                <p>คุณยังไม่ได้สร้างเพลย์ลิสต์มาราธอนเพื่อรับชมหนังสยองขวัญยามค่ำคืน คลิก "สร้างเพลย์ลิสต์ใหม่" เพื่อเริ่มต้นครับ 🩸</p>
            </div>
        `;
        return;
    }
    
    playlists.forEach(playlist => {
        const card = document.createElement('div');
        card.className = 'playlist-card';
        
        // Generate movie thumbnails
        let thumbnailsHTML = '';
        const allCollection = Storage.getCollection();
        const playlistMovies = allCollection.filter(m => playlist.movieIds.includes(m.id));
        
        if (playlistMovies.length > 0) {
            thumbnailsHTML = '<div class="playlist-thumbnails">';
            playlistMovies.forEach(movie => {
                const posterUrl = TMDB.getImageUrl(movie.poster_path, 'w92');
                thumbnailsHTML += `<img src="${posterUrl}" class="playlist-thumb" alt="${movie.title}" title="${movie.title}" loading="lazy">`;
            });
            thumbnailsHTML += '</div>';
        } else {
            thumbnailsHTML = '<div style="font-size: 0.75rem; color: var(--text-dark); margin: 0.5rem 0;">(เพลย์ลิสต์นี้ยังไม่มีข้อมูลหนัง)</div>';
        }
        
        card.innerHTML = `
            <div class="playlist-card-title">
              <span>${playlist.name}</span>
              <span class="playlist-movie-count">${playlist.movieIds.length} เรื่อง</span>
            </div>
            <p class="playlist-card-desc">${playlist.description || 'ไม่มีคำอธิบายสำหรับเพลย์ลิสต์นี้'}</p>
            ${thumbnailsHTML}
            <div class="playlist-card-footer">
                <div class="playlist-actions">
                    <button class="btn-primary" onclick="playPlaylistMarathon('${playlist.id}')" style="padding: 0.4rem 0.8rem; font-size: 0.75rem; border-radius: 6px; box-shadow: none;">
                        <i class="fa-solid fa-play"></i> เริ่มมาราธอน
                    </button>
                    <button class="btn-icon" onclick="handleSharePlaylist('${playlist.id}')" title="คัดลอกลิงก์แชร์เพลย์ลิสต์" style="width: 28px; height: 28px; border-radius: 6px;">
                        <i class="fa-solid fa-share-nodes"></i>
                    </button>
                </div>
                <div class="playlist-actions">
                    <button class="btn-icon" onclick="editPlaylistMarathon('${playlist.id}')" title="แก้ไขเพลย์ลิสต์" style="width: 28px; height: 28px; border-radius: 6px;">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn-icon" onclick="deletePlaylistMarathon('${playlist.id}')" title="ลบเพลย์ลิสต์" style="width: 28px; height: 28px; border-radius: 6px; color: var(--primary);">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        playlistsGrid.appendChild(card);
    });
}

window.playPlaylistMarathon = function(playlistId) {
    activePlaylistFilterId = playlistId;
    switchTab('collection');
};

window.handleSharePlaylist = function(playlistId) {
    const playlists = Storage.getPlaylists();
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return;
    
    try {
        const encoded = encodePlaylistData(playlist);
        const shareUrl = `${window.location.origin}${window.location.pathname}?playlist=${encoded}`;
        
        navigator.clipboard.writeText(shareUrl).then(() => {
            alert(`คัดลอกลิงก์แชร์เพลย์ลิสต์มาราธอน "${playlist.name}" สำเร็จ! 🩸\nส่งต่อลิงก์นี้ให้เพื่อนเปิดดูและร่วมหลอนไปด้วยกันได้เลยครับ`);
        }).catch(err => {
            prompt('คัดลอกลิงก์แชร์ตรงนี้:', shareUrl);
        });
    } catch (e) {
        console.error(e);
        alert('เกิดข้อผิดพลาดในการสร้างลิงก์แชร์เพลย์ลิสต์');
    }
};

window.editPlaylistMarathon = function(playlistId) {
    openPlaylistModal(playlistId);
};

window.deletePlaylistMarathon = function(playlistId) {
    const playlists = Storage.getPlaylists();
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return;
    
    const confirmDel = confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบเพลย์ลิสต์มาราธอน "${playlist.name}"?`);
    if (confirmDel) {
        Storage.removePlaylist(playlistId);
        renderPlaylists();
    }
};

function openPlaylistModal(playlistId = null) {
    if (!playlistModal || !playlistMovieSelection) return;
    
    playlistNameInput.value = '';
    playlistDescInput.value = '';
    playlistEditId.value = '';
    playlistMovieSelection.innerHTML = '';
    
    const collection = Storage.getCollection();
    if (collection.length === 0) {
        playlistMovieSelection.innerHTML = '<span style="color: var(--text-dark); font-size: 0.8rem; padding: 1rem; text-align: center; display: block;">คุณยังไม่มีภาพยนตร์ในคอลเล็กชันส่วนตัว กรุณาเพิ่มหนังสยองขวัญอย่างน้อย 1 เรื่องก่อนสร้างเพลย์ลิสต์ครับ 🩸</span>';
        playlistSaveBtn.disabled = true;
    } else {
        playlistSaveBtn.disabled = false;
        
        collection.forEach(movie => {
            const item = document.createElement('label');
            item.className = 'playlist-movie-row-item';
            item.innerHTML = `
                <input type="checkbox" name="playlist-movie-chk" value="${movie.id}">
                <span style="font-size: 0.82rem; color: var(--text-primary); font-weight: 500; margin-left: 0.25rem;">${movie.title}</span>
            `;
            playlistMovieSelection.appendChild(item);
        });
    }
    
    if (playlistId) {
        playlistModalTitle.textContent = 'แก้ไขเพลย์ลิสต์มาราธอนสยองขวัญ';
        const playlists = Storage.getPlaylists();
        const playlist = playlists.find(p => p.id === playlistId);
        if (playlist) {
            playlistEditId.value = playlist.id;
            playlistNameInput.value = playlist.name;
            playlistDescInput.value = playlist.description || '';
            
            const chks = playlistMovieSelection.querySelectorAll('input[name="playlist-movie-chk"]');
            chks.forEach(chk => {
                const mId = parseInt(chk.value, 10);
                if (playlist.movieIds.includes(mId)) {
                    chk.checked = true;
                }
            });
        }
    } else {
        playlistModalTitle.textContent = 'สร้างเพลย์ลิสต์มาราธอนสยองขวัญ';
    }
    
    playlistModal.classList.add('active');
}

function closePlaylistModal() {
    if (playlistModal) playlistModal.classList.remove('active');
}

function savePlaylistData() {
    const name = playlistNameInput.value.trim();
    const desc = playlistDescInput.value.trim();
    const editId = playlistEditId.value;
    
    if (!name) {
        alert('กรุณากรอกชื่อเพลย์ลิสต์มาราธอน');
        return;
    }
    
    const checkedBoxes = playlistMovieSelection.querySelectorAll('input[name="playlist-movie-chk"]:checked');
    const movieIds = Array.from(checkedBoxes).map(chk => parseInt(chk.value, 10));
    
    if (movieIds.length === 0) {
        alert('กรุณาเลือกภาพยนตร์เข้าเพลย์ลิสต์อย่างน้อย 1 เรื่องครับ 🩸');
        return;
    }
    
    const playlistId = editId || 'playlist_' + Date.now();
    Storage.savePlaylist({
        id: playlistId,
        name: name,
        description: desc,
        movieIds: movieIds
    });
    
    closePlaylistModal();
    renderPlaylists();
}

function encodePlaylistData(playlist) {
    const compact = {
        n: playlist.name,
        d: playlist.description,
        m: playlist.movieIds
    };
    const jsonStr = JSON.stringify(compact);
    return btoa(unescape(encodeURIComponent(jsonStr)));
}

function decodePlaylistData(base64Str) {
    const jsonStr = decodeURIComponent(escape(atob(base64Str)));
    const parsed = JSON.parse(jsonStr);
    return {
        name: parsed.n,
        description: parsed.d,
        movieIds: parsed.m
    };
}

function checkSharedPlaylistLink() {
    const urlParams = new URLSearchParams(window.location.search);
    const playlistParam = urlParams.get('playlist');
    
    if (playlistParam) {
        try {
            const decoded = decodePlaylistData(playlistParam);
            if (decoded && decoded.name && Array.isArray(decoded.movieIds)) {
                const playlists = Storage.getPlaylists();
                const exists = playlists.some(p => p.name === `🩸แชร์: ${decoded.name}` && p.movieIds.length === decoded.movieIds.length);
                if (!exists) {
                    const newId = 'shared_playlist_' + Date.now();
                    Storage.savePlaylist({
                        id: newId,
                        name: `🩸แชร์: ${decoded.name}`,
                        description: decoded.description || 'เพลย์ลิสต์หนังสยองขวัญที่ได้รับแชร์มา',
                        movieIds: decoded.movieIds
                    });
                    alert(`นำเข้าเพลย์ลิสต์มาราธอน "${decoded.name}" ของเพื่อนสำเร็จแล้ว! 🩸\nคุณสามารถดูรายการได้ที่แท็บ "เพลย์ลิสต์มาราธอน"`);
                }
                switchTab('playlists');
            }
        } catch (error) {
            console.error('Failed to parse shared playlist parameter', error);
        }
    }
}

// --- GOTHIC AMBIENT FOG CANVAS ---
function initFogEffect() {
    const canvas = document.getElementById('hero-fog-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 20;
    
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.1,
            radius: Math.random() * 80 + 60,
            opacity: Math.random() * 0.2 + 0.1,
            fadeSpeed: Math.random() * 0.002 + 0.001,
            fadeDirection: Math.random() > 0.5 ? 1 : -1
        });
    }
    
    function animate() {
        if (activeTab === 'playlists' || activeTab === 'characters') {
            fogAnimationId = requestAnimationFrame(animate);
            return; // Pause drawing if banner is hidden
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            
            if (p.x < -p.radius) p.x = canvas.width + p.radius;
            if (p.x > canvas.width + p.radius) p.x = -p.radius;
            if (p.y < -p.radius) p.y = canvas.height + p.radius;
            if (p.y > canvas.height + p.radius) p.y = -p.radius;
            
            p.opacity += p.fadeSpeed * p.fadeDirection;
            if (p.opacity >= 0.40) p.fadeDirection = -1;
            if (p.opacity <= 0.05) p.fadeDirection = 1;
            
            const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
            grad.addColorStop(0, `rgba(255, 0, 60, ${p.opacity})`);
            grad.addColorStop(0.5, `rgba(15, 15, 21, ${p.opacity * 0.4})`);
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        });
        
        fogAnimationId = requestAnimationFrame(animate);
    }
    
    animate();
}

// --- JUMPSCARE EASTER EGG ---
function initJumpscareIdleDetector() {
    const idleTimeLimit = 60000; // 60 seconds
    
    function resetIdleTimer() {
        if (jumpscareOverlay && jumpscareOverlay.classList.contains('active')) {
            jumpscareOverlay.classList.remove('active');
            document.body.style.overflow = '';
            // Unlock Jumpscare survivor achievement
            localStorage.setItem('achievement_jumpscare_survived', 'true');
            renderHorrorAnalytics();
        }
        
        clearTimeout(idleTimer);
        idleTimer = setTimeout(triggerJumpscare, idleTimeLimit);
    }
    
    function triggerJumpscare() {
        const isEnabled = localStorage.getItem('jumpscare_enabled') !== 'false';
        if (!isEnabled || isSharedProfileMode) return;
        
        if (jumpscareOverlay) {
            jumpscareOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            SoundscapeEngine.playJumpscareSFX();
        }
    }
    
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(event => {
        window.addEventListener(event, resetIdleTimer, { passive: true });
    });
    
    resetIdleTimer();
}

// --- HORROR ANALYTICS ---
function toggleAnalyticsPanel() {
    if (!analyticsPanel) return;
    
    const isHidden = analyticsPanel.style.display === 'none';
    if (isHidden) {
        analyticsPanel.style.display = 'block';
        analyticsToggleBtn.innerHTML = '<i class="fa-solid fa-chart-pie"></i> ซ่อนวิเคราะห์ความหลอน (Horror Analytics)';
        renderHorrorAnalytics();
    } else {
        analyticsPanel.style.display = 'none';
        analyticsToggleBtn.innerHTML = '<i class="fa-solid fa-chart-pie"></i> เจาะลึกวิเคราะห์ความหลอน (Horror Analytics)';
    }
}

function renderHorrorAnalytics() {
    const collection = Storage.getCollection();
    const badgeEl = document.getElementById('user-horror-badge');
    const badgeDescEl = document.getElementById('user-horror-badge-desc');
    const genreBarsEl = document.getElementById('genre-analytics-bars');
    const eraBarsEl = document.getElementById('era-analytics-bars');
    
    if (!badgeEl || !genreBarsEl || !eraBarsEl) return;
    
    const total = collection.length;
    let badgeText = 'เหยื่อฝึกหัด';
    let badgeDesc = 'คุณเพิ่งเริ่มต้นก้าวขาเข้ามาคัดสรรคอลเล็กชันหนังสยองขวัญ... มืดมิดและเปล่าเปลี่ยว 🩸';
    
    if (total >= 15) {
        badgeText = 'ผู้ปราบสัมภเวสี';
        badgeDesc = 'ยอดเยี่ยม! คุณคือสุดยอดผู้เชี่ยวชาญการปราบผี สะสมกว่า 15 เรื่อง ไม่มีสิ่งใดทำลายจิตใจคุณได้อีกแล้ว 🩸';
    } else if (total >= 7) {
        badgeText = 'ผู้รอดชีวิตคนสุดท้าย';
        badgeDesc = 'วิเศษมาก! คุณเริ่มจับทางหนังสยองขวัญได้แล้ว หนีรอดมาได้หลายเรื่อง รู้ทันทุกมุกผีหลอก!';
    } else if (total >= 3) {
        badgeText = 'นักล่าท้าผี';
        badgeDesc = 'คุณเริ่มมีความกล้าที่จะเปิดดูคลังหนังสยองขวัญมากขึ้นแล้ว ทนหลอนได้หลายระดับ!';
    }
    
    badgeEl.textContent = badgeText;
    badgeDescEl.textContent = badgeDesc;
    
    const genreCounts = {};
    collection.forEach(movie => {
        const genres = movie.genres || [];
        genres.forEach(gId => {
            const name = TMDB.SUB_GENRES[gId] || 'Horror (ทั่วไป)';
            const cleanName = name.replace(/\s*\(.*?\)\s*/g, '');
            genreCounts[cleanName] = (genreCounts[cleanName] || 0) + 1;
        });
    });
    
    genreBarsEl.innerHTML = '';
    const sortedGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    
    if (sortedGenres.length === 0) {
        genreBarsEl.innerHTML = '<span style="font-size: 0.78rem; color: var(--text-dark); text-align: center; display: block; padding: 1.5rem 0;">เพิ่มหนังเข้าคอลเล็กชันเพื่อเริ่มวิเคราะห์หมวดหมู่ภาพยนตร์</span>';
    } else {
        sortedGenres.forEach(([name, count]) => {
            const percentage = total > 0 ? ((count / total) * 100).toFixed(0) : 0;
            const barItem = document.createElement('div');
            barItem.className = 'analytics-bar-item';
            barItem.innerHTML = `
                <div class="analytics-bar-label">
                    <span>${name}</span>
                    <span>${count} เรื่อง (${percentage}%)</span>
                </div>
                <div class="analytics-bar-bg">
                    <div class="analytics-bar-fill" style="width: ${percentage}%"></div>
                </div>
            `;
            genreBarsEl.appendChild(barItem);
        });
    }
    
    const eraCounts = {
        'Classic (ก่อนปี 1980)': 0,
        'ยุค 80s (1980 - 1989)': 0,
        'ยุค 90s (1990 - 1999)': 0,
        'ยุค 2000s (2000 - 2009)': 0,
        'ยุค 2010s (2010 - 2019)': 0,
        'ยุค 2020s (2020 - ปัจจุบัน)': 0
    };
    
    collection.forEach(movie => {
        if (!movie.release_date) return;
        const year = parseInt(movie.release_date.split('-')[0], 10);
        if (isNaN(year)) return;
        
        if (year >= 2020) eraCounts['ยุค 2020s (2020 - ปัจจุบัน)']++;
        else if (year >= 2010) eraCounts['ยุค 2010s (2010 - 2019)']++;
        else if (year >= 2000) eraCounts['ยุค 2000s (2000 - 2009)']++;
        else if (year >= 1990) eraCounts['ยุค 90s (1990 - 1999)']++;
        else if (year >= 1980) eraCounts['ยุค 80s (1980 - 1989)']++;
        else eraCounts['Classic (ก่อนปี 1980)']++;
    });
    
    eraBarsEl.innerHTML = '';
    let hasEras = false;
    
    Object.entries(eraCounts).forEach(([era, count]) => {
        if (count > 0) hasEras = true;
        const percentage = total > 0 ? ((count / total) * 100).toFixed(0) : 0;
        
        if (count > 0) {
            const barItem = document.createElement('div');
            barItem.className = 'analytics-bar-item';
            barItem.innerHTML = `
                <div class="analytics-bar-label">
                    <span>${era}</span>
                    <span>${count} เรื่อง (${percentage}%)</span>
                </div>
                <div class="analytics-bar-bg">
                    <div class="analytics-bar-fill" style="width: ${percentage}%"></div>
                </div>
            `;
            eraBarsEl.appendChild(barItem);
        }
    });
    
    if (!hasEras) {
        eraBarsEl.innerHTML = '<span style="font-size: 0.78rem; color: var(--text-dark); text-align: center; display: block; padding: 1.5rem 0;">ไม่มีข้อมูลยุคสมัยหนังสยองขวัญ</span>';
    }
    
    // Render achievements dynamically
    renderAchievementsList();
}

// --- MIDNIGHT SOUNDSCAPES AUDIO SYNTH ENGINE ---
const SoundscapeEngine = {
    ctx: null,
    isPlaying: false,
    masterGain: null,
    stopTimeoutId: null,
    
    // Ambient sound nodes
    osc1: null,
    osc2: null,
    droneFilter: null,
    droneGain: null,
    droneLfo: null,
    droneLfoGain: null,
    
    noiseSource: null,
    windFilter: null,
    windGain: null,
    windLfo: null,
    windLfoGain: null,
    windVolumeLfo: null,
    windVolumeLfoGain: null,
    
    init() {
        if (this.ctx) return;
        
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
        
        // Master Volume
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.4;
        this.masterGain.connect(this.ctx.destination);
    },
    
    cleanupNodes() {
        if (this.stopTimeoutId) {
            clearTimeout(this.stopTimeoutId);
            this.stopTimeoutId = null;
        }
        
        try { this.osc1.stop(); } catch(e){}
        try { this.osc2.stop(); } catch(e){}
        try { this.droneLfo.stop(); } catch(e){}
        try { this.noiseSource.stop(); } catch(e){}
        try { this.windLfo.stop(); } catch(e){}
        try { this.windVolumeLfo.stop(); } catch(e){}
        
        try { this.osc1.disconnect(); } catch(e){}
        try { this.osc2.disconnect(); } catch(e){}
        try { this.droneFilter.disconnect(); } catch(e){}
        try { this.droneLfo.disconnect(); } catch(e){}
        try { this.droneLfoGain.disconnect(); } catch(e){}
        try { this.droneGain.disconnect(); } catch(e){}
        try { this.noiseSource.disconnect(); } catch(e){}
        try { this.windFilter.disconnect(); } catch(e){}
        try { this.windGain.disconnect(); } catch(e){}
        try { this.windLfo.disconnect(); } catch(e){}
        try { this.windLfoGain.disconnect(); } catch(e){}
        try { this.windVolumeLfo.disconnect(); } catch(e){}
        try { this.windVolumeLfoGain.disconnect(); } catch(e){}
    },
    
    startAmbient() {
        this.init();
        if (this.isPlaying) return;
        
        this.cleanupNodes();
        
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        
        this.isPlaying = true;
        
        // Fade in master gain smoothly
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value || 0, this.ctx.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(0.4, this.ctx.currentTime + 1.5);
        
        // --- 1. LOW BASS DRONE ---
        this.osc1 = this.ctx.createOscillator();
        this.osc2 = this.ctx.createOscillator();
        this.droneFilter = this.ctx.createBiquadFilter();
        this.droneGain = this.ctx.createGain();
        
        this.osc1.type = 'sawtooth';
        this.osc2.type = 'sawtooth';
        
        this.osc1.frequency.value = 55.0; // A1
        this.osc2.frequency.value = 55.6; // Detuned
        
        this.droneFilter.type = 'lowpass';
        this.droneFilter.frequency.value = 90;
        this.droneFilter.Q.value = 2.0;
        
        // Drone cutoff sweep LFO
        this.droneLfo = this.ctx.createOscillator();
        this.droneLfo.frequency.value = 0.05;
        this.droneLfoGain = this.ctx.createGain();
        this.droneLfoGain.gain.value = 30;
        this.droneLfo.connect(this.droneLfoGain);
        this.droneLfoGain.connect(this.droneFilter.frequency);
        
        this.droneGain.gain.value = 0.15;
        
        this.osc1.connect(this.droneFilter);
        this.osc2.connect(this.droneFilter);
        this.droneFilter.connect(this.droneGain);
        this.droneGain.connect(this.masterGain);
        
        this.osc1.start();
        this.osc2.start();
        this.droneLfo.start();
        
        // --- 2. HOWLING WIND ---
        const bufferSize = this.ctx.sampleRate * 2;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        
        this.noiseSource = this.ctx.createBufferSource();
        this.noiseSource.buffer = noiseBuffer;
        this.noiseSource.loop = true;
        
        this.windFilter = this.ctx.createBiquadFilter();
        this.windFilter.type = 'bandpass';
        this.windFilter.frequency.value = 450;
        this.windFilter.Q.value = 6.0;
        
        this.windGain = this.ctx.createGain();
        this.windGain.gain.value = 0.05;
        
        // Wind sweep LFO
        this.windLfo = this.ctx.createOscillator();
        this.windLfo.frequency.value = 0.08;
        this.windLfoGain = this.ctx.createGain();
        this.windLfoGain.gain.value = 220;
        
        this.windLfo.connect(this.windLfoGain);
        this.windLfoGain.connect(this.windFilter.frequency);
        
        // Wind volume gusts LFO
        this.windVolumeLfo = this.ctx.createOscillator();
        this.windVolumeLfo.frequency.value = 0.12;
        this.windVolumeLfoGain = this.ctx.createGain();
        this.windVolumeLfoGain.gain.value = 0.03;
        
        this.windVolumeLfo.connect(this.windVolumeLfoGain);
        this.windVolumeLfoGain.connect(this.windGain.gain);
        
        this.noiseSource.connect(this.windFilter);
        this.windFilter.connect(this.windGain);
        this.windGain.connect(this.masterGain);
        
        this.noiseSource.start();
        this.windLfo.start();
        this.windVolumeLfo.start();
    },
    
    stopAmbient() {
        if (!this.isPlaying) return;
        this.isPlaying = false;
        
        const stopTime = this.ctx.currentTime + 1.0;
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(0, stopTime);
        
        this.stopTimeoutId = setTimeout(() => {
            this.cleanupNodes();
        }, 1100);
    },
    
    playClickSFX() {
        this.init();
        if (this.ctx.state === 'suspended') return;
        
        const clickOsc = this.ctx.createOscillator();
        const clickFilter = this.ctx.createBiquadFilter();
        const clickGain = this.ctx.createGain();
        
        clickOsc.type = 'triangle';
        clickOsc.frequency.setValueAtTime(300, this.ctx.currentTime);
        clickOsc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.15);
        
        clickFilter.type = 'lowpass';
        clickFilter.frequency.value = 400;
        
        clickGain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        clickGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
        
        clickOsc.connect(clickFilter);
        clickFilter.connect(clickGain);
        clickGain.connect(this.masterGain || this.ctx.destination);
        
        clickOsc.start();
        clickOsc.stop(this.ctx.currentTime + 0.16);
    },
    
    playModalOpenSFX() {
        this.init();
        if (this.ctx.state === 'suspended') return;
        
        const boomOsc = this.ctx.createOscillator();
        const boomFilter = this.ctx.createBiquadFilter();
        const boomGain = this.ctx.createGain();
        
        boomOsc.type = 'sine';
        boomOsc.frequency.setValueAtTime(160, this.ctx.currentTime);
        boomOsc.frequency.exponentialRampToValueAtTime(35, this.ctx.currentTime + 0.8);
        
        boomFilter.type = 'lowpass';
        boomFilter.frequency.value = 150;
        
        boomGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        boomGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);
        
        boomOsc.connect(boomFilter);
        boomFilter.connect(boomGain);
        boomGain.connect(this.masterGain || this.ctx.destination);
        
        boomOsc.start();
        boomOsc.stop(this.ctx.currentTime + 0.85);
    },
    
    playJumpscareSFX() {
        this.init();
        if (this.ctx.state === 'suspended') return;
        
        const ctx = this.ctx;
        const now = ctx.currentTime;
        
        const screechGain = ctx.createGain();
        screechGain.gain.setValueAtTime(0.5, now);
        screechGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
        screechGain.connect(ctx.destination);
        
        const osc1 = ctx.createOscillator();
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(800, now);
        osc1.frequency.linearRampToValueAtTime(1400, now + 0.4);
        osc1.frequency.exponentialRampToValueAtTime(200, now + 1.5);
        
        const osc2 = ctx.createOscillator();
        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(815, now);
        osc2.frequency.linearRampToValueAtTime(1385, now + 0.4);
        osc2.frequency.exponentialRampToValueAtTime(205, now + 1.5);
        
        const pitchLfo = ctx.createOscillator();
        pitchLfo.frequency.value = 35;
        const pitchLfoGain = ctx.createGain();
        pitchLfoGain.gain.value = 60;
        
        pitchLfo.connect(pitchLfoGain);
        pitchLfoGain.connect(osc1.frequency);
        pitchLfoGain.connect(osc2.frequency);
        
        const bufferSize = ctx.sampleRate * 1.5;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.value = 1000;
        
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.25, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
        
        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(screechGain);
        
        osc1.connect(screechGain);
        osc2.connect(screechGain);
        
        osc1.start(now);
        osc2.start(now);
        pitchLfo.start(now);
        noise.start(now);
        
        osc1.stop(now + 1.8);
        osc2.stop(now + 1.8);
        pitchLfo.stop(now + 1.8);
        noise.stop(now + 1.8);
    }
};

function toggleSoundscapeState(forceActive = null) {
    const soundscapeBtn = document.getElementById('soundscape-btn');
    const soundscapeToggle = document.getElementById('settings-soundscape-toggle');
    
    let active = forceActive;
    if (active === null) {
        active = !(soundscapeBtn && soundscapeBtn.classList.contains('active'));
    }
    
    if (active) {
        if (soundscapeBtn) {
            soundscapeBtn.classList.add('active');
            const icon = soundscapeBtn.querySelector('i');
            if (icon) {
                icon.className = 'fa-solid fa-volume-high';
            }
        }
        if (soundscapeToggle) {
            soundscapeToggle.checked = true;
        }
        localStorage.setItem('settings-soundscape-active', 'true');
        SoundscapeEngine.startAmbient();
    } else {
        if (soundscapeBtn) {
            soundscapeBtn.classList.remove('active');
            const icon = soundscapeBtn.querySelector('i');
            if (icon) {
                icon.className = 'fa-solid fa-volume-xmark';
            }
        }
        if (soundscapeToggle) {
            soundscapeToggle.checked = false;
        }
        localStorage.setItem('settings-soundscape-active', 'false');
        SoundscapeEngine.stopAmbient();
    }
}

// --- SPOOKY ACHIEVEMENTS LIST & ENGINE ---
const SPOOKY_ACHIEVEMENTS = [
    {
        id: 'victim',
        title: 'เหยื่อผู้บริสุทธิ์ (Innocent Victim)',
        desc: 'เริ่มสะสมหนังสยองขวัญเรื่องแรกในคอลเล็กชัน',
        icon: 'fa-solid fa-skull',
        check: (col) => col.length >= 1
    },
    {
        id: 'exorcist',
        title: 'ผู้ปราบสัมภเวสี (Exorcist Master)',
        desc: 'สะสมหนังสยองขวัญในคลังรวมกันเกิน 15 เรื่อง',
        icon: 'fa-solid fa-ghost',
        check: (col) => col.length >= 15
    },
    {
        id: 'insomniac',
        title: 'วิญญาณไม่ยอมหลับ (Restless Spirit)',
        desc: 'เปิดใช้งานเว็บไซต์ในช่วงเที่ยงคืนถึงตี 4 (00:00 - 04:00 น.)',
        icon: 'fa-regular fa-clock',
        check: () => {
            const hr = new Date().getHours();
            return hr >= 0 && hr < 4;
        }
    },
    {
        id: 'jumpscare_survived',
        title: 'จิตสัมผัสพาร่างสั่น (Spooky Survivor)',
        desc: 'มีชีวิตรอดผ่านจังหวะตกใจกลัวผี Jump Scare 1 ครั้ง',
        icon: 'fa-solid fa-triangle-exclamation',
        check: () => localStorage.getItem('achievement_jumpscare_survived') === 'true'
    },
    {
        id: 'marathoner',
        title: 'ผู้จัดตารางสังเวย (Midnight Marathoner)',
        desc: 'สร้างเพลย์ลิสต์สำหรับวิ่งมาราธอนสยองขวัญอย่างน้อย 1 รายการ',
        icon: 'fa-solid fa-scroll',
        check: () => {
            const playlists = Storage.getPlaylists();
            return playlists.length >= 1;
        }
    },
    {
        id: 'critic',
        title: 'นักวิจารณ์จากอเวจี (Cursed Critic)',
        desc: 'เขียนความเห็นวิจารณ์หนัง (Text Review) รวมกันตั้งแต่ 3 เรื่องขึ้นไป',
        icon: 'fa-solid fa-comment-medical',
        check: (col) => {
            const count = col.filter(m => m.review && m.review.trim().length > 0).length;
            return count >= 3;
        }
    },
    {
        id: 'perfectionist',
        title: 'ความสมบูรณ์แบบที่น่ากลัว (Dark Perfectionist)',
        desc: 'ให้คะแนนรีวิวส่วนตัวกับหนังเรื่องใดก็ตามเต็ม 10/10 คะแนน',
        icon: 'fa-solid fa-star',
        check: (col) => {
            return col.some(m => parseInt(m.personalRating, 10) === 10);
        }
    }
];

function renderAchievementsList() {
    if (!achievementsGrid) return;
    
    achievementsGrid.innerHTML = '';
    const collection = Storage.getCollection();
    
    // Check achievements one by one
    SPOOKY_ACHIEVEMENTS.forEach(ach => {
        const isUnlocked = ach.check(collection);
        
        // Create achievement card DOM
        const card = document.createElement('div');
        card.className = `achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`;
        
        // Set icon class based on lock state
        const iconClass = isUnlocked ? ach.icon : 'fa-solid fa-lock';
        
        card.innerHTML = `
            <div class="achievement-icon-wrapper" title="${isUnlocked ? 'ปลดล็อกแล้ว' : 'ยังไม่ปลดล็อก'}">
                <i class="${iconClass}"></i>
            </div>
            <div class="achievement-info">
                <span class="achievement-title">${ach.title}</span>
                <span class="achievement-desc">${ach.desc}</span>
            </div>
        `;
        
        achievementsGrid.appendChild(card);
    });
}

// --- RETRO TICKET GENERATOR LOGIC ---
let activeTicketMovie = null;

function openTicketModal() {
    if (!selectedMovieData) return;
    
    activeTicketMovie = selectedMovieData;
    
    // Load stored ticket name if any, or default to 'LOUIS'
    const storedName = localStorage.getItem('settings-ticket-owner') || 'LOUIS';
    if (ticketOwnerName) ticketOwnerName.value = storedName;
    
    // Generate initial seat number
    if (ticketSeatNo) ticketSeatNo.value = generateRandomSpookySeat();
    
    // Render the Canvas
    updateTicketCanvas();
    
    if (ticketModal) ticketModal.classList.add('active');
}

function closeTicketModal() {
    if (ticketModal) ticketModal.classList.remove('active');
    activeTicketMovie = null;
}

function generateRandomSpookySeat() {
    const rows = ['A', 'B', 'C', 'F', 'X', 'Z'];
    const row = rows[Math.floor(Math.random() * rows.length)];
    const numbers = [13, 666, 4, 9, 99, 7];
    const num = numbers[Math.floor(Math.random() * numbers.length)];
    return `${row}-${num}`;
}

function handleRandomSeatClick() {
    SoundscapeEngine.playClickSFX();
    if (ticketSeatNo) ticketSeatNo.value = generateRandomSpookySeat();
    updateTicketCanvas();
}

function handleTicketOwnerInput() {
    if (!ticketOwnerName) return;
    const rawVal = ticketOwnerName.value.trim();
    const cleanVal = rawVal.substring(0, 18);
    localStorage.setItem('settings-ticket-owner', cleanVal);
    updateTicketCanvas();
}

function updateTicketCanvas() {
    if (!ticketCanvas || !activeTicketMovie) return;
    
    const ctx = ticketCanvas.getContext('2d');
    const width = ticketCanvas.width;
    const height = ticketCanvas.height;
    
    // 1. Draw Background
    ctx.fillStyle = '#0f070a';
    ctx.fillRect(0, 0, width, height);
    
    // 2. Add bloody abstract splash background
    ctx.fillStyle = 'rgba(255, 0, 60, 0.08)';
    ctx.beginPath();
    ctx.arc(100, 100, 150, 0, Math.PI * 2);
    ctx.arc(450, 180, 120, 0, Math.PI * 2);
    ctx.fill();
    
    // 3. Draw Ticket Border
    ctx.strokeStyle = '#c5a059';
    ctx.lineWidth = 3;
    ctx.strokeRect(8, 8, width - 16, height - 16);
    
    ctx.strokeStyle = 'rgba(197, 160, 89, 0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(13, 13, width - 26, height - 26);
    
    // 4. Draw Tear Perforation dashed line
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(197, 160, 89, 0.5)';
    ctx.setLineDash([5, 5]);
    ctx.moveTo(430, 15);
    ctx.lineTo(430, height - 15);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw semi-circular cuts
    ctx.fillStyle = '#150f13';
    ctx.beginPath();
    ctx.arc(430, 8, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(430, height - 8, 12, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#c5a059';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(430, 8, 12, 0, Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(430, height - 8, 12, Math.PI, 0);
    ctx.stroke();
    
    // 5. Draw Typography (Main Body - Left Side)
    // Logo
    ctx.fillStyle = '#ff003c';
    ctx.font = 'bold 11px Courier New';
    ctx.fillText('MIDNIGHT SOCIETY ADMISSION', 30, 42);
    
    // Gold Divider line
    ctx.fillStyle = '#c5a059';
    ctx.fillRect(30, 52, 370, 2);
    
    // Movie Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px "Outfit", "Inter", sans-serif';
    const titleText = activeTicketMovie.title || 'UNKNOWN FILM';
    const limit = 22;
    let dispTitle = titleText;
    if (titleText.length > limit) {
        dispTitle = titleText.substring(0, limit) + '...';
    }
    ctx.fillText(dispTitle.toUpperCase(), 30, 88);
    
    // Release Date & Genre info
    const releaseYear = activeTicketMovie.release_date ? activeTicketMovie.release_date.split('-')[0] : 'N/A';
    ctx.fillStyle = '#8b8a92';
    ctx.font = '12px "Inter", sans-serif';
    ctx.fillText(`YEAR: ${releaseYear} | GENRE: HORROR / GOTHIC`, 30, 112);
    
    // Owner name and seat details
    const ownerName = ((ticketOwnerName ? ticketOwnerName.value.trim() : 'LOUIS') || 'LOUIS').toUpperCase();
    const seatNo = (ticketSeatNo ? ticketSeatNo.value : 'B-13') || 'B-13';
    
    ctx.fillStyle = '#c5a059';
    ctx.font = 'bold 11px Courier New';
    ctx.fillText('HOLDER (ชื่อสะสม):', 30, 155);
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Courier New';
    ctx.fillText(ownerName, 30, 175);
    
    ctx.fillStyle = '#c5a059';
    ctx.font = 'bold 11px Courier New';
    ctx.fillText('SEAT (ที่นั่ง):', 190, 155);
    ctx.fillStyle = '#ff003c';
    ctx.font = 'bold 16px Courier New';
    ctx.fillText(seatNo, 190, 175);
    
    ctx.fillStyle = '#c5a059';
    ctx.font = 'bold 11px Courier New';
    ctx.fillText('DATE & TIME (คืนสังเวย):', 300, 155);
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Courier New';
    const nowStr = new Date().toISOString().split('T')[0];
    const hr = String(new Date().getHours()).padStart(2, '0');
    const min = String(new Date().getMinutes()).padStart(2, '0');
    ctx.fillText(`${nowStr} @ ${hr}:${min}`, 300, 175);
    
    // Bottom horror warning text
    ctx.fillStyle = '#ff003c';
    ctx.font = 'italic bold 9px "Inter", sans-serif';
    ctx.fillText('WARNING: WATCH AT YOUR OWN RISK. THE SHADOWS ARE WATCHING.', 30, 218);
    
    // 6. Draw Stub Typography (Right Side)
    ctx.fillStyle = 'rgba(197, 160, 89, 0.4)';
    ctx.font = 'bold 9px Courier New';
    ctx.fillText('TICKET STUB', 450, 42);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px "Outfit", sans-serif';
    ctx.fillText(seatNo, 450, 80);
    ctx.fillStyle = '#8b8a92';
    ctx.font = '9px Courier New';
    ctx.fillText('SEAT NO.', 450, 95);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px "Outfit", sans-serif';
    ctx.fillText(ownerName.substring(0, 12), 450, 125);
    ctx.fillStyle = '#8b8a92';
    ctx.font = '9px Courier New';
    ctx.fillText('ADM. OWNER', 450, 140);
    
    // Draw barcode
    ctx.fillStyle = '#ffffff';
    const barcodeX = 450;
    const barcodeY = 165;
    const barcodeH = 40;
    
    const barPattern = [2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 1];
    let curX = barcodeX;
    barPattern.forEach((w, idx) => {
        ctx.fillStyle = idx % 2 === 0 ? '#ffffff' : 'transparent';
        if (ctx.fillStyle !== 'transparent') {
            ctx.fillRect(curX, barcodeY, w, barcodeH);
        }
        curX += w + 1;
    });
    
    ctx.fillStyle = '#8b8a92';
    ctx.font = '7px Courier New';
    ctx.fillText('666-13-999-4-F', 455, 215);
}

function handleTicketDownloadClick() {
    if (!ticketCanvas || !activeTicketMovie) return;
    
    SoundscapeEngine.playClickSFX();
    
    const movieTitle = activeTicketMovie.title || 'horror_movie';
    const cleanTitle = movieTitle.toLowerCase().replace(/[^a-z0-9]/g, '_');
    
    const link = document.createElement('a');
    link.download = `midnight_ticket_${cleanTitle}.png`;
    link.href = ticketCanvas.toDataURL('image/png');
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// --- 20 ICONIC HORROR CHARACTERS DATABASE ---
const HORROR_CHARACTERS = [
    {
        id: 'jason',
        name: 'เจสัน วอร์ฮีส์',
        english: 'Jason Voorhees',
        weapon: 'มีดสปาต้า (Machete)',
        movieId: 4488,
        bio: 'ฆาตกรอมตะหน้ากากฮอกกี้แห่งแคมป์คริสตัลเลค เขาตามล่าทุกคนที่ย่างกรายเข้ามาด้วยพละกำลังมหาศาล ไม่มีวันเหนื่อย และไม่มีวันตาย เพื่อสังเวยความแค้นให้ผู้เป็นแม่',
        stats: { brutality: 9.5, stealth: 7.0, speed: 5.5, supernatural: 8.5 },
        simulator: {
            run: { rate: 15, text: 'คุณวิ่งหนีสุดชีวิต แต่เจสันเดินตามมาช้าๆ แล้วใช้อำนาจลึกลับวาร์ปมาดักหน้าคุณในความมืด ก่อนจะฟันมีดสปาต้าเข้ากลางแสกหน้าคุณอย่างโหดเหี้ยม!' },
            hide: { rate: 45, text: 'คุณแอบซ่อนอยู่ใต้เตียงในกระท่อม เจสันก้าวเดินผ่านห้องไปอย่างเชื่องช้า เสียงฝีเท้าหนักหน่วงทำเอาใจสั่นสะท้าน แต่สุดท้ายเขาก็เดินผ่านไป...' },
            fight: { rate: 5, text: 'คุณหยิบไม้หน้าสามฟาดใส่เจสันเต็มแรง! ไม้หักสะบั้น แต่เขากลับไม่รู้สึกสะทกสะท้านเลยแม้แต่น้อย เขาคว้าคอคุณบีบจนหักคามือทันที!' },
            trick: { rate: 8, text: 'คุณตะโกนว่า "คุณแม่ปาเมล่าสั่งให้คุณหยุด!" เจสันชะงักไปครู่หนึ่ง เอียงคอสงสัย แต่พอรู้ตัวว่าโดนหลอก เขาก็ก้าวเข้ามาแทงหน้าอกคุณ!' }
        }
    },
    {
        id: 'freddy',
        name: 'เฟรดดี้ ครูเกอร์',
        english: 'Freddy Krueger',
        weapon: 'ถุงมือใบมีดโกน (Claw Glove)',
        movieId: 377,
        bio: 'ปีศาจฝันร้ายผิวไหม้เกรียมผู้ล่าเหยื่อในความฝันยามหลับใหล หากเหยื่อตายในมิติแห่งฝัน ร่างกายในโลกจริงก็จะเสียชีวิตตามไปด้วย',
        stats: { brutality: 9.0, stealth: 8.5, speed: 7.5, supernatural: 10.0 },
        simulator: {
            run: { rate: 10, text: 'คุณวิ่งหนีไปตามทางเดินแคบๆ ในความฝัน แต่มันยืดยาวออกไปไม่มีที่สิ้นสุด ก่อนที่กรงเล็บเหล็กจะโผล่ทะลุผนังมาฉีกแผ่นหลังคุณกระจุย!' },
            hide: { rate: 20, text: 'คุณซ่อนตัวในห้องมืด แต่เฟรดดี้ที่ควบคุมมิติฝันได้ เปลี่ยนห้องนั้นให้กลายเป็นเตาเผาขยะขนาดยักษ์ คลอกร่างคุณจนไหม้เกรียม!' },
            fight: { rate: 30, text: 'คุณรวบรวมสติ ดึงตัวเฟรดดี้ออกมาในโลกความจริงและพยายามสู้กลับ! แม้จะทำให้เขาบาดเจ็บได้ แต่เขาก็ยังเหี้ยมเกินไปจนเสียบหัวใจคุณอยู่ดี' },
            trick: { rate: 55, text: 'คุณตั้งสมาธิ ปฏิเสธความกลัว และตะโกนใส่เขาว่า "แกไม่มีตัวตน!" ร่างของเขาค่อยๆ สลายไปจากฝันร้ายของคุณชั่วคราว รอดชีวิตหวุดหวิด!' }
        }
    },
    {
        id: 'michael',
        name: 'ไมเคิล ไมเยอร์ส',
        english: 'Michael Myers',
        weapon: 'มีดทำครัวขนาดใหญ่ (Chef\'s Knife)',
        movieId: 948,
        bio: 'อวตารความชั่วร้ายบริสุทธิ์ในหน้ากากสีขาวซีด เขาเดินตามล่าเหยื่ออย่างเงียบงันในคืนวันฮาโลวีนโดยไม่ยอมปริปากพูดและไม่มีความปรานีใดๆ',
        stats: { brutality: 8.8, stealth: 9.5, speed: 4.5, supernatural: 7.0 },
        simulator: {
            run: { rate: 40, text: 'คุณวิ่งหนีเร็วสุดขีด แต่ไม่ว่าจะหันไปมองกี่ครั้ง ชายร่างยักษ์ในหน้ากากขาวก็ยังคงเดินตามหลังคุณมาด้วยฝีเท้าเนิบๆ ระยะห่างเท่าเดิมเสมอ!' },
            hide: { rate: 65, text: 'คุณแอบซ่อนตัวอยู่ในตู้เสื้อผ้าอย่างเงียบเชียบ ไมเคิลก้าวเข้ามาในห้อง ยืนนิ่งจ้องตู้เสื้อผ้าครู่หนึ่ง ก่อนจะเดินจากไป ความเงียบช่วยชีวิตคุณไว้!' },
            fight: { rate: 15, text: 'คุณพยายามแย่งมีดและสู้กับเขาด้วยไม้แขวนเสื้อ ไมเคิลถูกแทงเข้าที่ไหล่แต่ไม่สะทกสะท้าน เขาจับคุณทุ่มกระแทกพื้นจนหมดลมหายใจ!' },
            trick: { rate: 5, text: 'ไม่มีประโยชน์ที่จะพูดจาหว่านล้อมกับความชั่วร้ายที่ไร้ก้นบึ้ง เขาไม่ฟังและบีบคอคุณยกขึ้นสูงจนสิ้นใจตาย' }
        }
    },
    {
        id: 'pennywise',
        name: 'เพนนีไวส์',
        english: 'Pennywise the Clown',
        weapon: 'ฟันเขี้ยวปีศาจและการแปลงกาย (Shape-shifting)',
        movieId: 346364,
        bio: 'ปีศาจโบราณจากนอกโลกที่แปลงกายเป็นตัวตลกเพื่อหลอกล่อเด็กๆ ในเมืองเดอร์รี่ มันจะขยายความกลัวในใจเหยื่อเพื่อใช้เป็นอาหารอันโอชะ',
        stats: { brutality: 9.2, stealth: 8.0, speed: 8.5, supernatural: 9.8 },
        simulator: {
            run: { rate: 35, text: 'มันวิ่งสี่ขาไล่ตามคุณอย่างรวดเร็วชวนสยดสยอง แต่หากคุณควบคุมจิตใจไม่ให้ตื่นกลัว พลังของมันจะลดลงทำให้คุณปีนหนีพ้นขึ้นมาได้' },
            hide: { rate: 15, text: 'คุณแอบซ่อนในที่มืด แต่ลูกโป่งสีแดงลอยมาแตกตรงหน้าคุณ พร้อมใบหน้าปีศาจตัวตลกอ้าปากกว้างเขมือบหัวคุณทันที!' },
            fight: { rate: 50, text: 'คุณหยิบไม้และหินทุบใส่มันพร้อมตะโกนว่า "แกมันก็แค่ตัวตลกกระจอก!" ความกล้าทำให้ตัวตลกอ่อนแอและหดเล็กลงจนยอมหนีลงท่อไป' },
            trick: { rate: 10, text: 'มันพยายามล่อลวงคุณด้วยคำพูดชวนไปลอยตัวในนรก คุณเกือบเคลิ้มตามแต่สะดุ้งตื่นเตะหน้ามันแล้ววิ่งหนีไป!' }
        }
    },
    {
        id: 'chucky',
        name: 'ชัคกี้',
        english: 'Chucky',
        weapon: 'มีดครัวปลายแหลม (Kitchen Knife)',
        movieId: 10585,
        bio: 'ตุ๊กตาเด็กเล่นที่ถูกสิงโดยวิญญาณฆาตกรต่อเนื่อง ชาร์ลส์ ลี เรย์ ผ่านมนต์ดำวูดู ใช้ขนาดตัวที่เล็กให้เป็นประโยชน์ในการลอบสังหารสะเพร่า',
        stats: { brutality: 8.0, stealth: 9.0, speed: 6.5, supernatural: 6.0 },
        simulator: {
            run: { rate: 75, text: 'ชัคกี้วิ่งกะเผลกไล่หลังคุณด้วยขาตุ๊กตาสั้นเตียน คุณวิ่งหนีออกประตูบ้านหนีรอดได้ง่ายดาย (ถ้าไม่ซุ่มซ่ามสะดุดของล้มเอง)' },
            hide: { rate: 55, text: 'คุณแอบซ่อนอยู่หลังโซฟา แต่เมื่อก้มมองดูข้างตัว ชัคกี้กลับนั่งนิ่งอยู่ตรงนั้น เขาแสยะยิ้มพูดว่า "อยากเล่นกันไหม?" ก่อนเสียบมีดเข้าที่ขาคุณ!' },
            fight: { rate: 45, text: 'คุณเตะชัคกี้ปลิวไปกระแทกกำแพงจนหัวหลุด! แต่ทว่า ร่างตุ๊กตากลับลุกขึ้นมาใหม่ คว้าปืนพกกระหน่ำยิงใส่คุณกระสุนเจาะอก!' },
            trick: { rate: 25, text: 'คุณพยายามถอดถ่านของตุ๊กตาออก แต่ลืมไปว่าเขาไม่ได้ขับเคลื่อนด้วยไฟฟ้า เขาหัวเราะลั่นแล้วเหวี่ยงค้อนทุบหัวเข่าคุณ!' }
        }
    },
    {
        id: 'leatherface',
        name: 'เลเธอร์เฟซ',
        english: 'Leatherface',
        weapon: 'เลื่อยไฟฟ้า (Chainsaw)',
        movieId: 11373,
        bio: 'ฆาตกรโรคจิตสวมหน้ากากหนังมนุษย์ผู้คลั่งเลื่อยไฟฟ้า ไล่ล่าเหยื่อภายใต้การสั่งการของครอบครัวกินคนโรคจิตในแถบเท็กซัส',
        stats: { brutality: 9.8, stealth: 4.5, speed: 7.0, supernatural: 1.0 },
        simulator: {
            run: { rate: 45, text: 'เสียงเลื่อยไฟฟ้าแผดร้องไล่หลังคุณอย่างบ้าคลั่ง คุณวิ่งกระโดดหน้าต่างทะลุผ่านป่าข้าวโพดหนีรอดไปได้อย่างหวุดหวิด!' },
            hide: { rate: 10, text: 'คุณซ่อนตัวในห้องใต้ดิน แต่เลเธอร์เฟซบ้าคลั่งแกว่งเลื่อยหั่นทำลายตู้โต๊ะและผนังทุกจุดจนเละเทะ เลื่อยตัดผ่านที่ซ่อนสับร่างคุณขาดครึ่ง!' },
            fight: { rate: 5, text: 'คุณถือท่อนเหล็กพยายามฟาดสู้ แต่เลื่อยไฟฟ้าตัดท่อนเหล็กและแขนของคุณขาดสะบั้นในพริบตา สิ้นใจจมกองเลือด!' },
            trick: { rate: 2, text: 'เขาไม่มีสติปัญญาพอจะฟังคุณเจรจา เขารู้จักเพียงแค่การสับทำลายและชำแหละเนื้อเพื่อเสิร์ฟเป็นอาหารเย็นของครอบครัว' }
        }
    },
    {
        id: 'jigsaw',
        name: 'จิ๊กซอว์ (จอห์น เครเมอร์)',
        english: 'Jigsaw / John Kramer',
        weapon: 'กับดักกลไกมรณะ (Mechanical Traps)',
        movieId: 176,
        bio: 'ชายชราป่วยมะเร็งระยะสุดท้ายผู้สร้างเกมกับดักมรณะ เพื่อทดสอบเจตจำนงในการมีชีวิตอยู่ของเหยื่อ โดยให้เลือกว่าจะยอมแลกด้วยอวัยวะหรือตาย',
        stats: { brutality: 8.8, stealth: 6.0, speed: 3.0, supernatural: 1.0 },
        simulator: {
            run: { rate: 5, text: 'ไม่มีที่ให้วิ่งหนี คุณลืมตาตื่นขึ้นมาก็พบว่าตนเองโดนตรึงเก้าอี้ พร้อมกับดักฉีกปากตลับเมตรสวมบนหัวเรียบร้อยแล้ว!' },
            hide: { rate: 5, text: 'การแอบซ่อนไร้ผล เพราะคุณโดนยาสลบรมลักพาตัวมาล่วงหน้าแล้วขณะกำลังนอนหลับอย่างสบายใจในห้องนอนตนเอง' },
            fight: { rate: 15, text: 'คุณพยายามฝืนดึงโซ่เหล็กและทำลายกับดักด้วยแรงดิบ แต่มันกระตุ้นให้เวลาถอยหลังทำงานเร็วขึ้น สับร่างคุณเป็นชิ้นๆ!' },
            trick: { rate: 80, text: 'คุณใช้สติปัญญาทำตามกติกาของเกมอย่างเคร่งครัด ยอมเฉือนเนื้อตนเองบางส่วนเพื่อกุญแจไขปลดล็อค รอดชีวิตออกมาได้พร้อมแผลเป็น!' }
        }
    },
    {
        id: 'ghostface',
        name: 'โกสต์เฟซ',
        english: 'Ghostface',
        weapon: 'มีดล่าสัตว์ปลายแหลม (Hunting Knife)',
        movieId: 4232,
        bio: 'ฆาตกรสวมหน้ากากผีและชุดคลุมสีดำที่ล่าเหยื่อด้วยมีด มีความคลั่งไคล้ในกฎและทฤษฎีภาพยนตร์สยองขวัญ มักโทรศัพท์มาปั่นประสาทเหยื่อก่อนฆ่า',
        stats: { brutality: 8.2, stealth: 8.8, speed: 7.2, supernatural: 1.0 },
        simulator: {
            run: { rate: 65, text: 'คุณวิ่งหนีสุดชีวิต โกสต์เฟซวิ่งไล่ตามแต่เขาดุดิกสะดุดเก้าอี้และพรมล้มลอย ทำให้คุณได้จังหวะวิ่งออกประตูโรงรถหนีพ้น!' },
            hide: { rate: 50, text: 'คุณแอบในตู้ แต่โทรศัพท์ในกระเป๋ากลับดังขึ้น โกสต์เฟซโทรมาแสยะยิ้มพูดว่า "ฉันเห็นแกแล้ว" ก่อนแทงทะลุตู้เสื้อผ้าเสียบอกคุณ!' },
            fight: { rate: 45, text: 'โกสต์เฟซเป็นเพียงมนุษย์ธรรมดาในหน้ากากยาง คุณคว้าแจกันฟาดใส่หัวเขาจนสลบเหมือด คลานหนีออกบ้านได้ทันท่วงที' },
            trick: { rate: 30, text: 'เขาถามคำถามประลองความรู้หนังผีกับคุณ ถ้าคุณตอบถูกกติกาเขาจะปล่อยคุณไป แต่ถ้าตอบผิด มีดปลายแหลมจะเสียบคอคุณทันที!' }
        }
    },
    {
        id: 'pinhead',
        name: 'พินเฮด',
        english: 'Pinhead',
        weapon: 'โซ่ตะขอเกี่ยวเนื้อ (Hooks and Chains)',
        movieId: 9003,
        bio: 'อดีตมนุสงค์ที่กลายเป็นหัวหน้าลัทธิเซโนไบต์ ทูตแห่งนรกผู้แสวงหาขีดสุดความทรมานและความเจ็บปวดจากการแก้ปริศนากล่องบาศก์ Lament Configuration',
        stats: { brutality: 9.3, stealth: 5.0, speed: 3.5, supernatural: 9.9 },
        simulator: {
            run: { rate: 5, text: 'คุณวิ่งหนี แต่โซ่ตรวนติดตะขอแหลมคมนับสิบพุ่งออกมาจากความมืดเกี่ยวตรึงแขนขาและกระชากร่างคุณฉีกทึ้งเป็นชิ้นๆ!' },
            hide: { rate: 10, text: 'เซโนไบต์สัมผัสเสียงสะท้อนจิตวิญญาณคุณได้ ไม่มีที่ซ่อนใดในสามภพที่จะหลบพ้นสายตาปุ่มเหล็กบนหัวของเขาได้!' },
            fight: { rate: 2, text: 'การชกต่อยหรือยิงกระสุนทำอะไรทูตแห่งขุมนรกผู้นี้ไม่ได้เลย เขาโบกมือเพียงครั้งเดียวโซ่ก็รัดคอคุณขาดสะบั้น!' },
            trick: { rate: 50, text: 'คุณมีกล่อง Lament Configuration ในมือ ค่อยๆ แก้ปริศนากลไกย้อนกลับเพื่อปิดประตูนรกและส่งเขากลับไปขุมนรกได้สำเร็จ!' }
        }
    },
    {
        id: 'hannibal',
        name: 'ฮันนิบาล เลคเตอร์',
        english: 'Hannibal Lecter',
        weapon: 'จิตวิทยาปั่นประสาทและมีดผ่าตัด (Scalpel)',
        movieId: 274,
        bio: 'จิตแพทย์อัจฉริยะผู้มีรสนิยมวิไลในการกินเนื้อคน เขาล่าและปรุงอาหารเหยื่อด้วยความสุขุมลุ่มลึก ละเมียดละไม และวิเคราะห์จิตใจเหยื่ออย่างทะลุปรุโปร่ง',
        stats: { brutality: 9.0, stealth: 7.5, speed: 6.0, supernatural: 1.0 },
        simulator: {
            run: { rate: 60, text: 'ฮันนิบาลไม่มีพลังพิเศษและอายุมากแล้ว หากคุณวิ่งหนีออกไปทันทีโดยไม่หยุดสนทนา คุณจะสามารถรอดพ้นได้อย่างง่ายดาย' },
            hide: { rate: 35, text: 'เขาสามารถวิเคราะห์พฤติกรรมมนุษย์และตามรอยอย่างอัจฉริยะ เขาจะเดินมาเคาะตู้ที่คุณซ่อนตัวอยู่แล้วยิ้มทักทายอย่างเยือกเย็น' },
            fight: { rate: 20, text: 'เขาเชี่ยวชาญสรีรวิทยาและอนาโตมี่ เขาสามารถหลบหมัดของคุณและใช้เข็มฉีดยาหรือมีดผ่าตัดเจาะเข้าเส้นเลือดใหญ่ดับชีพคุณใน 3 วินาที!' },
            trick: { rate: 75, text: 'คุณเสนอผลประโยชน์และวิเคราะห์จิตวิทยาแลกเปลี่ยนแบบ "Quid Pro Quo" อย่างเหนือชั้น เขาประทับใจในสติปัญญาของคุณและเว้นชีวิต!' }
        }
    },
    {
        id: 'bates',
        name: 'นอร์แมน เบทส์',
        english: 'Norman Bates',
        weapon: 'มีดหั่นขนมปัง (Bread Knife)',
        movieId: 539,
        bio: 'เจ้าของโรงแรมเบทส์โมเทลผู้มีจิตใจแตกแยก สวมรอยเป็น "คุณแม่" ที่ล่วงลับไปแล้วเพื่อลงมือฆ่าแขกที่มาพักที่ทำให้เขารู้สึกขัดแย้งทางเพศ',
        stats: { brutality: 8.0, stealth: 9.0, speed: 6.0, supernatural: 1.0 },
        simulator: {
            run: { rate: 75, text: 'ฆาตกรสวมชุดคลุมและวิกผมผู้หญิงถือมีดวิ่งไล่ตาม คุณวิ่งผลักเขาออกจากห้องอาบน้ำและขับรถหนีจากโมเทลร้างได้ทัน!' },
            hide: { rate: 40, text: 'คุณซ่อนตัวในห้องพักนอร์แมนถือมีดไขกุญแจเข้ามาตรวจดู ถ้าคุณหลบซ่อนตัวไม่มิดชิด มีดทำครัวจะแทงทะลุผ้าม่านห้องน้ำ!' },
            fight: { rate: 50, text: 'นอร์แมนเป็นชายหนุ่มร่างผอมบาง คุณสามารถผลักเขาตกบันไดหรือแย่งมีดทำครัวจากมือเขาจนเขาสลบและสับสนในจิตใจได้!' },
            trick: { rate: 30, text: 'คุณพยายามพูดคุยเกลี้ยกล่อม แต่ตัวตน "คุณแม่" ในจิตสำนึกของเขาคลั่งขึ้นมาและปรี่เข้ามาแทงคุณอย่างไม่ฟังเสียง!' }
        }
    },
    {
        id: 'regan',
        name: 'เรแกน แมคนีล (พาสุซุ)',
        english: 'Regan MacNeil (Pazuzu)',
        weapon: 'พลังจิตเคลื่อนย้ายและน้ำลายปีศาจ (Telekinesis)',
        movieId: 9552,
        bio: 'เด็กสาวไร้เดียงสาที่ถูกปีศาจโบราณพาสุซุสิงร่าง เธอสามารถหมุนหัวได้ 360 องศา ลอยตัวกลางอากาศ และใช้พลังจิตทำลายสิ่งของรอบข้างเพื่อทรมานผู้คน',
        stats: { brutality: 8.5, stealth: 2.0, speed: 4.0, supernatural: 9.7 },
        simulator: {
            run: { rate: 80, text: 'เด็กสาวขยับเดินท่าสะพานโค้งลงบันไดอย่างช้าๆ ชวนสยองขวัญ คุณเพียงแค่วิ่งหนีออกจากบ้านหลังนั้นก็รอดพ้นอย่างปลอดภัย!' },
            hide: { rate: 20, text: 'พลังจิตปีศาจสั่นสะเทือนห้องทุ่มเก้าอี้กระจัดกระจายและชี้เป้าที่คุณหลบซ่อนอยู่ได้อย่างง่ายดาย ปิดประตูขังคุณทรมาน!' },
            fight: { rate: 10, text: 'คุณพยายามชกต่อยเด็กสาว แต่แรงปีศาจปัดคุณกระเด็น และหักข้อมือคุณกลับหลังอย่างโหดร้าย!' },
            trick: { rate: 65, text: 'คุณหยิบน้ำมนต์และพระคัมภีร์มาสวดขับไล่ปีศาจอย่างตั้งมั่น "The power of Christ compels you!" ร่างกายปีศาจเจ็บปวดสลายกำลังลง!' }
        }
    },
    {
        id: 'carrie',
        name: 'แครี่ ไวท์',
        english: 'Carrie White',
        weapon: 'พลังจิตสังหารวงกว้าง (Telekinesis)',
        movieId: 7340,
        bio: 'เด็กสาวมัธยมปลายผู้อ่อนแอที่ค้นพบว่าตนเองมีพลังจิตหลังโดนแกล้งอย่างรุนแรงในงานพรอม เธอปลดปล่อยโทสะสังหารผู้คนด้วยพลังไฟและการควบคุมวัตถุ',
        stats: { brutality: 9.0, stealth: 3.0, speed: 5.0, supernatural: 9.5 },
        simulator: {
            run: { rate: 25, text: 'เธอปิดประตูทางออกทุกบานด้วยพลังจิตและจุดไฟเผาทุกอย่างรอบตัว คุณโดนควันไฟรมควันสำลักทรมานหนีออกไปไม่ได้!' },
            hide: { rate: 15, text: 'พลังจิตลากโต๊ะเก้าอี้และมีดทำครัวลอยฟิ้วทะลุกำแพงเจาะกลางหลังคุณที่ซ่อนตัวอยู่หมดหนทางรอด!' },
            fight: { rate: 5, text: 'พยายามสู้ตรงๆ โดนแรงอัดพลังจิตทุ่มกระแทกเพดานโรงยิมจนกระดูกและคอหักละเอียดเสียชีวิต!' },
            trick: { rate: 50, text: 'คุณก้าวเข้าไปกอดเธอและเอ่ยปากขอโทษอย่างจริงใจก่อนที่พลังจิตจะคลั่งขีดสุด ความอบอุ่นทำให้เธอสงบและสลายความโกรธ!' }
        }
    },
    {
        id: 'art',
        name: 'อาร์ต เดอะ คลาวน์',
        english: 'Art the Clown',
        weapon: 'มีดชำแหละและปืน (Cleaver / Hacksaw)',
        movieId: 420634,
        bio: 'ปีศาจในคราบตัวตลกใบ้ขาวดำจอมซาดิสต์ มันชื่นชอบการชำแหละและทรมานเหยื่ออย่างช้าๆ พิสดาร โดยไม่มีเสียงพูดหรือการแสดงอารมณ์เมตตา',
        stats: { brutality: 9.9, stealth: 9.0, speed: 7.0, supernatural: 8.0 },
        simulator: {
            run: { rate: 30, text: 'คุณวิ่งหนีสุดชีวิต แต่อาร์ตปั่นจักรยานเด็กสามล้อตามคุณมาเงียบๆ พร้อมปืนพกกระหน่ำยิงใส่ขาคุณจนล้มคลาน!' },
            hide: { rate: 10, text: 'เขาค้นตู้เสื้อผ้าและห้องน้ำอย่างบ้าคลั่ง หากเจอคุณเขาจะจับมัดห้อยหัวหั่นเลื่อยผ่าครึ่งร่างอย่างทรมานแสนสาหัส!' },
            fight: { rate: 15, text: 'คุณคว้าไม้ฟาดหัวเขาจนล้มคว่ำและสลบไป แต่ทว่าเขามีพลังชุบชีวิต ฟื้นขึ้นมาสาดน้ำกรดใส่หน้าคุณทำละลายผิวหนังหมด!' },
            trick: { rate: 2, text: 'เขาไม่สนทนาใดๆ ทำเพียงโบกมือบีบแตรแป้นๆ ส่งจูบให้คุณ แล้วชักเลื่อยไฟฟ้ามาหั่นร่างคุณเป็นชิ้นๆ อย่างสนุกสนาน!' }
        }
    },
    {
        id: 'sadako',
        name: 'ซาดาโกะ ยามามูระ',
        english: 'Sadako Yamamura',
        weapon: 'พลังจิตคำสาปม้วนวิดีโอ (Nenki Curse)',
        movieId: 2671,
        bio: 'วิญญาณแค้นผีสาวผมยาวจากก้นบ่อน้ำมรณะ เธอส่งต่อความแค้นผ่านคำสาปม้วนวิดีโอเทป หากผู้ใดเปิดดูจะได้รับโทรศัพท์เตือนความตายภายใน 7 วัน',
        stats: { brutality: 8.7, stealth: 9.0, speed: 3.0, supernatural: 9.8 },
        simulator: {
            run: { rate: 5, text: 'เมื่อครบกำหนด 7 วัน ซาดาโกะจะคลานออกจากจอทีวีไม่ว่าคุณจะอยู่ที่ไหน ข้ามน้ำข้ามทะเลเธอก็โผล่มาหลอนหัวใจคุณวายตาย!' },
            hide: { rate: 5, text: 'ต่อให้ซ่อนใต้ผ้าห่มหรือดับไฟมืด คำสาปและความสยองขวัญจะบีบคั้นจิตใจคุณจนช็อคตาค้างดับอนาถคาที!' },
            fight: { rate: 2, text: 'การชกต่อยวิญญาณไม่มีผลใดๆ ร่างเงาดำผมยาวจะกระชากวิญญาณคุณออกจากร่างไปขังในบ่อน้ำร้างตลอดกาล!' },
            trick: { rate: 85, text: 'คุณรีบอัดคัดลอกวิดีโอม้วนนั้นแล้วส่งต่อไปให้ผู้อื่นดูแทนภายใน 7 วัน เป็นการส่งต่อคำสาปเพื่อช่วยชีวิตตัวเอง รอดหวุดหวิด!' }
        }
    },
    {
        id: 'valak',
        name: 'วาลาค (แม่ชีผี)',
        english: 'Valak / The Nun',
        weapon: 'ร่างแม่ชีสะกดวิญญาณ (Demonic Possession)',
        movieId: 439079,
        bio: 'ปีศาจระดับสูงจากนรกที่แปลงกายสวมชุดแม่ชีเพื่อล้อเลียนความศรัทธา มันมีพลังบิดเบือนพื้นที่ สร้างภาพลวงตา และสิงสู่ผู้คนเพื่อทำลายศาสนสถาน',
        stats: { brutality: 9.0, stealth: 9.2, speed: 6.0, supernatural: 9.9 },
        simulator: {
            run: { rate: 40, text: 'แม่ชีผีลอยวาร์ปมาดักหน้า บังคับเงาดำตรึงร่างคุณกระแทกชนกำแพงโบสถ์เหล็กจนซี่โครงหักแหลกละเอียดหมด!' },
            hide: { rate: 30, text: 'คุณหลบหลังแท่นบูชาพระคริสต์ แต่เงาดำของวาลาคแผ่กระจายดับแสงไฟทั้งหมด บีบคอคุณลอยขัดขวางทางอากาศ!' },
            fight: { rate: 20, text: 'กระสุนปืนหรือแรงกายทำอะไรปีศาจตนนี้ไม่ได้เลย เธอจะกระชากตัวคุณลอยหมุนเคว้งกลางเวหาก่อนทุ่มหัวกระแทกพื้น!' },
            trick: { rate: 70, text: 'คุณรวบรวมสติ คว้ารูปภาพศักดิ์สิทธิ์และตะโกนเรียกชื่อจริงของเธอ "ในนามของพระเยซู ข้าขอสั่งให้แกกลับนรกไป วาลาค!" ร่างเธอสลายทันที!' }
        }
    },
    {
        id: 'torrance',
        name: 'แจ็ค ทอร์แรนซ์',
        english: 'Jack Torrance',
        weapon: 'ขวานจามหัว (Fire Axe)',
        movieId: 694,
        bio: 'นักเขียนที่โดนพลังงานชั่วร้ายของโรงแรมผีสิง Overlook ครอบงำจิตวิญญาณจนคลุ้มคลั่ง หยิบขวานไล่ฆ่าภรรยาและลูกชายในทางเดินเขาวงกตหิมะ',
        stats: { brutality: 8.5, stealth: 5.5, speed: 5.0, supernatural: 3.0 },
        simulator: {
            run: { rate: 80, text: 'แจ็คถือขวานวิ่งไล่คุณเข้าไปในเขาวงกตหิมะลึก คุณใช้ไหวพริบเดินถอยหลังลบรอยเท้า ล่อให้เขาหลงทางหนาวตายในกองหิมะ!' },
            hide: { rate: 40, text: 'คุณแอบในห้องน้ำ แจ็คใช้ขวานจามพังประตูไม้โผล่หน้ามาหัวเราะลั่นร้อง "Johnny\'s Here!" ก่อนจามขวานใส่คุณดับคาอ่าง!' },
            fight: { rate: 45, text: 'แจ็คเป็นคนธรรมดา คุณแย่งมีดหั่นเนื้อแทงส่วนกลับหรือผลักเขาตกบันไดทำให้เขาบาดเจ็บช้าลงเปิดโอกาสให้คุณวิ่งหนีพ้น!' },
            trick: { rate: 20, text: 'เขาโดนโรงแรมสิงจนจิตหลอนกู่ไม่กลับแล้ว คำขอร้องของเพื่อนหรือครอบครัวไม่มีผลใดๆ ต่อคมขวานที่จามลงมา!' }
        }
    },
    {
        id: 'babadook',
        name: 'บาบาดุค',
        english: 'The Babadook',
        weapon: 'เงาสยองขวัญในสมุดนิทาน (Shadow Monster)',
        movieId: 242224,
        bio: 'ปีศาจเงาสูทดำสวมหมวกทรงสูงที่หลุดออกมาจากหนังสือภาพปริศนา มันเป็นตัวแทนของความโศกเศร้าและการสูญเสียที่คอยหลอกหลอนจิตใจจนบ้าคลั่ง',
        stats: { brutality: 8.0, stealth: 8.5, speed: 6.5, supernatural: 9.0 },
        simulator: {
            run: { rate: 30, text: 'คุณวิ่งหนีออกนอกบ้าน แต่เงาสีดำทอดยาวตามพื้นพร้อมเสียงคราง "บา-บา-ดูค!" เกาะติดหลอนประสาทคุณไปทุกหนทุกแห่ง!' },
            hide: { rate: 20, text: 'มันสามารถขยายเงาแทรกซึมใต้ตู้เสื้อผ้าและใต้เตียงของคุณ ซ่อนยังไงมันก็โผล่มาสั่นสะเทือนเตียงนอนบีบคอคุณ!' },
            fight: { rate: 15, text: 'ยิงปืนใส่เงาไม่มีผลทางกายภาพ มันจะควบคุมจิตใจคุณทำให้คุณหันกระบอกปืนมายิงทำร้ายตัวเองดับสลด!' },
            trick: { rate: 80, text: 'คุณยอมสบตามัน เผชิญหน้ากับความโศกเศร้าในใจ และพูดว่า "ฉันรู้ว่าแกอยู่ที่นี่ และฉันจะไม่กลัวแก!" มันจะหดตัวกลับไปเชื่องช้าในใต้ดิน!' }
        }
    },
    {
        id: 'kayako',
        name: 'คายาโกะ ซาเอกิ',
        english: 'Kayako Saeki',
        weapon: 'วิญญาณแค้นจูออนสิงบ้าน (Grudge Curse)',
        movieId: 11838,
        bio: 'ผีแม่ลูกดกชาวญี่ปุ่นที่ตายด้วยความอาฆาตแค้นแสนสาหัสจากสามี เธอสถิตอยู่ในบ้านหลังนั้นและตามฆ่าทุกคนที่เข้าเหยียบเพื่อขยายวงจรแค้นไม่สิ้นสุด',
        stats: { brutality: 9.0, stealth: 9.5, speed: 4.0, supernatural: 9.9 },
        simulator: {
            run: { rate: 5, text: 'คำสาปจูออนไม่มีวันจางหาย เธอจะตามหลอกหลอนคลานลงบันไดส่งเสียงครืดๆ ในคอ ดึงขาคุณลงไปตายในมิติผีสิง!' },
            hide: { rate: 5, text: 'คุณแอบใต้ผ้าห่มบนเตียงนอน แต่อยู่ดีๆ ร่างซีดเผือดตาโตของคายาโกะกลับมุดขึ้นมาจากใต้ผ้าห่มจ้องมองหน้าคุณในระยะเผาขนช็อคตาย!' },
            fight: { rate: 2, text: 'ร่างกายเธอเหนียวหนืดและไร้ขีดจำกัดทางฟิสิกส์ เธอรวบรัดแขนขาบีบคอคุณหักพับกระดูกจนตายคาที!' },
            trick: { rate: 2, text: 'คำสาปผีดุไม่มีเจตจำนงในการคุยหรือต่อรองใดๆ ทั้งสิ้น เธอมีชีวิตอยู่เพื่อล้างแค้นทุกคนอย่างไร้เหตุผลและสะพรึงที่สุด!' }
        }
    },
    {
        id: 'xenomorph',
        name: 'ซีโนมอร์ฟ',
        english: 'Xenomorph',
        weapon: 'ลิ้นเขี้ยวเหล็กและเลือดกรด (Inner Jaw / Acid Blood)',
        movieId: 348,
        bio: 'อสูรกายต่างดาวสุดยอดเครื่องจักรสังหารชีวภาพ มีหัวยาวเรียบ ผิวหนังแข็งแกร่ง เลือดเป็นกรดรุนแรง และมีลิ้นเขี้ยวซ้อนยืดออกเจาะหัวกะโหลกเหยื่อ',
        stats: { brutality: 9.7, stealth: 9.6, speed: 9.0, supernatural: 1.0 },
        simulator: {
            run: { rate: 20, text: 'มันวิ่งไล่ตามทางเดินยานอวกาศอย่างว่องไวและใช้หางยาวเสียบทะลุท้องคุณลากกลับไปรังดักแด้หนอนเอเลี่ยน!' },
            hide: { rate: 35, text: 'มันจับการสั่นสะเทือนและกลิ่นฟีโรโมนได้ดีมาก หากคุณแอบในตู้ล็อคเกอร์แล้วกลั้นหายใจนิ่งสนิทที่สุด มันอาจก้าวข้ามผ่านไปกรงเล็บเฉียดหน้าผาก!' },
            fight: { rate: 10, text: 'คุณยิงปืนใส่ปะทะตัวมัน เลือดกรดละลายเหล็กพุ่งฉีดกระจายล้างหน้าผิวกายคุณสลายแสบร้อนเจ็บปวดทรมานตายคาที่!' },
            trick: { rate: 90, text: 'คุณรีบวิ่งไปเปิดระบบสลัดห้องอวกาศกระแทกสวิตช์ดีดตัว ปล่อยให้แรงดึงดูดศูนย์สุญญากาศเป่าร่างมันปลิวหลุดลอยสู่อวกาศอันมืดมิด! รอดชีวิต!' }
        }
    }
];

// --- RENDER HORROR CHARACTERS GRID ---
function renderCharacters() {
    if (!charactersGrid) return;
    charactersGrid.innerHTML = '';
    
    HORROR_CHARACTERS.forEach(char => {
        const card = document.createElement('div');
        card.className = 'character-card';
        card.dataset.charId = char.id;
        
        card.innerHTML = `
            <div class="character-card-bg" id="char-bg-${char.id}"></div>
            <div class="character-card-overlay"></div>
            <div class="character-card-content">
                <div class="character-card-name">${char.name}</div>
                <div class="character-card-english">${char.english}</div>
                <div class="character-card-weapon"><i class="fa-solid fa-gavel text-danger"></i> อาวุธ: ${char.weapon}</div>
                <div class="character-card-stats-row">
                    <span class="meta-rating" style="background: rgba(255, 0, 60, 0.12); border-color: rgba(255, 0, 60, 0.35); color: var(--primary); font-size: 0.72rem; padding: 0.15rem 0.45rem;">
                        <i class="fa-solid fa-skull"></i> โหด ${char.stats.brutality}/10
                    </span>
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => {
            SoundscapeEngine.playClickSFX();
            openCharacterModal(char.id);
        });
        
        charactersGrid.appendChild(card);
        loadCharacterCardImage(char);
    });
}

async function loadCharacterCardImage(char) {
    const bgEl = document.getElementById(`char-bg-${char.id}`);
    if (!bgEl) return;
    
    try {
        const movie = await TMDB.getMovieDetails(char.movieId);
        if (movie && movie.backdrop_path) {
            bgEl.style.backgroundImage = `url('${TMDB.getImageUrl(movie.backdrop_path, 'w300')}')`;
        } else {
            bgEl.style.backgroundColor = '#15090f';
        }
    } catch (err) {
        console.error("Failed to load TMDB image for " + char.name, err);
        bgEl.style.backgroundColor = '#15090f';
    }
}

// --- CHARACTER MODAL & SIMULATOR LOGIC ---
async function openCharacterModal(charId) {
    const char = HORROR_CHARACTERS.find(c => c.id === charId);
    if (!char) return;
    
    SoundscapeEngine.playModalOpenSFX();
    
    document.getElementById('character-name').textContent = char.name;
    document.getElementById('character-english').innerHTML = `<i class="fa-regular fa-user"></i> ${char.english}`;
    document.getElementById('character-weapon').innerHTML = `<i class="fa-solid fa-gavel"></i> อาวุธ: ${char.weapon}`;
    document.getElementById('character-bio').textContent = char.bio;
    
    const resultBox = document.getElementById('sim-result-box');
    if (resultBox) resultBox.style.display = 'none';
    
    const simBtns = ['run', 'hide', 'fight', 'trick'];
    simBtns.forEach(choice => {
        const btn = document.getElementById(`sim-btn-${choice}`);
        if (btn) {
            btn.classList.remove('active');
            
            // Rebind click listeners cleanly
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            newBtn.addEventListener('click', () => runSurvivalSimulator(char.id, choice));
        }
    });
    
    const stats = ['brutality', 'stealth', 'speed', 'supernatural'];
    stats.forEach(stat => {
        const valEl = document.getElementById(`stat-val-${stat}`);
        const barEl = document.getElementById(`stat-bar-${stat}`);
        if (valEl && barEl) {
            const score = char.stats[stat];
            valEl.textContent = `${score} / 10`;
            barEl.style.width = '0%';
            setTimeout(() => {
                barEl.style.width = `${score * 10}%`;
            }, 50);
        }
    });
    
    const modal = document.getElementById('character-detail-modal');
    if (modal) modal.classList.add('active');
    
    const backdropEl = document.getElementById('character-backdrop');
    const posterEl = document.getElementById('character-poster');
    const linkContainer = document.getElementById('character-featured-movie-link');
    
    if (posterEl) posterEl.src = 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=500&auto=format&fit=crop';
    if (backdropEl) backdropEl.style.backgroundImage = 'radial-gradient(circle, #25090f 0%, #08080c 100%)';
    if (linkContainer) linkContainer.innerHTML = 'กำลังโหลดภาพยนตร์แนะนำ...';
    
    try {
        const movie = await TMDB.getMovieDetails(char.movieId);
        if (movie) {
            if (posterEl && movie.poster_path) {
                posterEl.src = TMDB.getImageUrl(movie.poster_path, 'w185');
            }
            if (backdropEl && movie.backdrop_path) {
                backdropEl.style.backgroundImage = `url('${TMDB.getImageUrl(movie.backdrop_path, 'original')}')`;
            }
            
            if (linkContainer) {
                linkContainer.innerHTML = `
                    <img src="${TMDB.getImageUrl(movie.poster_path, 'w92')}" class="actor-movie-poster" alt="${movie.title}">
                    <div class="actor-movie-details">
                        <div class="actor-movie-title">${movie.title}</div>
                        <div class="actor-movie-character" style="font-size: 0.72rem; color: var(--primary);"><i class="fa-solid fa-fire animate-pulse"></i> คลิกเพื่อดูรายละเอียดและรับชมตัวอย่างภาพยนตร์</div>
                    </div>
                `;
                
                const newLink = linkContainer.cloneNode(true);
                linkContainer.parentNode.replaceChild(newLink, linkContainer);
                newLink.addEventListener('click', () => {
                    closeCharacterModal();
                    openMovieModal(movie.id);
                });
            }
        }
    } catch (err) {
        console.error("Failed to load TMDB details for character modal", err);
        if (linkContainer) {
            linkContainer.innerHTML = `<div style="font-size: 0.8rem; color: var(--text-dark);"><i class="fa-solid fa-triangle-exclamation"></i> ไม่สามารถเชื่อมต่อภาพยนตร์แนะนำได้ (ออฟไลน์)</div>`;
        }
    }
}

function closeCharacterModal() {
    const modal = document.getElementById('character-detail-modal');
    if (modal) modal.classList.remove('active');
}

function runSurvivalSimulator(charId, choice) {
    const char = HORROR_CHARACTERS.find(c => c.id === charId);
    if (!char) return;
    
    const choices = ['run', 'hide', 'fight', 'trick'];
    choices.forEach(c => {
        const btn = document.getElementById(`sim-btn-${c}`);
        if (btn) {
            btn.classList.toggle('active', c === choice);
        }
    });
    
    const result = char.simulator[choice];
    const rate = result.rate;
    
    if (rate <= 15) {
        SoundscapeEngine.playJumpscareSFX();
    } else {
        SoundscapeEngine.playClickSFX();
    }
    
    const resultBox = document.getElementById('sim-result-box');
    const survivalRateEl = document.getElementById('sim-survival-rate');
    const outcomeTextEl = document.getElementById('sim-outcome-text');
    
    if (resultBox && survivalRateEl && outcomeTextEl) {
        survivalRateEl.textContent = `โอกาสรอด: ${rate}%`;
        
        if (rate >= 70) {
            survivalRateEl.style.color = '#10b981';
        } else if (rate >= 40) {
            survivalRateEl.style.color = '#f59e0b';
        } else {
            survivalRateEl.style.color = '#ef4444';
        }
        
        outcomeTextEl.textContent = result.text;
        resultBox.style.display = 'block';
    }
}
