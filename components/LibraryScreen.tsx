import React, { useState, useMemo } from 'react';
import { Play, Clock, Calendar, ArrowUpDown, CheckCircle2, CloudLightning } from 'lucide-react';

interface LibraryGame {
  id: string;
  title: string;
  hoursPlayed: number;
  lastPlayedDate: string;
  lastPlayedTimestamp: number; // Helper for sorting
  status: 'Installed' | 'Stream Ready';
}

const LIBRARY_GAMES: LibraryGame[] = [
  { 
    id: '1', 
    title: 'Cyber Flow 2077', 
    hoursPlayed: 42.5, 
    lastPlayedDate: 'Сегодня', 
    lastPlayedTimestamp: 1715400000000, 
    status: 'Installed' 
  },
  { 
    id: '2', 
    title: 'Galactic Tactics', 
    hoursPlayed: 12.8, 
    lastPlayedDate: 'Вчера', 
    lastPlayedTimestamp: 1715300000000, 
    status: 'Stream Ready' 
  },
  { 
    id: '3', 
    title: 'Neon Drifter', 
    hoursPlayed: 5.2, 
    lastPlayedDate: '2 дня назад', 
    lastPlayedTimestamp: 1715200000000, 
    status: 'Installed' 
  },
  { 
    id: '4', 
    title: 'Zero Gravity', 
    hoursPlayed: 0.5, 
    lastPlayedDate: 'Неделю назад', 
    lastPlayedTimestamp: 1714800000000, 
    status: 'Stream Ready' 
  },
  { 
    id: '5', 
    title: 'Aether Chronicles', 
    hoursPlayed: 120.0, 
    lastPlayedDate: '23 Окт', 
    lastPlayedTimestamp: 1713800000000, 
    status: 'Installed' 
  },
];

type SortOption = 'Recent' | 'Alphabetical' | 'Hours';

export const LibraryScreen: React.FC = () => {
  const [sortBy, setSortBy] = useState<SortOption>('Recent');

  const sortedGames = useMemo(() => {
    return [...LIBRARY_GAMES].sort((a, b) => {
      switch (sortBy) {
        case 'Recent':
          return b.lastPlayedTimestamp - a.lastPlayedTimestamp;
        case 'Alphabetical':
          return a.title.localeCompare(b.title);
        case 'Hours':
          return b.hoursPlayed - a.hoursPlayed;
        default:
          return 0;
      }
    });
  }, [sortBy]);

  const handlePlay = (gameTitle: string) => {
    window.alert(`Запуск игры ${gameTitle}...`);
  };

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
      <header className="mb-6 max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Библиотека</h1>
        <p className="text-gray-500 dark:text-nexus-nav text-sm">Ваша коллекция игр ({LIBRARY_GAMES.length})</p>
      </header>

      {/* Sorting Controls */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar pb-2 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 text-gray-500 dark:text-nexus-nav text-xs font-bold uppercase mr-2 shrink-0">
            <ArrowUpDown className="w-4 h-4" />
            <span>Сортировка:</span>
        </div>
        
        <SortButton 
            active={sortBy === 'Recent'} 
            label="Недавние" 
            onClick={() => setSortBy('Recent')} 
        />
        <SortButton 
            active={sortBy === 'Alphabetical'} 
            label="А-Я" 
            onClick={() => setSortBy('Alphabetical')} 
        />
        <SortButton 
            active={sortBy === 'Hours'} 
            label="Время игры" 
            onClick={() => setSortBy('Hours')} 
        />
      </div>

      {/* Games List / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
        {sortedGames.map((game) => (
          <div 
            key={game.id}
            className="group bg-white dark:bg-nexus-card border border-gray-200 dark:border-transparent hover:border-cyan-400 dark:hover:border-nexus-cyan/30 rounded-xl p-4 flex items-center justify-between transition-all duration-200 shadow-sm dark:shadow-none relative overflow-hidden"
          >
             {/* Hover Glow */}
             <div className="absolute inset-0 bg-nexus-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

            {/* Left Content */}
            <div className="flex flex-col gap-1 relative z-10">
              <h3 className="text-gray-900 dark:text-white font-bold text-lg leading-tight group-hover:text-cyan-600 dark:group-hover:text-nexus-cyan transition-colors">
                {game.title}
              </h3>
              
              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-nexus-nav mt-1">
                <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{game.hoursPlayed} ч.</span>
                </div>
                <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{game.lastPlayedDate}</span>
                </div>
              </div>

              <div className="mt-3 flex">
                {game.status === 'Installed' ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-400/10 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Installed
                    </span>
                ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-400/10 px-2 py-0.5 rounded-full">
                        <CloudLightning className="w-3 h-3" /> Stream Ready
                    </span>
                )}
              </div>
            </div>

            {/* Right Content - Play Button */}
            <button
                onClick={() => handlePlay(game.title)}
                className="relative z-10 bg-gray-900 dark:bg-nexus-cyan text-white dark:text-black p-3 rounded-full hover:bg-gray-700 dark:hover:bg-[#80FFFF] active:scale-95 shadow-md dark:shadow-[0_0_10px_rgba(0,255,255,0.3)] transition-all flex items-center justify-center transform group-hover:scale-110"
            >
                <Play className="w-6 h-6 fill-white dark:fill-black pl-0.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const SortButton: React.FC<{ active: boolean; label: string; onClick: () => void }> = ({ active, label, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
            active
            ? 'bg-cyan-50 dark:bg-nexus-cyan/10 border-cyan-500 dark:border-nexus-cyan text-cyan-700 dark:text-nexus-cyan'
            : 'bg-white dark:bg-nexus-card border-gray-200 dark:border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
        }`}
    >
        {label}
    </button>
);