
import { Game, SystemRequirements, GameNews } from './types';

export const COLORS = {
  CYAN: '#00FFFF',
  DARK_BG: '#1A1A1A',
  CARD_BG: '#282828',
  NAV_INACTIVE: '#888888',
};

// --- REAL STEAM DATABASE ---
// Format: [AppID, Title, RealPrice, ControlType, Genre]
const REAL_STEAM_DB: [string, string, number, 'Gamepad' | 'Touch' | 'Both', string][] = [
    // --- TOP HITS ---
    ['1091500', 'Cyberpunk 2077', 59.99, 'Gamepad', 'RPG'],
    ['1245620', 'Elden Ring', 59.99, 'Gamepad', 'RPG'],
    ['1086940', 'Baldur\'s Gate 3', 59.99, 'Gamepad', 'RPG'],
    ['2355430', 'Assassin\'s Creed Mirage', 49.99, 'Gamepad', 'Action'],
    ['1167630', 'Teardown', 29.99, 'Gamepad', 'Simulation'],
    ['1716740', 'Starfield', 69.99, 'Gamepad', 'RPG'],
    ['553850', 'Helldivers 2', 39.99, 'Gamepad', 'Action'],
    ['1623730', 'Palworld', 29.99, 'Gamepad', 'Action'],
    ['2358720', 'Black Myth: Wukong', 59.99, 'Gamepad', 'Action'],
    ['2215430', 'Ghost of Tsushima DIRECTOR\'S CUT', 59.99, 'Gamepad', 'Action'],
    
    // --- POPULAR ---
    ['1174180', 'Red Dead Redemption 2', 59.99, 'Gamepad', 'Action'],
    ['271590', 'Grand Theft Auto V', 29.99, 'Gamepad', 'Action'],
    ['292030', 'The Witcher 3: Wild Hunt', 39.99, 'Gamepad', 'RPG'],
    ['489830', 'The Elder Scrolls V: Skyrim Special Edition', 39.99, 'Gamepad', 'RPG'],
    ['1551360', 'Forza Horizon 5', 59.99, 'Gamepad', 'Racing'],
    ['730', 'Counter-Strike 2', 0, 'Gamepad', 'Action'],
    ['570', 'Dota 2', 0, 'Both', 'Strategy'],
    ['1172470', 'Apex Legends™', 0, 'Gamepad', 'Action'],
    ['578080', 'PUBG: BATTLEGROUNDS', 0, 'Gamepad', 'Action'],
    ['1938090', 'Call of Duty®', 0, 'Gamepad', 'Action'],

    // --- SIMULATION & STRATEGY ---
    ['1290000', 'PowerWash Simulator', 24.99, 'Gamepad', 'Simulation'],
    ['641320', 'Cooking Simulator', 19.99, 'Touch', 'Simulation'],
    ['621060', 'PC Building Simulator', 19.99, 'Touch', 'Simulation'],
    ['526870', 'Satisfactory', 29.99, 'Gamepad', 'Strategy'],
    ['548430', 'Deep Rock Galactic', 29.99, 'Gamepad', 'Action'],
    ['1366540', 'Dyson Sphere Program', 19.99, 'Touch', 'Strategy'],
    ['233860', 'Kenshi', 29.99, 'Touch', 'RPG'],
    ['108600', 'Project Zomboid', 19.99, 'Touch', 'Simulation'],
    ['252490', 'Rust', 39.99, 'Gamepad', 'Action'],
    ['221100', 'DayZ', 49.99, 'Gamepad', 'Action'],
    
    // --- INDIE & CLASSIC ---
    ['391540', 'Undertale', 9.99, 'Touch', 'RPG'],
    ['105600', 'Terraria', 9.99, 'Touch', 'Action'],
    ['413150', 'Stardew Valley', 14.99, 'Touch', 'Simulation'],
    ['1145360', 'Hades', 24.99, 'Touch', 'Action'],
    ['367520', 'Hollow Knight', 14.99, 'Touch', 'Action'],
    ['945360', 'Among Us', 4.99, 'Touch', 'Casual'],
    ['646570', 'Slay the Spire', 24.99, 'Touch', 'Strategy'],
    ['268910', 'Cuphead', 19.99, 'Gamepad', 'Action'],
    
    // --- ACTION ADVENTURE ---
    ['1659040', 'STAR WARS Jedi: Survivor™', 69.99, 'Gamepad', 'Action'],
    ['1817070', 'Marvel’s Spider-Man Remastered', 59.99, 'Gamepad', 'Action'],
    ['1888930', 'The Last of Us™ Part I', 59.99, 'Gamepad', 'Action'],
    ['990080', 'Hogwarts Legacy', 59.99, 'Gamepad', 'RPG'],
    ['2050650', 'Resident Evil 4', 39.99, 'Gamepad', 'Horror'],
    ['814380', 'Sekiro™: Shadows Die Twice', 59.99, 'Gamepad', 'Action'],
    ['374320', 'DARK SOULS™ III', 59.99, 'Gamepad', 'RPG'],
    ['2208920', 'Assassin\'s Creed Valhalla', 59.99, 'Gamepad', 'RPG'],
    
    // --- VALVE CLASSICS ---
    ['400', 'Portal', 9.99, 'Gamepad', 'Puzzle'],
    ['620', 'Portal 2', 9.99, 'Gamepad', 'Puzzle'],
    ['220', 'Half-Life 2', 9.99, 'Gamepad', 'Action'],
    ['440', 'Team Fortress 2', 0, 'Gamepad', 'Action'],
    ['550', 'Left 4 Dead 2', 9.99, 'Gamepad', 'Action'],
];

