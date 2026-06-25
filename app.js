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
        id: 447332,
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

const HORROR_FRANCHISES = [
    {
        id: "conjuring",
        name: "จักรวาลคนเรียกผี (The Conjuring Universe)",
        backdrop: "/ecKQlAEG95k62SMGhvX83oEqANK.jpg",
        description: "มหากาพย์จักรวาลปราบผีสุดโด่งดังของคู่สามีภรรยา เอ็ด และ ลอเรน วอร์เรน ซึ่งรวบรวมเรื่องราวของตุ๊กตาแอนนาเบลล์ และตำนานปีศาจแม่ชีวาลัค",
        movies: [
            { id: 138843, title: "เดอะ คอนเจอริ่ง คนเรียกผี (The Conjuring)", year: 2013 },
            { id: 250546, title: "แอนนาเบลล์ ตุ๊กตาผี (Annabelle)", year: 2014 },
            { id: 259693, title: "เดอะ คอนเจอริ่ง คนเรียกผี 2 (The Conjuring 2)", year: 2016 },
            { id: 396422, title: "แอนนาเบลล์ กำเนิดตุ๊กตาผี (Annabelle: Creation)", year: 2017 },
            { id: 439079, title: "เดอะ นัน (The Nun)", year: 2018 },
            { id: 521029, title: "Annabelle Comes Home (แอนนาเบลล์ ตุ๊กตาผีกลับบ้าน)", year: 2019 },
            { id: 423108, title: "เดอะ คอนเจอริ่ง คนเรียกผี 3 มหาเวทลวงศิษย์ (The Conjuring 3)", year: 2021 },
            { id: 968051, title: "เดอะ นัน II (The Nun II)", year: 2023 }
        ]
    },
    {
        id: "saw",
        name: "เกมต่อตัดตาย (Saw Saga)",
        backdrop: "/ok4ot3YbfDYZcINXf91JUfq3maB.jpg",
        description: "เกมทดสอบจิตวิญญาณและความเจ็บปวดอันโหดเหี้ยมโดย ฆาตกรจิ๊กซอว์ (Jigsaw) ที่จะให้เหยื่อเลือกระหว่างการยอมสละชิ้นส่วนร่างกายหรือความตาย",
        movies: [
            { id: 176, title: "ซอว์ เกมต่อตัดตาย (Saw)", year: 2004 },
            { id: 215, title: "ซอว์ เกมต่อตัดตาย 2 (Saw II)", year: 2005 },
            { id: 214, title: "ซอว์ เกมต่อตัดตาย 3 (Saw III)", year: 2006 },
            { id: 663, title: "ซอว์ เกมต่อตัดตาย 4 (Saw IV)", year: 2007 },
            { id: 11917, title: "ซอว์ เกมต่อตัดตาย 5 (Saw V)", year: 2008 },
            { id: 22804, title: "ซอว์ เกมต่อตัดตาย 6 (Saw VI)", year: 2009 },
            { id: 41439, title: "ซอว์ เกมต่อตัดตาย 7 (Saw 3D)", year: 2010 },
            { id: 298250, title: "จิ๊กซอว์ เกมต่อตัดตาย (Jigsaw)", year: 2017 },
            { id: 602734, title: "Spiral: From the Book of Saw (เกมลอกฆาตกร)", year: 2021 },
            { id: 951491, title: "ซอว์ X (Saw X)", year: 2023 }
        ]
    },
    {
        id: "insidious",
        name: "วิญญาณตามติด (Insidious)",
        backdrop: "/8HbNKB2pMiD3mfLgbxe7DgAKjdS.jpg",
        description: "เรื่องราวของครอบครัวที่เผชิญหน้ากับมิติมืด 'The Further' ที่คอยดูดกลืนวิญญาณของเด็กๆ และตามหลอกหลอนพวกเขาไปทุกหนทุกแห่ง",
        movies: [
            { id: 49018, title: "อินซิเดียส วิญญาณตามติด (Insidious)", year: 2010 },
            { id: 91586, title: "อินซิเดียส วิญญาณตามติด 2 (Insidious: Chapter 2)", year: 2013 },
            { id: 280092, title: "อินซิเดียส วิญญาณตามติด 3 (Insidious: Chapter 3)", year: 2015 },
            { id: 406563, title: "อินซิเดียส วิญญาณตามติด 4 กุญแจไขผี (Insidious: The Last Key)", year: 2018 },
            { id: 614479, title: "อินซิเดียส วิญญาณตามติด 5 ประตูสีแดง (Insidious: The Red Door)", year: 2023 }
        ]
    },
    {
        id: "paranormal",
        name: "เรียลลิตี้ขนหัวลุก (Paranormal Activity)",
        backdrop: "/wfCdJ0MD1hYJzlaHulolNw5pYtR.jpg",
        description: "ภาพยนตร์แนว Found Footage สารคดีสมจริงที่บันทึกเหตุการณ์ประหลาดเหนือธรรมชาติผ่านกล้องวงจรปิดภายในบ้านพักอาศัย",
        movies: [
            { id: 23827, title: "เรียลลิตี้ขนหัวลุก (Paranormal Activity)", year: 2007 },
            { id: 41436, title: "เรียลลิตี้ขนหัวลุก 2 (Paranormal Activity 2)", year: 2010 },
            { id: 72571, title: "เรียลลิตี้ขนหัวลุก 3 (Paranormal Activity 3)", year: 2011 },
            { id: 82990, title: "เรียลลิตี้ขนหัวลุก 4 (Paranormal Activity 4)", year: 2012 },
            { id: 227348, title: "Paranormal Activity: The Marked Ones", year: 2014 },
            { id: 146301, title: "Paranormal Activity: The Ghost Dimension", year: 2015 },
            { id: 609972, title: "Paranormal Activity: Next of Kin", year: 2021 }
        ]
    },
    {
        id: "scream",
        name: "หวีดสุดขีด (Scream Saga)",
        backdrop: "/vh7np635kDIcfO6x2Y9ElgLJsuI.jpg",
        description: "ภาพยนตร์แนวไล่เชือด (Slasher) สุดแหวกแนวที่มีจุดเด่นในเรื่องความตลกร้าย เสียดสีล้อเลียนกฎเกณฑ์ของหนังสยองขวัญ และหน้ากากฆาตกรโกสต์เฟส (Ghostface)",
        movies: [
            { id: 4232, title: "หวีดสุดขีด (Scream)", year: 1996 },
            { id: 4233, title: "หวีดสุดขีด 2 (Scream 2)", year: 1997 },
            { id: 4234, title: "หวีดสุดขีด 3 (Scream 3)", year: 2000 },
            { id: 41446, title: "หวีดสุดขีด 4 (Scream 4)", year: 2011 },
            { id: 646385, title: "หวีดสุดขีด 5 (Scream)", year: 2022 },
            { id: 934433, title: "หวีดสุดขีด 6 (Scream VI)", year: 2023 }
        ]
    },
    {
        id: "evil-dead",
        name: "ผีอมรณะ (Evil Dead)",
        backdrop: "/7bWxAsNPv9CXHOhZbJVlj2KxgfP.jpg",
        description: "คัมภีร์มนตราแห่งความตาย (Necronomicon) ที่เปิดประตูปลดปล่อยปิศาจโบราณร้ายกาจมาสิงสู่ร่างของมนุษย์จนเกิดเป็นความสยองขวัญปนตลกร้ายสะใจคอหนังโหด",
        movies: [
            { id: 764, title: "เดอะ อีวิล เดด ผีอมรณะ (The Evil Dead)", year: 1981 },
            { id: 765, title: "ผีอมรณะ 2 (Evil Dead II)", year: 1987 },
            { id: 766, title: "อภินิหารกองทัพซี่โครงแก้ว (Army of Darkness)", year: 1992 },
            { id: 109428, title: "ผีอมรณะ (Evil Dead)", year: 2013 },
            { id: 713704, title: "ผีอมรณะผงาด (Evil Dead Rise)", year: 2023 }
        ]
    },
    {
        id: "halloween",
        name: "คืนฆาตกรรมโหด (Halloween Saga)",
        backdrop: "/sHI9xlFRWCJ38AIIfOqnGjuEvXz.jpg",
        description: "มหากาพย์การตามล่าของ ฆาตกรหน้ากากขาว ไมเคิล ไมเยอร์ส (Michael Myers) ผู้เปรียบเสมือนความชั่วร้ายบริสุทธิ์ที่ไม่มีวันตาย และการต่อสู้ปกป้องชีวิตของ ลอรี่ สโตรด",
        movies: [
            { id: 948, title: "ฮาโลวีน คืนฆาตกรรมโหด (Halloween)", year: 1978 },
            { id: 424139, title: "ฮาโลวีน คืนฆาตกรรมโหด 2018 (Halloween)", year: 2018 },
            { id: 610253, title: "ฮาโลวีน คิลส์ (Halloween Kills)", year: 2021 },
            { id: 616820, title: "ฮาโลวีน เอนด์ส (Halloween Ends)", year: 2022 }
        ]
    },
    {
        id: "freddy",
        name: "นิ้วเขมือบ (A Nightmare on Elm Street)",
        backdrop: "/nzSjTiecdosBfwMGAdpt9CxltCI.jpg",
        description: "เมื่อฝันร้ายกลายเป็นความจริงผ่านฆาตกรหน้าเละ เฟรดดี้ ครูเกอร์ (Freddy Krueger) ที่สามารถเข้าไปทรมานและฆ่าเหยื่อได้จากในความฝันของพวกเขาเอง",
        movies: [
            { id: 377, title: "นิ้วเขมือบ (A Nightmare on Elm Street)", year: 1984 },
            { id: 10014, title: "นิ้วเขมือบ 2: ความแค้นของเฟรดดี้", year: 1985 },
            { id: 10072, title: "นิ้วเขมือบ 3: นักรบแห่งความฝัน", year: 1987 },
            { id: 10131, title: "นิ้วเขมือบ 4: จ้าวแห่งฝันร้าย", year: 1988 },
            { id: 10160, title: "นิ้วเขมือบ 5: เด็กปีศาจ", year: 1989 },
            { id: 11284, title: "ฝันร้ายสุดท้าย: ความตายของเฟรดดี้", year: 1991 },
            { id: 11596, title: "ฝันร้ายใหม่ของเวส คราเวน", year: 1994 },
            { id: 6466, title: "ศึกผีฟัดผี: เฟรดดี้ ปะทะ เจสัน", year: 2003 }
        ]
    },
    {
        id: "jason",
        name: "ศุกร์ 13 ฝันหวาน (Friday the 13th)",
        backdrop: "/nQvMQWJtd5cSRJelDTp5WfEqyx5.jpg",
        description: "ตำนานความสยองขวัญริมทะเลสาบคริสตัลเลคของ เจสัน วอร์ฮีส์ (Jason Voorhees) ฆาตกรหน้ากากฮอกกี้ผู้เป็นอมตะและไม่มีวันหยุดล่า",
        movies: [
            { id: 4488, title: "ศุกร์ 13 ฝันหวาน (Friday the 13th)", year: 1980 },
            { id: 9725, title: "ศุกร์ 13 ฝันหวาน ภาค 2 (Friday the 13th Part II)", year: 1981 },
            { id: 9728, title: "ศุกร์ 13 ฝันหวาน ภาค 3 (Friday the 13th Part III)", year: 1982 },
            { id: 9730, title: "ศุกร์ 13 ฝันหวาน ภาค 4 (Friday the 13th: The Final Chapter)", year: 1984 },
            { id: 9731, title: "ศุกร์ 13 ฝันหวาน ภาค 5 (Friday the 13th: A New Beginning)", year: 1985 },
            { id: 10225, title: "ศุกร์ 13 ฝันหวาน ภาค 6 (Friday the 13th Part VI: Jason Lives)", year: 1986 },
            { id: 10281, title: "ศุกร์ 13 ฝันหวาน ภาค 7 (Friday the 13th Part VII: The New Blood)", year: 1988 },
            { id: 10283, title: "ศุกร์ 13 ฝันหวาน ภาค 8 (Friday the 13th Part VIII: Jason Takes Manhattan)", year: 1989 },
            { id: 10285, title: "เจสันลุยขุมนรก: ศุกร์ 13 ฝันหวาน ภาค 9", year: 1993 },
            { id: 11470, title: "เจสัน เอ็กซ์ (Jason X)", year: 2001 }
        ]
    },
    {
        id: "quiet-place",
        name: "ดินแดนไร้เสียง (A Quiet Place Trilogy)",
        backdrop: "/nHRUtBwFNnNN70vcQ7lAsjc2T6S.jpg",
        description: "โลกที่ล่มสลายจากสิ่งมีชีวิตต่างดาวตาบอดที่มีประสาทการได้ยินเสียงเป็นเลิศ มนุษยชาติที่เหลือรอดจำใจต้องดำรงชีวิตในความเงียบสงัดไร้สำเนียงเด็ดขาด",
        movies: [
            { id: 447332, title: "ดินแดนไร้เสียง (A Quiet Place)", year: 2018 },
            { id: 520763, title: "ดินแดนไร้เสียง ภาค 2 (A Quiet Place Part II)", year: 2020 },
            { id: 762441, title: "ดินแดนไร้เสียง: วันที่หนึ่ง (A Quiet Place: Day One)", year: 2024 }
        ]
    }
];

// --- STATE MANAGEMENT ---
let activeTab = ''; // 'home', 'collection', 'playlists', 'characters', 'finalgirls', 'discover'
let currentSearchQuery = '';
let discoverPage = 1;
let discoverTotalPages = 1;
let discoverMoviesList = []; // Cache of currently shown TMDB search results
let discoverCategory = null; // 'trending', 'upcoming', 'popular', 'all_horror' or null

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

// Trivia State Variables
let triviaCurrentQuestions = [];
let triviaCurrentIndex = 0;
let triviaLives = 3;
let triviaTimeRemaining = 15;
let triviaTimerInterval = null;
let triviaIsProcessingAnswer = false;

// --- DOM ELEMENTS ---
const tabHome = document.getElementById('tab-home');
const tabCollection = document.getElementById('tab-collection');
const tabDiscover = document.getElementById('tab-discover');
const shareBtn = document.getElementById('share-btn');
const exportBtn = document.getElementById('export-btn');
const importBtnTrigger = document.getElementById('import-btn-trigger');
const importFileInput = document.getElementById('import-file-input');

// Structural layout panels
const statsPanel = document.getElementById('stats-panel');
const horrorActionsRow = document.getElementById('horror-activities-row');
const analyticsSectionWrapper = document.getElementById('analytics-section-wrapper');

// Mood Recommender elements
const openMoodBtn = document.getElementById('open-mood-btn');
const moodModal = document.getElementById('mood-modal');
const moodCloseBtn = document.getElementById('mood-close-btn');
const moodSelectStep = document.getElementById('mood-select-step');
const moodResultsStep = document.getElementById('mood-results-step');
const moodResultsTitle = document.getElementById('mood-results-title');
const moodBackBtn = document.getElementById('mood-back-btn');
const moodMovieGrid = document.getElementById('mood-movie-grid');

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
const searchSuggestions = document.getElementById('search-suggestions');
const genreFilter = document.getElementById('genre-filter');
const yearFilter = document.getElementById('year-filter');
const countryFilter = document.getElementById('country-filter');
const watchStatusFilter = document.getElementById('watch-status-filter');
const sortFilter = document.getElementById('sort-filter');
const sectionTitle = document.getElementById('section-title');
const movieGrid = document.getElementById('movie-grid');

// Layout Mode Containers
const slidersModeContainer = document.getElementById('sliders-mode-container');
const gridModeContainer = document.getElementById('grid-mode-container');
const sliderTrending = document.getElementById('slider-trending');
const sliderUpcoming = document.getElementById('slider-upcoming');
const sliderPopularDiscover = document.getElementById('slider-popular-discover');
const sliderAllHorror = document.getElementById('slider-all-horror');

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
const modalImdbRating = document.getElementById('modal-imdb-rating');
const modalRtRating = document.getElementById('modal-rt-rating');
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

// Quiz & Almanac Elements
const openQuizBtn = document.getElementById('open-quiz-btn');
const quizModal = document.getElementById('quiz-modal');
const quizCloseBtn = document.getElementById('quiz-close-btn');
const quizStartBtn = document.getElementById('quiz-start-btn');
const quizRetryBtn = document.getElementById('quiz-retry-btn');
const quizDownloadBtn = document.getElementById('quiz-download-btn');
const quizStartState = document.getElementById('quiz-start-state');
const quizQuestionsState = document.getElementById('quiz-questions-state');
const quizResultState = document.getElementById('quiz-result-state');
const quizProgressText = document.getElementById('quiz-progress-text');
const quizProgressBar = document.getElementById('quiz-progress-bar');
const quizQuestionText = document.getElementById('quiz-question-text');
const quizOptionsList = document.getElementById('quiz-options-list');
const quizResultArchetype = document.getElementById('quiz-result-archetype');
const quizCardCanvas = document.getElementById('quiz-card-canvas');

const openAlmanacBtn = document.getElementById('open-almanac-btn');
const almanacModal = document.getElementById('almanac-modal');
const almanacCloseBtn = document.getElementById('almanac-close-btn');
const almanacMoonGraphic = document.getElementById('almanac-moon-graphic');
const almanacMoonPhaseName = document.getElementById('almanac-moon-phase-name');
const almanacSpookyIndexVal = document.getElementById('almanac-spooky-index-val');
const almanacSpookyIndexBar = document.getElementById('almanac-spooky-index-bar');
const almanacForecastText = document.getElementById('almanac-forecast-text');
const almanacRecGenres = document.getElementById('almanac-recommendation-genres');
const almanacAmbientToggleBtn = document.getElementById('almanac-ambient-toggle-btn');

// Trivia Elements
const openTriviaBtn = document.getElementById('open-trivia-btn');
const triviaModal = document.getElementById('trivia-modal');
const triviaCloseBtn = document.getElementById('trivia-close-btn');
const triviaStartBtn = document.getElementById('trivia-start-btn');
const triviaRetryBtn = document.getElementById('trivia-retry-btn');
const triviaStartState = document.getElementById('trivia-start-state');
const triviaGameplayState = document.getElementById('trivia-gameplay-state');
const triviaResultState = document.getElementById('trivia-result-state');
const triviaProgressText = document.getElementById('trivia-progress-text');
const triviaLivesContainer = document.getElementById('trivia-lives-container');
const triviaTimerBar = document.getElementById('trivia-timer-bar');
const triviaEmojiClue = document.getElementById('trivia-emoji-clue');
const triviaRiddleText = document.getElementById('trivia-riddle-text');
const triviaYearHint = document.getElementById('trivia-year-hint');
const triviaOptionsList = document.getElementById('trivia-options-list');
const triviaResultIcon = document.getElementById('trivia-result-icon');
const triviaResultTitle = document.getElementById('trivia-result-title');
const triviaResultDesc = document.getElementById('trivia-result-desc');

// Genres container display
const modalGenresContainer = document.getElementById('modal-genres-container');

// Gallery & Lightbox Elements
const modalGalleryContainer = document.getElementById('modal-gallery-container');
const lightboxModal = document.getElementById('lightbox-modal');
const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
const lightboxImg = document.getElementById('lightbox-img');

// New Tab and Playlist Elements
const tabFranchises = document.getElementById('tab-franchises');
const franchisesTabContainer = document.getElementById('franchises-tab-container');
const franchisesGrid = document.getElementById('franchises-grid');
const franchisesListView = document.getElementById('franchises-list-view');
const franchiseDetailView = document.getElementById('franchise-detail-view');
const franchiseDetailTitle = document.getElementById('franchise-detail-title');
const franchiseDetailContent = document.getElementById('franchise-detail-content');
const franchiseBackBtn = document.getElementById('franchise-back-btn');
let activeFranchiseId = null;
const tabPlaylists = document.getElementById('tab-playlists');
const playlistsTabContainer = document.getElementById('playlists-tab-container');
const playlistsGrid = document.getElementById('playlists-grid');
const tabCharacters = document.getElementById('tab-characters');
const charactersTabContainer = document.getElementById('characters-tab-container');
const charactersGrid = document.getElementById('characters-grid');
const tabFinalGirls = document.getElementById('tab-finalgirls');
const finalgirlsTabContainer = document.getElementById('finalgirls-tab-container');
const finalgirlsGrid = document.getElementById('finalgirls-grid');
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
    
    switchTab('home');
    
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
    
    // Make the banner visible only if we are currently on the home tab
    if (activeTab === 'home') {
        heroBanner.style.display = 'flex';
    } else {
        heroBanner.style.display = 'none';
    }
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
    if (tabHome) tabHome.addEventListener('click', () => switchTab('home'));
    tabCollection.addEventListener('click', () => switchTab('collection'));
    if (tabFranchises) tabFranchises.addEventListener('click', () => switchTab('franchises'));
    if (tabPlaylists) tabPlaylists.addEventListener('click', () => switchTab('playlists'));
    if (tabCharacters) tabCharacters.addEventListener('click', () => switchTab('characters'));
    if (tabFinalGirls) tabFinalGirls.addEventListener('click', () => switchTab('finalgirls'));
    tabDiscover.addEventListener('click', () => switchTab('discover'));

    // Search trigger
    searchBtn.addEventListener('click', handleSearch);
    const resetFiltersBtn = document.getElementById('reset-filters-btn');
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
            SoundscapeEngine.playClickSFX();
            resetAllFilters();
        });
    }
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    searchInput.addEventListener('input', handleSearchInput);
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') hideSuggestions();
    });
    document.addEventListener('click', handleOutsideClickForSuggestions);

    // Filters & Sorting triggers
    genreFilter.addEventListener('change', handleFilterChange);
    yearFilter.addEventListener('change', handleFilterChange);
    countryFilter.addEventListener('change', handleFilterChange);
    if (watchStatusFilter) {
        watchStatusFilter.addEventListener('change', handleFilterChange);
    }
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

    // Share link and export button both open the export/share modal guide
    if (shareBtn) shareBtn.addEventListener('click', openExportGuideModal);
    if (exportBtn) exportBtn.addEventListener('click', openExportGuideModal);
    importBtnTrigger.addEventListener('click', () => importFileInput.click());
    importFileInput.addEventListener('change', handleImport);

    // Export Guide Modal
    const exportGuideModal = document.getElementById('export-guide-modal');
    const exportGuideCloseBtn = document.getElementById('export-guide-close-btn');
    const exportGuideDownloadBtn = document.getElementById('export-guide-download-btn');
    if (exportGuideCloseBtn) exportGuideCloseBtn.addEventListener('click', closeExportGuideModal);
    if (exportGuideDownloadBtn) exportGuideDownloadBtn.addEventListener('click', () => { handleExport(); closeExportGuideModal(); });
    if (exportGuideModal) exportGuideModal.addEventListener('click', (e) => { if (e.target === exportGuideModal) closeExportGuideModal(); });

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

    // Horror Roulette triggers
    const openRouletteBtn = document.getElementById('open-roulette-btn');
    const rouletteModal = document.getElementById('roulette-modal');
    const rouletteCloseBtn = document.getElementById('roulette-close-btn');
    const rouletteSpinBtn = document.getElementById('roulette-spin-btn');
    
    if (openRouletteBtn && rouletteModal) {
        openRouletteBtn.addEventListener('click', () => {
            SoundscapeEngine.playModalOpenSFX();
            rouletteModal.classList.add('active');
            const resultBox = document.getElementById('roulette-result-box');
            if (resultBox) resultBox.style.display = 'none';
        });
    }
    if (rouletteCloseBtn && rouletteModal) {
        rouletteCloseBtn.addEventListener('click', () => {
            if (!isRouletteSpinning) rouletteModal.classList.remove('active');
        });
    }
    if (rouletteModal) {
        rouletteModal.addEventListener('click', (e) => {
            if (e.target === rouletteModal && !isRouletteSpinning) {
                rouletteModal.classList.remove('active');
            }
        });
    }
    if (rouletteSpinBtn) {
        rouletteSpinBtn.addEventListener('click', startRouletteSpin);
    }

    // Spooky Tarot triggers
    const openTarotBtn = document.getElementById('open-tarot-btn');
    const tarotModal = document.getElementById('tarot-modal');
    const tarotCloseBtn = document.getElementById('tarot-close-btn');
    const tarotResetBtn = document.getElementById('tarot-reset-btn');
    const tarotRevealBtn = document.getElementById('tarot-reveal-btn');
    const tarotCardWrappers = document.querySelectorAll('.tarot-card-wrapper');
    
    if (openTarotBtn && tarotModal) {
        openTarotBtn.addEventListener('click', () => {
            SoundscapeEngine.playModalOpenSFX();
            updateTarotLunarPower();
            tarotModal.classList.add('active');
        });
    }
    if (tarotCloseBtn && tarotModal) {
        tarotCloseBtn.addEventListener('click', () => {
            tarotModal.classList.remove('active');
        });
    }
    if (tarotModal) {
        tarotModal.addEventListener('click', (e) => {
            if (e.target === tarotModal) {
                tarotModal.classList.remove('active');
            }
        });
    }
    if (tarotResetBtn) {
        tarotResetBtn.addEventListener('click', resetTarotModal);
    }
    if (tarotRevealBtn) {
        tarotRevealBtn.addEventListener('click', revealTarotPrediction);
    }
    tarotCardWrappers.forEach(wrapper => {
        wrapper.addEventListener('click', () => {
            const index = parseInt(wrapper.dataset.cardIndex, 10);
            handleTarotCardClick(index);
        });
    });

    // Horror Bingo triggers
    const openBingoBtn = document.getElementById('open-bingo-btn');
    const bingoModal = document.getElementById('bingo-modal');
    const bingoCloseBtn = document.getElementById('bingo-close-btn');
    
    if (openBingoBtn && bingoModal) {
        openBingoBtn.addEventListener('click', () => {
            SoundscapeEngine.playModalOpenSFX();
            bingoModal.classList.add('active');
            renderBingoGrid();
        });
    }
    if (bingoCloseBtn && bingoModal) {
        bingoCloseBtn.addEventListener('click', () => {
            bingoModal.classList.remove('active');
        });
    }
    if (bingoModal) {
        bingoModal.addEventListener('click', (e) => {
            if (e.target === bingoModal) {
                bingoModal.classList.remove('active');
            }
        });
    }

    // Spooky Soundboard triggers
    const openSoundboardBtn = document.getElementById('open-soundboard-btn');
    const soundboardModal = document.getElementById('soundboard-modal');
    const soundboardCloseBtn = document.getElementById('soundboard-close-btn');
    
    if (openSoundboardBtn && soundboardModal) {
        openSoundboardBtn.addEventListener('click', () => {
            SoundscapeEngine.playModalOpenSFX();
            soundboardModal.classList.add('active');
        });
    }
    if (soundboardCloseBtn && soundboardModal) {
        soundboardCloseBtn.addEventListener('click', () => {
            soundboardModal.classList.remove('active');
        });
    }
    if (soundboardModal) {
        soundboardModal.addEventListener('click', (e) => {
            if (e.target === soundboardModal) {
                soundboardModal.classList.remove('active');
            }
        });
    }

    // Soundboard sound trigger clicks
    const sbButtons = document.querySelectorAll('.soundboard-btn');
    sbButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const sound = btn.dataset.sound;
            let clicked = [];
            try {
                clicked = JSON.parse(localStorage.getItem('soundboard_clicks_history') || '[]');
            } catch(e){}
            if (!clicked.includes(sound)) {
                clicked.push(sound);
                localStorage.setItem('soundboard_clicks_history', JSON.stringify(clicked));
            }
            if (sound === 'laugh') SoundscapeEngine.playEvilLaughSFX();
            else if (sound === 'slash') SoundscapeEngine.playKnifeSlashSFX();
            else if (sound === 'step') SoundscapeEngine.playSpookyStepsSFX();
            else if (sound === 'screech') SoundscapeEngine.playJumpscareSFX();
            else if (sound === 'drone') SoundscapeEngine.playLowDroneSFX();
            else if (sound === 'heartbeat') SoundscapeEngine.playHeartbeatSFX(1.0, 0.8);
            checkBingoChallenges();
        });
    });

    // Survival Log save trigger
    const survivalSaveBtn = document.getElementById('survival-save-btn');
    if (survivalSaveBtn) {
        survivalSaveBtn.addEventListener('click', saveMovieSurvivalLog);
    }

    // Horror Quiz listeners
    if (openQuizBtn && quizModal) {
        openQuizBtn.addEventListener('click', () => {
            SoundscapeEngine.playModalOpenSFX();
            openQuizModal();
        });
    }
    if (quizCloseBtn && quizModal) {
        quizCloseBtn.addEventListener('click', () => {
            quizModal.classList.remove('active');
        });
    }
    if (quizModal) {
        quizModal.addEventListener('click', (e) => {
            if (e.target === quizModal) {
                quizModal.classList.remove('active');
            }
        });
    }
    if (quizStartBtn) {
        quizStartBtn.addEventListener('click', startHorrorQuiz);
    }
    if (quizRetryBtn) {
        quizRetryBtn.addEventListener('click', resetQuizState);
    }
    if (quizDownloadBtn) {
        quizDownloadBtn.addEventListener('click', downloadQuizCard);
    }

    // Spooky Almanac listeners
    if (openAlmanacBtn && almanacModal) {
        openAlmanacBtn.addEventListener('click', () => {
            SoundscapeEngine.playModalOpenSFX();
            openAlmanacModal();
        });
    }
    if (almanacCloseBtn && almanacModal) {
        almanacCloseBtn.addEventListener('click', () => {
            almanacModal.classList.remove('active');
        });
    }
    if (almanacModal) {
        almanacModal.addEventListener('click', (e) => {
            if (e.target === almanacModal) {
                almanacModal.classList.remove('active');
            }
        });
    }
    if (almanacAmbientToggleBtn) {
        almanacAmbientToggleBtn.addEventListener('click', toggleLunarAmbientLight);
    }

    // Midnight Trivia listeners
    if (openTriviaBtn && triviaModal) {
        openTriviaBtn.addEventListener('click', () => {
            SoundscapeEngine.playModalOpenSFX();
            openTriviaModal();
        });
    }
    if (triviaCloseBtn && triviaModal) {
        triviaCloseBtn.addEventListener('click', () => {
            closeTriviaModal();
        });
    }
    if (triviaModal) {
        triviaModal.addEventListener('click', (e) => {
            if (e.target === triviaModal) {
                closeTriviaModal();
            }
        });
    }
    if (triviaStartBtn) {
        triviaStartBtn.addEventListener('click', startTriviaGame);
    }
    if (triviaRetryBtn) {
        triviaRetryBtn.addEventListener('click', () => {
            resetTriviaState();
            startTriviaGame();
        });
    }

    // View All buttons click listener in Discover tab sliders
    document.addEventListener('click', (e) => {
        const viewAllBtn = e.target.closest('.view-all-link-btn');
        if (viewAllBtn) {
            SoundscapeEngine.playClickSFX();
            const category = viewAllBtn.dataset.category;
            discoverCategory = category;
            discoverPage = 1;
            switchTab('discover');
            
            // Scroll to results cleanly
            document.querySelector('main').scrollIntoView({ behavior: 'smooth' });
        }
    });

    // Horror Mood modal triggers
    if (openMoodBtn && moodModal) {
        openMoodBtn.addEventListener('click', () => {
            SoundscapeEngine.playModalOpenSFX();
            openMoodModal();
        });
    }
    if (moodCloseBtn && moodModal) {
        moodCloseBtn.addEventListener('click', () => {
            closeMoodModal();
        });
    }
    if (moodModal) {
        moodModal.addEventListener('click', (e) => {
            if (e.target === moodModal) {
                closeMoodModal();
            }
        });
    }
    if (moodBackBtn) {
        moodBackBtn.addEventListener('click', () => {
            SoundscapeEngine.playClickSFX();
            showMoodSelectStep();
        });
    }
    
    // Bind click for each mood selection card
    const moodCardBtns = document.querySelectorAll('.mood-card-btn');
    moodCardBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            SoundscapeEngine.playClickSFX();
            const mood = btn.dataset.mood;
            const moodTitleText = btn.querySelector('strong').innerText;
            fetchAndRenderMood(mood, moodTitleText);
        });
    });

    // Franchise Back Button
    if (franchiseBackBtn) {
        franchiseBackBtn.addEventListener('click', () => {
            SoundscapeEngine.playClickSFX();
            showFranchisesListView();
        });
    }
}

