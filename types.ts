
export interface Game {
  id: string;
  title: string;
  price: number;
  isFree: boolean;
  controlType: 'Gamepad' | 'Touch';
  isStreamable: boolean;
}

export interface Transaction {
  id: string;
  type: 'PURCHASE' | 'TOP_UP';
  amount: number;
  date: string;
  description: string;
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
}

export type TabRoute = 'Store' | 'Library' | 'Community' | 'Wallet' | 'Profile';