const UNIQUE_STEAM_DB = Array.from(new Map(REAL_STEAM_DB.map(item => [item[0], item])).values());

// --- REAL GAMEPLAY SCREENSHOTS ---
// Directly linked from Steam CDN to ensure "gameplay" look instead of promotional art
const REAL_SCREENSHOTS_DB: Record<string, string[]> = {
    '1091500': [ // Cyberpunk
        'https://cdn.akamai.steamstatic.com/steam/apps/1091500/ss_605418b7b25000571b7640c4a3501f2f896b0542.1920x1080.jpg',
        'https://cdn.akamai.steamstatic.com/steam/apps/1091500/ss_f74e50889218d6e382d5f0b4a44f80879f64d146.1920x1080.jpg'
    ],
    '1245620': [ // Elden Ring
        'https://cdn.akamai.steamstatic.com/steam/apps/1245620/ss_9628b065a2d6091410626300451a9a4b3d3257c7.1920x1080.jpg',
        'https://cdn.akamai.steamstatic.com/steam/apps/1245620/ss_2b7336f322304d9c7c4b4f5351a9d18c33e839e5.1920x1080.jpg'
    ],
    '1086940': [ // BG3
        'https://cdn.akamai.steamstatic.com/steam/apps/1086940/ss_c2522778393e8784d1235b6c230f2c4161a49f57.1920x1080.jpg',
        'https://cdn.akamai.steamstatic.com/steam/apps/1086940/ss_df4582e051d927c03038a8e1e7f34084534a0247.1920x1080.jpg'
    ],
    '2358720': [ // Black Myth Wukong
        'https://cdn.akamai.steamstatic.com/steam/apps/2358720/ss_073243177695e173e203c73367201df1e63a1548.1920x1080.jpg',
        'https://cdn.akamai.steamstatic.com/steam/apps/2358720/ss_c5b5657803328518e38d74384022a36184976d8b.1920x1080.jpg'
    ],
    '1716740': [ // Starfield
        'https://cdn.akamai.steamstatic.com/steam/apps/1716740/ss_350024479901460d603a129033333ce32e146743.1920x1080.jpg',
        'https://cdn.akamai.steamstatic.com/steam/apps/1716740/ss_01777d0a2333069116c4293f7734421b53e70d4d.1920x1080.jpg'
    ],
    '1623730': [ // Palworld
        'https://cdn.akamai.steamstatic.com/steam/apps/1623730/ss_3160a2245b721869e5d7967a531f8f3c7c229712.1920x1080.jpg',
        'https://cdn.akamai.steamstatic.com/steam/apps/1623730/ss_2c045b3484f901168565a9726117406a4454955b.1920x1080.jpg'
    ],
    '553850': [ // Helldivers 2
        'https://cdn.akamai.steamstatic.com/steam/apps/553850/ss_0c8d17960350d268270575d8d0c9f1309852230a.1920x1080.jpg',
        'https://cdn.akamai.steamstatic.com/steam/apps/553850/ss_6f54c9d300227163864a66a70e70034a70659972.1920x1080.jpg'
    ],
     '2355430': [ // AC Mirage
        'https://cdn.akamai.steamstatic.com/steam/apps/2355430/ss_4350175c572c29013b8603612739322238318257.1920x1080.jpg',
        'https://cdn.akamai.steamstatic.com/steam/apps/2355430/ss_165e317072a45a666991147772412e8473210459.1920x1080.jpg'
    ],
    '2215430': [ // Ghost of Tsushima
         'https://cdn.akamai.steamstatic.com/steam/apps/2215430/ss_891785532b26002f2604859f7df82e8f17a94d93.1920x1080.jpg'
    ]
};