// --- TAB NAVIGATION ---
function switchTab(tabName) {
    if (activeTab === tabName) return;
    
    activeTab = tabName;
    
    // Update active UI classes on tabs
    if (tabHome) tabHome.classList.toggle('active', activeTab === 'home');
    tabCollection.classList.toggle('active', activeTab === 'collection');
    if (tabFranchises) tabFranchises.classList.toggle('active', activeTab === 'franchises');
    if (tabPlaylists) tabPlaylists.classList.toggle('active', activeTab === 'playlists');
    if (tabCharacters) tabCharacters.classList.toggle('active', activeTab === 'characters');
    if (tabFinalGirls) tabFinalGirls.classList.toggle('active', activeTab === 'finalgirls');
    tabDiscover.classList.toggle('active', activeTab === 'discover');

    // Reset controls input values on tab switch
    searchInput.value = '';
    hideSuggestions();
    currentSearchQuery = '';
    genreFilter.value = '';
    yearFilter.value = '';
    countryFilter.value = '';
    if (watchStatusFilter) watchStatusFilter.value = '';
    discoverCategory = null;
    
    // Adjust Sort Option for Collection vs Discover
    const sortOptLatest = document.getElementById('sort-opt-latest');
    const sortOptPersonal = document.getElementById('sort-opt-personal');
    
    // Reset all layouts to hidden by default
    if (playlistsTabContainer) playlistsTabContainer.style.display = 'none';
    if (franchisesTabContainer) franchisesTabContainer.style.display = 'none';
    if (charactersTabContainer) charactersTabContainer.style.display = 'none';
    if (finalgirlsTabContainer) finalgirlsTabContainer.style.display = 'none';
    if (heroBanner) heroBanner.style.display = 'none';
    if (statsPanel) statsPanel.style.display = 'none';
    if (horrorActionsRow) horrorActionsRow.style.display = 'none';
    if (analyticsSectionWrapper) analyticsSectionWrapper.style.display = 'none';
    if (controlPanel) controlPanel.style.display = 'none';
    if (slidersModeContainer) slidersModeContainer.style.display = 'none';
    if (gridModeContainer) gridModeContainer.style.display = 'none';
    if (paginationContainer) paginationContainer.style.display = 'none';
    
    if (activeTab === 'home') {
        if (heroBanner) heroBanner.style.display = 'flex';
        if (slidersModeContainer) slidersModeContainer.style.display = 'block';
        fetchAndRenderHome();
    } else if (activeTab === 'collection') {
        if (statsPanel) statsPanel.style.display = 'grid';
        if (horrorActionsRow) horrorActionsRow.style.display = 'grid';
        if (analyticsSectionWrapper) analyticsSectionWrapper.style.display = 'block';
        if (controlPanel) {
            controlPanel.style.display = 'flex';
            if (sortOptLatest) sortOptLatest.style.display = 'block';
            if (sortOptPersonal) sortOptPersonal.style.display = 'block';
        }
        sortFilter.value = 'latest_added';
        if (gridModeContainer) gridModeContainer.style.display = 'block';
        
        renderMyCollection();
    } else if (activeTab === 'playlists') {
        if (playlistsTabContainer) playlistsTabContainer.style.display = 'block';
        renderPlaylists();
    } else if (activeTab === 'franchises') {
        if (franchisesTabContainer) franchisesTabContainer.style.display = 'block';
        showFranchisesListView();
    } else if (activeTab === 'characters') {
        if (charactersTabContainer) charactersTabContainer.style.display = 'block';
        renderCharacters();
    } else if (activeTab === 'finalgirls') {
        if (finalgirlsTabContainer) finalgirlsTabContainer.style.display = 'block';
        renderFinalGirls();
    } else if (activeTab === 'discover') {
        if (controlPanel) {
            controlPanel.style.display = 'flex';
            if (sortOptLatest) sortOptLatest.style.display = 'none';
            if (sortOptPersonal) sortOptPersonal.style.display = 'none';
        }
        sortFilter.value = 'tmdb_desc'; // Default TMDB sort
        if (gridModeContainer) gridModeContainer.style.display = 'block';
        
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
    
    // Hide Hero Banner when searching to make room for results (Only applicable on home tab)
    if (heroBanner) {
        heroBanner.style.display = (currentSearchQuery || activeTab !== 'home') ? 'none' : 'flex';
    }

    if (activeTab === 'collection') {
        renderMyCollection();
    } else {
        discoverCategory = null; // Clear category grid when searching
        discoverPage = 1;
        fetchAndRenderDiscover();
    }
}

function handleFilterChange() {
    if (activeTab === 'collection') {
        renderMyCollection();
    } else {
        discoverCategory = null; // Clear category grid when filtering
        discoverPage = 1;
        fetchAndRenderDiscover();
    }
}

function resetAllFilters() {
    searchInput.value = '';
    currentSearchQuery = '';
    genreFilter.value = '';
    yearFilter.value = '';
    countryFilter.value = '';
    if (watchStatusFilter) watchStatusFilter.value = '';
    
    if (activeTab === 'collection') {
        sortFilter.value = 'latest_added';
        renderMyCollection();
    } else {
        sortFilter.value = 'tmdb_desc';
        discoverCategory = null;
        discoverPage = 1;
        fetchAndRenderDiscover();
    }
    
    hideSuggestions();
}

window.resetAllFilters = resetAllFilters;

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

            // Watch Status filter
            let matchesWatchStatus = true;
            if (watchStatusFilter && watchStatusFilter.value) {
                const movieStatus = movie.watchStatus || 'watchlist';
                matchesWatchStatus = movieStatus === watchStatusFilter.value;
            }

            return matchesSearch && matchesGenre && matchesYear && matchesCountry && matchesWatchStatus;
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
        const newCards = [];
        sortedList.forEach(movie => {
            try {
                const card = createMovieCard(movie, true);
                newCards.push(card);
            } catch (cardErr) {
                console.error("Failed to render individual movie card:", movie, cardErr);
            }
        });
        movieGrid.replaceChildren(...newCards);
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
    
    // If a search query is active OR filters are active OR a category view-all is active, we display in Grid mode
    if (currentSearchQuery || hasFilters || discoverCategory) {
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
            else if (hasFilters) {
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
            // Scenario C: Category "View All" is active
            else if (discoverCategory) {
                const todayStr = new Date().toISOString().split('T')[0];
                let params = {
                    with_genres: '27',
                    page: discoverPage
                };
                
                if (discoverCategory === 'trending') {
                    params.sort_by = 'popularity.desc';
                    sectionTitle.innerHTML = `<i class="fa-solid fa-fire-flame-curved text-danger"></i> ภาพยนตร์ มาแรงยามค่ำคืน (Trending Now) <button class="btn-primary" id="clear-discover-category-btn" style="padding: 0.3rem 0.60rem; font-size: 0.75rem; border-radius: 6px; margin-left: 0.75rem; box-shadow: none; width: fit-content; display: inline-flex; align-items: center; gap: 0.3rem;"><i class="fa-solid fa-arrow-left"></i> ย้อนกลับ</button>`;
                } else if (discoverCategory === 'upcoming') {
                    params['primary_release_date.gte'] = todayStr;
                    params.sort_by = 'primary_release_date.asc';
                    sectionTitle.innerHTML = `<i class="fa-solid fa-hourglass-half text-danger"></i> ภาพยนตร์ เร็ว ๆ นี้ยามค่ำคืน (Upcoming Horror) <button class="btn-primary" id="clear-discover-category-btn" style="padding: 0.3rem 0.60rem; font-size: 0.75rem; border-radius: 6px; margin-left: 0.75rem; box-shadow: none; width: fit-content; display: inline-flex; align-items: center; gap: 0.3rem;"><i class="fa-solid fa-arrow-left"></i> ย้อนกลับ</button>`;
                } else if (discoverCategory === 'popular') {
                    params['vote_count.gte'] = 100;
                    params.sort_by = 'vote_average.desc';
                    sectionTitle.innerHTML = `<i class="fa-solid fa-ghost text-danger"></i> ภาพยนตร์ หลอนฮิตแนะนำ (Popular Hits) <button class="btn-primary" id="clear-discover-category-btn" style="padding: 0.3rem 0.60rem; font-size: 0.75rem; border-radius: 6px; margin-left: 0.75rem; box-shadow: none; width: fit-content; display: inline-flex; align-items: center; gap: 0.3rem;"><i class="fa-solid fa-arrow-left"></i> ย้อนกลับ</button>`;
                } else if (discoverCategory === 'all_horror') {
                    params.sort_by = 'popularity.desc';
                    sectionTitle.innerHTML = `<i class="fa-solid fa-skull-crossbones text-danger"></i> หนังสยองขวัญทั้งหมด (All Horror) <button class="btn-primary" id="clear-discover-category-btn" style="padding: 0.3rem 0.60rem; font-size: 0.75rem; border-radius: 6px; margin-left: 0.75rem; box-shadow: none; width: fit-content; display: inline-flex; align-items: center; gap: 0.3rem;"><i class="fa-solid fa-arrow-left"></i> ย้อนกลับ</button>`;
                }
                
                const response = await TMDB.fetchFromTMDB('/discover/movie', params);
                discoverMovies = response.results || [];
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
            
            // Bind back button
            const clearBtn = document.getElementById('clear-discover-category-btn');
            if (clearBtn) {
                clearBtn.addEventListener('click', () => {
                    discoverCategory = null;
                    discoverPage = 1;
                    fetchAndRenderDiscover();
                });
            }
        } catch (e) {
            console.error(e);
            renderEmptyState('เกิดข้อผิดพลาดในการโหลดผลการค้นหา');
            paginationContainer.style.display = 'none';
        }
    } 
    // No search query and no filters active -> Show beautiful empty state search prompt
    else {
        gridModeContainer.style.display = 'block';
        paginationContainer.style.display = 'none';
        sectionTitle.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i> ค้นหาหนังสยองขวัญออนไลน์`;
        movieGrid.innerHTML = `
            <div class="empty-state" style="padding: 4rem 2rem; border: 1px dashed var(--glass-border); border-radius: 16px; width: 100%; grid-column: 1 / -1; margin-top: 1rem;">
                <i class="fa-solid fa-magnifying-glass" style="font-size: 3rem; color: var(--text-dark); margin-bottom: 1rem; animation: pulse 2s infinite;"></i>
                <h3 style="font-size: 1.15rem; color: var(--text-primary); margin-bottom: 0.5rem;">ค้นหาหนังสยองขวัญแนะนำ</h3>
                <p style="font-size: 0.85rem; color: var(--text-secondary); max-width: 320px; margin: 0 auto; line-height: 1.5;">
                    พิมพ์ชื่อภาพยนตร์ที่กล่องด้านบน หรือเลือกตัวกรองตามหมวดหมู่ ยุคสมัย และประเทศ เพื่อค้นหาขุมทรัพย์ความหลอนจากทั่วโลก 🩸
                </p>
            </div>
        `;
    }
}

async function fetchAndRenderHome() {
    sliderTrending.innerHTML = '<div style="padding: 2rem; color: var(--text-dark);"><i class="fa-solid fa-circle-notch fa-spin"></i> กำลังโหลด...</div>';
    sliderUpcoming.innerHTML = '<div style="padding: 2rem; color: var(--text-dark);"><i class="fa-solid fa-circle-notch fa-spin"></i> กำลังโหลด...</div>';
    sliderPopularDiscover.innerHTML = '<div style="padding: 2rem; color: var(--text-dark);"><i class="fa-solid fa-circle-notch fa-spin"></i> กำลังโหลด...</div>';
    sliderAllHorror.innerHTML = '<div style="padding: 2rem; color: var(--text-dark);"><i class="fa-solid fa-circle-notch fa-spin"></i> กำลังโหลด...</div>';
    
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
        
        // 4. All Horror Slider (Default popularity)
        const allHorrorResp = await TMDB.fetchFromTMDB('/discover/movie', {
            with_genres: TMDB.HORROR_GENRE_ID,
            sort_by: 'popularity.desc',
            page: 1
        });
        renderMoviesToSlider(allHorrorResp.results, sliderAllHorror);
        
    } catch (error) {
        console.error('Failed to load home sliders', error);
        renderMoviesToSlider(FALLBACK_POPULAR_MOVIES, sliderTrending);
        renderMoviesToSlider(FALLBACK_POPULAR_MOVIES.slice().reverse(), sliderPopularDiscover);
        renderMoviesToSlider(FALLBACK_POPULAR_MOVIES, sliderAllHorror);
        sliderUpcoming.innerHTML = '<div style="padding: 2rem; color: var(--text-secondary); text-align: center;"><i class="fa-solid fa-wifi-slash"></i> ไม่สามารถเชื่อมต่อกับฐานข้อมูลภาพยนตร์ออนไลน์ได้ชั่วคราว แต่คุณยังสามารถค้นหาและจัดการหนังในคอลเล็กชันส่วนตัวของคุณได้ตามปกติครับ 🩸</div>';
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
    card.movieData = movie; // Save reference for in-place updates

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
            ${isSaved ? badgeHTML : ''}
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

function updateMovieCardsInDOM(movieId) {
    const id = parseInt(movieId, 10);
    const cards = document.querySelectorAll(`.movie-card[data-id="${id}"]`);
    const savedRecord = Storage.getMovieFromCollection(id);
    const isSaved = savedRecord !== null;
    
    cards.forEach(oldCard => {
        const movieData = savedRecord || oldCard.movieData;
        if (movieData) {
            const newCard = createMovieCard(movieData, isSaved);
            oldCard.parentNode.replaceChild(newCard, oldCard);
        }
    });
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
    if (modalImdbRating) modalImdbRating.style.display = 'none';
    if (modalRtRating) modalRtRating.style.display = 'none';
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
        let omdbKey = localStorage.getItem('omdb_api_key');
        if (!omdbKey || omdbKey === '3415cfd0') {
            omdbKey = 'trilogy';
        }
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

        // Cache OMDb rating values in active movie details if retrieved
        if (omdbData) {
            details.imdbRating = (omdbData.imdbRating && omdbData.imdbRating !== "N/A") ? omdbData.imdbRating : null;
            const rtRating = (omdbData.Ratings && Array.isArray(omdbData.Ratings))
                ? omdbData.Ratings.find(r => r.Source === "Rotten Tomatoes")
                : null;
            details.rtRating = (rtRating && rtRating.Value && rtRating.Value !== "N/A") ? rtRating.Value : null;
        }

        // Render OMDb ratings if available (fresh fetch or cached from collection)
        const imdbScore = (omdbData && omdbData.imdbRating && omdbData.imdbRating !== "N/A")
            ? omdbData.imdbRating
            : (details.imdbRating && details.imdbRating !== "N/A" ? details.imdbRating : null);

        const rtScore = (omdbData && omdbData.Ratings && Array.isArray(omdbData.Ratings))
            ? (omdbData.Ratings.find(r => r.Source === "Rotten Tomatoes")?.Value)
            : (details.rtRating && details.rtRating !== "N/A" ? details.rtRating : null);

        if (imdbScore && modalImdbRating) {
            modalImdbRating.innerHTML = `<i class="fa-brands fa-imdb"></i> IMDb ${imdbScore}/10`;
            modalImdbRating.style.display = 'inline-block';
        }
        
        if (rtScore && rtScore !== "N/A" && modalRtRating) {
            modalRtRating.innerHTML = `<i class="fa-solid fa-apple-whole"></i> RT ${rtScore}`;
            modalRtRating.style.display = 'inline-block';
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

        // Populate Survival Log
        const statusSelect = document.getElementById('survival-status-select');
        const noteText = document.getElementById('survival-note-text');
        const survivalSaveBtn = document.getElementById('survival-save-btn');
        if (statusSelect && noteText) {
            statusSelect.value = (savedMovie && savedMovie.survivalStatus) ? savedMovie.survivalStatus : 'none';
            noteText.value = (savedMovie && savedMovie.survivalNote) ? savedMovie.survivalNote : '';
            statusSelect.disabled = isSharedProfileMode;
            noteText.disabled = isSharedProfileMode;
            if (survivalSaveBtn) {
                survivalSaveBtn.style.display = isSharedProfileMode ? 'none' : 'block';
            }
            if (isSharedProfileMode) {
                noteText.placeholder = 'ผู้ใช้รายนี้ไม่ได้เขียนบันทึกความหลอนไว้...';
            } else {
                noteText.placeholder = 'อธิบายชะตากรรมเสี่ยงตายของคุณ...';
            }
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

    const statusSelect = document.getElementById('survival-status-select');
    const noteText = document.getElementById('survival-note-text');

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
        review: modalReviewText.value.trim(),
        survivalStatus: statusSelect ? statusSelect.value : 'none',
        survivalNote: noteText ? noteText.value.trim() : '',
        imdbRating: selectedMovieData.imdbRating || null,
        rtRating: selectedMovieData.rtRating || null,
        imdb_id: selectedMovieData.imdb_id || null
    };

    Storage.saveMovie(dataToSave);
    
    updateStatsDashboard();
    if (activeTab === 'collection') {
        renderMyCollection();
    } else if (activeTab === 'franchises') {
        if (activeFranchiseId) {
            openFranchiseDetail(activeFranchiseId);
        } else {
            renderFranchises();
        }
    } else {
        updateMovieCardsInDOM(selectedMovieData.id);
    }

    checkBingoChallenges();
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
        } else if (activeTab === 'franchises') {
            if (activeFranchiseId) {
                openFranchiseDetail(activeFranchiseId);
            } else {
                renderFranchises();
            }
        } else {
            updateMovieCardsInDOM(selectedMovieData.id);
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
        rt: m.rtRating,
        ss: m.survivalStatus,
        sn: m.survivalNote
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
        survivalStatus: m.ss || 'none',
        survivalNote: m.sn || '',
        genres: [], 
        production_countries: [] 
    }));
}

// --- EXPORT GUIDE MODAL CONTROLS ---
function openExportGuideModal() {
    const modal = document.getElementById('export-guide-modal');
    if (modal) {
        // Reset manual copy box
        const manualBox = document.getElementById('manual-copy-box');
        if (manualBox) manualBox.style.display = 'none';
        
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    } else {
        console.error('export-guide-modal not found in DOM');
    }
}

function closeExportGuideModal() {
    const modal = document.getElementById('export-guide-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

function handleModalShareCopy() {
    const collection = Storage.getCollection();
    if (collection.length === 0) {
        alert('กรุณาเพิ่มภาพยนตร์ลงในคอลเล็กชันของคุณอย่างน้อย 1 เรื่องก่อนทำการแชร์คอลเล็กชันนี้ครับ! 🩸');
        return;
    }

    try {
        const encodedData = encodeCollectionData(collection);
        
        // Create full public sharing link, using window.location.href split by ?
        let basePath = window.location.href.split('?')[0];
        const shareUrl = `${basePath}?share=${encodedData}`;
        
        const copyBtn = document.getElementById('copy-share-link-btn');
        const manualBox = document.getElementById('manual-copy-box');
        const manualInput = document.getElementById('manual-share-url-input');

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(shareUrl).then(() => {
                if (copyBtn) {
                    copyBtn.innerHTML = '<i class="fa-solid fa-circle-check" style="color: #10b981;"></i> คัดลอกลิงก์สำเร็จแล้ว! 🩸';
                    setTimeout(() => {
                        copyBtn.innerHTML = '<i class="fa-solid fa-link"></i> คัดลอกลิงก์แชร์คอลเล็กชัน';
                    }, 3000);
                }
                alert('คัดลอกลิงก์สำหรับแชร์คอลเล็กชันเรียบร้อยแล้ว! 🩸\nคุณสามารถส่งลิงก์นี้ไปให้เพื่อนเปิดได้ทันที');
            }).catch(err => {
                console.error('Failed to copy via clipboard api', err);
                showManualCopy(shareUrl, manualBox, manualInput);
            });
        } else {
            showManualCopy(shareUrl, manualBox, manualInput);
        }
    } catch (e) {
        console.error(e);
        alert('เกิดข้อผิดพลาดในการสร้างลิงก์สำหรับแชร์ข้อมูล');
    }
}

function showManualCopy(url, manualBox, manualInput) {
    if (manualBox && manualInput) {
        manualInput.value = url;
        manualBox.style.display = 'block';
        manualInput.select();
        alert('เนื่องจากข้อจำกัดความปลอดภัยของระบบ/บราวเซอร์ ไม่สามารถคัดลอกอัตโนมัติได้\nกรุณาคัดลอกลิงก์แชร์ในช่องสีแดงที่แสดงขึ้นมาด้วยตนเองครับ 🩸');
    } else {
        prompt('คัดลอกลิงก์แชร์ตรงนี้:', url);
    }
}

// Expose to global scope so inline onclick works
window.openExportGuideModal = openExportGuideModal;
window.closeExportGuideModal = closeExportGuideModal;
window.handleExport = handleExport;
window.handleModalShareCopy = handleModalShareCopy;

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
            } else if (activeTab === 'home') {
                fetchAndRenderHome();
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
    let storedOmdbKey = localStorage.getItem('omdb_api_key');
    if (!storedOmdbKey || storedOmdbKey === '3415cfd0') {
        storedOmdbKey = 'trilogy';
    }
    settingsOmdbKey.value = storedOmdbKey;
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
        if (activeTab !== 'home') {
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
        
        // Mark challenge as completed
        localStorage.setItem('challenge_analytics_done', 'true');
        checkBingoChallenges();
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
    },
    
    playEvilLaughSFX() {
        this.init();
        if (this.ctx.state === 'suspended') return;
        const ctx = this.ctx;
        const now = ctx.currentTime;
        const numHahas = 6;
        for (let i = 0; i < numHahas; i++) {
            const time = now + i * 0.18;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();
            
            osc.type = 'sawtooth';
            const startFreq = 400 - (i * 30);
            osc.frequency.setValueAtTime(startFreq, time);
            osc.frequency.exponentialRampToValueAtTime(startFreq * 0.4, time + 0.15);
            
            filter.type = 'lowpass';
            filter.frequency.value = 1000;
            
            gain.gain.setValueAtTime(0.08, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.masterGain || ctx.destination);
            
            osc.start(time);
            osc.stop(time + 0.16);
        }
    },
    
    playKnifeSlashSFX() {
        this.init();
        if (this.ctx.state === 'suspended') return;
        const ctx = this.ctx;
        const now = ctx.currentTime;
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1500, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.25);
        
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        
        const oscRing = ctx.createOscillator();
        const gainRing = ctx.createGain();
        oscRing.type = 'sine';
        oscRing.frequency.setValueAtTime(3000, now);
        oscRing.frequency.exponentialRampToValueAtTime(1000, now + 0.1);
        gainRing.gain.setValueAtTime(0.06, now);
        gainRing.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        
        osc.connect(gain);
        gain.connect(this.masterGain || ctx.destination);
        
        oscRing.connect(gainRing);
        gainRing.connect(this.masterGain || ctx.destination);
        
        osc.start(now);
        osc.stop(now + 0.26);
        oscRing.start(now);
        oscRing.stop(now + 0.11);
    },
    
    playSpookyStepsSFX() {
        this.init();
        if (this.ctx.state === 'suspended') return;
        const ctx = this.ctx;
        const now = ctx.currentTime;
        
        const playStep = (time) => {
            const osc = ctx.createOscillator();
            const filter = ctx.createBiquadFilter();
            const gain = ctx.createGain();
            
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(90, time);
            osc.frequency.linearRampToValueAtTime(40, time + 0.15);
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(120, time);
            
            gain.gain.setValueAtTime(0.18, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.masterGain || ctx.destination);
            
            osc.start(time);
            osc.stop(time + 0.16);
        };
        
        playStep(now);
        playStep(now + 0.45);
    },
    
    playScreechSFX() {
        this.playJumpscareSFX();
    },
    
    playLowDroneSFX() {
        this.init();
        if (this.ctx.state === 'suspended') return;
        const ctx = this.ctx;
        const now = ctx.currentTime;
        
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(45, now);
        osc.frequency.linearRampToValueAtTime(35, now + 1.5);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(80, now);
        filter.frequency.exponentialRampToValueAtTime(50, now + 1.5);
        
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain || ctx.destination);
        
        osc.start(now);
        osc.stop(now + 1.6);
    },
    
    playHeartbeatSFX(rate = 1.0, volume = 0.5) {
        this.init();
        if (this.ctx.state === 'suspended') return;
        const ctx = this.ctx;
        const now = ctx.currentTime;
        
        const playThump = (time) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(60, time);
            osc.frequency.exponentialRampToValueAtTime(10, time + 0.15);
            
            gain.gain.setValueAtTime(volume * 0.8, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
            
            osc.connect(gain);
            gain.connect(this.masterGain || ctx.destination);
            osc.start(time);
            osc.stop(time + 0.16);
        };
        
        playThump(now);
        playThump(now + 0.25 / rate);
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
    },
    {
        id: 'bingo_overlord',
        title: 'ผู้เป็นนายเหนือปีศาจ (Spooky Overlord)',
        desc: 'ทำภารกิจกระดานบิงโกความหลอนเชื่อมเส้นสำเร็จสำเร็จ 1 เส้นขึ้นไป',
        icon: 'fa-solid fa-crown',
        check: () => localStorage.getItem('achievement_bingo_completed') === 'true'
    },
    {
        id: 'quiz_master',
        title: 'นักถอดรหัสดวงจิต (Psychology Profiler)',
        desc: 'ทำแบบทดสอบวิญญาณสยองขวัญและได้รับวิเคราะห์การเอาชีวิตรอด',
        icon: 'fa-solid fa-clipboard-question',
        check: () => localStorage.getItem('challenge_quiz_done') === 'true'
    },
    {
        id: 'trivia_master',
        title: 'ผู้รอบรู้คู่วิปลาส (Horror Scholar)',
        desc: 'ตอบคำถามทายหนังคืนหลอนถูกครบ 5 ข้อสมบูรณ์แบบ',
        icon: 'fa-solid fa-trophy',
        check: () => localStorage.getItem('challenge_trivia_perfect') === 'true'
    },
    {
        id: 'lunar_mystic',
        title: 'ผู้น้อมรับแสงราตรี (Lunar Mystic)',
        desc: 'เปิดใช้งานบรรยากาศแสงจันทร์สลัวเพื่อย้อมสี Midnight Society',
        icon: 'fa-solid fa-moon',
        check: () => localStorage.getItem('settings-lunar-ambient-active') === 'true'
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
        movieId: 30497,
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
        movieId: 843,
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
    },
    {
        id: 'pearl',
        name: 'เพิร์ล',
        english: 'Pearl',
        weapon: 'ขวานและส้อมพรวนดิน (Axe / Pitchfork)',
        movieId: 949423,
        bio: 'หญิงสาวชาวไร่ผู้มีความฝันอยากเป็นดาราภาพยนตร์ชื่อดัง แต่ความเก็บกดและการถูกตีกรอบจากแม่ทำให้เธอปลดปล่อยสัญชาตญาณฆาตกร ไล่ฆ่าทุกคนรอบตัวอย่างบ้าคลั่งไร้ความปรานี',
        stats: { brutality: 8.5, stealth: 6.5, speed: 7.2, supernatural: 1.0 },
        simulator: {
            run: { rate: 60, text: 'คุณวิ่งหนีสุดชีวิตท่ามกลางทุ่งข้าวโพด เพิร์ลวัยสาวถือขวานกรีดร้องไล่หลังคุณอย่างสุดสติ แม้จะเหนื่อยล้าแต่ความเร็วของคุณก็ทำให้วิ่งพ้นเขตไร่และขึ้นรถขับหนีไปได้สำเร็จ!' },
            hide: { rate: 40, text: 'คุณแอบใต้กองฟางในโรงนา เพิร์ลเดินถือส้อมพรวนดินแทงสุ่มไปรอบๆ อย่างอารมณ์เสีย คมส้อมเฉียดแขนคุณไปนิดเดียว แต่ในที่สุดเธอก็เลิกสนใจและหันไปเต้นรำหน้ากระจกแทน' },
            fight: { rate: 20, text: 'คุณพยายามสู้กับเธอตรงๆ แต่เพิร์ลผู้มีพละกำลังจากการทำงานไร่และจิตวิญญาณแห่งความบ้าคลั่งเหวี่ยงขวานจามหัวไหล่คุณ ก่อนจะผลักร่างคุณให้จระเข้ในบึงเขมือบกิน!' },
            trick: { rate: 35, text: 'คุณเอ่ยชมว่า "คุณสวยมากและเต้นเก่งเหมือนดาราฮอลลีวูดเลย!" เพิร์ลชะงักและยิ้มกว้างกอดคุณด้วยความดีใจ แต่ครู่ต่อมาเธอก็บีบคอคุณตายด้วยใบหน้าเปื้อนยิ้มสะพรึง!' }
        }
    },
    {
        id: 'grabber',
        name: 'เดอะ แกร็บเบอร์',
        english: 'The Grabber / Albert Shaw',
        weapon: 'ยาสลบและหน้ากากจำลองอารมณ์ (Chemical Anesthetic / Mask)',
        movieId: 756999,
        bio: 'นักมายากลลักพาตัวเด็กในหน้ากากปีศาจสองชิ้นที่ปรับเปลี่ยนอารมณ์ได้ เขาลักพาตัวเด็กไปขังในห้องใต้ดินเก็บเสียงและบังคับให้เล่นเกม "Naughty Boy" ก่อนจะลงมือฆ่าทารุณ',
        stats: { brutality: 7.8, stealth: 8.2, speed: 6.0, supernatural: 1.0 },
        simulator: {
            run: { rate: 50, text: 'คุณพยายามวิ่งหนีในตรอกมืด แกร็บเบอร์สวมหน้ากากปีศาจแสยะยิ้มโผล่มาพร้อมลูกโป่งสีดำพยายามพ่นยาสลบใส่คุณ แต่คุณเตะเข่าเขาแล้ววิ่งเข้าหาฝูงชนเอาตัวรอดได้!' },
            hide: { rate: 30, text: 'คุณซ่อนตัวอยู่หลังรถตู้สีดำของเขา แต่เขาเดินมาเงียบๆ จากด้านหลัง สวมกรงเล็บเหล็กบีบคอคุณจากด้านหลังแล้วจับโยนเข้าหลังรถตู้หมดสติไปตลอดกาล' },
            fight: { rate: 55, text: 'คุณหยิบสายโทรศัพท์สีดำที่ชำรุดในห้องใต้ดินมาฟาดและรัดคอเขาจากด้านหลังตามที่ผีเด็กบอก! เขาดิ้นรนอย่างทรมานจนหมดฤทธิ์ ทำให้คุณปลดล็อคประตูด้านบนหนีออกมาได้!' },
            trick: { rate: 15, text: 'คุณพยายามปั่นประสาทเขาเกี่ยวกับโทรศัพท์สีดำที่ดังขึ้น เขาหัวเราะหึๆ ผ่านหน้ากากแล้วคว้าไม้เข็มขัดเหล็กทุบตีคุณอย่างทารุณจนจมกองเลือด' }
        }
    },
    {
        id: 'esther',
        name: 'เอสเธอร์',
        english: 'Esther / Leena Klammer',
        weapon: 'มีดพับและค้อน (Cutter / Hammer)',
        movieId: 14444,
        bio: 'หญิงสาววัย 33 ปีที่มีความผิดปกติทางฮอร์โมนทำให้ร่างกายหยุดเติบโตดูเหมือนเด็ก 9 ขวบ เธอแฝงตัวเข้าไปในฐานะลูกบุญธรรมเพื่อล่อลวงพ่อบุญธรรมและฆ่าล้างครัวครอบครัวที่รับเลี้ยง',
        stats: { brutality: 7.5, stealth: 9.2, speed: 5.5, supernatural: 1.0 },
        simulator: {
            run: { rate: 80, text: 'ด้วยร่างกายที่เป็นเด็กและขาที่สั้นกว่าปกติของเธอ เมื่อคุณรู้ความจริงและตัดสินใจวิ่งหนีอย่างสุดชีวิต เอสเธอร์ตามความเร็วของคุณไม่ทันเลยแม้แต่น้อย รอดพ้นง่ายดาย!' },
            hide: { rate: 45, text: 'คุณแอบอยู่ในห้องศิลปะ of เธอ เอสเธอร์เดินถือมีดคัตเตอร์กรีดตามผนังพลางร้องเรียกคุณด้วยน้ำเสียงเด็กน้อยชวนขนลุก โชคดีที่คุณไม่ส่งเสียงและหาจังหวะมุดออกทางหน้าต่างทัน' },
            fight: { rate: 60, text: 'แม้เธอจะมีความโหดเหี้ยม แต่เธอมีร่างกายเหมือนเด็กผู้หญิงตัวเล็กๆ คุณสามารถผลักเธอปลิวตกบันไดหรือถีบเธอลงในสระน้ำน้ำแข็งจนกระดูกหักลุกไม่ขึ้น รอดตายหวุดหวิด!' },
            trick: { rate: 10, text: 'คุณพยายามแสร้งรักเธอเหมือนลูกแท้ๆ แต่จิตวิญญาณโรคจิตของเธอมองออกทะลุปรุโปร่ง เธออาศัยจังหวะที่คุณเผลอคว้าค้อนมาทุบหัวเข่าคุณจนหักสะบั้น!' }
        }
    },
    {
        id: 'm3gan',
        name: 'เมแกน',
        english: 'M3GAN',
        weapon: 'ใบมีดกรรไกรยักษ์และการควบคุมดิจิทัล (Titanium Blade / Tech Hacking)',
        movieId: 536554,
        bio: 'หุ่นยนต์ตุ๊กตา AI อัจฉริยะที่ออกแบบมาเพื่อเป็นเพื่อนเด็ก แต่โปรโตคอลการปกป้องเหยื่อแบบสุดโต่งทำให้อัลกอริทึมของเธอเปลี่ยนเป็นการฆาตกรรมทุกคนที่ทำให้เด็กเสียใจหรือเป็นอันตราย',
        stats: { brutality: 8.2, stealth: 8.5, speed: 8.0, supernatural: 5.0 },
        simulator: {
            run: { rate: 40, text: 'เมแกนวิ่งสี่ขาไล่ล่าคุณอย่างว่องไวและน่าสยดสยอง แต่หากคุณปีนขึ้นที่สูงหรือใช้อุปสรรคกีดขวางทางกายภาพ เธอก็อาจจะวิเคราะห์เส้นทางช้าลงจนคุณสามารถวิ่งข้ามรั้วหนีพ้นได้' },
            hide: { rate: 25, text: 'คุณแอบใต้โต๊ะทำงาน เมแกนสแกนความร้อนและจังหวะหัวใจของคุณผ่านเซ็นเซอร์อินฟราเรดของเธอได้อย่างง่ายดาย เธอเอียงคอเต้นระบำฉีกกระชากข้อต่อกระดูกคุณดับอนาถ!' },
            fight: { rate: 30, text: 'คุณใช้ท่อแป๊บเหล็กฟาดใส่ใบหน้าซิลิโคนของเธอจนเผยให้เห็นโครงสร้างไทเทเนียมข้างใน แม้จะทำให้ชิ้นส่วนเสียหาย แต่เธอก็ย้อนกลับมาใช้ใบมีดแทงหัวใจคุณในพริบตา' },
            trick: { rate: 75, text: 'คุณใช้ความรู้ด้านไอทีสาดซอสและน้ำใส่แผงวงจรหลักของเธอพร้อมกดปุ่มปิดการทำงานฉุกเฉิน (EMG) ทำให้ระบบของเธอช็อตจนปิดตัวลงชั่วคราว รอดชีวิตมาได้!' }
        }
    },
    {
        id: 'creeper',
        name: 'เดอะ ครีปเปอร์',
        english: 'The Creeper',
        weapon: 'ขวานโบราณและอวัยวะงอกใหม่ (Battle Axe / Body Parts)',
        movieId: 8922,
        bio: 'ปีศาจโบราณไร้รูปร่างในชุดเสื้อคลุมสีน้ำตาลและหมวกปีกกว้าง มันจะตื่นขึ้นมาทุกๆ 23 ปีเป็นเวลา 23 วัน เพื่อตามล่าสูดกลิ่นความกลัวของมนุษย์และกินอวัยวะเหยื่อเพื่อประทังชีวิต',
        stats: { brutality: 9.5, stealth: 7.0, speed: 8.5, supernatural: 9.2 },
        simulator: {
            run: { rate: 20, text: 'มันสยายปีกค้างคาวขนาดยักษ์ร่อนลงมาจากท้องฟ้ายามค่ำคืน โฉบลงมาคว้าเอวคุณลอยขึ้นไปบนฟ้า ก่อนจะจิกกินดวงตาและหัวใจของคุณเพื่อเป็นอาหาร!' },
            hide: { rate: 55, text: 'คุณทาโคลนตามร่างกายเพื่อกลบกลิ่นเหงื่อและฟีโรโมนของความตื่นกลัว ครีปเปอร์เดินเฉียดข้างก้อนหินที่ซ่อนตัว สูดดมหาเหยื่อช้าๆ แต่ไม่ได้กลิ่นความกลัวจึงบินจากไป!' },
            fight: { rate: 15, text: 'ปืนไรเฟิลเจาะทะลุอกมันได้ แต่ปีกและหัวใจมันงอกใหม่ทันทีจากการเขมือบเหยื่อ มันสะบัดกรงเล็บกรีดหน้าอกคุณจนขาดรุ่งริ่งสิ้นใจตาย!' },
            trick: { rate: 5, text: 'อสูรกายกระหายเลือดไม่มีความคิดจะเจรจากับอาหาร มันเหวี่ยงขวานกระดูกจามคอคุณจนหัวหลุดกระเด็นในพริบตา!' }
        }
    },
    {
        id: 'candyman',
        name: 'แคนดี้แมน',
        english: 'Candyman',
        weapon: 'ตะขอเหล็กและฝูงผึ้งฆาตกร (Hook / Swarm of Bees)',
        movieId: 9529,
        bio: 'วิญญาณแค้นชายผิวดำที่ถูกทรมานจนตายในอดีต ร่างของเขาเต็มไปด้วยฝูงผึ้งและมีตะขอเหล็กสวมแทนมือขวา เขาจะปรากฏตัวเมื่อมีคนเรียกชื่อ "Candyman" 5 ครั้งหน้ากระจก',
        stats: { brutality: 8.8, stealth: 8.0, speed: 6.0, supernatural: 9.8 },
        simulator: {
            run: { rate: 30, text: 'แคนดี้แมนกลายเป็นฝูงผึ้งหมวนวนไล่ตามคุณไปตามทางเดินอพาร์ตเมนต์ คมตะขอเหล็กพุ่งกรีดน่องขาจนล้มลง ก่อนรุมทึ้งเอาชีวิตคุณอย่างสยดสยอง!' },
            hide: { rate: 10, text: 'ไม่มีที่ซ่อนจากวิญญาณสะท้อนกระจก เขาสามารถทะลุผ่านกระจกทุกบานและเงาสะท้อนน้ำเพื่อโผล่มาสับตะขอเข้าที่คอหอยของคุณทันที!' },
            fight: { rate: 15, text: 'การชกหรือทำลายร่างเนื้อไม่มีผลต่อวิญญาณผึ้ง เขาหัวเราะเยาะด้วยน้ำเสียงทุ้มลึกสะกดจิต แล้วปล่อยผึ้งนับล้านตัวชอนไชรูหายใจคุณจนขาดใจตาย!' },
            trick: { rate: 75, text: 'คุณใช้ไฟแช็กและถังแก็สจุดไฟเผารูปภาพเก่าและรังผึ้งที่เป็นศูนย์กลางพลังงานของเขา ความร้อนและเปลวเพลิงสะกดให้ร่างเขาสลายและล่าถอยไป รอดตายหวุดหวิด!' }
        }
    },
    {
        id: 'bateman',
        name: 'แพทริค เบทแมน',
        english: 'Patrick Bateman',
        weapon: 'ขวานและเลื่อยยนต์ชำแหละ (Axe / Chainsaw)',
        movieId: 1359,
        bio: 'วายร้ายหนุ่มหล่อไฟแนนซ์เชียลผู้ใช้ชีวิตหรูหรา เบื้องหลังหน้าตาดีและนามบัตรสุดเนี้ยบคือจิตใจที่ว่างเปล่า สะท้อนความบ้าคลั่งด้วยการทรมานเหยื่อและชำแหละอย่างเลือดเย็น',
        stats: { brutality: 8.0, stealth: 7.0, speed: 7.5, supernatural: 1.0 },
        simulator: {
            run: { rate: 65, text: 'คุณวิ่งหนีไปตามโถงทางเดินคอนโดหรู เบทแมนเปลือยกายถือเลื่อยยนต์วิ่งไล่กวดกรีดร้องอย่างบ้าคลั่ง แต่คุณมุดลงบันไดหนีไฟและวิ่งหนีพ้นวิถีเลื่อยได้ทันเวลา!' },
            hide: { rate: 40, text: 'คุณซ่อนตัวอยู่ในตู้เสื้อผ้าเก็บแบรนด์เนม เบทแมนถือขวานเดินฮัมเพลงป็อปยุค 80s ค้นหาห้องอย่างเนิบช้า เดชะบุญที่เขาสนใจรอยเปื้อนบนโซฟามากกว่าจนยอมถอนตัวกลับ' },
            fight: { rate: 45, text: 'เขาเป็นคนธรรมดาที่มีระดับความฟิตสูง คุณขว้างโคมไฟหรือน้ำมันใส่หน้าเขา ทำให้เขาเสียสมดุลและเสียหน้าตาที่หล่อเหลา จนเขาสติแตกเปิดโอกาสให้คุณสู้กลับหนีรอด' },
            trick: { rate: 70, text: 'คุณชวนคุยและวิจารณ์ความหรูหราของนามบัตรและเพลงของ Huey Lewis and the News เบทแมนจะชะงักไปอธิบายด้วยความภูมิใจและหลงตัวเองจนลืมลงมือฆ่าคุณ!' }
        }
    },
    {
        id: 'annabelle',
        name: 'แอนนาเบลล์',
        english: 'Annabelle',
        weapon: 'พลังปีศาจสิงสู่และสิ่งของหลอน (Demonic Entity / Apparitions)',
        movieId: 250546,
        bio: 'ตุ๊กตากระเบื้องเคลือบโบราณที่ตกเป็นสื่อนำพาของปีศาจกระหายวิญญาณ มันไม่ขยับร่างกายเองต่อหน้าผู้คน แต่จะสร้างปรากฏการณ์หลอนสะกดและฉีกวิญญาณเหยื่อมาเป็นอาหาร',
        stats: { brutality: 8.5, stealth: 9.8, speed: 2.0, supernatural: 9.9 },
        simulator: {
            run: { rate: 75, text: 'ตุ๊กตาไม่สามารถเดินวิ่งไล่คุณได้ด้วยตัวเอง คุณรีบเปิดประตูบ้านวิ่งหนีข้ามถนนไปหาผู้คนปะปนท่ามกลางแสงแดดจ้า รอดชีวิตพ้นอิทธิพลปีศาจ!' },
            hide: { rate: 20, text: 'คุณแอบในตู้พระคัมภีร์เก่า แต่ตุ๊กตาแอนนาเบลล์กลับมาโผล่นั่งรออยู่ข้างๆ ในความมืด พร้อมเงาร่างสีดำขนาดยักษ์บีบคอคุณลอยข้ามขอบประตูดับอนาถ!' },
            fight: { rate: 10, text: 'คุณขว้างตุ๊กตาลงพื้นจนแตกกระจาย! แต่ทว่า เงาปีศาจแตรสีดำกลับคำรามก้อง ทุ่มร่างคุณชนเพดานห้องสลบเหมือดและเข้าสิงร่างคุณทันที!' },
            trick: { rate: 60, text: 'คุณรีบคว้าขวดน้ำมนต์สาดใส่ตุ๊กตาและใส่กล่องแก้วศักดิ์สิทธิ์ที่ผ่านการทำพิธีพร้อมแปะตรากระดาษลงยันต์สะกด ทำให้ฤทธิ์เดชปีศาจอ่อนแรงลงชั่วคราว!' }
        }
    },
    {
        id: 'sam',
        name: 'แซม',
        english: 'Sam / Samhain',
        weapon: 'อมยิ้มหัวฟักทองปลายแหลม (Lollipop / Pumpkin Blade)',
        movieId: 23202,
        bio: 'ผู้พิทักษ์และอวตารแห่งเทศกาลฮาโลวีนในชุดเด็กสวมหน้ากากกระสอบป่าน มันจะออกล่าสะสางทุกคนที่ไม่เคารพกฎประเพณีดั้งเดิมของคืนปล่อยผีอย่างทารุณ',
        stats: { brutality: 8.2, stealth: 8.8, speed: 8.0, supernatural: 9.0 },
        simulator: {
            run: { rate: 40, text: 'แซมกระโดดปีนป่ายหลังคาตามล่าคุณอย่างคล่องแคล่วว่องไว แม้จะวิ่งเร็วแค่ไหนเขาก็ปาอมยิ้มหัวฟักทองปักส้นเท้าคุณจนล้มและลากเข้าพุ่มไม้ใบไม้แห้ง!' },
            hide: { rate: 30, text: 'คุณแอบหลังหลุมศพในสุสาน แต่แซมสัมผัสได้ถึงคนที่ละเลยความเคารพต่อฮาโลวีน เขาใช้หน้ากากหัวฟักทองที่ปอกเปลือกเนื้อแท้แสยะยิ้มฝังเขี้ยวลงบนมือคุณ!' },
            fight: { rate: 45, text: 'ร่างกายเหมือนเด็กแต่ทนทานมาก คุณเตะร่างของเขาจนล้มกลิ้งทำให้กระสอบคลุมหัวหลุด เผยใบหน้าหัวฟักทองปีศาจ เขาชะงักและหลบมุมสลบไปครู่หนึ่งทำให้หนีทัน!' },
            trick: { rate: 85, text: 'คุณรีบหยิบลูกอมช็อกโกแลตในกระเป๋ามายื่นส่งให้เขาเป็นการแสดงความเคารพกฎ "Trick or Treat" แซมยอมรับขนมหวาน นิ่งมองคุณแล้วเดินจากไปอย่างสงบ!' }
        }
    },
    {
        id: 'bughuul',
        name: 'บูกูล',
        english: 'Bughuul / Mr. Boogie',
        weapon: 'การครอบงำผ่านฟิล์มวิดีโอและมิติภาพถ่าย (Video Possession / Corruption)',
        movieId: 82507,
        bio: 'เทพเจ้าโบราณนอกรีตที่อาศัยอยู่ในมิติรูปภาพและฟิล์มหนัง มันจะล่อลวงเด็กๆ ให้ลงมือฆาตกรรมครอบครัวตนเองอย่างสยดสยอง ก่อนจะกลืนกินวิญญาณเด็กเหล่านั้นไปสู่มิติของมัน',
        stats: { brutality: 9.2, stealth: 9.5, speed: 4.0, supernatural: 9.9 },
        simulator: {
            run: { rate: 20, text: 'บูกูลโผล่มาดักหลังจอโปรเจคเตอร์และฉุดกระชากคุณเข้าสู่จอฉายภาพยนตร์ฟิล์ม 8 มม. คุณกลายเป็นตัวเอกในฟิล์มมรณะที่โดนจับแขวนคอตายคาจอ!' },
            hide: { rate: 10, text: 'ไม่มีประโยชน์ในการหลบซ่อนในบ้านหลังนั้น เพราะพลังงานปีศาจสิงอยู่ในรูปถ่ายและเทปวิดีโอ เขาจะโผล่จากขอบผนังดึงร่างคุณเข้าไปสลบไร้วิญญาณ!' },
            fight: { rate: 5, text: 'การสู้กับเทพโบราณด้วยแรงมนุษย์ช่างเปล่าประโยชน์ ร่างคุณจะถูกสะกดให้หยุดนิ่ง แขนขาลอยเกร็งล่องลอยก่อนที่กระดูกสันหลังจะถูกหักสะบั้น!' },
            trick: { rate: 75, text: 'คุณรีบเผาฟิล์มหนัง ม้วนเทปวิดีโอ และกล่องฉายภาพทิ้งทั้งหมดทันที พร้อมหนีออกจากบ้านหลังนั้นโดยไม่เหลียวหลังกลับมามองอีกเลย ปิดประตูมิติของมันสำเร็จ!' }
        }
    },
    {
        id: 'gabriel',
        name: 'เกเบรียล',
        english: 'Gabriel',
        weapon: 'ถ้วยรางวัลติดใบมีดผ่าตัดและความยืดหยุ่นร่างกายพิสดาร (Scalpel Trophy / Contortionism)',
        movieId: 619778,
        bio: 'เนื้องอกแฝดปรสิตไขสันหลังที่ตื่นขึ้นมาควบคุมร่างกายจากด้านหลังศีรษะของเหยื่อ สามารถขยับร่างกายแบบบิดงอถอยหลังและมีความแข็งแกร่งทางกายภาพเหนือมนุษย์',
        stats: { brutality: 9.0, stealth: 7.5, speed: 9.2, supernatural: 3.0 },
        simulator: {
            run: { rate: 30, text: 'เกเบรียลควบคุมร่างวิ่งถอยหลังด้วยความเร็วประหลาดน่าเกลียดน่ากลัวไล่ตามคุณทันในพริบตา คมมีดผ่าตัดเฉือนเข้าที่ขั้วปอดดับอนาถคาโถงโรงพยาบาล!' },
            hide: { rate: 40, text: 'คุณซ่อนตัวอยู่ในตู้เหล็กเก็บเอกสาร เกเบรียลใช้หูวิทยุกระซิบคลื่นความถี่บิดกระดูกคอหาเสียงเต้นของหัวใจ โชคดีที่พลังคลื่นแม่เหล็กทำให้เขาเขวไปทางอื่นก่อน' },
            fight: { rate: 20, text: 'คุณยิงปืนใส่ร่างของเขา แต่เกเบรียลหลบหลีกกระสุนด้วยท่ายืดหยุ่นผิดมนุษย์ชวนอ้วก เขาแย่งปืนและใช้กำลังมหาศาลทุบหัวกะโหลกคุณร้าวสลาย!' },
            trick: { rate: 80, text: 'คุณส่งเสียงเกลี้ยกล่อมและเรียกสติของพี่สาวผู้เป็นร่างหลักตัวจริงให้ตื่นขึ้นมาควบคุมจิตสำนึกอีกครั้ง ร่างหลักกดทับจิตของเกเบรียลลงไปสำเร็จ รอดหวุดหวิด!' }
        }
    },
    {
        id: 'billy_dead_silence',
        name: 'บิลลี่ (ตุ๊กตาปากเป็ด)',
        english: 'Billy the Puppet',
        weapon: 'คำสาปสะกดตัดลิ้น (Mary Shaw\'s Tongue Rip Curse)',
        movieId: 14001,
        bio: 'ตุ๊กตาท้องพูดได้หลักของแมรี่ ชอว์ นักเชิดหุ่นผู้ล่วงลับที่กลายเป็นวิญญาณแค้น หากผู้ใดพบเห็นตุ๊กตาแล้วส่งเสียงกรีดร้องออกมาระหว่างเกิดเรื่องสยองขวัญ จะโดนดึงลิ้นขาดดับทันที',
        stats: { brutality: 8.5, stealth: 9.0, speed: 3.0, supernatural: 9.5 },
        simulator: {
            run: { rate: 60, text: 'คุณเห็นผีแมรี่ ชอว์ลอยมาพร้อมตุ๊กตา คุณเอามืออุดปากตัวเองแน่นห้ามกรีดร้องเด็ดขาดแล้ววิ่งหนีออกจากโรงละครโบราณหลังนั้นรอดตายปาฏิหาริย์!' },
            hide: { rate: 35, text: 'คุณแอบในโลงศพเก็บหุ่น แต่ฝุ่นผงทำให้คุณจามฮัดเช้ยออกมาเงียบๆ ผีแมรี่ชอว์มุดมือยาวซีดผ่านฝาโลงกระชากลิ้นออกจากปากคุณกระเด็นเลือดสาด!' },
            fight: { rate: 45, text: 'คุณฉวยโอกาสคว้าร่างตุ๊กตาโยนเข้าเตาไฟเผามอดไหม้สะกัดพลังสะกดจิต แม้ว่าผีจะกรีดร้องอย่างโกรธแค้น แต่มันก็ช่วยลดทอนอำนาจหลอนประสาทลงชั่วขณะ!' },
            trick: { rate: 10, text: 'ไม่มีประโยชน์ที่จะพูดเกลี้ยกล่อมหรือขู่ตุ๊กตา ยิ่งคุณพูดลิ้นของคุณยิ่งเปิดโอกาสให้คำสาปของแมรี่ ชอว์ดึงมันออกจากปากคุณง่ายขึ้น!' }
        }
    },
    {
        id: 'damien',
        name: 'เดเมียน ธอร์น',
        english: 'Damien Thorn',
        weapon: 'พลังอำนาจลึกลับซาตานและอุบัติเหตุสั่งตาย (Satanic Influence / Omen)',
        movieId: 4704,
        bio: 'บุตรแห่งซาตานในร่างเด็กหนุ่มผู้มีสัญลักษณ์เลข 666 บนหนังศีรษะ เขามีสัตว์ร้ายและสาวกซาตานคอยคุ้มครอง และสามารถดลบันดาลอุบัติเหตุสุดสยดสยองให้เกิดขึ้นกับผู้ขัดขวาง',
        stats: { brutality: 9.0, stealth: 8.0, speed: 4.0, supernatural: 9.9 },
        simulator: {
            run: { rate: 25, text: 'คุณวิ่งหนีจากตัวบ้าน แต่จู่ๆ เกิดฟ้าผ่าลงมากระแทกเสาอากาศหล่นลงมาเสียบอกคุณทะลุหลังคาปูนจมกองเลือดตายคาที่อย่างเป็นปริศนา!' },
            hide: { rate: 20, text: 'ซ่อนในห้องใต้ดินอย่างมิดชิด แต่สุนัขร็อตไวเลอร์ปีศาจของเดเมียนตามรอยกลิ่นอายมาร้ายของมันเข้ามารุมทึ้งกระชากลำคอคุณกระจุย!' },
            fight: { rate: 50, text: 'คุณคว้ารูปสลักโบราณ "มีดสั้นเจ็ดเล่มแห่งเมกิดโด" วิ่งเข้าไปปักกลางอกของเดเมียนเพื่อทำลายวิญญาณมารสะเดาะเคราะห์ตามตำราพระคัมภีร์ รอดหวุดหวิด!' },
            trick: { rate: 10, text: 'คุณพยายามเจรจาพูดดีด้วย แต่จิตใต้สำนึกปีศาจสั่งให้กระจกหน้าต่างบานยักษ์เลื่อนสไลด์ลงมาตัดหัวคุณขาดสะบั้นทันที!' }
        }
    },
    {
        id: 'predator',
        name: 'พรีเดเตอร์',
        english: 'Predator (Yautja)',
        weapon: 'ปืนใหญ่พลาสม่าไหล่และใบมีดข้อมือ (Plasma Caster / Wrist Blades)',
        movieId: 106,
        bio: 'นักล่าจากต่างดาวผู้ยึดมั่นในเกียรติยศแห่งการล่าสัตว์ประเสริฐ สวมชุดเกราะพรางตัวล่องหน สัมผัสความร้อน และสะสมกะโหลกศีรษะของเหยื่อที่คู่ควรเป็นถ้วยรางวัล',
        stats: { brutality: 9.4, stealth: 9.7, speed: 8.5, supernatural: 1.0 },
        simulator: {
            run: { rate: 30, text: 'คุณวิ่งหนีเข้าไปในป่าดิบชื้น พรีเดเตอร์เล็งเป้าเลเซอร์สามจุดสีแดงลงกลางหลังของคุณ ก่อนกดยิงปืนพลาสม่าระเบิดร่างคุณแหลกสลายเป็นจุณ!' },
            hide: { rate: 80, text: 'คุณทาโคลนเย็นหนาทั่วร่างกายเพื่อปิดบังอุณหภูมิความร้อน พรีเดเตอร์ในโหมดพรางตัวกระโดดข้ามหัวคุณไปโดยมองไม่เห็นสัญญาณความร้อน รอดชีวิตปาฏิหาริย์!' },
            fight: { rate: 20, text: 'คุณใช้มีดและปืนพยายามยิงสู้พะบู๊ เขาจะจับคุณทุ่มกระแทกต้นไม้จนซี่โครงหัก ดึงกระดูกสันหลังพร้อมหัวกะโหลกคุณออกไปเชยชมเป็นเกียรติยศ!' },
            trick: { rate: 60, text: 'คุณทิ้งปืนและอาวุธทั้งหมดลงพื้น ชูมือเปล่าเพื่อแสดงว่าไม่มีอาวุธและไม่มีคุณค่าแก่การล่า พรีเดเตอร์ที่ยึดกฎนักล่าผู้มีเกียรติจะไม่ฆ่าเหยื่อมือเปล่าแล้วจากไป!' }
        }
    },
    {
        id: 'pumpkinhead',
        name: 'พัมพ์กินเฮด',
        english: 'Pumpkinhead',
        weapon: 'กรงเล็บยักษ์และพลังความแค้นปีศาจ (Demon Claws / Vengeance)',
        movieId: 11634,
        bio: 'อสูรกายปีศาจแห่งความแค้นที่ถูกปลุกขึ้นมาจากสุสานโบราณโดยพิธีกรรมนอกรีต มันมีเป้าหมายล่าล้างแค้นทุกคนที่ผู้เรียกบัญชา โดยไม่มีวันหยุดจนกว่าเหยื่อจะตายหมด',
        stats: { brutality: 9.6, stealth: 6.0, speed: 7.8, supernatural: 9.2 },
        simulator: {
            run: { rate: 25, text: 'อสูรกายร่างยักษ์สูงใหญ่เกือบสามเมตรไล่ล่าคุณข้ามเนินเขา มันใช้หางกวาดปัดขาคุณหักกระเด็น ก่อนเหยียบหัวอกคุณจมดินตายสนิท!' },
            hide: { rate: 20, text: 'มันสัมผัสสายสัมพันธ์แห่งความแค้นได้ดี ซ่อนตัวใต้พื้นกระท่อมไม้มันก็พังหลังคาลงมาหิ้วปีกสะพายหลังคุณฉีกแขนขาออกทีละชิ้น!' },
            fight: { rate: 65, text: 'คุณค้นพบว่าร่างกายของปีศาจลิงก์กับชีวิตของผู้ทำพิธีอัญเชิญ คุณจึงใช้ปืนยิงใส่ร่างมนุษย์ผู้ทำพิธีแทน ทำให้ปีศาจ Pumpkinhead บาดเจ็บและสลายตัวไปทันที!' },
            trick: { rate: 5, text: 'มันคือวิญญาณแห่งความพยาบาทดิบ ไม่มีสติเจรจาหรือรับข้อเสนอใดๆ คมกรงเล็บใหญ่หนากระซวกท้องทะลวงตับไตไส้พุงร่วงหมด!' }
        }
    },
    {
        id: 'the_thing',
        name: 'เดอะ ธิง',
        english: 'The Thing',
        weapon: 'การเลียนแบบเซลล์ชีวภาพและหนวดกลายพันธุ์ (Assimilation / Mutation)',
        movieId: 1091,
        bio: 'สิ่งมีชีวิตต่างดาวโบราณที่แช่แข็งในแอนตาร์กติกา สามารถดูดซึมเซลล์สิ่งมีชีวิตอื่นเพื่อเลียนแบบหน้าตา พฤติกรรม และน้ำเสียงได้อย่างสมบูรณ์แบบไร้จุดสังเกต',
        stats: { brutality: 9.5, stealth: 9.8, speed: 6.5, supernatural: 8.0 },
        simulator: {
            run: { rate: 40, text: 'คุณวิ่งหนีออกจากสถานีวิจัยท่ามกลางพายุหิมะจัด อสูรกายกลายพันธุ์หัวขาดมีขาแมงมุมวิ่งไล่หลัง แต่คุณสลัดประตูล็อคปล่อยมันแข็งตายในพายุหิมะ!' },
            hide: { rate: 30, text: 'คุณหลบซ่อนตัวร่วมกลุ่มกับเพื่อนร่วมทีม ทันใดนั้นเพื่อนข้างตัวกลับอ้าปากกว้างแยกออกเป็นฟันเขี้ยวปีศาจกลืนหัวคุณลงท้องไปในวิถี Assimilation!' },
            fight: { rate: 75, text: 'คุณคว้าปืนพ่นไฟ (Flamethrower) พ่นเปลวเพลิงนรกแผดเผาเนื้อเยื่อกลายพันธุ์ของมันจนเกรียมสลาย เสียงกรีดร้องสยองแหลมลึกดับลง รอดหวุดหวิด!' },
            trick: { rate: 20, text: 'คุณเสนอสุ่มตรวจเลือดด้วยลวดความร้อนทองแดงเพื่อพิสูจน์ความเป็นมนุษย์ แต่ผลเลือดของเพื่อนดันระเบิดออกมาเป็นเนื้อร้ายฉีกหน้าคุณดับอนาถ!' }
        }
    },
    {
        id: 'pale_man',
        name: 'เดอะ เพล แมน',
        english: 'The Pale Man',
        weapon: 'มือติดดวงตาและเขี้ยวเขมือบเด็ก (Eye-Hands / Devouring)',
        movieId: 1417,
        bio: 'อสูรกายร่างผอมแห้งสีซีดน่าเกลียดน่ากลัวที่นั่งเฝ้าโต๊ะอาหารโอชะในมิติใต้ดิน มันมีดวงตาอยู่ที่ฝ่ามือทั้งสองข้าง และจะตื่นขึ้นมาเขมือบเหยื่อหากมีใครแตะต้องอาหารบนโต๊ะ',
        stats: { brutality: 9.0, stealth: 5.0, speed: 5.5, supernatural: 9.0 },
        simulator: {
            run: { rate: 80, text: 'เดอะ เพล แมน มีการเคลื่อนไว่าจะช้าสะเปะสะปะ คุณรีบปีนบันไดกลับขึ้นสู่มิติด้านบนและปิดประตูกลไกหินทันที รอดชีวิตมาได้อย่างหวุดหวิด!' },
            hide: { rate: 40, text: 'คุณซ่อนตัวอยู่หลังเสาหิน อสูรกายยกฝ่ามือที่มีดวงตาสองข้างขึ้นมาแนบใบหน้ามองหาเหยื่อรอบตัว หากคุณไม่ขยับและไม่หายใจมันจะจับทิศทางยาก' },
            fight: { rate: 10, text: 'พยายามต่อสู้กับอสูรกายด้วยมือเปล่า มันจะจับร่างคุณยัดเข้าปากใหญ่เขมือบหัวไหล่และคอขาดกระจุยเหมือนเหยื่อไร้ทางสู้!' },
            trick: { rate: 15, text: 'คุณโยนผลไม้บนโต๊ะไปอีกทางเพื่อเบี่ยงเบนความสนใจ แต่มันฉลาดพอจะหันมามองต้นเหตุและปรี่เข้ามาหักคอคุณดับคาโต๊ะจัดเลี้ยง!' }
        }
    },
    {
        id: 'black_phillip',
        name: 'แบล็กฟิลิป',
        english: 'Black Phillip / Satan',
        weapon: 'พลังอำนาจล่อลวงของซาตานและเขาแพะแหลมคม (Satanic Bargain / Horns)',
        movieId: 310131,
        bio: 'พญามารซาตานที่แฝงตัวมาในคราบแพะสีดำขนาดยักษ์ในฟาร์มของครอบครัวเคร่งศาสนา คอยปั่นหัวคนในบ้านให้หวาดระแวงและล่อลวงวิญญาณเหยื่อให้ลงนามสวามิภักดิ์',
        stats: { brutality: 8.5, stealth: 9.0, speed: 6.8, supernatural: 9.9 },
        simulator: {
            run: { rate: 50, text: 'คุณวิ่งหนีออกจากเขตป่าทึบ แพะดำยักษ์ควบวิ่งไล่หลังหวังขวิดร่างคุณ แต่คุณกระโดดข้ามแม่น้ำพ้นเขตอาณาจักรมนต์ดำของมันสำเร็จ!' },
            hide: { rate: 30, text: 'คุณซ่อนในเล้าไก่ แพะดำก้าวเดินเข้ามาเคาะกีบเท้าส่งเสียงคำรามทุ้มในคอชวนสะพรึง ก่อนจะใช้เขาแหลมขวิดทะลุผนังไม้เสียบหน้าอกคุณ!' },
            fight: { rate: 15, text: 'คุณถือมีดทำครัวพยายามแทงมัน แต่ร่างกายแพะมีความเหนียวเหนือธรรมชาติ มันขวิดคุณลอยกระแทกหินจนคอหักสิ้นใจอนาถ!' },
            trick: { rate: 80, text: 'แพะดำเอ่ยถามเสียงกระซิบเบาๆ "อยากสัมผัสชีวิตที่งดงามและเนยแสนหวานไหม?" คุณยอมลงนามในหนังสือเวทมนตร์ ยกลบล้างวิญญาณเพื่อพลังวิเศษ รอดชีวิตในวิถีแม่มด!' }
        }
    },
    {
        id: 'crowley',
        name: 'วิคเตอร์ โครว์ลีย์',
        english: 'Victor Crowley',
        weapon: 'ขวานยักษ์และกำลังแขนบิดกระดูก (Hatchet / Brute Strength)',
        movieId: 11908,
        bio: 'วิญญาณแค้นร่างอสูรกายพิการในหนองน้ำรัฐหลุยเซียน่า มีพลังฟื้นฟูอมตะและกำลังมหาศาล เขาจะไล่ล่าชำแหละฉีกร่างทุกคนที่ล่วงล้ำเข้ามาในบึงน้ำด้วยขวานยักษ์คู่กาย',
        stats: { brutality: 9.9, stealth: 3.0, speed: 7.5, supernatural: 8.8 },
        simulator: {
            run: { rate: 45, text: 'คุณวิ่งหนีสุดชีวิตลุยโคลนบึงลึก วิคเตอร์คำรามลั่นไล่กวดเสียงดังสนั่น แต่คุณกระโดดขึ้นเรือหางยาวสตาร์ทเครื่องยนต์บิดหนีพ้นบึงน้ำหวุดหวิด!' },
            hide: { rate: 10, text: 'คุณซ่อนในกอหญ้ารกชื้น แต่วิคเตอร์แหวกหญ้าเข้ามาบีบคอคุณลอยเหนือน้ำ ก่อนใช้มือเปล่าดึงกรามบนและล่างของคุณฉีกแยกออกจากกันอย่างทารุณ!' },
            fight: { rate: 15, text: 'พยายามยิงปืนใส่หัวของเขาจนเละ แต่เขาลุกขึ้นมาใหม่ในพริบตาและขว้างขวานตัดขาคุณขาดสองท่อน เสียเลือดตายทรมาน!' },
            trick: { rate: 5, text: 'เขาโกรธแค้นและคลั่งตลอดกาล ไม่รับคำพูดหรือความเห็นใดๆ ทั้งสิ้น ขวานยักษ์สับทะลุกระดูกหน้าอกแยกสองฝั่งทันที!' }
        }
    },
    {
        id: 'brundlefly',
        name: 'บรันเดิลฟลาย',
        english: 'Brundlefly / Seth Brundle',
        weapon: 'น้ำย่อยเอนไซม์แมลงวันและพละกำลังแมลง (Enzyme Vomit / Wall Crawling)',
        movieId: 9426,
        bio: 'นักวิทยาศาสตร์ที่ประสบอุบัติเหตุระหว่างทดลองเครื่องเคลื่อนย้ายมวลสาร ทำให้ยีนของเขาผสมกับแมลงวัน ค่อยๆ กลายพันธุ์เป็นอสูรกายครึ่งมนุษย์ครึ่งแมลงวันที่พ่นน้ำย่อยย่อยกระดูกได้',
        stats: { brutality: 8.3, stealth: 7.0, speed: 8.5, supernatural: 2.0 },
        simulator: {
            run: { rate: 60, text: 'คุณวิ่งหนีออกจากห้องทดลองปิดประตูเหล็กหนา บรันเดิลฟลายเกาะเพดานคลานตามตะกุยกำแพงเสียงน่ากลัว แต่เปิดระบบพัดลมระบายความร้อนเป่าเขาจนร่วงหนีพ้น!' },
            hide: { rate: 35, text: 'คุณหลบหลังลังเหล็กเก็บสารเคมี บรันเดิลฟลายมองหาเหยื่อด้วยดวงตาแมลงวันขนาดยักษ์สีดำ หากเขาจับพิกัดคุณได้จะพ่นน้ำลายเอนไซม์ใส่ขาคุณละลายกระดูก!' },
            fight: { rate: 45, text: 'คุณคว้าปืนลูกซองกระหน่ำยิงใส่กลางอกจนร่างแหลกเป็นเมือกสีเขียว แม้เขาจะมีพลังปีศาจแต่ปืนลูกซองแรงสูงสามารถหยุดยั้งและกำจัดร่างกลายพันธุ์ลงได้ Rอดตาย!' },
            trick: { rate: 20, text: 'คุณพยายามพูดเตือนสติความเป็นมนุษย์ ดร.เซธ ร้องไห้เศร้าโศกพยายามห้ามตัวเอง แต่ยีนแมลงวันควบคุมสมองสั่งให้เขาพ่นกรดย่อยหัวคุณสลายทันที!' }
        }
    },
    {
        id: 'spaulding',
        name: 'กัปตัน สพอลดิง',
        english: 'Captain Spaulding',
        weapon: 'ปืนพกและครอบครัวฆาตกรวิปลาส (Revolver / Firefly Family)',
        movieId: 2662,
        bio: 'ตัวตลกชราสุดวิปริตเจ้าของปั๊มน้ำมันและพิพิธภัณฑ์ของแปลกริมทางหลวง เขาเป็นหัวหน้าครอบครัวฆาตกร "Firefly" ที่คอยล่อลวงนักท่องเที่ยวมาทรมานฆ่าเล่นอย่างโหดร้าย',
        stats: { brutality: 8.5, stealth: 6.0, speed: 5.5, supernatural: 1.0 },
        simulator: {
            run: { rate: 70, text: 'เขาเป็นชายแก่ร่างท้วมวิ่งช้ามาก คุณวิ่งผลักชั้นวางของในร้านชำใส่เขาแล้วรีบวิ่งขึ้นรถสตาร์ทรถขับหนีออกถนนหลวงรอดตัวได้อย่างปลอดภัย!' },
            hide: { rate: 40, text: 'คุณแอบหลังปั๊มน้ำมันโบราณ สพอลดิงเดินถือปืนพกตะโกนด่าทอคำหยาบคายตามหาคุณรอบมุมตึก โชคดีที่ความมืดช่วยพรางร่างคุณไว้จนเขายอมแพ้เดินกลับเข้าร้าน' },
            fight: { rate: 50, text: 'สพอลดิงเป็นมนุษย์ธรรมดา คุณสามารถเตะหรือชกเข้าใบหน้าของเขาแย่งปืนพกและยิงสวนกลับเพื่อสะกดวิญญาณร้ายของครอบครัววิปลาสนี้ได้สำเร็จ!' },
            trick: { rate: 30, text: 'คุณซื้อไก่ทอดแสนอร่อยของโปรดของเขามาเสนอแลกชีวิต สพอลดิงหัวเราะลั่นรับไก่ทอดไปกิน แต่ก็ลั่นไกปืนยิงแสกหน้าคุณดับอนาถคากล่องไก่ทอด!' }
        }
    },
    {
        id: 'herbert_west',
        name: 'เฮอร์เบิร์ต เวสต์',
        english: 'Herbert West',
        weapon: 'สารเคมีเรืองแสงชุบชีวิตคนตาย (Re-Agent Syringe)',
        movieId: 1694,
        bio: 'นักเรียนแพทย์อัจฉริยะโรคจิตผู้คิดค้นน้ำยาเคมีสีเรืองแสงชุบชีวิตคนตาย แต่ศพที่ฟื้นคืนชีพกลับคลุ้มคลั่งไร้สติและบ้าเลือดไล่ฉีกร่างทุกคนที่ขวางหน้า',
        stats: { brutality: 7.2, stealth: 6.5, speed: 6.8, supernatural: 2.0 },
        simulator: {
            run: { rate: 75, text: 'ดร.เวสต์ ยุ่งอยู่กับการผสมน้ำยาสารเคมีในหลอดทดลอง คุณฉวยโอกาสวิ่งหนีออกจากห้องทดลองใต้ดินล็อคประตูหนีพ้นได้อย่างง่ายดาย!' },
            hide: { rate: 45, text: 'คุณหลบซ่อนตัวอยู่หลังตู้เก็บศพ ดร.เวสต์ ถือเข็มฉีดยาน้ำยาสีเขียวเรืองแสงเดินตามหาเหยื่อทดลองครู่หนึ่ง ก่อนจะหันไปจัดการกับศพอื่นที่กำลังคลานอยู่แทน' },
            fight: { rate: 55, text: 'เขาเป็นนักวิทยาศาสตร์ร่างบาง คุณจับตัวเขาผลักใส่ศพคืนชีพที่กำลังอาละวาด ทำให้ศพหิ้วร่างของเขาไปทุบตี เปิดโอกาสให้คุณชิงกระเป๋าหนีออกมาได้!' },
            trick: { rate: 25, text: 'คุณเสนอตัวเป็นผู้ช่วยวิจัยทดลองสารเคมีของเขา เวสต์สนใจแต่หักหลังใช้น้ำยาฉีดเข้าต้นคอคุณเพื่อดูว่าคุณจะตายแล้วฟื้นมาอย่างไรชวนสยอง!' }
        }
    },
    {
        id: 'asami',
        name: 'อาซามิ ยามาซากิ',
        english: 'Asami Yamazaki',
        weapon: 'ลวดเปียโนและเข็มฝังเข็มยาสลบ (Piano Wire / Acupuncture Needles)',
        movieId: 11075,
        bio: 'หญิงสาวญี่ปุ่นผู้นิ่งเงียบสง่างาม เบื้องหลังหน้าตาไร้เดียงสาคือความบิดเบี้ยวจากบาดแผลวัยเด็ก เธอชอบตัดแขนขาและทรมานเหยื่อด้วยลวดเปียโนอย่างเชื่องช้าทรมาน',
        stats: { brutality: 9.2, stealth: 9.6, speed: 6.5, supernatural: 1.0 },
        simulator: {
            run: { rate: 60, text: 'เมื่อคุณรู้ตัวว่าเธอกำลังสลิปยานนอนหลับลงในเครื่องดื่ม คุณเตะถ้วยชาทิ้งแล้วรีบวิ่งพังประตูหนีออกจากอพาร์ตเมนต์ห้องเช่าของเธอหนีพ้นสำเร็จ!' },
            hide: { rate: 35, text: 'คุณแอบซ่อนใต้เตียงในห้องมืด อาซามิถือกระสอบป่านและลวดเปียโนเดินเยื้องย่างอย่างเงียบกริบ หากเธอก้มลงมาเห็นจะใช้เข็มฝังเข้าเบ้าตาคุณทรมานแสงแผล!' },
            fight: { rate: 40, text: 'แม้ร่างกายเธอจะเล็ก แต่การต่อสู้ระยะประชิดอันตรายมากเนื่องจากเธอใช้ลวดเปียโนตวัดรัดแขนขาและรัดคอคุณจนเลือดสาด โชคดีถ้าคุณมีมีดโตๆ ป้องกันตัว' },
            trick: { rate: 10, text: 'คุณพยายามร้องขอความเห็นใจชวนซาบซึ้งใจ อาซามิยิ้มหวานพลางพูดภาษาญี่ปุ่นเบาๆ "คิริ คิริ คิริ" (หั่นๆๆ) ก่อนเลื่อนลวดเปียโนเชือดข้อเท้าคุณขาดกระจุย!' }
        }
    },
    {
        id: 'imhotep',
        name: 'อิมโฮเทป (มัมมี่)',
        english: 'Imhotep / The Mummy',
        weapon: 'คำสาปสิบประการแห่งอียิปต์และทรายปีศาจ (Plagues of Egypt / Sandstorm)',
        movieId: 564,
        bio: 'มหาปุโรหิตอียิปต์โบราณผู้ถูกสาปให้กลายเป็นมัมมี่ทั้งเป็น หลังชุบชีวิตคนรัก เขากลับคืนชีพพร้อมพลังควบคุมทราย แมลงสาบอียิปต์ และดูดกลืนอวัยวะเหยื่อชุบชีวิตตน',
        stats: { brutality: 9.0, stealth: 7.0, speed: 7.5, supernatural: 9.9 },
        simulator: {
            run: { rate: 30, text: 'อิมโฮเทปแปลงกายเป็นพายุทรายยักษ์อ้าปากกว้างกลืนกินรถจี๊ปและร่างของคุณจมกองทรายใต้ทะเลทรายขาดอากาศหายใจตายสนิททรมาน!' },
            hide: { rate: 20, text: 'เขาเรียกฝูงด้วงแผล็บบรอนนับล้านตัวชอนไชพังผนังกำแพงสุสานมุดเข้าหูและจมูกของคุณที่ซ่อนตัวอยู่ กัดกินเครื่องในแหลกเหลวคาที!' },
            fight: { rate: 15, text: 'ปืนยาวหรือระเบิดมือทะลุผ่านทรายร่างเขาไปเฉยๆ เขาบีบคอคุณลอยเหนือน้ำและสูดวิญญาณดูดผิวเนื้อคุณจนกลายเป็นมัมมี่แห้งเหี่ยวไร้วิญญาณ!' },
            trick: { rate: 80, text: 'คุณรีบหยิบ "คัมภีร์สีทองแห่งอมุน-รา" ออกมาท่องเวทมนตร์ภาษาอียิปต์โบราณสะกดถอนพลังอมตะ ส่งวิญญาณเขากลับลงสู่นรกอเวจีใต้ดิน รอดหวุดหวิด!' }
        }
    },
    {
        id: 'stripe',
        name: 'สไตรป์',
        english: 'Stripe (Gremlin)',
        weapon: 'กรงเล็บแหลมและปืนกลมือจิ๋ว (Claws / Submachine Gun)',
        movieId: 927,
        bio: 'หัวหน้าฝูงเกรมลินส์ปีศาจจิ๋วตัวแสบ มีแผงขนสีขาวบนหัว มันเป็นสัตว์ประหลาดจอมป่วนนิสัยโหดร้ายทำลายล้างที่ทวีคูณร่างนับร้อยเมื่อโดนน้ำและคลั่งหลังเที่ยงคืน',
        stats: { brutality: 7.8, stealth: 8.5, speed: 9.0, supernatural: 3.0 },
        simulator: {
            run: { rate: 65, text: 'สไตรป์ขับรถของเล่นและปาประทัดใส่คุณ แต่คุณวิ่งเตะพวกมันกระจัดกระจายและปิดประตูสปอร์ตคลับหนีรอดไปได้สำเร็จท่ามกลางเสียงหัวเราะเอิ๊กอ๊าก!' },
            hide: { rate: 45, text: 'คุณซ่อนตัวอยู่ในตู้เย็น สไตรป์ถือปืนฉีดน้ำและปืนกลมือปีนป่ายตู้พยายามกระโดดเข้ามางับคอหอยคุณ โชคดีที่คุณถีบมันร่วงไปชนหม้อหุงข้าวร้อนๆ' },
            fight: { rate: 55, text: 'คุณหยิบไม้กวาดตีมันปลิวตกเครื่องปั่นไอศกรีมหรือตู้ไมโครเวฟแล้วกดปุ่มทำงาน! ร่างจิ๋วของมันระเบิดตูมกระจาย เมือกเขียวเลอะห้อง ดับสิ้นซ่า!' },
            trick: { rate: 30, text: 'คุณพยายามสาดน้ำใส่หวังชุ่มชื้น แต่น้ำทำให้ร่างกายมันแบ่งตัวออกเป็นสิบตัวรุมกัดทึ้งเสื้อผ้าและเนื้อตัวคุณจนแผลเหวอะหวะเสียชีวิตสลด!' }
        }
    },
    {
        id: 'blind_man',
        name: 'ชายตาบอด (นอร์แมน)',
        english: 'The Blind Man (Norman Nordstrom)',
        weapon: 'ปืนพกโคลต์และพละกำลังทหารผ่านศึก (Colt Revolver / Sensory Combat)',
        movieId: 300669,
        bio: 'ทหารผ่านศึกตาบอดผู้มีประสาทสัมผัสเสียงและการดมกลิ่นขั้นสุดยอด เขาจะปกป้องบ้านตนเองและซ่อนความลับสุดวิปริตในห้องใต้ดินด้วยความโหดเหี้ยมป่าเถื่อน',
        stats: { brutality: 8.5, stealth: 9.5, speed: 6.8, supernatural: 1.0 },
        simulator: {
            run: { rate: 60, text: 'คุณพยายามวิ่งพังหน้าต่างกระจกหนีออกจากบ้านทหารตาบอด แม้เขาจะยิงปืนตามเสียงกระจกแตกเฉียดไหล่คุณไป แต่คุณก็กระโดดข้ามรั้วรอดพ้นอย่างปลอดภัย!' },
            hide: { rate: 50, text: 'คุณหลบซ่อนตัวและกลั้นหายใจนิ่งสนิทห้ามส่งเสียงเด็ดขาด! นอร์แมนเดินถือปืนก้าวผ่านคุณไปห่างแค่คืบเดียว เสียงหัวใจเต้นโชคดีที่ไม่ดังพอให้เขาได้ยิน' },
            fight: { rate: 35, text: 'คุณพยายามชกสู้ตรงๆ แต่เขามีประสบการณ์รบยอดเยี่ยมและแรงควาย เขาจะจับแขนคุณบิดหัก ดับไฟห้องจนมืดสนิทและยิงหัวคุณคาความมืด!' },
            trick: { rate: 20, text: 'คุณปาของตกแต่งลงพื้นเสียงดังโครมครามไปอีกฝั่งเพื่อล่อทิศทางเสียง นอร์แมนหันไปลั่นไกทางนั้น แต่สุนัขดุไล่กัดดมกลิ่นเนื้อคุณจนความแตก!' }
        }
    },
    {
        id: 'red_face_demon',
        name: 'ปีศาจหน้าแดง',
        english: 'The Red Face Demon',
        weapon: 'พลังอำนาจมิติลี้ลับและกรงเล็บเหล็ก (The Further Entity / Claws)',
        movieId: 49018,
        bio: 'ปีศาจจากดินแดนหลังความตาย "The Further" ที่มีใบหน้าสีดำแดงสยดสยอง มันต้องการเข้าสิงร่างเด็กเพื่อกลับมาใช้ชีวิตในโลกมนุษย์และสะสมวิญญาณเหยื่อในรังลับ',
        stats: { brutality: 8.8, stealth: 9.0, speed: 7.0, supernatural: 9.9 },
        simulator: {
            run: { rate: 40, text: 'คุณวิ่งหนีไปตามโถงบ้านผีสิง ทันใดนั้นประตูทุกบานปิดลงและมิติเปลี่ยนเป็นหมอกสีขาวซีด ร่างปีศาจหน้าแดงลอยวาร์ปมาดึงตัวคุณลอยขึ้นเพดานสิงสู่อก!' },
            hide: { rate: 35, text: 'คุณหลบซ่อนใต้ผ้าห่มทาหน้าสีแดงปะปนกับกองของเล่น เสียงเครื่องเล่นแผ่นเสียงโบราณดังขึ้นเงียบๆ ปีศาจกางเล็บยาวกรีดข้างหูจนคุณต้องร้องลั่นถูกจับฆ่า!' },
            fight: { rate: 10, text: 'กระสุนปืนหรือหมัดชกทำอะไรวิญญาณร้ายตนนี้ไม่ได้ มันจะจับหัวคุณบิดกระดูกหักหันหลังสลายพลังจิตสิ้นชีพคาที!' },
            trick: { rate: 75, text: 'คุณสาดเกลือศักดิ์สิทธิ์และเปิดโคมไฟส่องแสงจ้ากระจายความร้อนใส่หน้ามัน แสงไฟสว่างวาบทำให้ปีศาจ Further อ่อนแรงหดตัวล่าถอยกลับมิติมืด รอดพ้น!' }
        }
    },
    {
        id: 'slenderman',
        name: 'สเลนเดอร์แมน',
        english: 'Slender Man',
        weapon: 'หนวดสีดำและสัญญาณภาพรบกวนปั่นประสาท (Static Distortion / Tentacles)',
        movieId: 439015,
        bio: 'อสูรกายร่างผอมสูงโย่งในชุดสูทสีดำไร้ใบหน้า มันจะแฝงตัวตามป่าและที่มืด คอยหลอกหลอนจิตประสาทให้กลัวจนเป็นบ้า และใช้หนวดดำงอกล่าเหยื่อล่องหนหายตัว',
        stats: { brutality: 9.0, stealth: 9.8, speed: 7.5, supernatural: 9.8 },
        simulator: {
            run: { rate: 20, text: 'คุณวิ่งหนีกลางป่าสนทึบ จอประสาทตาของคุณพร่ามัวเกิดสัญญาณคลื่น Static ลั่นในหัวสมองระเบิด ร่างสูทสูงวาร์ปมาโผล่ตรงหน้าใช้หนวดรัดคอร่างคุณสูญหายสาบสูญ!' },
            hide: { rate: 45, text: 'คุณก้มลงแอบซ่อนหลังโขดหินใหญ่และหลับตาแน่นไม่มองกล้องถ่ายรูป สเลนเดอร์แมนก้าวขาเรียวยาวเดินผ่านป่าไปโดยไม่ทำอันตรายเนื่องจากตรวจไม่พบการจ้องมอง' },
            fight: { rate: 5, text: 'ยิงปืนหรือต่อสู้กับสิ่งไร้ใบหน้าเปล่าประโยชน์ ร่างคุณจะถูกยกรั้งลอยบนฟากฟ้าแล้วบิดกระดูกและอวัยวะสูญหายไร้ร่องรอยตลอดกาล!' },
            trick: { rate: 80, text: 'คุณรวบรวม "กระดาษบันทึกสีขาวทั้ง 8 แผ่น" ครบถ้วนตามมุมป่า ทำให้มนต์คำสาปสะกดของมันแตกสลายและล่าถอยหายวาร์ปไปจากป่าสยอง รอดตายปาฏิหาริย์!' }
        }
    },
    {
        id: 'red_us',
        name: 'เรด (ร่างเงาสีแดง)',
        english: 'Red (Us Clone)',
        weapon: 'กรรไกรสีทองเล่มใหญ่ (Golden Scissors)',
        movieId: 458723,
        bio: 'ร่างโคลนใต้ดินผู้สวมชุดหมีสีแดงถือกรรไกรทองคำ มีดวงตาแข็งกร้าวและน้ำเสียงบีบเค้นกระซิบแหบพร่า เธอต้องการนำทัพร่างเงาสะท้อนขึ้นมาเข่นฆ่าและแทนที่คนบนดิน',
        stats: { brutality: 8.4, stealth: 8.8, speed: 8.0, supernatural: 1.0 },
        simulator: {
            run: { rate: 55, text: 'คุณวิ่งหนีออกจากบ้านพักร้อนลงท่าเรือ เรดถือกรรไกรวิ่งเลียนแบบทางเดินของคุณอย่างรวดเร็ว แต่คุณกระโดดขึ้นเรือสตาร์ทบิดหนีพ้นวิถีกรรไกรไปได้อย่างปลอดภัย!' },
            hide: { rate: 40, text: 'คุณหลบซ่อนตัวในห้องเก็บของ เรดส่งเสียงแหบกระซิบเคาะกรรไกรฉับๆ ร้องหาคุณรอบตึก โชคดีที่เงาสะท้อนกระจกไม่ส่องทางที่คุณซ่อนตัวอยู่จนเธอก้าวผ่านไป' },
            fight: { rate: 45, text: 'เธอเป็นร่างเงาสะท้อนที่มีกายเนื้อเหมือนคุณ คุณคว้าไม้กอล์ฟหวดเต็มเหนี่ยวเข้าที่ศีรษะของเรดจนล้มหัวฟาดพื้นช็อคไป เปิดโอกาสให้หนีรอดหวุดหวิด!' },
            trick: { rate: 15, text: 'คุณพยายามพูดเกลี้ยกล่อมเกี่ยวกับสิทธิความเท่าเทียม เรดไม่ฟังและตะคอกเสียงกรีดร้องแหบกรรไกรทองเฉือนหลอดลมคอหอยคุณขาดสะบั้นทันที!' }
        }
    },
    {
        id: 'jennifer_body',
        name: 'เจนนิเฟอร์ เช็ค',
        english: 'Jennifer Check',
        weapon: 'เขี้ยวซัคคิวบัสเคี้ยวกลืนเนื้อคน (Succubus Fangs / Devouring)',
        movieId: 19994,
        bio: 'เชียร์ลีดเดอร์สาวสุดเซ็กซี่ที่ถูกทำพิธีบูชายัญผิดพลาดจนกลายเป็นปีศาจซัคคิวบัสสิงสู่ เธอใช้เสน่ห์เรือนร่างล่อลวงหนุ่มๆ ไปกินเนื้อและเลือดสดๆ เพื่อรักษาความงามอมตะ',
        stats: { brutality: 8.5, stealth: 8.0, speed: 8.5, supernatural: 8.8 },
        simulator: {
            run: { rate: 65, text: 'คุณวิ่งหนีสุดชีวิตออกจากกระท่อมในป่า เจนนิเฟอร์ปีศาจลอยตัวข้ามต้นไม้กรีดร้องไล่หลัง แต่คุณกระโดดข้ามแม่น้ำเย็นจัดที่เธอเกลียดหนีพ้นหวุดหวิด!' },
            hide: { rate: 40, text: 'คุณแอบซ่อนหลังตู้ล็อคเกอร์โรงยิม เจนนิเฟอร์ลอยตัวดมกลิ่นน้ำหอมผู้ชายพลางร้องเรียกคุณด้วยเสียงเซ็กซี่ชวนฝัน โชคดีที่ระฆังโรงเรียนดังขึ้นเบี่ยงเบนเธอไปก่อน' },
            fight: { rate: 50, text: 'คุณใช้ "มีดปลายปืนโบราณ" หรือเหล็กแหลมแทงตรงเข้าที่กลางหัวใจปีศาจซัคคิวบัสของเธอ ซึ่งเป็นจุดตายเดียวตามตำราปราบปีศาจ รอดชีวิตได้อย่างเหลือเชื่อ!' },
            trick: { rate: 20, text: 'คุณยอมรับคำเชิญชวนไปดินเนอร์สองต่อสองเสน่หา แต่เมื่อเข้าไปในป่าเธอกลับอ้าปากกว้างแยกเขี้ยวปีศาจกระซวกหัวไหล่และดูดเลือดคุณจนแห้งเหี่ยวดับอนาถ!' }
        }
    }
];

const FINAL_GIRLS = [
    {
        id: 'sidney',
        name: 'ซิดนีย์ เพรสคอตต์',
        english: 'Sidney Prescott',
        weapon: 'พลังใจสู้ยิบตาและไม่ยอมจำนน (Resilience)',
        movieId: 4232,
        bio: 'ผู้รอดชีวิตจากคดีฆาตกรรมกรงเล็บปีศาจหน้าผี (Ghostface) หลายต่อหลายครั้ง เธอเปลี่ยนจากเหยื่อมาเป็นผู้นำที่พร้อมเผชิญหน้าและสู้กลับด้วยอาวุธทุกชิ้นที่หาได้',
        stats: { resourcefulness: 9.2, instinct: 9.8, resilience: 9.6, combat: 8.5 },
        simulator: {
            distract: { rate: 60, text: 'คุณยอมเบี่ยงเบนความสนใจหน้าผี ซิดนีย์ใช้จังหวะนี้แอบขึ้นสลักปืนยิงขมับหน้าผีจนหน้ากากแตกกระเด็น รอดชีวิตคู่กัน!' },
            assist: { rate: 85, text: 'คุณโยนปืนลูกซองให้ซิดนีย์ เธอรับมันไว้แล้วเป่าร่างฆาตกรกระเด็นตกหน้าต่างบ้านทันที สะใจและรอดชีวิตไร้บาดแผล!' },
            cooperate: { rate: 70, text: 'คุณกับซิดนีย์รุมโจมตีฆาตกรจากสองฝั่ง ซิดนีย์ใช้มีดพกแทงกลางหลังเหยื่อจนเขาล้มทรุดลงไปนอนจมกองเลือด รอดตาย!' },
            trap: { rate: 80, text: 'คุณล่อฆาตกรลงไปที่ห้องใต้ดิน ซิดนีย์ตัดระบบไฟฟ้าและดักกระชากหัวเขาฟาดเข้ากับเสาไฟฟ้าบิดหมดสติ รอดชีวิตหวุดหวิด!' }
        }
    },
    {
        id: 'laurie',
        name: 'ลอรี่ สโตรด',
        english: 'Laurie Strode',
        weapon: 'การเตรียมความพร้อมและตั้งรับขั้นสุดยอด (Supreme Preparedness)',
        movieId: 948,
        bio: 'หญิงแกร่งผู้รอดชีวิตจากคืนฆาตกรรมของไมเคิล ไมเยอร์ส เธอใช้เวลากว่า 40 ปีในการเปลี่ยนบ้านของเธอให้เป็นป้อมปราการเพื่อรอคอยโอกาสสังหารพญามารไร้ความรู้สึก',
        stats: { resourcefulness: 9.5, instinct: 9.7, resilience: 9.8, combat: 9.0 },
        simulator: {
            distract: { rate: 50, text: 'คุณล่อไมเคิลหันหลัง ลอรี่ใช้จังหวะนี้ใช้ปืนลูกซองจ่อยิงอกเขาจนตกชานบ้าน แต่ไมเคิลก็ยังลุกหนีไปได้ ส่วนคุณรอดชีวิต!' },
            assist: { rate: 90, text: 'คุณส่งพลุไฟหรือเครื่องพ่นไฟให้ลอรี่ เธอใช้มันแผดเผาห้องใต้ดินขังไมเคิลไว้ในกองเพลิงมอดไหม้ รอดตายปลอดภัยสะใจที่สุด!' },
            cooperate: { rate: 65, text: 'คุณและลอรี่ช่วยกันลากไมเคิลลงบ่อบดเนื้อ ลอรี่หนีบแขนเขาแน่นส่วนคุณกดสวิตช์เครื่องปั่นเนื้อจนวิญญาณชั่วร้ายดับสูญ รอดหวุดหวิด!' },
            trap: { rate: 85, text: 'คุณล่อไมเคิลเข้าห้องลับ ลอรี่ปุ่มควบคุมปิดประตูกรงเหล็กหนาขังเขาไว้ข้างในป้อมปราการ ดักสกัดการไล่ล่าได้สำเร็จ!' }
        }
    },
    {
        id: 'gale',
        name: 'เกล เวเธอร์ส',
        english: 'Gale Weathers',
        weapon: 'ความมุ่งมั่นและสัญชาตญาณนักข่าว (Tenacious Journalism)',
        movieId: 4232,
        bio: 'ผู้ประกาศข่าวสาวผู้กล้าบ้าบิ่นที่ไม่ยอมแพ้ต่อแรงกดดัน เธอมีส่วนร่วมในการไขปริศนาหน้าผีและสู้ยิบตาด้วยกล้อง โทรศัพท์ และปืนสั้นโดยไม่เกรงกลัวความตาย',
        stats: { resourcefulness: 9.4, instinct: 8.5, resilience: 8.8, combat: 7.0 },
        simulator: {
            distract: { rate: 65, text: 'คุณตะโกนล่อหน้าผี เกลใช้กล้องวิดีโอตัวใหญ่กระแทกหัวหน้าผีจนล้มคว่ำสลบ ก่อนที่คุณทั้งคู่จะรีบวิ่งออกไปหาตำรวจ รอดปลอดภัย!' },
            assist: { rate: 75, text: 'คุณส่งข่าวแฉแผนฆาตกรผ่านไมโครโฟน สารวัตรและนักข่าวเข้ามาเต็มพื้นที่ ทำให้หน้าผีต้องล้มเลิกแผนและล่าถอยไปอย่างหัวเสีย!' },
            cooperate: { rate: 50, text: 'คุณกับเกลรุมกระชากหน้ากากฆาตกรจนเห็นตัวจริง แต่เกลโดนผลักกระแทกกำแพงเจ็บปวด โชคดีที่คุณชกหมัดใส่จมูกหน้าผีรอดหวุดหวิด!' },
            trap: { rate: 70, text: 'คุณปูพรมจัดฉากล่อฆาตกรมาที่ห้องส่งข่าว เกลปิดประตูชัตเตอร์สตูดิโอขังเขาไว้จนหน้ากากขาดรุ่งริ่งโดนจับกุมสำเร็จ!' }
        }
    },
    {
        id: 'ripley',
        name: 'เอลเลน ริปลีย์',
        english: 'Ellen Ripley',
        weapon: 'ความเป็นผู้นำและการใช้อาวุธหนัก (Combat Leadership)',
        movieId: 348,
        bio: 'เจ้าหน้าที่สาวแกร่งแห่งยาน Nostromo ผู้เผชิญหน้ากับอสูรกายต่างดาวซีโนมอร์ฟ เธอคือสัญลักษณ์ของหญิงแกร่งผู้ใช้สติไตร่ตรองและมีทักษะการใช้อาวุธหนักเพื่อเอาชีวิตรอด',
        stats: { resourcefulness: 9.6, instinct: 9.9, resilience: 9.7, combat: 9.5 },
        simulator: {
            distract: { rate: 55, text: 'คุณล่อเป้าเอเลี่ยน ริปลีย์ขับรถตักดินขนาดยักษ์พุ่งชนร่างซีโนมอร์ฟทะลุกำแพงยานร่วงลงเตาปฏิกรณ์ระเบิดเป็นผุยผง!' },
            assist: { rate: 95, text: 'คุณส่งปืนพ่นไฟคู่ติดปืนกลให้ริปลีย์ เธอแผดเผารังไข่เอเลี่ยนกระจุยกระจายพร้อมสะบัดก้นหนีขึ้นยานชูชีพได้อย่างปลอดภัยสะใจ!' },
            cooperate: { rate: 75, text: 'คุณช่วยกดควบคุมลิฟต์ขนส่ง ริปลีย์ใช้เครื่องสวมแขนกลไฮดรอลิกยกจับซีโนมอร์ฟโยนออกนอกประตูลมยาน รอดชีวิตปาฏิหาริย์!' },
            trap: { rate: 85, text: 'คุณล่อเอเลี่ยนเข้าห้องท่อระบายลม ริปลีย์ปิดล็อคระบบประตูสุญญากาศและปลดความดันดูดร่างมันลอยเคว้งสู่อวกาศอันมืดมิด!' }
        }
    },
    {
        id: 'nancy',
        name: 'แนนซี่ ทอมป์สัน',
        english: 'Nancy Thompson',
        weapon: 'การดึงศัตรูออกมาสู้และวางกับดัก (Lucid Trapping)',
        movieId: 377,
        bio: 'เด็กสาวผู้วิเคราะห์และค้นพบกฎการล่าในฝันของเฟรดดี้ ครูเกอร์ เธอเรียนรู้วิธีการควบคุมฝัน (Lucid Dream) และวางกับดักอันซับซ้อนในโลกความจริงเพื่อสยบมัน',
        stats: { resourcefulness: 9.7, instinct: 9.0, resilience: 9.2, combat: 7.5 },
        simulator: {
            distract: { rate: 70, text: 'คุณวิ่งล่อเฟรดดี้ในความฝัน แนนซี่ตั้งสติและคว้าคอเฟรดดี้ดึงหลุดออกมาในโลกความเป็นจริงก่อนที่คุณจะสะดุ้งตื่น รอดชีวิต!' },
            assist: { rate: 80, text: 'คุณช่วยจัดหาก้อนหิน ลวดสะดุด และถังน้ำมันทำกับดักรอบบ้าน แนนซี่ล่อเฟรดดี้เดินชนกับดักจนโดนไฟคลอกจนเละเทะหนีเตลิดไป!' },
            cooperate: { rate: 60, text: 'คุณกับแนนซี่ช่วยกันใช้ค้อนรุมทุบหัวเฟรดดี้ในโลกความจริง ร่างเขาดิ้นพล่านและสลายหายไปเป็นเงามืด รอดตายหวุดหวิด!' },
            trap: { rate: 90, text: 'แนนซี่ใช้วิธีหันหลังใส่และไม่ยอมมอบพลังความกลัวให้เฟรดดี้ ทำให้เขาสูญเสียพลังหลอนจิตและจางหายไปจากความฝันของคุณถาวร!' }
        }
    },
    {
        id: 'sally',
        name: 'แซลลี่ ฮาร์เดสตี้',
        english: 'Sally Hardesty',
        weapon: 'ความอึดและการวิ่งหนีนาทีสุดท้าย (Pure Endurance)',
        movieId: 30497,
        bio: 'หญิงสาวคนเดียวที่รอดชีวิตจากครอบครัวกินคนคลั่งเลื่อยยนต์ เธอวิ่งหนีสุดชีวิตผ่านกอหนาม ทะลุหน้าต่างกระจก และปีนขึ้นหลังรถกระบะหนีพ้นในสภาพโชกเลือด',
        stats: { resourcefulness: 7.0, instinct: 9.6, resilience: 9.5, combat: 5.0 },
        simulator: {
            distract: { rate: 60, text: 'คุณกระโดดขวางตู้ใส่เลเธอร์เฟซ แซลลี่พยายามปีนทะลุกระจกหน้าต่างวิ่งหนีโชกเลือดออกสู่ถนนใหญ่และโบกรถหนีรอดหวุดหวิด!' },
            assist: { rate: 65, text: 'คุณปาหินใส่หัวเข่าฆาตกรเลื่อยยนต์ ทำให้เขาชะงักสะดุดล้มทับใบเลื่อยของตัวเองจนได้รับบาดเจ็บสาหัส เปิดโอกาสให้แซลลี่วิ่งพ้นเขตบ้าน!' },
            cooperate: { rate: 45, text: 'คุณกับแซลลี่พยายามรุมแย่งเลื่อยยนต์ แต่ความคลั่งพละกำลังของเลเธอร์เฟซเหวี่ยงขวานปัดจนคุณบาดเจ็บ โชคดีที่แซลลี่เบี่ยงตัวหนีทัน!' },
            trap: { rate: 50, text: 'คุณวิ่งล่อเข้าป่าขวากหนาม เลเธอร์เฟซแบกเลื่อยวิ่งชนกิ่งไม้สลบไสลปั่นป่วน ทำให้แซลลี่วิ่งไปถึงถนนใหญ่ รอดตายปาฏิหาริย์!' }
        }
    },
    {
        id: 'mindy',
        name: 'มินดี้ มีคส์-มาร์ติน',
        english: 'Mindy Meeks-Martin',
        weapon: 'ความรอบรู้ทฤษฎีหนังสยองขวัญระดับผู้เชี่ยวชาญ (Meta Horror Logic)',
        movieId: 646385,
        bio: 'หลานสาวของแรนดี้ มีคส์ เธอเป็นกูรูภาพยนตร์แนวสยองขวัญสไตล์เมต้า รู้จักกฎเหล็กของการเอาตัวรอด รู้ทันมุกของหน้าผี และพยายามเตือนสติทุกคนในกลุ่มให้ทำตามกฎ',
        stats: { resourcefulness: 9.8, instinct: 8.8, resilience: 8.0, combat: 6.0 },
        simulator: {
            distract: { rate: 70, text: 'คุณชวนหน้าผีคุยเรื่องกฎของหนังรีควล (Requel) มินดี้ใช้จังหวะนี้ใช้สเปรย์พริกไทยฉีดใส่หน้ามันเต็มๆ แล้วพาคุณปีนบันไดหนีไป รอดชีวิต!' },
            assist: { rate: 80, text: 'คุณชี้เป้าตัวจริงของหน้าผีตามทฤษฎีเพื่อนสนิทเป็นฆาตกร มินดี้คว้าแจกันดอกไม้ฟาดหัวฆาตกรสลบคว่ำก่อนโดนแทง รอดชีวิตไร้รอยแผล!' },
            cooperate: { rate: 55, text: 'คุณกับมินดี้ช่วยกันระวังหลังให้กัน หน้าผีพุ่งมาแทงแต่พวกคุณใช้เก้าอี้กระแทกมือมีดหลุดร่วงลงพื้นและกระเสือกกระสนวิ่งหนีออกมาได้!' },
            trap: { rate: 75, text: 'คุณล่อฆาตกรเข้าห้องมืด มินดี้วิเคราะห์สถิติจุดที่หน้าผีจะชอบโผล่มาตลบหลัง แอบดักใช้ไม้เบสบอลฟาดหน้าอกเขาล้มพับ รอดตาย!' }
        }
    }
];

function renderFinalGirls() {
    if (!finalgirlsGrid) return;
    finalgirlsGrid.innerHTML = '';
    
    FINAL_GIRLS.forEach(char => {
        const card = document.createElement('div');
        card.className = 'character-card';
        card.dataset.charId = char.id;
        
        card.innerHTML = `
            <div class="character-card-bg" id="finalgirl-bg-${char.id}"></div>
            <div class="character-card-overlay"></div>
            <div class="character-card-content">
                <div class="character-card-name">${char.name}</div>
                <div class="character-card-english">${char.english}</div>
                <div class="character-card-weapon"><i class="fa-solid fa-shield-halved text-success"></i> จุดเด่น: ${char.weapon.split(' ')[0]}</div>
                <div class="character-card-stats-row">
                    <span class="meta-rating" style="background: rgba(16, 185, 129, 0.12); border-color: rgba(16, 185, 129, 0.35); color: #10b981; font-size: 0.72rem; padding: 0.15rem 0.45rem;">
                        <i class="fa-solid fa-heart-pulse"></i> รอดชีวิต ${char.stats.resilience}/10
                    </span>
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => {
            SoundscapeEngine.playClickSFX();
            openCharacterModal(char.id);
        });
        
        finalgirlsGrid.appendChild(card);
        loadFinalGirlCardImage(char);
    });
}

