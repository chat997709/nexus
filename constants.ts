import { Game } from './types';

export const MOCK_GAMES: Game[] = [
  { id: '1', title: 'Cyber Flow 2077', price: 9.99, isFree: false, controlType: 'Gamepad', isStreamable: true },
  { id: '2', title: 'Puzzle Nexus', price: 0, isFree: true, controlType: 'Touch', isStreamable: false },
  { id: '3', title: 'Galactic Tactics', price: 2.99, isFree: false, controlType: 'Touch', isStreamable: false },
  { id: '4', title: 'Neon Drifter', price: 4.99, isFree: false, controlType: 'Touch', isStreamable: true },
  { id: '5', title: 'Stream Racing', price: 19.99, isFree: false, controlType: 'Gamepad', isStreamable: true },
  { id: '6', title: 'Zero Gravity', price: 0, isFree: true, controlType: 'Gamepad', isStreamable: false },
];

export const COLORS = {
  CYAN: '#00FFFF',
  DARK_BG: '#1A1A1A',
  CARD_BG: '#282828',
  NAV_INACTIVE: '#888888',
};