// --- REAL TRAILERS (MP4) ---
// Hardcoded to ensure valid media even if API fails/blocks
const REAL_TRAILERS_DB: Record<string, string[]> = {
    '1091500': ['http://video.akamai.steamstatic.com/store_trailers/256991206/movie480.mp4'], // CP2077
    '1245620': ['http://video.akamai.steamstatic.com/store_trailers/256999262/movie480.mp4'], // Elden Ring
    '1086940': ['http://video.akamai.steamstatic.com/store_trailers/256942095/movie480.mp4'], // BG3
    '1174180': ['http://video.akamai.steamstatic.com/store_trailers/256768372/movie480.mp4'], // RDR2
    '271590': ['http://video.akamai.steamstatic.com/store_trailers/256784576/movie480.mp4'],  // GTA V
    '292030': ['http://video.akamai.steamstatic.com/store_trailers/256889417/movie480.mp4'],  // Witcher 3
    '1551360': ['http://video.akamai.steamstatic.com/store_trailers/256859186/movie480.mp4'], // Forza 5
    '730': ['http://video.akamai.steamstatic.com/store_trailers/256972275/movie480.mp4'],     // CS2
    '570': ['http://video.akamai.steamstatic.com/store_trailers/2032549/movie480.mp4'],       // Dota 2
    '1172470': ['http://video.akamai.steamstatic.com/store_trailers/257002575/movie480.mp4'], // Apex
    '2358720': ['http://video.akamai.steamstatic.com/store_trailers/257046524/movie480.mp4'], // Wukong
    '1716740': ['http://video.akamai.steamstatic.com/store_trailers/256950293/movie480.mp4'], // Starfield
    '1623730': ['http://video.akamai.steamstatic.com/store_trailers/256996029/movie480.mp4'], // Palworld
    '2355430': ['http://video.akamai.steamstatic.com/store_trailers/256976269/movie480.mp4'], // AC Mirage
    '1167630': ['http://video.akamai.steamstatic.com/store_trailers/256810237/movie480.mp4'], // Teardown
    '553850': ['http://video.akamai.steamstatic.com/store_trailers/256997426/movie480.mp4'], // Helldivers 2
    '2215430': ['http://video.akamai.steamstatic.com/store_trailers/257022064/movie480.mp4'], // Ghost of Tsushima
    '1817070': ['http://video.akamai.steamstatic.com/store_trailers/256899144/movie480.mp4'], // Spider-Man
};

const generateMockSpecs = (title: string, price: number): { minimum: SystemRequirements; recommended: SystemRequirements } => {
    const isAAA = price > 35;
    return {
        minimum: {
            os: "Windows 10 64-bit",
            processor: isAAA ? "Intel Core i5-8400 / AMD Ryzen 5 2600" : "Intel Core i3-4170 / AMD FX-8300",
            memory: isAAA ? "16 GB RAM" : "8 GB RAM",
            graphics: isAAA ? "NVIDIA GeForce GTX 1060 6GB / AMD Radeon RX 580" : "NVIDIA GeForce GTX 760 / AMD Radeon R7 260x",
            storage: isAAA ? "80 GB available space" : "20 GB available space"
        },
        recommended: {
            os: "Windows 10/11 64-bit",
            processor: isAAA ? "Intel Core i7-10700K / AMD Ryzen 7 5800X" : "Intel Core i5-8600K / AMD Ryzen 5 3600",
            memory: isAAA ? "32 GB RAM" : "16 GB RAM",
            graphics: isAAA ? "NVIDIA GeForce RTX 3070 / AMD Radeon RX 6800" : "NVIDIA GeForce GTX 1060 6GB",
            storage: isAAA ? "80 GB SSD" : "20 GB available space"
        }
    };
};

const generateGameNews = (gameTitle: string): GameNews[] => {
    const now = new Date();
    // Helper to format date like Steam (e.g. "24 Oct, 2023")
    const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    
    return [
        {
            id: 'n1',
            title: `Update 1.6 - Performance & Quality of Life`,
            date: fmt(now),
            summary: `${gameTitle} update 1.6 is live! We've addressed performance issues on high-end configurations, improved controller latency for Nexus Play streaming, and fixed several community-reported bugs.`,
            image: undefined 
        },
        {
            id: 'n2',
            title: "Community Challenge: The Golden Weekend",
            date: fmt(new Date(now.getTime() - 86400000 * 3)),
            summary: "Join the community this weekend for exclusive in-game rewards. Log in between Friday and Sunday to claim your 'Golden Nexus' skin and double XP.",
            image: undefined
        },
        {
            id: 'n3',
            title: "Developer Diary #12: The Future of the World",
            date: fmt(new Date(now.getTime() - 86400000 * 14)),
            summary: "Our lead designer discusses the roadmap for the coming year, including the upcoming DLC expansion and modding support tools.",
            image: undefined
        }
    ];
};