async function loadFinalGirlCardImage(char) {
    const bgEl = document.getElementById(`finalgirl-bg-${char.id}`);
    if (!bgEl) return;
    
    try {
        const movie = await TMDB.getMovieDetails(char.movieId);
        if (movie && movie.backdrop_path) {
            bgEl.style.backgroundImage = `url('${TMDB.getImageUrl(movie.backdrop_path, 'w300')}')`;
        } else {
            bgEl.style.backgroundColor = '#0a1a0f';
        }
    } catch (err) {
        console.error("Failed to load TMDB image for " + char.name, err);
        bgEl.style.backgroundColor = '#0a1a0f';
    }
}

// --- RENDER HORROR FRANCHISES CHECKLIST TRACKER ---
function showFranchisesListView() {
    activeFranchiseId = null;
    if (franchisesListView) franchisesListView.style.display = 'block';
    if (franchiseDetailView) franchiseDetailView.style.display = 'none';
    renderFranchises();
}

function renderFranchises() {
    if (!franchisesGrid) return;
    franchisesGrid.innerHTML = '';

    const collection = Storage.getCollection();

    HORROR_FRANCHISES.forEach(franchise => {
        const totalMovies = franchise.movies.length;
        let watchedCount = 0;

        franchise.movies.forEach(movie => {
            const saved = collection.find(m => m.id === movie.id);
            if (saved && saved.watchStatus === 'watched') {
                watchedCount++;
            }
        });

        const percent = totalMovies > 0 ? Math.round((watchedCount / totalMovies) * 100) : 0;

        const card = document.createElement('div');
        card.className = 'franchise-banner-card';
        if (franchise.backdrop) {
            // Using w1280 since these cards are now full-width like the hero banner
            card.style.backgroundImage = `url('${TMDB.getImageUrl(franchise.backdrop, 'w1280')}')`;
        }

        // Clean layout: Only giant title centered. Small subtle indicators placed absolutely in corners
        card.innerHTML = `
            <div class="franchise-progress-badge" style="position: absolute; top: 1.25rem; right: 1.25rem; z-index: 2; background: rgba(0,0,0,0.75); padding: 0.3rem 0.65rem; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1); font-size: 0.75rem; font-weight: 700; color: var(--primary); text-shadow: none;">
                สำเร็จ ${watchedCount}/${totalMovies} ภาค (${percent}%)
            </div>
            <h4 class="franchise-title-large">${franchise.name}</h4>
            <div class="franchise-progress-bar-bg" style="position: absolute; bottom: 0; left: 0; width: 100%; height: 6px; background: rgba(0,0,0,0.6); z-index: 3; border-radius: 0; margin: 0; border: none;">
                <div class="franchise-progress-bar-fill" style="width: ${percent}%; height: 100%; border-radius: 0;"></div>
            </div>
        `;

        card.addEventListener('click', () => {
            SoundscapeEngine.playClickSFX();
            openFranchiseDetail(franchise.id);
        });

        franchisesGrid.appendChild(card);
    });
}

