
export interface Game {
  id: string;
  title: string;
  price: number;
  isFree: boolean;
  controlType: 'Gamepad' | 'Touch' | 'Both';
  genre: string; // Added genre field
  isStreamable: boolean;
  image: string;
  description_en: string;
  description_ru: string;
  // Extended Details
  longDescription_en: string; // Can contains HTML
  longDescription_ru: string; // Can contains HTML
  developer: string;
  publisher: string;
  releaseDate: string;
  requirements: {
      minimum: SystemRequirements | string; // String if HTML from Steam
      recommended: SystemRequirements | string; // String if HTML from Steam
  };
  rating: number; // 0.0 to 5.0
  // New Steam Assets
  movies?: string[]; // URLs to mp4
  screenshots?: string[]; // URLs to jpg
  news?: GameNews[];
}

export interface GameNews {
    id: string;
    title: string;
    date: string;
    image?: string;
    summary: string;
    url?: string;
}

export interface SystemRequirements {
    os: string;
    processor: string;
    memory: string;
    graphics: string;
    storage: string;
}

export interface Transaction {
  id: string;
  type: 'PURCHASE' | 'TOP_UP' | 'BONUS';
  amount: number;
  date: string;
  description: string;
}

export interface Friend {
  id: string;
  shortId: string; // For adding by ID (e.g. #8492)
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'in-game' | 'busy';
  gameActivity?: string; // If in-game
  isBlocked?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  type: 'text' | 'system' | 'invite';
}

export interface CallParticipant {
  id: string;
  name: string;
  avatar: string;
  isMuted: boolean;
  isSpeaking: boolean;
  isVideoOn: boolean;
  isScreenSharing: boolean;
}

export interface User {
  email: string;
  name: string;
  surname: string;
  dob: string;
  avatar?: string;
  ownedGameIds: string[];
  transactions: Transaction[];
  stats: {
    hoursPlayed: number;
    achievementsUnlocked: number;
    gamesOwned: number;
    credits: number;
  };
  // New fields for community
  shortId?: string; 
  friends?: Friend[];
}

export type TabRoute = 'Store' | 'Library' | 'Community' | 'Wallet' | 'Profile';