const generateRealStore = (): Game[] => {
  return UNIQUE_STEAM_DB.map(entry => {
    const [id, title, price, control, genre] = entry;
    
    const descEn = `Experience the critically acclaimed ${title} on Nexus Play. Featuring cloud save support, instant streaming, and optimized controls for ${control}. Dive into a world of immersive gameplay and stunning visuals.`;
    const descRu = `Испытайте признанный критиками ${title} на Nexus Play. Поддержка облачных сохранений, мгновенный запуск и оптимизация для ${control === 'Gamepad' ? 'геймпада' : 'сенсора'}. Погрузитесь в мир захватывающего геймплея и потрясающей графики.`;

    const longDescEn = `
        <h1>About This Game</h1>
        <p>${title} is a genre-defining experience that pushes the boundaries of what is possible in interactive entertainment. With <b>${control}</b> optimization, you can play seamlessly on any device.</p>
        <br/>
        <p>Key Features:</p>
        <ul style="list-style-type: disc; margin-left: 20px;">
            <li><b>Immersive World:</b> Explore vast landscapes rendered in stunning detail.</li>
            <li><b>Dynamic Gameplay:</b> Adapt your strategy to changing environments and intelligent AI.</li>
            <li><b>Nexus Integration:</b> Full support for cloud saves and cross-device progression.</li>
        </ul>
        <br/>
        <p>Whether you are a veteran of the series or a newcomer, ${title} offers hundreds of hours of content. Join the community of millions of players and write your own legend today.</p>
    `;
    
    const longDescRu = `
        <h1>Об этой игре</h1>
        <p>${title} — это жанрообразующий проект, расширяющий границы возможного в интерактивных развлечениях. Благодаря оптимизации для <b>${control === 'Gamepad' ? 'геймпада' : 'сенсора'}</b>, вы можете играть без задержек на любом устройстве.</p>
        <br/>
        <p>Ключевые особенности:</p>
        <ul style="list-style-type: disc; margin-left: 20px;">
            <li><b>Захватывающий мир:</b> Исследуйте обширные ландшафты, созданные с невероятным вниманием к деталям.</li>
            <li><b>Динамичный геймплей:</b> Адаптируйте свою стратегию к меняющимся условиям и умному ИИ.</li>
            <li><b>Интеграция Nexus:</b> Полная поддержка облачных сохранений и кроссплатформенного прогресса.</li>
        </ul>
        <br/>
        <p>Будь вы ветераном серии или новичком, ${title} предложит сотни часов контента. Присоединяйтесь к миллионам игроков и создайте свою легенду уже сегодня.</p>
    `;

    // Standard Steam Header
    let imageUrl = `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${id}/header.jpg`;
    
    // FIX FOR AC MIRAGE (CDN stability)
    if (id === '2355430') {
        imageUrl = 'https://cdn.akamai.steamstatic.com/steam/apps/2355430/capsule_616x353.jpg';
    }

    // Use REAL screenshots if available, otherwise fallback to generated list from header
    // This ensures no game ever has "empty" screenshots initially
    let screenshots: string[] = REAL_SCREENSHOTS_DB[id] || [];
    
    // CRITICAL FIX: If no screenshots in DB, ensure we have at least the header as a "screenshot"
    // so the gallery doesn't show black screen or break.
    if (screenshots.length === 0) {
        screenshots = [
            imageUrl,
            `https://cdn.akamai.steamstatic.com/steam/apps/${id}/page_bg_generated_v6b.jpg`,
            `https://cdn.akamai.steamstatic.com/steam/apps/${id}/capsule_616x353.jpg`
        ];
    }
    
    // Use REAL trailers if available
    const movies: string[] = REAL_TRAILERS_DB[id] || [];

    return {
      id: id,
      title: title,
      price: price,
      isFree: price === 0,
      controlType: control,
      genre: genre, // Added mapping
      isStreamable: Math.random() > 0.2, // 80% streamable
      image: imageUrl,
      description_en: descEn,
      description_ru: descRu,
      longDescription_en: longDescEn,
      longDescription_ru: longDescRu,
      developer: "Nexus Partner Studio",
      publisher: "Global Games Publishing",
      releaseDate: "2023-2024",
      requirements: generateMockSpecs(title, price),
      rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
      movies: movies, 
      screenshots: screenshots,
      news: generateGameNews(title)
    };
  });
};

export const MOCK_GAMES: Game[] = generateRealStore();