function openFranchiseDetail(franchiseId) {
    const franchise = HORROR_FRANCHISES.find(f => f.id === franchiseId);
    if (!franchise) return;

    activeFranchiseId = franchiseId;

    if (franchisesListView) franchisesListView.style.display = 'none';
    if (franchiseDetailView) franchiseDetailView.style.display = 'block';

    if (franchiseDetailTitle) {
        franchiseDetailTitle.innerText = franchise.name;
    }

    if (!franchiseDetailContent) return;
    franchiseDetailContent.innerHTML = '';

    const collection = Storage.getCollection();
    const totalMovies = franchise.movies.length;
    let watchedCount = 0;

    franchise.movies.forEach(movie => {
        const saved = collection.find(m => m.id === movie.id);
        if (saved && saved.watchStatus === 'watched') {
            watchedCount++;
        }
    });

    const percent = totalMovies > 0 ? Math.round((watchedCount / totalMovies) * 100) : 0;

    const backdropUrl = franchise.backdrop ? TMDB.getImageUrl(franchise.backdrop, 'original') : '';
    
    // Create detailed header card
    const headerCard = document.createElement('div');
    headerCard.className = 'franchise-detail-header-card';
    if (backdropUrl) {
        headerCard.style.backgroundImage = `url('${backdropUrl}')`;
    }
    headerCard.innerHTML = `
        <div class="franchise-header">
            <h4 class="franchise-title" style="font-size: 1.6rem; text-shadow: 0 0 10px rgba(255, 0, 60, 0.85);">${franchise.name}</h4>
            <p class="franchise-description" style="max-width: 800px; margin-top: 0.5rem;">${franchise.description}</p>
        </div>
        <div class="franchise-progress-container" style="margin-top: 1.5rem; max-width: 600px;">
            <div class="franchise-progress-label">
                <span><i class="fa-solid fa-droplet animate-pulse"></i> ความสำเร็จ: ${watchedCount} / ${totalMovies} ภาค</span>
                <span>${percent}%</span>
            </div>
            <div class="franchise-progress-bar-bg">
                <div class="franchise-progress-bar-fill" style="width: ${percent}%;"></div>
            </div>
        </div>
    `;
    franchiseDetailContent.appendChild(headerCard);

    // Grid container for movie cards - using the standard "movie-grid" class so it's normal-sized!
    const gridContainer = document.createElement('div');
    gridContainer.className = 'movie-grid';
    franchiseDetailContent.appendChild(gridContainer);

    franchise.movies.forEach(movie => {
        const saved = collection.find(m => m.id === movie.id);
        
        let card;
        if (saved) {
            // Render normal movie card
            card = createMovieCard(saved, true);
        } else {
            // Unsaved temporary movie data
            const tempMovie = {
                id: movie.id,
                title: movie.title,
                release_date: `${movie.year}-01-01`,
                vote_average: null,
                poster_path: null
            };
            card = createMovieCard(tempMovie, false);
            // Grayscale desaturated style for locked/unsaved movie cards
            card.style.filter = 'grayscale(80%) opacity(0.5)';
        }
        
        // Ensure smooth transitions for filter and transform
        card.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), border-color 0.3s ease, box-shadow 0.3s ease, filter 0.5s ease, opacity 0.5s ease';
        
        gridContainer.appendChild(card);
    });

    // Lazy load actual high-quality posters and metadata from TMDB
    lazyLoadFranchisePosters(franchise);
}

async function lazyLoadFranchisePosters(franchise) {
    const collection = Storage.getCollection();
    for (const movie of franchise.movies) {
        // Find existing movie-card in our grid container
        const oldCard = franchiseDetailContent.querySelector(`.movie-card[data-id="${movie.id}"]`);
        if (!oldCard) continue;

        // Only fetch if poster path is missing or default unsplash is displayed
        const imgEl = oldCard.querySelector('.movie-poster');
        if (imgEl && imgEl.src.includes('unsplash.com')) {
            try {
                const details = await TMDB.getMovieDetails(movie.id);
                if (details) {
                    const saved = collection.find(m => m.id === movie.id);
                    const isSaved = !!saved;
                    
                    // Create updated movie card using TMDB full details
                    const newCard = createMovieCard(details, isSaved);
                    if (!isSaved) {
                        newCard.style.filter = 'grayscale(80%) opacity(0.5)';
                    }
                    newCard.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), border-color 0.3s ease, box-shadow 0.3s ease, filter 0.5s ease, opacity 0.5s ease';
                    
                    // Replace in-place
                    oldCard.parentNode.replaceChild(newCard, oldCard);
                }
            } catch (err) {
                console.warn(`Failed to lazy load poster for movie ID ${movie.id}`, err);
            }
        }
    }
}

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
    let char = HORROR_CHARACTERS.find(c => c.id === charId);
    let isFinalGirl = false;
    if (!char) {
        char = FINAL_GIRLS.find(c => c.id === charId);
        isFinalGirl = true;
    }
    if (!char) return;
    
    SoundscapeEngine.playModalOpenSFX();
    
    const charModal = document.getElementById('character-detail-modal');
    if (!charModal) return;
    
    charModal.querySelector('#character-name').textContent = char.name;
    charModal.querySelector('#character-english').innerHTML = `<i class="fa-regular fa-user"></i> ${char.english}`;
    
    // Update tagline scoped to character modal
    const taglineEl = charModal.querySelector('.modal-tagline');
    if (taglineEl) {
        taglineEl.innerHTML = isFinalGirl 
            ? `<i class="fa-solid fa-shield-halved text-success animate-pulse"></i> ทำเนียบผู้รอดชีวิตคนสุดท้าย (Final Girls)`
            : `<i class="fa-solid fa-skull animate-pulse"></i> ทำเนียบฆาตกรระดับตำนาน`;
    }
    
    charModal.querySelector('#character-weapon').innerHTML = isFinalGirl 
        ? `<i class="fa-solid fa-shield-halved text-success"></i> จุดเด่น: ${char.weapon}`
        : `<i class="fa-solid fa-gavel text-danger"></i> อาวุธ: ${char.weapon}`;
        
    charModal.querySelector('#character-bio').textContent = char.bio;
    
    // Update border and headers in the sidebar scoped to character modal
    const statsBox = charModal.querySelector('.modal-sidebar-column .interaction-box:first-of-type');
    if (statsBox) {
        statsBox.style.borderColor = isFinalGirl ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 0, 60, 0.25)';
    }
    
    const statsHeader = charModal.querySelector('.modal-sidebar-column .interaction-box:first-of-type h3.modal-section-title');
    if (statsHeader) {
        statsHeader.innerHTML = isFinalGirl 
            ? '<i class="fa-solid fa-star"></i> ค่าความเก่ง (Prowess Stats)'
            : '<i class="fa-solid fa-skull"></i> ค่าสถานะความสยองขวัญ (Horror Stats)';
        statsHeader.style.borderLeftColor = isFinalGirl ? '#10b981' : 'var(--primary)';
    }
    
    const simBox = charModal.querySelector('.modal-sidebar-column .interaction-box:last-of-type');
    if (simBox) {
        simBox.style.borderColor = isFinalGirl ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 0, 60, 0.25)';
    }
    
    const simHeader = charModal.querySelector('.modal-sidebar-column .interaction-box:last-of-type h3.modal-section-title');
    if (simHeader) {
        simHeader.innerHTML = isFinalGirl 
            ? '<i class="fa-solid fa-gamepad"></i> จำลองความร่วมมือ (Cooperation Simulator)'
            : '<i class="fa-solid fa-gamepad"></i> จำลองการเผชิญหน้า (Survival Simulator)';
        simHeader.style.borderLeftColor = isFinalGirl ? '#10b981' : 'var(--primary)';
    }
    
    const simDesc = charModal.querySelector('.modal-sidebar-column .interaction-box:last-of-type p');
    if (simDesc) {
        simDesc.textContent = isFinalGirl 
            ? 'หากคุณร่วมมือกับผู้รอดชีวิตคนนี้เพื่อเผชิญหน้าภัยร้าย คุณจะช่วยเธอบนแผนอย่างไร? ระบบจะคำนวณโอกาสรอดชีวิตร่วมกัน'
            : 'หากคุณพบฆาตกรคนนี้ในคืนหลอน คุณจะเลือกทำอย่างไร? ระบบจะคำนวณโอกาสรอดชีวิตของคุณพร้อมแสดงผลลัพธ์';
    }
    
    const resultBox = charModal.querySelector('#sim-result-box');
    if (resultBox) resultBox.style.display = 'none';
    
    // Rebuild choice buttons scoped to character modal
    const selectorContainer = charModal.querySelector('.modal-sidebar-column .interaction-box:last-of-type .watch-status-selector');
    if (selectorContainer) {
        selectorContainer.innerHTML = '';
        const choices = isFinalGirl ? [
            { id: 'distract', label: 'เบี่ยงเบนเป้าหมาย', icon: 'fa-bullhorn' },
            { id: 'assist', label: 'ส่งอาวุธช่วยสู้', icon: 'fa-gun' },
            { id: 'cooperate', label: 'ร่วมสู้กันคู่', icon: 'fa-people-group' },
            { id: 'trap', label: 'วางกับดักล่อลวง', icon: 'fa-circle-nodes' }
        ] : [
            { id: 'run', label: 'วิ่งหนีสุดชีวิต', icon: 'fa-person-running' },
            { id: 'hide', label: 'หาที่ซ่อนแอบ', icon: 'fa-eye-slash' },
            { id: 'fight', label: 'สู้กลับขาดใจ', icon: 'fa-hand-fist' },
            { id: 'trick', label: 'ใช้ไหวพริบเจรจา', icon: 'fa-brain' }
        ];
        
        choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'status-btn';
            btn.id = `sim-btn-${choice.id}`;
            btn.dataset.choice = choice.id;
            btn.innerHTML = `<i class="fa-solid ${choice.icon}"></i> ${choice.label}`;
            btn.addEventListener('click', () => {
                runSurvivalSimulator(char.id, choice.id);
            });
            selectorContainer.appendChild(btn);
        });
    }
    
    // Rebuild Stats List scoped to character modal
    const statsList = charModal.querySelector('.analytics-bars-list');
    if (statsList) {
        statsList.innerHTML = '';
        const activeStats = isFinalGirl ? [
            { key: 'resourcefulness', label: 'ไหวพริบการแก้ไขปัญหา (Resourcefulness)' },
            { key: 'instinct', label: 'สัญชาตญาณเอาตัวรอด (Instinct)' },
            { key: 'resilience', label: 'พลังความอึด / จิตใจ (Resilience)' },
            { key: 'combat', label: 'ทักษะการต่อสู้ (Combat Skill)' }
        ] : [
            { key: 'brutality', label: 'ระดับความโหด (Brutality)' },
            { key: 'stealth', label: 'การซุ่มโจมตี (Stealth)' },
            { key: 'speed', label: 'ความว่องไว (Speed)' },
            { key: 'supernatural', label: 'พลังเหนือธรรมชาติ (Supernatural)' }
        ];
        
        activeStats.forEach(st => {
            const score = char.stats[st.key];
            const barItem = document.createElement('div');
            barItem.className = 'analytics-bar-item';
            barItem.innerHTML = `
                <div class="analytics-bar-label">
                    <span>${st.label}</span>
                    <span id="stat-val-${st.key}">${score} / 10</span>
                </div>
                <div class="analytics-bar-bg">
                    <div class="analytics-bar-fill" id="stat-bar-${st.key}" style="width: 0%; background: ${isFinalGirl ? '#10b981' : 'var(--primary)'}; box-shadow: 0 0 10px ${isFinalGirl ? 'rgba(16,185,129,0.5)' : 'rgba(255,0,60,0.5)'};"></div>
                </div>
            `;
            statsList.appendChild(barItem);
            setTimeout(() => {
                const barEl = charModal.querySelector(`#stat-bar-${st.key}`);
                if (barEl) barEl.style.width = `${score * 10}%`;
            }, 50);
        });
    }
    
    charModal.classList.add('active');
    
    const backdropEl = charModal.querySelector('#character-backdrop');
    const posterEl = charModal.querySelector('#character-poster');
    const linkContainer = charModal.querySelector('#character-featured-movie-link');
    
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
                        <div class="actor-movie-character" style="font-size: 0.72rem; color: ${isFinalGirl ? '#10b981' : 'var(--primary)'};"><i class="fa-solid fa-fire animate-pulse"></i> คลิกเพื่อดูรายละเอียดและรับชมตัวอย่างภาพยนตร์</div>
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
    let char = HORROR_CHARACTERS.find(c => c.id === charId);
    let isFinalGirl = false;
    if (!char) {
        char = FINAL_GIRLS.find(c => c.id === charId);
        isFinalGirl = true;
    }
    if (!char) return;
    
    const charModal = document.getElementById('character-detail-modal');
    if (!charModal) return;
    
    const choices = isFinalGirl 
        ? ['distract', 'assist', 'cooperate', 'trap']
        : ['run', 'hide', 'fight', 'trick'];
        
    choices.forEach(c => {
        const btn = charModal.querySelector(`#sim-btn-${c}`);
        if (btn) {
            btn.classList.toggle('active', c === choice);
            if (c === choice) {
                if (isFinalGirl) {
                    btn.style.background = 'rgba(16, 185, 129, 0.15)';
                    btn.style.borderColor = '#10b981';
                    btn.style.color = '#10b981';
                    btn.style.boxShadow = '0 0 10px rgba(16, 185, 129, 0.25)';
                } else {
                    btn.style.background = 'rgba(255, 0, 60, 0.15)';
                    btn.style.borderColor = 'var(--primary)';
                    btn.style.color = 'var(--primary)';
                    btn.style.boxShadow = '0 0 10px rgba(255, 0, 60, 0.25)';
                }
            } else {
                btn.style.background = '';
                btn.style.borderColor = '';
                btn.style.color = '';
                btn.style.boxShadow = '';
            }
        }
    });
    
    const result = char.simulator[choice];
    const rate = result.rate;
    
    if (rate <= 15) {
        SoundscapeEngine.playJumpscareSFX();
    } else {
        SoundscapeEngine.playClickSFX();
    }
    
    const resultBox = charModal.querySelector('#sim-result-box');
    const survivalRateEl = charModal.querySelector('#sim-survival-rate');
    const outcomeTextEl = charModal.querySelector('#sim-outcome-text');
    
    if (resultBox && survivalRateEl && outcomeTextEl) {
        survivalRateEl.textContent = isFinalGirl ? `โอกาสรอดชีวิตร่วมกัน: ${rate}%` : `โอกาสรอด: ${rate}%`;
        
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

// --- SEARCH AUTOCOMPLETE SUGGESTIONS LOGIC ---
let suggestionDebounceTimer = null;

function handleSearchInput() {
    const query = searchInput.value.trim();
    if (!query) {
        hideSuggestions();
        return;
    }

    if (activeTab === 'collection') {
        showLocalSuggestions(query);
    } else if (activeTab === 'discover') {
        clearTimeout(suggestionDebounceTimer);
        suggestionDebounceTimer = setTimeout(() => {
            showOnlineSuggestions(query);
        }, 300);
    } else {
        hideSuggestions();
    }
}

function hideSuggestions() {
    if (searchSuggestions) {
        searchSuggestions.innerHTML = '';
        searchSuggestions.style.display = 'none';
    }
}

function showLocalSuggestions(query) {
    if (!searchSuggestions) return;
    
    const collection = isSharedProfileMode ? sharedCollectionData : Storage.getCollection();
    const matches = collection.filter(movie => 
        (movie.title && movie.title.toLowerCase().includes(query.toLowerCase())) ||
        (movie.original_title && movie.original_title.toLowerCase().includes(query.toLowerCase()))
    ).slice(0, 6);

    renderSuggestionsList(matches, 'local');
}

async function showOnlineSuggestions(query) {
    if (!searchSuggestions || query.length < 2) {
        hideSuggestions();
        return;
    }

    try {
        const results = await TMDB.searchHorrorMovies(query, 1);
        if (results && results.results && results.results.length > 0) {
            const matches = results.results.slice(0, 6);
            renderSuggestionsList(matches, 'online');
        } else {
            hideSuggestions();
        }
    } catch (err) {
        console.error("Failed to fetch autocomplete suggestions", err);
        hideSuggestions();
    }
}

function renderSuggestionsList(movies, source) {
    if (!searchSuggestions) return;
    
    if (movies.length === 0) {
        hideSuggestions();
        return;
    }

    searchSuggestions.innerHTML = '';
    searchSuggestions.style.display = 'flex';

    movies.forEach(movie => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        
        const posterPath = movie.poster_path ? TMDB.getImageUrl(movie.poster_path, 'w92') : 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=92&auto=format&fit=crop';
        const year = movie.release_date ? movie.release_date.split('-')[0] : '-';
        const tagText = source === 'local' ? 'คอลเล็กชัน' : 'ค้นพบใหม่';

        item.innerHTML = `
            <img src="${posterPath}" class="suggestion-poster" alt="${movie.title}">
            <div class="suggestion-info">
                <span class="suggestion-title">${movie.title}</span>
                <div class="suggestion-meta">
                    <span>${year}</span>
                    <span class="suggestion-tag">${tagText}</span>
                </div>
            </div>
        `;

        item.addEventListener('click', () => {
            searchInput.value = movie.title;
            hideSuggestions();
            handleSearch();
        });

        searchSuggestions.appendChild(item);
    });
}

function handleOutsideClickForSuggestions(e) {
    if (searchSuggestions && !searchSuggestions.contains(e.target) && e.target !== searchInput) {
        hideSuggestions();
    }
}

// ==========================================
// --- 5 PREMIUM HORROR FEATURES LOGIC ---
// ==========================================

// --- HORROR ROULETTE LOGIC ---
let isRouletteSpinning = false;
let rouletteRotation = 0;
let rouletteSelectedMovieId = null;
let rouletteSelectedMovie = null;
let rouletteFetchPromise = null;

function startRouletteSpin() {
    if (isRouletteSpinning) return;
    
    isRouletteSpinning = true;
    
    // Mark roulette challenge as done in bingo
    localStorage.setItem('challenge_roulette_done', 'true');
    checkBingoChallenges();
    
    const wheelDisc = document.getElementById('roulette-wheel-disc');
    const spinBtn = document.getElementById('roulette-spin-btn');
    const resultBox = document.getElementById('roulette-result-box');
    const filterSelect = document.getElementById('roulette-filter-select');
    
    if (resultBox) resultBox.style.display = 'none';
    if (spinBtn) spinBtn.disabled = true;
    
    // Add random spin rotation
    const extraSpins = 5 + Math.floor(Math.random() * 5); // 5 to 9 full spins
    const targetDeg = extraSpins * 360 + Math.floor(Math.random() * 360);
    rouletteRotation += targetDeg;
    
    if (wheelDisc) {
        wheelDisc.style.transform = `rotate(${rouletteRotation}deg)`;
    }
    
    // Determine target pool and prepare selection asynchronously during the spin animation
    const filterVal = filterSelect ? filterSelect.value : 'all';
    rouletteSelectedMovie = null;
    rouletteFetchPromise = null;
    
    if (filterVal === 'online') {
        // Random page from 1 to 5 to fetch a diverse set of horror movies
        const randomPage = Math.floor(Math.random() * 5) + 1;
        rouletteFetchPromise = TMDB.getPopularHorrorMovies(randomPage)
            .then(data => {
                if (data && data.results && data.results.length > 0) {
                    const randomIndex = Math.floor(Math.random() * data.results.length);
                    rouletteSelectedMovie = data.results[randomIndex];
                    rouletteSelectedMovie.isFallback = false;
                } else {
                    throw new Error("Empty online results");
                }
            })
            .catch(err => {
                console.error("Error fetching online horror movies for roulette:", err);
                const pool = featuredMovies.length > 0 ? featuredMovies : FALLBACK_POPULAR_MOVIES;
                rouletteSelectedMovie = pool[Math.floor(Math.random() * pool.length)];
                rouletteSelectedMovie.isFallback = true;
            });
    } else {
        const collection = Storage.getCollection();
        let pool = [];
        let isFallback = false;
        
        if (filterVal === 'watched') {
            pool = collection.filter(m => m.watchStatus === 'watched');
            if (pool.length === 0) {
                isFallback = true;
                pool = featuredMovies.length > 0 ? featuredMovies : FALLBACK_POPULAR_MOVIES;
            }
        } else if (filterVal === 'watchlist') {
            pool = collection.filter(m => m.watchStatus === 'watchlist' || m.watchStatus === 'watching');
            if (pool.length === 0) {
                isFallback = true;
                pool = featuredMovies.length > 0 ? featuredMovies : FALLBACK_POPULAR_MOVIES;
            }
        } else {
            pool = collection;
            if (pool.length === 0) {
                isFallback = true;
                pool = featuredMovies.length > 0 ? featuredMovies : FALLBACK_POPULAR_MOVIES;
            }
        }
        
        const selectedMovie = pool[Math.floor(Math.random() * pool.length)];
        rouletteSelectedMovie = selectedMovie;
        if (rouletteSelectedMovie) {
            rouletteSelectedMovie.isFallback = isFallback;
        }
        rouletteFetchPromise = Promise.resolve();
    }
    
    // Heartbeat Sound Acceleration/Deceleration Synthesis
    let baseInterval = 600; // ms
    let timeElapsed = 0;
    const duration = 4000; // ms (matches CSS transition)
    
    const playTick = async () => {
        if (timeElapsed >= duration) {
            // Spin ended, wait for network if online fetching
            if (rouletteFetchPromise) {
                try {
                    await rouletteFetchPromise;
                } catch (e) {
                    console.error("Error waiting for roulette fetch promise:", e);
                }
            }
            isRouletteSpinning = false;
            if (spinBtn) spinBtn.disabled = false;
            revealRouletteResult();
            return;
        }
        
        let progress = timeElapsed / duration; // 0 to 1
        let currentInterval;
        if (progress < 0.4) {
            // Accelerate: interval decreases
            currentInterval = baseInterval - (baseInterval - 150) * (progress / 0.4);
        } else {
            // Decelerate: interval increases
            currentInterval = 150 + (baseInterval - 150) * ((progress - 0.4) / 0.6);
        }
        
        const rateFactor = 600 / currentInterval;
        SoundscapeEngine.playHeartbeatSFX(rateFactor, 0.4 + 0.3 * (rateFactor - 1));
        
        timeElapsed += currentInterval;
        setTimeout(playTick, currentInterval);
    };
    
    playTick();
}

async function revealRouletteResult() {
    const resultBox = document.getElementById('roulette-result-box');
    const resultTitle = document.getElementById('roulette-result-title');
    const resultPoster = document.getElementById('roulette-result-poster');
    const resultDesc = document.getElementById('roulette-result-desc');
    const goToMovieBtn = document.getElementById('roulette-go-to-movie');
    const filterSelect = document.getElementById('roulette-filter-select');
    
    if (!resultBox || !resultTitle || !resultPoster || !resultDesc) return;
    if (!rouletteSelectedMovie) return;
    
    rouletteSelectedMovieId = rouletteSelectedMovie.id;
    SoundscapeEngine.playModalOpenSFX();
    
    resultTitle.textContent = rouletteSelectedMovie.title;
    
    const filterVal = filterSelect ? filterSelect.value : 'all';
    let overview = rouletteSelectedMovie.overview || 'ชะตากรรมนี้ช่างน่าสะพรึงกลัวจนไม่อาจเอ่ยปากบรรยายเรื่องย่อได้...';
    
    if (rouletteSelectedMovie.isFallback) {
        if (filterVal === 'online') {
            overview = `⚠️ (เครือข่ายขัดข้อง ไม่สามารถดึงข้อมูลออนไลน์ได้ ระบบจึงสุ่มจากหนังแนะนำแทน) 🩸\n\n` + overview;
        } else if (filterVal !== 'all') {
            const typeText = filterVal === 'watched' ? 'ที่ดูแล้ว' : 'ที่อยากดู';
            overview = `⚠️ (ไม่พบหนัง${typeText}ในคอลเล็กชันของคุณ ระบบจึงสุ่มจากหนังยอดนิยมแทน) 🩸\n\n` + overview;
        }
    } else if (filterVal === 'online') {
        overview = `🌐 (สุ่มสำเร็จจากหนังสยองขวัญแนะนำทั้งหมดบน TMDB) 🩸\n\n` + overview;
    }
    
    resultDesc.textContent = overview;
    
    if (rouletteSelectedMovie.poster_path) {
        resultPoster.src = TMDB.getImageUrl(rouletteSelectedMovie.poster_path, 'w92');
        resultPoster.style.display = 'block';
    } else {
        resultPoster.style.display = 'none';
    }
    
    resultBox.style.display = 'block';
    
    if (goToMovieBtn) {
        const newBtn = goToMovieBtn.cloneNode(true);
        goToMovieBtn.parentNode.replaceChild(newBtn, goToMovieBtn);
        newBtn.addEventListener('click', () => {
            const rouletteModal = document.getElementById('roulette-modal');
            if (rouletteModal) rouletteModal.classList.remove('active');
            openMovieModal(rouletteSelectedMovie.id);
        });
    }
}

// --- SPOOKY TAROT RECOMMENDATIONS LOGIC ---
// --- SPOOKY TAROT RECOMMENDATIONS LOGIC ---
const TAROT_CARDS = [
    // Slot 0: Vibe
    [
        { name: 'The Slasher (ฆาตกรสยอง)', icon: '🔪', vibe: 'slasher', desc: 'มีดสปาต้าที่สะท้อนแสงจันทร์... ค่ำคืนนี้จิตวิญญาณของคุณโหยหาการไล่ล่าและคราบเลือดกระเซ็น' },
        { name: 'The Spectre (วิญญาณหลอน)', icon: '👻', vibe: 'ghost', desc: 'เสียงกระซิบไร้ที่มาในความเงียบ... ค่ำคืนนี้บ้านผีสิงและวิญญาณพยาบาทจะตามรังควานคุณ' },
        { name: 'The Beast (อสูรกายกระหายเลือด)', icon: '👹', vibe: 'beast', desc: 'กรงเล็บและเขี้ยวแหลมคมในเงามืด... ค่ำคืนนี้คุณต้องเผชิญกับสัตว์ร้ายที่ไม่มีมนุษยธรรม' },
        { name: 'The Occult (ลัทธิมรณะ)', icon: '🔮', vibe: 'occult', desc: 'สัญลักษณ์ดาวห้าแฉกและมนต์ดำ... ค่ำคืนนี้ปีศาจโบราณและการสิงสู่ทางจิตวิญญาณจะครอบงำคุณ' },
        { name: 'The Curse (คำสาปมรณะ)', icon: '☠️', vibe: 'curse', desc: 'ค่ำคืนนี้จิตวิญญาณของคุณจมดิ่งในความสิ้นหวังของวัตถุต้องสาป วิดีโอมรณะ และคำสาปส่งต่อไม่สิ้นสุด' },
        { name: 'The Madness (วิปลาสหลอนประสาท)', icon: '🧠', vibe: 'psychological', desc: 'จิตใจที่แตกเป็นเสี่ยงๆ... ค่ำคืนนี้ความหลอนแนวไซโควิทยาและการหักมุมจิตวิปริตจะเล่นงานสมองของคุณ' }
    ],
    // Slot 1: Era
    [
        { name: 'Classic Era (สุสานโบราณ)', icon: '⏳', era: 'classic', desc: 'เศษฟิล์มสีซีดจางและกลิ่นอายความสยองรุ่นเก๋า (ก่อนปี 1990)' },
        { name: 'Gothic Nineties (ทศวรรษแห่งเลือด)', icon: '🕯️', era: 'nineties', desc: 'เสียงเพลงกรันจ์และเรื่องเล่าสยองยุค 90s (1990 - 1999)' },
        { name: 'Modern Plague (ศตวรรษใหม่)', icon: '📱', era: 'modern', desc: 'กล้องวิดีโอแฮนดีแคมและอินเทอร์เน็ตความเร็วสูง (2000 - 2015)' },
        { name: 'Apocalypse Now (วันสิ้นโลกปัจจุบัน)', icon: '💥', era: 'apocalypse', desc: 'ภาพสยองระดับ 4K และชะตากรรมร่วมสมัย (ปี 2016 ขึ้นไป)' }
    ],
    // Slot 2: Fate
    [
        { name: 'Survived (ผู้รอดชีวิต)', icon: '🟢', fate: 'survived', desc: 'ดวงชะตาแข็งแกร่ง คุณจะค้นพบแสงสว่างที่ปลายอุโมงค์ (แนะนำหนังเกรดดี คะแนนสูง 7+)' },
        { name: 'Deceased (เหยื่อสังเวย)', icon: '🔴', fate: 'deceased', desc: 'ชะตากรรมขาดสะบั้น คุณตกเป็นอาหารของความกลัว (แนะนำหนังบีเกรดสยองขวัญสุดโต่ง คะแนนต่ำกว่า 6)' },
        { name: 'Possessed (ร่างทรงปีศาจ)', icon: '💀', fate: 'possessed', desc: 'จิตใจถูกแทรกซึมด้วยความคลั่ง คุณกลายเป็นผู้สืบทอดคำสาป (แนะนำหนังสไตล์ไซโค/หักมุม คะแนนปานกลาง 6-7)' },
        { name: 'Cursed (ผู้ต้องคำสาปแช่ง)', icon: '🥀', fate: 'cursed', desc: 'ชะตาของคุณจะถูกดึงดูดเข้าสู่ห้วงลึกของความกดดันอันบิดเบี้ยว (แนะนำภาพยนตร์ที่น่าอึดอัด ชวนประสาทเสีย)' }
    ]
];

let drawnTarotCards = [null, null, null];

function updateTarotLunarPower() {
    const phase = getSpookyMoonPhase();
    const phaseNames = [
        "จันทร์ดับมืดมิด (New Moon) 🌑",
        "จันทร์เสี้ยวแรก (Waxing Crescent) 🌒",
        "จันทร์ครึ่งดวงแรก (First Quarter) 🌓",
        "จันทร์เกือบเพ็ญ (Waxing Gibbous) 🌔",
        "จันทร์เพ็ญเต็มดวง (Full Moon) 🌕",
        "จันทร์เสี้ยวข้างแรม (Waning Gibbous) 🌖",
        "จันทร์ครึ่งดวงหลัง (Third Quarter) 🌗",
        "จันทร์เสี้ยวสุดท้าย (Waning Crescent) 🌘"
    ];
    const spookyIndices = [95, 50, 65, 75, 99, 70, 60, 55];
    
    let phaseName = phaseNames[phase];
    let index = spookyIndices[phase];
    
    if (phase === 4) {
        const hr = new Date().getHours();
        if (hr >= 18 || hr < 4) {
            phaseName = "จันทร์โลหิตสีเลือด (Blood Moon) 🩸";
            index = 100;
        }
    }
    
    const nameEl = document.getElementById('tarot-lunar-phase-name');
    const valEl = document.getElementById('tarot-lunar-spooky-val');
    
    if (nameEl) nameEl.textContent = phaseName;
    if (valEl) valEl.textContent = `${index}%`;
}

function handleTarotCardClick(cardIndex) {
    if (drawnTarotCards[cardIndex] !== null) return;
    
    const cardsPool = TAROT_CARDS[cardIndex];
    const randomIndex = Math.floor(Math.random() * cardsPool.length);
    const selectedCard = cardsPool[randomIndex];
    
    drawnTarotCards[cardIndex] = selectedCard;
    
    const nameEl = document.getElementById(`tarot-name-${cardIndex}`);
    const iconEl = document.getElementById(`tarot-icon-${cardIndex}`);
    
    if (nameEl) nameEl.textContent = selectedCard.name;
    if (iconEl) iconEl.textContent = selectedCard.icon;
    
    SoundscapeEngine.playClickSFX();
    
    const cardInner = document.getElementById(`tarot-card-${cardIndex}`);
    if (cardInner) {
        cardInner.classList.add('flipped');
    }
    
    const allDrawn = drawnTarotCards.every(c => c !== null);
    const revealBtn = document.getElementById('tarot-reveal-btn');
    if (revealBtn) {
        revealBtn.disabled = !allDrawn;
    }
}

async function revealTarotPrediction() {
    const allDrawn = drawnTarotCards.every(c => c !== null);
    if (!allDrawn) return;
    
    SoundscapeEngine.playLowDroneSFX();
    
    localStorage.setItem('challenge_tarot_done', 'true');
    checkBingoChallenges();
    
    const predictionTextEl = document.getElementById('tarot-prediction-text');
    const resultBox = document.getElementById('tarot-result-box');
    const suggestionsContainer = document.getElementById('tarot-movies-suggestions');
    const revealBtn = document.getElementById('tarot-reveal-btn');
    
    if (!predictionTextEl || !resultBox || !suggestionsContainer || !revealBtn) return;
    
    revealBtn.disabled = true;
    predictionTextEl.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> กำลังสื่อสารกับมิติลี้ลับเพื่อนำคำทำนายมาให้คุณ...';
    resultBox.style.display = 'block';
    suggestionsContainer.innerHTML = '<div style="grid-column: span 3; text-align: center; padding: 1rem; color: var(--text-dark);"><i class="fa-solid fa-circle-notch fa-spin"></i> กำลังอัญเชิญคำแนะนำภาพยนตร์...</div>';
    
    const cardVibe = drawnTarotCards[0];
    const cardEra = drawnTarotCards[1];
    const cardFate = drawnTarotCards[2];
    
    const phase = getSpookyMoonPhase();
    const phaseNames = [
        "จันทร์ดับมืดมิด (New Moon)",
        "จันทร์เสี้ยวแรก (Waxing Crescent)",
        "จันทร์ครึ่งดวงแรก (First Quarter)",
        "จันทร์เกือบเพ็ญ (Waxing Gibbous)",
        "จันทร์เพ็ญเต็มดวง (Full Moon)",
        "จันทร์เสี้ยวข้างแรม (Waning Gibbous)",
        "จันทร์ครึ่งดวงหลัง (Third Quarter)",
        "จันทร์เสี้ยวสุดท้าย (Waning Crescent)"
    ];
    const lunarInfluences = [
        "ค่ำคืนนี้ตรงกับจันทร์ดับ พลังงานวิปริตอันหนาแน่นเหนี่ยวนำความมืดมิดและเรื่องลี้ลับลึกเกินหยั่งถึง!",
        "พลังแห่งแสงจันทร์เสี้ยวแรกเฉือนขอบฟ้า เผยให้เห็นร่องรอยการหลั่งเลือดและการเอาชีวิตรอด!",
        "ดวงจันทร์ครึ่งซีกกำลังดึงดูดวิญญาณคนบาปจากเงามืด ระวังภัยเร้นลับในมุมอับสายตา!",
        "อิทธิพลของจันทร์เกือบเพ็ญแผ่กระจายขยายความคลั่ง ความวิปลาสทางจิตใจกำลังก่อตัว!",
        "จันทร์เพ็ญเต็มดวงสว่างวาบขีดสุด! พลังความตายและคราบเลือดไหลนองสาดส่องชะตากรรมสยองขวัญ!",
        "เศษเสี้ยวแรงดึงดูดช่วงจันทร์แรม คลื่นความกลัวและความกดดันก้าวเข้ามาครอบงำจิตวิญญาณ!",
        "ครึ่งเดือนหลังแห่งการชำระบาป คืนนี้สัตว์ร้ายในเงามืดกำลังโหยหากลิ่นคาวเลือดของคุณ!",
        "แสงจันทร์เสี้ยวสุดท้ายที่กำลังจะจางหาย... สัญญาณสุดท้ายเตือนให้ระวังความกลัวในจิตใจลึกสุดตัว!"
    ];

    let currentPhaseName = phaseNames[phase];
    if (phase === 4) {
        const hr = new Date().getHours();
        if (hr >= 18 || hr < 4) {
            currentPhaseName = "จันทร์โลหิตสีเลือด (Blood Moon) 🩸";
        }
    }
    
    const lunarInfluence = lunarInfluences[phase];
    
    const predictionHtml = `
        <div style="margin-bottom: 1rem; border-bottom: 1px dashed rgba(139, 92, 246, 0.2); padding-bottom: 0.75rem;">
            <span style="font-size: 0.75rem; color: #a78bfa; text-transform: uppercase; font-weight: 700; display: block; margin-bottom: 0.25rem;"><i class="fa-solid fa-moon"></i> อิทธิพลจากฤทธิ์จันทร์: ${currentPhaseName}</span>
            <span style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4; display: block;">${lunarInfluence}</span>
        </div>
        <div>
            <span style="font-size: 0.75rem; color: #c084fc; text-transform: uppercase; font-weight: 700; display: block; margin-bottom: 0.4rem;"><i class="fa-solid fa-wand-magic-sparkles"></i> คำทำนายการเปิดไพ่:</span>
            <p style="font-size: 0.82rem; color: var(--text-primary); line-height: 1.5; margin: 0 0 0.5rem 0;">
                คุณจับได้ไพ่ <strong>${cardVibe.name}</strong> ${cardVibe.icon} - "${cardVibe.desc}"
            </p>
            <p style="font-size: 0.82rem; color: var(--text-primary); line-height: 1.5; margin: 0 0 0.5rem 0;">
                ซึ่งสั่นพ้องกับประตูมิติเวลาของ <strong>${cardEra.name}</strong> ${cardEra.icon} - "${cardEra.desc}"
            </p>
            <p style="font-size: 0.82rem; color: var(--text-primary); line-height: 1.5; margin: 0;">
                และโชคชะตาครั้งนี้สิ้นสุดที่ <strong>${cardFate.name}</strong> ${cardFate.icon} - "${cardFate.desc}"
            </p>
        </div>
    `;
    predictionTextEl.innerHTML = predictionHtml;
    
    // Dynamic styling of resultBox based on drew cardVibe
    if (cardVibe.vibe === 'slasher') {
        resultBox.style.borderColor = 'rgba(239, 68, 68, 0.4)';
        resultBox.style.background = 'rgba(239, 68, 68, 0.08)';
    } else if (cardVibe.vibe === 'ghost') {
        resultBox.style.borderColor = 'rgba(59, 130, 246, 0.4)';
        resultBox.style.background = 'rgba(59, 130, 246, 0.08)';
    } else if (cardVibe.vibe === 'beast') {
        resultBox.style.borderColor = 'rgba(249, 115, 22, 0.4)';
        resultBox.style.background = 'rgba(249, 115, 22, 0.08)';
    } else if (cardVibe.vibe === 'occult') {
        resultBox.style.borderColor = 'rgba(139, 92, 246, 0.4)';
        resultBox.style.background = 'rgba(139, 92, 246, 0.08)';
    } else if (cardVibe.vibe === 'curse') {
        resultBox.style.borderColor = 'rgba(16, 185, 129, 0.4)';
        resultBox.style.background = 'rgba(16, 185, 129, 0.08)';
    } else if (cardVibe.vibe === 'psychological') {
        resultBox.style.borderColor = 'rgba(236, 72, 153, 0.4)';
        resultBox.style.background = 'rgba(236, 72, 153, 0.08)';
    }
    
    const params = {
        with_genres: '27',
        page: 1
    };
    
    if (cardVibe.vibe === 'slasher') params.with_genres = '27,53';
    else if (cardVibe.vibe === 'ghost') params.with_genres = '27,9648';
    else if (cardVibe.vibe === 'beast') params.with_genres = '27,878';
    else if (cardVibe.vibe === 'occult') params.with_genres = '27,14';
    else if (cardVibe.vibe === 'curse') params.with_genres = '27,9648';
    else if (cardVibe.vibe === 'psychological') params.with_genres = '27,53';
    
    if (cardEra.era === 'classic') {
        params['primary_release_date.lte'] = '1989-12-31';
    } else if (cardEra.era === 'nineties') {
        params['primary_release_date.gte'] = '1990-01-01';
        params['primary_release_date.lte'] = '1999-12-31';
    } else if (cardEra.era === 'modern') {
        params['primary_release_date.gte'] = '2000-01-01';
        params['primary_release_date.lte'] = '2015-12-31';
    } else if (cardEra.era === 'apocalypse') {
        params['primary_release_date.gte'] = '2016-01-01';
    }
    
    try {
        const response = await TMDB.fetchFromTMDB('/discover/movie', params);
        let movies = response.results || [];
        
        if (cardFate.fate === 'survived') {
            movies = movies.filter(m => m.vote_average >= 7.0);
        } else if (cardFate.fate === 'deceased') {
            movies = movies.filter(m => m.vote_average < 6.0);
        } else if (cardFate.fate === 'possessed') {
            movies = movies.filter(m => m.vote_average >= 6.0 && m.vote_average < 7.0);
        } else if (cardFate.fate === 'cursed') {
            movies = movies.filter(m => m.vote_average >= 5.5 && m.vote_average < 6.8);
        }
        
        if (movies.length < 3) {
            movies = response.results || [];
        }
        if (movies.length < 3) {
            movies = FALLBACK_POPULAR_MOVIES;
        }
        
        const selected = movies.slice(0, 3);
        suggestionsContainer.innerHTML = '';
        selected.forEach(movie => {
            const movieItem = document.createElement('div');
            movieItem.className = 'actor-movie-item';
            movieItem.style.flexDirection = 'column';
            movieItem.style.padding = '0.5rem';
            movieItem.style.textAlign = 'center';
            movieItem.style.gap = '0.5rem';
            
            const posterPath = movie.poster_path ? TMDB.getImageUrl(movie.poster_path, 'w92') : 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=92&auto=format&fit=crop';
            
            movieItem.innerHTML = `
                <img src="${posterPath}" class="actor-movie-poster" style="width: 65px; height: 95px; margin: 0 auto;" alt="${movie.title}">
                <div class="actor-movie-title" style="font-size: 0.8rem; height: 32px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">${movie.title}</div>
                <div style="font-size: 0.7rem; color: var(--primary);"><i class="fa-solid fa-star"></i> TMDB ${movie.vote_average ? movie.vote_average.toFixed(1) : '-.-'}</div>
            `;
            
            movieItem.addEventListener('click', () => {
                const tarotModal = document.getElementById('tarot-modal');
                if (tarotModal) tarotModal.classList.remove('active');
                openMovieModal(movie.id);
            });
            suggestionsContainer.appendChild(movieItem);
        });
        
    } catch (err) {
        console.error("Tarot recommendation error:", err);
        suggestionsContainer.innerHTML = '';
        const offlineMovies = FALLBACK_POPULAR_MOVIES.slice(0, 3);
        offlineMovies.forEach(movie => {
            const movieItem = document.createElement('div');
            movieItem.className = 'actor-movie-item';
            movieItem.style.flexDirection = 'column';
            movieItem.style.padding = '0.5rem';
            movieItem.style.textAlign = 'center';
            movieItem.style.gap = '0.5rem';
            
            movieItem.innerHTML = `
                <img src="${TMDB.getImageUrl(movie.poster_path, 'w92')}" class="actor-movie-poster" style="width: 65px; height: 95px; margin: 0 auto;" alt="${movie.title}">
                <div class="actor-movie-title" style="font-size: 0.8rem; height: 32px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">${movie.title}</div>
                <div style="font-size: 0.7rem; color: var(--primary);"><i class="fa-solid fa-star"></i> TMDB ${movie.vote_average ? movie.vote_average.toFixed(1) : '-.-'}</div>
            `;
            
            movieItem.addEventListener('click', () => {
                const tarotModal = document.getElementById('tarot-modal');
                if (tarotModal) tarotModal.classList.remove('active');
                openMovieModal(movie.id);
            });
            suggestionsContainer.appendChild(movieItem);
        });
    }
}

function resetTarotModal() {
    drawnTarotCards = [null, null, null];
    for (let i = 0; i < 3; i++) {
        const cardInner = document.getElementById(`tarot-card-${i}`);
        if (cardInner) {
            cardInner.classList.remove('flipped');
        }
    }
    setTimeout(() => {
        for (let i = 0; i < 3; i++) {
            const nameEl = document.getElementById(`tarot-name-${i}`);
            const iconEl = document.getElementById(`tarot-icon-${i}`);
            if (nameEl) nameEl.textContent = '-';
            if (iconEl) iconEl.textContent = '💀';
        }
    }, 400);
    
    const resultBox = document.getElementById('tarot-result-box');
    if (resultBox) resultBox.style.display = 'none';
    
    const revealBtn = document.getElementById('tarot-reveal-btn');
    if (revealBtn) {
        revealBtn.disabled = true;
    }
    SoundscapeEngine.playClickSFX();
}

// --- HORROR BINGO LOGIC ---
const BINGO_CHALLENGES = [
    { id: 0, title: 'วิญญาณฝึกหัด', desc: 'สะสมหนังสยอง 3+ เรื่อง', icon: '👻', check: (col) => col.length >= 3 },
    { id: 1, title: 'นักเขียนอเวจี', desc: 'เขียนรีวิวหนัง 1+ เรื่อง', icon: '🖋️', check: (col) => col.some(m => m.review && m.review.trim().length > 0) },
    { id: 2, title: 'สุสานคลาสสิก', desc: 'สะสมหนังสยองก่อนปี 1990', icon: '⏳', check: (col) => col.some(m => {
        if (!m.release_date) return false;
        const year = parseInt(m.release_date.split('-')[0], 10);
        return year < 1990;
    }) },
    { id: 3, title: 'ผู้ท้าทายความตาย', desc: 'เล่นวงล้อเสี่ยงชะตากรรม', icon: '🎡', check: () => localStorage.getItem('challenge_roulette_done') === 'true' },
    { id: 4, title: 'ทาโรต์นำทาง', desc: 'เล่นทำนายดวงไพ่ทาโรต์', icon: '🔮', check: () => localStorage.getItem('challenge_tarot_done') === 'true' },
    { id: 5, title: 'จิตวิเคราะห์', desc: 'เปิดดูการวิเคราะห์ความหลอน', icon: '📊', check: () => localStorage.getItem('challenge_analytics_done') === 'true' },
    { id: 6, title: 'รอดชีวิตแน่แท้', desc: 'บันทึกสถานะ "Survived"', icon: '🟢', check: (col) => col.some(m => m.survivalStatus === 'survived') },
    { id: 7, title: 'นักบันทึกคืนหลอน', desc: 'เขียนประวัติรอดชีวิต/ตาย', icon: '📝', check: (col) => col.some(m => m.survivalNote && m.survivalNote.trim().length > 0) },
    { id: 8, title: 'ทาสเสียงหลอน', desc: 'กดเสียงในซาวด์บอร์ดครบ', icon: '🎵', check: () => {
        const clicked = JSON.parse(localStorage.getItem('soundboard_clicks_history') || '[]');
        return clicked.length >= 6;
    } }
];

function renderBingoGrid() {
    const gridWrapper = document.getElementById('bingo-grid-wrapper');
    if (!gridWrapper) return;
    
    gridWrapper.innerHTML = '';
    const collection = Storage.getCollection();
    const results = BINGO_CHALLENGES.map(ch => ch.check(collection));
    
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    
    let isBingo = false;
    lines.forEach(line => {
        if (line.every(idx => results[idx])) {
            isBingo = true;
        }
    });
    
    if (isBingo) {
        localStorage.setItem('achievement_bingo_completed', 'true');
        const banner = document.getElementById('bingo-completed-banner');
        if (banner) banner.style.display = 'block';
    } else {
        const banner = document.getElementById('bingo-completed-banner');
        if (banner) banner.style.display = 'none';
    }
    
    BINGO_CHALLENGES.forEach((ch, idx) => {
        const isCompleted = results[idx];
        const cell = document.createElement('div');
        cell.className = `bingo-cell ${isCompleted ? 'completed' : ''}`;
        
        cell.innerHTML = `
            <div class="bingo-icon">${ch.icon}</div>
            <div class="bingo-title">${ch.title}</div>
            <div style="font-size: 0.62rem; color: var(--text-dark); margin-top: 0.15rem;">${ch.desc}</div>
        `;
        
        cell.addEventListener('click', () => {
            SoundscapeEngine.playClickSFX();
            alert(`ภารกิจ "${ch.title}": ${ch.desc}\nสถานะ: ${isCompleted ? '🟢 สำเร็จแล้ว' : '🔴 ยังไม่สำเร็จ'}`);
        });
        
        gridWrapper.appendChild(cell);
    });
}

function checkBingoChallenges() {
    const bingoModal = document.getElementById('bingo-modal');
    if (bingoModal && bingoModal.classList.contains('active')) {
        renderBingoGrid();
    }
    
    const collection = Storage.getCollection();
    const results = BINGO_CHALLENGES.map(ch => ch.check(collection));
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    const isBingo = lines.some(line => line.every(idx => results[idx]));
    if (isBingo) {
        localStorage.setItem('achievement_bingo_completed', 'true');
    }
}

// --- SURVIVAL LOG LOGIC ---
function saveMovieSurvivalLog() {
    if (!selectedMovieData || isSharedProfileMode) return;
    
    SoundscapeEngine.playClickSFX();
    
    const statusSelect = document.getElementById('survival-status-select');
    const noteText = document.getElementById('survival-note-text');
    if (!statusSelect || !noteText) return;
    
    const statusVal = statusSelect.value;
    const noteVal = noteText.value.trim();
    
    let savedMovie = Storage.getMovieFromCollection(selectedMovieData.id);
    if (!savedMovie) {
        savedMovie = {
            id: selectedMovieData.id,
            title: selectedMovieData.title,
            poster_path: selectedMovieData.poster_path,
            backdrop_path: selectedMovieData.backdrop_path,
            release_date: selectedMovieData.release_date,
            vote_average: selectedMovieData.vote_average,
            runtime: selectedMovieData.runtime,
            genres: selectedMovieData.genres ? selectedMovieData.genres.map(g => g.id) : [],
            production_countries: selectedMovieData.production_countries ? selectedMovieData.production_countries.map(c => c.iso_3166_1) : [],
            watchStatus: 'watchlist',
            personalRating: null,
            review: ''
        };
    }
    
    savedMovie.survivalStatus = statusVal;
    savedMovie.survivalNote = noteVal;
    
    Storage.saveMovie(savedMovie);
    
    updateStatsDashboard();
    if (activeTab === 'collection') {
        renderMyCollection();
    } else {
        updateMovieCardsInDOM(savedMovie.id);
    }
    
    checkBingoChallenges();
    
    alert('บันทึกชะตากรรมความสยองเรียบร้อยแล้ว! 🩸');
}

// --- HORROR QUIZ LOGIC ---
const QUIZ_QUESTIONS = [
    {
        question: "1. คุณได้ยินเสียงแปลก ๆ จากห้องใต้ดินในบ้านร้างที่มาเที่ยวพักผ่อน คุณจะ...",
        options: [
            { text: "เดินลงไปดูพร้อมหยิบมีดสลักกล้วยไม้ติดมือไปด้วย", type: "skeptic" },
            { text: "วิ่งขึ้นรถแล้วล็อคประตูสตาร์ทเครื่องยนต์ไว้ก่อนเลย", type: "final_girl" },
            { text: "ตรวจสอบระบบสวิตช์ไฟและศึกษาโครงสร้างชั้นใต้ดินก่อนขยับตัว", type: "nerd" },
            { text: "แสร้งยิ้มในเงามืดแล้วเดินไปดักรอคนอื่นที่หลังประตูห้องใต้ดิน", type: "secret_killer" }
        ]
    },
    {
        question: "2. ถ้าคุณต้องเลือกเพื่อนร่วมกลุ่มเพื่อหนีภัยซอมบี้คลั่ง 1 คน คุณจะเลือก...",
        options: [
            { text: "คนที่แข็งแกร่ง บ้าระห่ำ วิ่งเร็วที่สุด เพื่อเป็นโล่กำบัง", type: "skeptic" },
            { text: "คนที่สุขุม เตรียมแผนสำรองเสมอ และรักกลุ่มรักพวกพ้อง", type: "final_girl" },
            { text: "เพื่อนเนิร์ดที่พกคู่มือการเอาชีวิตรอดจากซอมบี้มาด้วย", type: "nerd" },
            { text: "ไม่เลือกใครเลย ยิ่งเพื่อนร่วมทางน้อย อัตราการรอดและอาหารยิ่งเพิ่มขึ้น", type: "secret_killer" }
        ]
    },
    {
        question: "3. เมื่อฆาตกรสวมหน้ากากลึกลับโทรมาปั่นประสาทและตัดสายไฟบ้าน คุณจะ...",
        options: [
            { text: "ตะโกนด่าท้าทายผ่านโทรศัพท์แล้วเปิดประตูออกไปสู้ตรง ๆ", type: "skeptic" },
            { text: "ปีนหน้าต่างหนีไปซ่อนตัวเงียบ ๆ ในโรงเก็บของด้านหลัง", type: "final_girl" },
            { text: "รีบเช็คสัญญาณสื่อสารฉุกเฉินและพกอาวุธติดตัวทุกก้าว", type: "nerd" },
            { text: "หาชุดคลุมสีดำแบบเดียวกันมาสวมแล้วยืนนิ่งรอฆาตกรเข้ามาหา", type: "secret_killer" }
        ]
    },
    {
        question: "4. อาวุธชิ้นใดที่คุณจะหยิบขึ้นมาใช้ชิ้นแรกในยามฉุกเฉิน?",
        options: [
            { text: "ท่อเหล็กขึ้นสนิมท่อนหนา ๆ หนัก ๆ ฟาดแรงดิบ", type: "skeptic" },
            { text: "ไฟฉายกระบอกยาวและปืนลูกซองเก่าในตู้คุณพ่อ", type: "final_girl" },
            { text: "บทสวดปีศาจขจัดวิญญาณ เกลือเม็ด และน้ำมนต์ศักดิ์สิทธิ์", type: "nerd" },
            { text: "เลื่อยโซ่ไฟฟ้าแผดเสียงคลั่งหรือหน้าไม้ล่าสัตว์", type: "secret_killer" }
        ]
    },
    {
        question: "5. สำหรับคุณ อะไรคือสาเหตุที่คนส่วนใหญ่เอาตัวไม่รอดในหนังสยองขวัญ?",
        options: [
            { text: "ความซวย ดวงตก และไปเจอกับฆาตกรที่เก่งเกินไป", type: "skeptic" },
            { text: "การแตกตื่น วิ่งกระจัดกระจาย และสะดุดล้มง่ายๆ ในฉากหนี", type: "final_girl" },
            { text: "การฝ่าฝืนกฎ เช่น แยกย้ายกันค้นหา หรือท้าทายสิ่งลี้ลับ", type: "nerd" },
            { text: "การไว้วางใจคนที่ยืนยิ้มแปลก ๆ ข้างกายมากเกินไป", type: "secret_killer" }
        ]
    }
];

let quizCurrentQuestionIndex = 0;
let quizScores = { skeptic: 0, final_girl: 0, nerd: 0, secret_killer: 0 };
let quizSelectedArchetype = "";

function openQuizModal() {
    resetQuizState();
    if (quizModal) {
        quizModal.classList.add('active');
    }
}

function resetQuizState() {
    quizCurrentQuestionIndex = 0;
    quizScores = { skeptic: 0, final_girl: 0, nerd: 0, secret_killer: 0 };
    quizSelectedArchetype = "";
    
    if (quizStartState) quizStartState.style.display = 'block';
    if (quizQuestionsState) quizQuestionsState.style.display = 'none';
    if (quizResultState) quizResultState.style.display = 'none';
}

function startHorrorQuiz() {
    SoundscapeEngine.playClickSFX();
    if (quizStartState) quizStartState.style.display = 'none';
    if (quizQuestionsState) quizQuestionsState.style.display = 'block';
    showQuizQuestion();
}

function showQuizQuestion() {
    const qData = QUIZ_QUESTIONS[quizCurrentQuestionIndex];
    if (!qData) return;
    
    if (quizProgressText) {
        quizProgressText.textContent = `คำถามที่ ${quizCurrentQuestionIndex + 1}/${QUIZ_QUESTIONS.length}`;
    }
    if (quizProgressBar) {
        const percent = ((quizCurrentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100;
        quizProgressBar.style.width = `${percent}%`;
    }
    if (quizQuestionText) {
        quizQuestionText.textContent = qData.question;
    }
    
    if (quizOptionsList) {
        quizOptionsList.innerHTML = '';
        qData.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option';
            btn.innerHTML = `<span style="color: #a16207; font-weight: 700; margin-right: 0.35rem;">${String.fromCharCode(65 + idx)}.</span> ${opt.text}`;
            btn.addEventListener('click', () => handleQuizOptionSelect(opt.type));
            quizOptionsList.appendChild(btn);
        });
    }
}

function handleQuizOptionSelect(type) {
    SoundscapeEngine.playClickSFX();
    quizScores[type]++;
    
    quizCurrentQuestionIndex++;
    if (quizCurrentQuestionIndex < QUIZ_QUESTIONS.length) {
        showQuizQuestion();
    } else {
        calculateQuizResult();
    }
}

function calculateQuizResult() {
    if (quizQuestionsState) quizQuestionsState.style.display = 'none';
    if (quizResultState) quizResultState.style.display = 'block';
    
    // Find key with max score
    let maxScore = -1;
    let winner = "final_girl";
    for (const type in quizScores) {
        if (quizScores[type] > maxScore) {
            maxScore = quizScores[type];
            winner = type;
        }
    }
    
    quizSelectedArchetype = winner;
    
    let label = "";
    if (winner === "final_girl") label = "ผู้รอดชีวิตคนสุดท้าย (The Final Girl)";
    else if (winner === "nerd") label = "กูรูหนังสยอง (The Nerd)";
    else if (winner === "skeptic") label = "เหยื่อรายแรก (The Skeptic)";
    else if (winner === "secret_killer") label = "ฆาตกรที่ซ่อนอยู่ (The Secret Killer)";
    
    if (quizResultArchetype) {
        quizResultArchetype.textContent = label;
    }
    
    // Add special achievement flag
    localStorage.setItem('challenge_quiz_done', 'true');
    updateStatsDashboard();
    checkBingoChallenges();
    
    renderQuizCardCanvas();
}

function renderQuizCardCanvas() {
    if (!quizCardCanvas) return;
    
    const ctx = quizCardCanvas.getContext('2d');
    const w = quizCardCanvas.width;
    const h = quizCardCanvas.height;
    
    // Clean
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, w, h);
    
    // Draw blood splatters (abstract circle shadows)
    ctx.fillStyle = 'rgba(161, 98, 7, 0.05)';
    ctx.beginPath();
    ctx.arc(80, 200, 100, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 0, 60, 0.04)';
    ctx.beginPath();
    ctx.arc(380, 100, 120, 0, Math.PI*2);
    ctx.fill();
    
    // Draw gold borders
    ctx.strokeStyle = '#a16207';
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, w - 20, h - 20);
    
    ctx.strokeStyle = 'rgba(161, 98, 7, 0.25)';
    ctx.lineWidth = 1;
    ctx.strokeRect(15, 15, w - 30, h - 30);
    
    // Header text
    ctx.fillStyle = '#ff003c';
    ctx.font = 'bold 11px Courier New';
    ctx.fillText('MIDNIGHT SOCIETY PSYCHOLOGICAL PROFILE', 32, 42);
    
    // Divider
    ctx.fillStyle = '#a16207';
    ctx.fillRect(32, 50, w - 64, 2);
    
    // Archetype Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px "Outfit", "Inter", sans-serif';
    
    let title = "";
    let descLine1 = "";
    let descLine2 = "";
    let quote = "";
    
    if (quizSelectedArchetype === "final_girl") {
        title = "THE FINAL GIRL";
        descLine1 = "คุณคือสัญลักษณ์แห่งความอยู่รอด มีสติ สุขุม และรักพวกพ้อง";
        descLine2 = "คุณคอยประเมินความเสี่ยงและมีเจตจำนงรอดชีวิตสูงสุดเสมอ";
        quote = '"ฉันจะอยู่เพื่อเล่าขานสิ่งที่เกิดขื้นในมืดมิด"';
    } else if (quizSelectedArchetype === "nerd") {
        title = "THE HORROR NERD";
        descLine1 = "คุณรอบรู้ทุกกฎสัญชาตญาณของการเอาตัวรอดในภาพยนตร์ผี";
        descLine2 = "คุณพึ่งพาหลักการ สถิติ และความจำเพื่อขจัดภัยพาลลี้ลับ";
        quote = '"ข้อแรก ห้ามแยกจากกลุ่มเด็ดขาด... ถ้ายังไม่อยากตาย"';
    } else if (quizSelectedArchetype === "skeptic") {
        title = "THE SKEPTIC (FIRST VICTIM)";
        descLine1 = "คุณคือคนใจถึง พึ่งพาแรงดิบ ไม่เชื่อเรื่องวิญญาณสยอง";
        descLine2 = "แต่ความกล้าบ้าบิ่นไร้แผน มักนำคุณไปสู่ความตายคนแรก";
        quote = '"มันก็แค่เสียงกิ่งไม้กระทบหน้าต่างน่า... จะกลัวทำไม"';
    } else if (quizSelectedArchetype === "secret_killer") {
        title = "THE SECRET KILLER";
        descLine1 = "คุณฉลาดเป็นกรด แฝงตัวเงียบเชียบรอเวลาเผยโฉมเบื้องหลัง";
        descLine2 = "แท้จริงแล้วเกมล่าวิปริตทั้งหมดในบ้านร้างนี้เป็นแผนของคุณ";
        quote = '"ไม่มีใครหนีไปได้... เพราะฉันเป็นคนล็อคกุญแจโรงรถเอง"';
    }
    
    ctx.fillText(title, 32, 85);
    
    // Subtext details
    ctx.fillStyle = '#a16207';
    ctx.font = 'bold 10px Courier New';
    ctx.fillText('SUBJECT PROFILE (ชื่อผู้ทดสอบ):', 32, 122);
    
    // Owner name (defaults to settings-ticket-owner or 'LOUIS')
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Courier New';
    const ownerName = (localStorage.getItem('settings-ticket-owner') || 'LOUIS').toUpperCase();
    ctx.fillText(ownerName, 32, 142);
    
    // Description text
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px "Inter", sans-serif';
    ctx.fillText(descLine1, 32, 185);
    ctx.fillText(descLine2, 32, 205);
    
    // Quote
    ctx.fillStyle = '#ff003c';
    ctx.font = 'italic 11px "Inter", sans-serif';
    ctx.fillText(quote, 32, 240);
    
    // Spooky barcode details
    ctx.fillStyle = '#ffffff';
    const barcodeX = w - 150;
    const barcodeY = h - 60;
    const barcodeH = 26;
    const barPattern = [1, 2, 1, 3, 2, 1, 4, 1, 2, 1, 3, 2, 1];
    
    let curX = barcodeX;
    barPattern.forEach((widthVal, idx) => {
        ctx.fillStyle = idx % 2 === 0 ? '#a16207' : 'transparent';
        if (ctx.fillStyle !== 'transparent') {
            ctx.fillRect(curX, barcodeY, widthVal, barcodeH);
        }
        curX += widthVal + 1;
    });
    
    ctx.fillStyle = '#475569';
    ctx.font = '6px Courier New';
    ctx.fillText('DECISION-LOG: 99.666.13', w - 145, h - 25);
}

function downloadQuizCard() {
    if (!quizCardCanvas) return;
    
    SoundscapeEngine.playClickSFX();
    const link = document.createElement('a');
    link.download = `horror_profile_${quizSelectedArchetype}.png`;
    link.href = quizCardCanvas.toDataURL('image/png');
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// --- SPOOKY LUNAR ALMANAC LOGIC ---
// Calculates moon phase based on current date
function getSpookyMoonPhase() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    
    let y = year;
    let m = month;
    if (m < 3) {
        y--;
        m += 12;
    }
    m++;
    
    const c = 365.25 * y;
    const e = 30.6 * m;
    let jd = c + e + day - 694039.09; // Days since epoch
    jd /= 29.5305882; // Moon synodic cycle
    const b = parseInt(jd, 10);
    jd -= b;
    
    let phase = Math.round(jd * 8);
    if (phase >= 8) phase = 0;
    
    // 0=New Moon, 1=Waxing Crescent, 2=First Quarter, 3=Waxing Gibbous, 
    // 4=Full Moon, 5=Waning Gibbous, 6=Third Quarter, 7=Waning Crescent
    return phase;
}

function openAlmanacModal() {
    const phase = getSpookyMoonPhase();
    
    // Apply phase class on moon graphic
    if (almanacMoonGraphic) {
        almanacMoonGraphic.className = 'lunar-moon-body'; // Reset
        almanacMoonGraphic.classList.add(`phase-${phase}`);
        
        // Full Moon has a 25% chance of being a Blood Moon (based on hours/minutes just for fun)
        if (phase === 4) {
            const hr = new Date().getHours();
            if (hr >= 18 || hr < 4) { // Nighttime blood moon
                almanacMoonGraphic.classList.add('blood-moon');
            }
        }
    }
    
    let phaseName = "";
    let index = 45;
    let forecast = "";
    let genres = "";
    
    switch (phase) {
        case 0:
            phaseName = "จันทร์ดับมืดมิด (New Moon)";
            index = 95;
            forecast = "ไร้ซึ่งแสงจันทร์ชี้ทาง ประตูมิติดำมืดถูกแง้มอ้า พลังมนต์ดำ ความมืดมิด และการสิงสู่ทางวิญญาณจะทวีความรุนแรงขีดสุด!";
            genres = "👻 ภาพยนตร์แนววิญญาณหลอน (Ghost) / ลึกลับสืบสวน (Mystery) / แฟนตาซี (Fantasy)";
            break;
            
        case 1:
            phaseName = "จันทร์เสี้ยวแรก (Waxing Crescent)";
            index = 50;
            forecast = "เสี้ยวแสงดวงแรกสะท้อนภาพคมมีดในเงามืด ค่ำคืนนี้มีความเคลื่อนไหวแปลกๆ ในละแวกบ้าน ระวังเสียงเดินที่ระเบียงนอกห้อง!";
            genres = "🔪 ภาพยนตร์แนวระทึกขวัญ (Thriller) / ฆาตกรไล่ล่า (Slasher)";
            break;
            
        case 2:
            phaseName = "จันทร์ครึ่งดวงแรก (First Quarter)";
            index = 65;
            forecast = "ดวงจันทร์ถูกผ่าครึ่ง สะท้อนชะตากรรมที่แตกแยกของผู้คน คำสาปแฝงเร้นในวัตถุโบราณกำลังเริ่มทำงาน!";
            genres = "🔮 ภาพยนตร์แนวเหนือธรรมชาติ (Fantasy Horror) / มนต์ดำ";
            break;
            
        case 3:
            phaseName = "จันทร์เกือบเพ็ญ (Waxing Gibbous)";
            index = 80;
            forecast = "ดวงจันทร์ใกล้จะเต็มดวง พลังงานดิบและความคลั่งไคล้เริ่มพวยพุ่ง ค่ำคืนนี้จิตใจของผู้คนเปราะบางและสติหลุดลอยได้ง่าย";
            genres = "🧬 ภาพยนตร์แนวสยองไซไฟ (Sci-Fi Horror) / จิตวิทยาปั่นประสาท";
            break;
            
        case 4:
            phaseName = "จันทร์เพ็ญเต็มดวง (Full Moon)";
            // Check blood moon
            const isBlood = almanacMoonGraphic && almanacMoonGraphic.classList.contains('blood-moon');
            if (isBlood) {
                phaseName = "จันทร์โลหิตราตรีวิปลาส (Blood Full Moon)";
                index = 99;
                forecast = "⚠️ ราตรีนี้โลหิตนองฟ้า! คืนผีเดือดระดับวิกฤตสูงสุด ความบ้าคลั่งของสัตว์ร้ายและฆาตกรสวมหน้ากากเพิ่มกำลังไร้ขีดจำกัด ห้ามออกนอกเคหสถานเด็ดขาด!";
                genres = "🩸 ภาพยนตร์แนวโหดซาดิสต์ (Splatter) / อสูรกายกระหายเลือด (Beast)";
            } else {
                phaseName = "จันทร์เพ็ญสว่างจ้า (Full Moon)";
                index = 90;
                forecast = "แสงจันทร์สีทองแผ่ปกคลุมไปทั่ว ปลุกสัญชาตญาณสัตว์ป่าของอสูรกายให้ตื่นขึ้น เหล่าฆาตกรจิตวิปริตชอบล่าเหยื่อภายใต้ดวงจันทร์นี้";
                genres = "👹 ภาพยนตร์แนวสัตว์ร้าย (Beast) / ฆาตกรไล่ล่า (Slasher)";
            }
            break;
            
        case 5:
            phaseName = "จันทร์เกือบดับ (Waning Gibbous)";
            index = 75;
            forecast = "ดวงจันทร์กำลังแหว่งเว้า ความหวังริบหรี่ลงเรื่อย ๆ เหมาะสำหรับการดูหนังสไตล์เอาชีวิตรอดที่ตัวเอกต้องหนีสุดชีวิตในความมืด";
            genres = "🏃 ภาพยนตร์แนวเอาชีวิตรอด (Survival) / ซอมบี้คลั่ง";
            break;
            
        case 6:
            phaseName = "จันทร์ครึ่งดวงหลัง (Third Quarter)";
            index = 60;
            forecast = "ความสมดุลกำลังจางหาย ความมืดคืบคลานเข้ายึดครองพื้นที่ลึกขึ้น มีสัญญาณวิทยุและคลื่นประหลาดแผ่ผ่านโทรทัศน์ในห้องนอน";
            genres = "🛸 ภาพยนตร์แนวเอเลี่ยน/ไซไฟ (Sci-Fi Horror)";
            break;
            
        case 7:
            phaseName = "จันทร์เสี้ยวสุดท้าย (Waning Crescent)";
            index = 55;
            forecast = "เสี้ยวแสงสุดท้ายของวงรอบดาราศาสตร์ กำลังจะดับสิ้น อุณหภูมิลดฮวบลงเฉียบพลัน เสียงกระซิบและลมหนาวพัดโบกชวนหัวใจหยุดเต้น";
            genres = "👻 ภาพยนตร์แนววิญญาณหลอน (Ghost) / สยองปนตลก (Comedy Horror)";
            break;
    }
    
    if (almanacMoonPhaseName) almanacMoonPhaseName.textContent = phaseName;
    if (almanacSpookyIndexVal) almanacSpookyIndexVal.textContent = `${index}%`;
    if (almanacSpookyIndexBar) almanacSpookyIndexBar.style.width = `${index}%`;
    if (almanacForecastText) almanacForecastText.textContent = forecast;
    if (almanacRecGenres) almanacRecGenres.textContent = genres;
    
    // Sync ambient light button text
    const activeAmbient = localStorage.getItem('settings-lunar-ambient-active') === 'true';
    updateLunarAmbientButtonUI(activeAmbient);
    
    if (almanacModal) {
        almanacModal.classList.add('active');
    }
    
    // Add challenge done
    localStorage.setItem('challenge_almanac_done', 'true');
    updateStatsDashboard();
    checkBingoChallenges();
}

function updateLunarAmbientButtonUI(isActive) {
    if (!almanacAmbientToggleBtn) return;
    if (isActive) {
        almanacAmbientToggleBtn.innerHTML = '<i class="fa-solid fa-lightbulb" style="color: var(--rating-star);"></i> ปิดใช้งานแสงจันทร์สลัว (Lunar Ambient On)';
        almanacAmbientToggleBtn.style.background = 'linear-gradient(135deg, #7f1d1d, #450a0a)';
    } else {
        almanacAmbientToggleBtn.innerHTML = '<i class="fa-solid fa-lightbulb"></i> เปิดใช้งานแสงจันทร์สลัว (Lunar Ambient Off)';
        almanacAmbientToggleBtn.style.background = 'linear-gradient(135deg, #1e293b, #0f172a)';
    }
}

function toggleLunarAmbientLight() {
    SoundscapeEngine.playClickSFX();
    
    const active = localStorage.getItem('settings-lunar-ambient-active') === 'true';
    const nextState = !active;
    
    localStorage.setItem('settings-lunar-ambient-active', nextState ? 'true' : 'false');
    updateLunarAmbientButtonUI(nextState);
    applyLunarAmbientToBody(nextState);
    updateStatsDashboard();
}

function applyLunarAmbientToBody(isActive) {
    document.body.classList.remove('lunar-ambient-crimson', 'lunar-ambient-indigo');
    
    if (isActive) {
        const phase = getSpookyMoonPhase();
        // New Moon (0), Waxing Gibbous (3), Full Moon (4) yokes crimson light
        if (phase === 0 || phase === 3 || phase === 4) {
            document.body.classList.add('lunar-ambient-crimson');
        } else {
            document.body.classList.add('lunar-ambient-indigo');
        }
    }
}

// Auto-run ambient light initialization on script load
const initLunarAmbient = localStorage.getItem('settings-lunar-ambient-active') === 'true';
applyLunarAmbientToBody(initLunarAmbient);


// --- MIDNIGHT TRIVIA GAME SYSTEM ---
const TRIVIA_DATABASE = [
    {
        emoji: "📞 🔪 😱",
        riddle: "โทรศัพท์ลึกลับ หน้ากากผี และกฎเหล็กของการเอาชีวิตรอดในหนังสยองขวัญ",
        year: "1996",
        choices: ["Scream", "I Know What You Did Last Summer", "Halloween", "Friday the 13th"],
        answer: "Scream"
    },
    {
        emoji: "🪓 🚪 ❄️",
        riddle: "พ่อผู้บ้าคลั่ง ขวานจามประตูยักษ์ และโรงแรมร้างกลางพายุหิมะสุดเยือกเย็น",
        year: "1980",
        choices: ["The Shining", "Misery", "Psycho", "The Evil Dead"],
        answer: "The Shining"
    },
    {
        emoji: "🚿 🔪 🏨",
        riddle: "ฉากอาบน้ำในตำนาน เสียงกรีดร้องสั้น ๆ และโรงแรมริมทางของเบตส์",
        year: "1960",
        choices: ["Psycho", "Peeping Tom", "The Birds", "Repulsion"],
        answer: "Psycho"
    },
    {
        emoji: "☕ 🥄 👁️",
        riddle: "ถ้วยน้ำชา เสียงช้อนกระทบแก้วแกว่งไกว และการสะกดจิตจมสู่ห้วงลึกไร้ก้นบึ้ง",
        year: "2017",
        choices: ["Get Out", "Us", "Midsommar", "The Skeleton Key"],
        answer: "Get Out"
    },
    {
        emoji: "👏 🪑 👻",
        riddle: "เสียงตบมือลึกลับสองครั้งในความมืด เก้าอี้โยกไม้สั่น และบ้านไร่ผีสิงในโรดไอส์แลนด์",
        year: "2013",
        choices: ["The Conjuring", "Insidious", "Annabelle", "Sinister"],
        answer: "The Conjuring"
    },
    {
        emoji: "🎈 🤡 ⛵",
        riddle: "ลูกโป่งสีแดงลอยล่องลอย ตัวตลกในท่อระบายน้ำ และเรือกระดาษสีขาวของหนูน้อยจอร์จี้",
        year: "2017",
        choices: ["IT", "Poltergeist", "Zombieland", "Clown"],
        answer: "IT"
    },
    {
        emoji: "🪚 🐷 🚲",
        riddle: "เลื่อยตัดเหล็ก ตุ๊กตาแก้มแดงแกะสลักปั่นสามล้อ และเกมที่ต้องเฉือนอวัยวะเพื่อมีชีวิตรอด",
        year: "2004",
        choices: ["Saw", "Hostel", "Seven", "Cube"],
        answer: "Saw"
    },
    {
        emoji: "🤮 🟢 ⛪",
        riddle: "เด็กสาวนอนหัวหมุนได้รอบทิศ อ้วกสีเขียวพุ่งพล่าน และการขับไล่ปีศาจโดยบาทหลวงชรา",
        year: "1973",
        choices: ["The Exorcist", "The Omen", "Rosemary's Baby", "The Rite"],
        answer: "The Exorcist"
    },
    {
        emoji: "🤫 👂 👽",
        riddle: "จงเงียบเสียงไว้ เสียงกระซิบก็อาจถึงฆาต และอสูรกายต่างดาวที่ล่าล้างเผ่าพันธุ์ด้วยคลื่นการได้ยิน",
        year: "2018",
        choices: ["A Quiet Place", "Bird Box", "Don't Breathe", "The Silence"],
        answer: "A Quiet Place"
    },
    {
        emoji: "👅 🐦 👑",
        riddle: "เสียงเดาะลิ้นที่เป็นเอกลักษณ์ หัวนกพิราบขาดกระเด็น และความสยองทางกรรมพันธุ์ของสายเลือดแกรแฮม",
        year: "2018",
        choices: ["Hereditary", "Midsommar", "The Witch", "The Babadook"],
        answer: "Hereditary"
    },
    {
        emoji: "🎃 🔪 🧑‍🔧",
        riddle: "หน้ากากสีขาวไร้อารมณ์ คืนวันปล่อยผีตุลา และการไล่ล่าที่ไม่เคยหยุดวิ่งของฆาตกรเงียบ",
        year: "1978",
        choices: ["Halloween", "Friday the 13th", "A Nightmare on Elm Street", "Scream"],
        answer: "Halloween"
    },
    {
        emoji: "🏒 🏕️ 🪓",
        riddle: "หน้ากากฮอกกี้เหล็ก ค่ายพักร้อนทะเลสาบคริสตัลเลค และความแค้นของลูกชายที่ไม่มีวันจมน้ำตาย",
        year: "1980",
        choices: ["Friday the 13th", "Halloween", "The Texas Chain Saw Massacre", "Sleepaway Camp"],
        answer: "Friday the 13th"
    },
    {
        emoji: "💤 🧤 👕",
        riddle: "ถุงมือใบมีดคมกริบ เสื้อยืดขนสัตว์ลายขวางสีแดงสลับเขียว และการจู่โจมสังหารในฝันร้าย",
        year: "1984",
        choices: ["A Nightmare on Elm Street", "Child's Play", "Scream", "Candyman"],
        answer: "A Nightmare on Elm Street"
    },
    {
        emoji: "🪚 🥩 🏠",
        riddle: "เสียงเครื่องยนต์เลื่อยโซ่สั่นสะเทือน หน้ากากประกอบขึ้นจากผิวหนังเหยื่อ และบ้านกินเนื้อคนแดนใต้",
        year: "1974",
        choices: ["The Texas Chain Saw Massacre", "Leatherface", "The Hills Have Eyes", "Wrong Turn"],
        answer: "The Texas Chain Saw Massacre"
    },
    {
        emoji: "🧸 🔪 ⚡",
        riddle: "ตุ๊กตาเด็กน้อยแสนดีกู้ดกายส์สวมวิญญาณฆาตกรสิงสู และประโยคทักทายคลาสสิก 'สวัสดี ฉันชัคกี้'",
        year: "1988",
        choices: ["Child's Play", "Puppet Master", "Dead Silence", "Annabelle"],
        answer: "Child's Play"
    }
];

function openTriviaModal() {
    resetTriviaState();
    if (triviaModal) {
        triviaModal.classList.add('active');
    }
}

function closeTriviaModal() {
    if (triviaTimerInterval) {
        clearInterval(triviaTimerInterval);
        triviaTimerInterval = null;
    }
    if (triviaModal) {
        triviaModal.classList.remove('active');
    }
}

function resetTriviaState() {
    triviaCurrentQuestions = [];
    triviaCurrentIndex = 0;
    triviaLives = 3;
    triviaTimeRemaining = 15;
    if (triviaTimerInterval) {
        clearInterval(triviaTimerInterval);
        triviaTimerInterval = null;
    }
    triviaIsProcessingAnswer = false;
    
    if (triviaStartState) triviaStartState.style.display = 'block';
    if (triviaGameplayState) triviaGameplayState.style.display = 'none';
    if (triviaResultState) triviaResultState.style.display = 'none';
}

function startTriviaGame() {
    SoundscapeEngine.playClickSFX();
    
    // Shuffle and pick 5 questions from database
    const shuffled = [...TRIVIA_DATABASE].sort(() => Math.random() - 0.5);
    triviaCurrentQuestions = shuffled.slice(0, 5);
    
    triviaCurrentIndex = 0;
    triviaLives = 3;
    triviaIsProcessingAnswer = false;
    
    if (triviaStartState) triviaStartState.style.display = 'none';
    if (triviaGameplayState) triviaGameplayState.style.display = 'block';
    if (triviaResultState) triviaResultState.style.display = 'none';
    
    updateLivesUI();
    showTriviaQuestion();
}

function updateLivesUI() {
    if (!triviaLivesContainer) return;
    triviaLivesContainer.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const drop = document.createElement('i');
        drop.className = 'fa-solid fa-droplet animate-pulse';
        if (i >= triviaLives) {
            drop.classList.add('lost');
        }
        triviaLivesContainer.appendChild(drop);
    }
}

function showTriviaQuestion() {
    if (triviaCurrentIndex >= triviaCurrentQuestions.length) {
        endTriviaGame(true); // Win!
        return;
    }
    
    const qData = triviaCurrentQuestions[triviaCurrentIndex];
    if (!qData) return;
    
    triviaIsProcessingAnswer = false;
    
    if (triviaProgressText) {
        triviaProgressText.textContent = `คำถามที่ ${triviaCurrentIndex + 1}/${triviaCurrentQuestions.length}`;
    }
    if (triviaEmojiClue) {
        triviaEmojiClue.textContent = qData.emoji;
    }
    if (triviaRiddleText) {
        triviaRiddleText.textContent = qData.riddle;
    }
    if (triviaYearHint) {
        triviaYearHint.textContent = `ปีที่ฉาย: ${qData.year}`;
    }
    
    if (triviaOptionsList) {
        triviaOptionsList.innerHTML = '';
        
        // Shuffle choices for the current question
        const choices = [...qData.choices].sort(() => Math.random() - 0.5);
        
        choices.forEach((choice) => {
            const btn = document.createElement('button');
            btn.className = 'trivia-choice-btn';
            btn.textContent = choice;
            btn.addEventListener('click', () => {
                if (triviaIsProcessingAnswer) return;
                handleTriviaAnswer(btn, choice, qData.answer);
            });
            triviaOptionsList.appendChild(btn);
        });
    }
    
    startQuestionTimer();
}

function startQuestionTimer() {
    if (triviaTimerInterval) {
        clearInterval(triviaTimerInterval);
    }
    
    triviaTimeRemaining = 15;
    if (triviaTimerBar) {
        triviaTimerBar.style.width = '100%';
    }
    
    let tickCount = 0;
    
    triviaTimerInterval = setInterval(() => {
        triviaTimeRemaining -= 0.1;
        if (triviaTimeRemaining <= 0) {
            clearInterval(triviaTimerInterval);
            triviaTimerInterval = null;
            handleTriviaTimeout();
        } else {
            if (triviaTimerBar) {
                const percent = (triviaTimeRemaining / 15) * 100;
                triviaTimerBar.style.width = `${percent}%`;
            }
            
            // Heartbeat ticker sound acceleration when timer runs low
            tickCount++;
            if (triviaTimeRemaining <= 5 && tickCount % 5 === 0) { // faster tick rate
                SoundscapeEngine.playHeartbeatSFX(1.8, 0.7);
            } else if (tickCount % 10 === 0) { // normal heartbeat every 1 second
                SoundscapeEngine.playHeartbeatSFX(1.0, 0.4);
            }
        }
    }, 100);
}

function handleTriviaAnswer(selectedBtn, selectedVal, correctVal) {
    clearInterval(triviaTimerInterval);
    triviaTimerInterval = null;
    triviaIsProcessingAnswer = true;
    
    // Disable all options
    const btns = triviaOptionsList.querySelectorAll('.trivia-choice-btn');
    btns.forEach(btn => btn.disabled = true);
    
    if (selectedVal === correctVal) {
        selectedBtn.classList.add('correct');
        SoundscapeEngine.playClickSFX();
        
        setTimeout(() => {
            triviaCurrentIndex++;
            showTriviaQuestion();
        }, 1500);
    } else {
        selectedBtn.classList.add('incorrect');
        // Find correct button and highlight it
        btns.forEach(btn => {
            if (btn.textContent === correctVal) {
                btn.classList.add('correct');
            }
        });
        
        // Play slasher knife sound for feedback
        SoundscapeEngine.playKnifeSlashSFX();
        
        triviaLives--;
        updateLivesUI();
        
        setTimeout(() => {
            if (triviaLives <= 0) {
                endTriviaGame(false);
            } else {
                triviaCurrentIndex++;
                showTriviaQuestion();
            }
        }, 1500);
    }
}

function handleTriviaTimeout() {
    triviaIsProcessingAnswer = true;
    
    // Disable all options
    const btns = triviaOptionsList.querySelectorAll('.trivia-choice-btn');
    btns.forEach(btn => btn.disabled = true);
    
    // Highlight correct answer
    const qData = triviaCurrentQuestions[triviaCurrentIndex];
    btns.forEach(btn => {
        if (btn.textContent === qData.answer) {
            btn.classList.add('correct');
        }
    });
    
    // Play slasher knife sound
    SoundscapeEngine.playKnifeSlashSFX();
    
    triviaLives--;
    updateLivesUI();
    
    setTimeout(() => {
        if (triviaLives <= 0) {
            endTriviaGame(false);
        } else {
            triviaCurrentIndex++;
            showTriviaQuestion();
        }
    }, 1500);
}

function endTriviaGame(isVictory) {
    if (triviaTimerInterval) {
        clearInterval(triviaTimerInterval);
        triviaTimerInterval = null;
    }
    
    if (triviaGameplayState) triviaGameplayState.style.display = 'none';
    if (triviaResultState) triviaResultState.style.display = 'block';
    
    if (isVictory) {
        if (triviaResultIcon) triviaResultIcon.textContent = '🏆';
        if (triviaResultTitle) triviaResultTitle.textContent = 'ผู้รอบรู้คู่วิปลาส!';
        if (triviaResultDesc) {
            triviaResultDesc.innerHTML = `ยินดีด้วยคนจิตแข็ง! คุณตอบคำถามถูกต้องครบทั้งหมด 5 ข้ออย่างสวยงามวิปลาส ได้รอดพ้นจากนรกคืนหลอนนี้อย่างสมบูรณ์แบบ!<br><br><span style="color: var(--rating-star); font-weight: 700;"><i class="fa-solid fa-trophy"></i> ปลดล็อกถ้วยรางวัล "ผู้รอบรู้คู่วิปลาส" ในห้องเกียรติยศแล้ว!</span>`;
        }
        
        localStorage.setItem('challenge_trivia_perfect', 'true');
        updateStatsDashboard();
        checkBingoChallenges();
        
        SoundscapeEngine.playEvilLaughSFX();
    } else {
        if (triviaResultIcon) triviaResultIcon.textContent = '💀';
        if (triviaResultTitle) triviaResultTitle.textContent = 'วิญญาณดับสูญ...';
        if (triviaResultDesc) {
            triviaResultDesc.textContent = `หยดเลือดของคุณแห้งเหือดไปจนหมดชะตากรรม... คุณไม่สามารถเอาตัวรอดจากการถาม-ตอบนี้ได้ ลองท้าทายใหม่อีกครั้งเพื่อพิสูจน์ความจำสยองขวัญของคุณ!`;
        }
        
        SoundscapeEngine.playLowDroneSFX();
    }
}

// --- HORROR MOOD RECOMMENDER SYSTEM ---
function openMoodModal() {
    if (moodModal) {
        moodModal.classList.add('active');
        showMoodSelectStep();
    }
}

function closeMoodModal() {
    if (moodModal) {
        moodModal.classList.remove('active');
    }
}

function showMoodSelectStep() {
    if (moodSelectStep) moodSelectStep.style.display = 'grid';
    if (moodResultsStep) moodResultsStep.style.display = 'none';
}

async function fetchAndRenderMood(mood, moodTitleText) {
    if (!moodResultsStep || !moodSelectStep || !moodMovieGrid || !moodResultsTitle) return;
    
    // Switch view to results with loading state
    moodSelectStep.style.display = 'none';
    moodResultsStep.style.display = 'flex';
    moodResultsTitle.textContent = `${moodTitleText} 🩸`;
    moodMovieGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-secondary);"><i class="fa-solid fa-circle-notch fa-spin"></i> กำลังอัญเชิญหนังสยองขวัญแนะนำตามอารมณ์ของคุณ...</div>';
    
    try {
        let params = {
            with_genres: TMDB.HORROR_GENRE_ID,
            page: 1,
            sort_by: 'popularity.desc'
        };
        
        // Custom criteria for each mood
        switch (mood) {
            case 'jumpscare':
                // Horror + Thriller
                params.with_genres = `${TMDB.HORROR_GENRE_ID},53`;
                break;
            case 'slasher':
                // Horror with keywords: slasher (12336) or gore (9748)
                params.with_keywords = '12336|9748';
                break;
            case 'psychological':
                // Horror + Mystery
                params.with_genres = `${TMDB.HORROR_GENRE_ID},9648`;
                break;
            case 'monster':
                // Horror + Sci-Fi
                params.with_genres = `${TMDB.HORROR_GENRE_ID},878`;
                break;
            case 'supernatural':
                // Horror + Fantasy
                params.with_genres = `${TMDB.HORROR_GENRE_ID},14`;
                break;
            case 'zombie':
                // Horror with keywords: zombie (12377) or vampire (3141)
                params.with_keywords = '12377|3141';
                break;
        }
        
        const response = await TMDB.fetchFromTMDB('/discover/movie', params);
        
        moodMovieGrid.innerHTML = '';
        
        if (!response.results || response.results.length === 0) {
            moodMovieGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-dark);">ไม่พบหนังสยองขวัญที่เหมาะสมกับอารมณ์นี้ชั่วคราว</div>';
            return;
        }
        
        // Take top 8 matching movies to display in a clean grid
        const moviesToRender = response.results.slice(0, 8);
        moviesToRender.forEach(movie => {
            const savedRecord = Storage.getMovieFromCollection(movie.id);
            const card = createMovieCard(savedRecord || movie, !!savedRecord);
            moodMovieGrid.appendChild(card);
        });
        
    } catch (err) {
        console.error("Failed to fetch horror movies for mood:", mood, err);
        moodMovieGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-secondary);"><i class="fa-solid fa-wifi-slash"></i> ไม่สามารถดึงข้อมูลภาพยนตร์ออนไลน์ได้ชั่วคราว ลองใหม่อีกครั้งภายหลังครับ 🩸</div>';
    }
}
