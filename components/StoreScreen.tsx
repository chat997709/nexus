import React, { useState, useMemo } from 'react';
import { Game } from '../types';
import { MOCK_GAMES } from '../constants';
import { CloudLightning, DollarSign, Filter, Box, Check, ShoppingCart } from 'lucide-react';
import { useNotification } from './NotificationSystem';

interface StoreScreenProps {
  userBalance: number;
  ownedGameIds: string[];
  onPurchase: (game: Game) => { success: boolean; message: string; code: 'SUCCESS' | 'INSUFFICIENT_FUNDS' | 'ALREADY_OWNED' | 'ERROR' };
  onNavigateWallet: () => void;
}

export const StoreScreen: React.FC<StoreScreenProps> = ({ userBalance, ownedGameIds, onPurchase, onNavigateWallet }) => {
  const { addNotification } = useNotification();
  const [filterControl, setFilterControl] = useState<'All' | 'Touch' | 'Gamepad'>('All');
  const [filterFree, setFilterFree] = useState<boolean>(false);
  const [filterStreamable, setFilterStreamable] = useState<boolean>(false);

  const filteredGames = useMemo(() => {
    return MOCK_GAMES.filter((game: Game) => {
      if (filterControl !== 'All' && game.controlType !== filterControl) return false;
      if (filterFree && !game.isFree) return false;
      if (filterStreamable && !game.isStreamable) return false;
      return true;
    });
  }, [filterControl, filterFree, filterStreamable]);

  const handleBuyClick = (e: React.MouseEvent, game: Game) => {
    e.stopPropagation();
    
    // Confirmation for paid games
    if (!game.isFree) {
        const confirmed = window.confirm(`Purchase ${game.title} for $${game.price}?`);
        if (!confirmed) return;
    }

    const result = onPurchase(game);

    if (result.success) {
        addNotification('Purchase Successful', result.message, 'sale');
    } else {
        // Handle failure
        if (result.code === 'INSUFFICIENT_FUNDS') {
            addNotification('Insufficient Funds', result.message, 'system');
            if(window.confirm(`${result.message} Go to Wallet to top up?`)) {
                onNavigateWallet();
            }
        } else if (result.code === 'ALREADY_OWNED') {
             addNotification('Library', result.message, 'system');
        } else {
             addNotification('Error', result.message, 'system');
        }
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto pb-24 md:pb-8 perspective-container no-scrollbar">
      <header className="mb-8 pl-2 border-l-4 border-nexus-cyan glass-panel p-4 rounded-r-xl transition-all hover:translate-x-1 duration-300 flex justify-between items-center max-w-5xl mx-auto w-full">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight" style={{ textShadow: '0 4px 10px rgba(0,0,0,0.1) dark:rgba(0,0,0,0.5)' }}>Store</h1>
          <p className="text-gray-500 dark:text-nexus-nav text-sm">Holographic Marketplace</p>
        </div>
        <div className="text-right">
            <div className="text-xs text-nexus-nav uppercase font-bold">Balance</div>
            <div className="text-nexus-cyan font-mono text-xl font-bold">${userBalance.toFixed(2)}</div>
        </div>
      </header>

      {/* 3D Filters Section */}
      <div className="mb-8 preserve-3d max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-2 mb-4 pl-2">
          <Box className="w-4 h-4 text-nexus-cyan animate-pulse" />
          <span className="text-gray-800 dark:text-white text-sm font-semibold uppercase tracking-wider">Parameters</span>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="flex flex-wrap gap-3">
            {['All', 'Gamepad', 'Touch'].map(type => (
                <button
                key={type}
                onClick={() => setFilterControl(type as any)}
                className={`relative px-5 py-2 rounded-lg text-xs font-bold transition-all transform hover:translate-y-[-2px] active:translate-y-[1px] ${
                    filterControl === type
                    ? 'bg-nexus-cyan text-black shadow-[0_5px_15px_rgba(0,255,255,0.4)] scale-105' 
                    : 'glass-panel text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-nexus-cyan/30'
                }`}
                >
                {type}
                </button>
            ))}
            </div>

            <div className="flex gap-3">
            <FilterButton 
                isActive={filterFree} 
                onClick={() => setFilterFree(!filterFree)} 
                icon={<DollarSign className="w-3 h-3" />}
                label="Free"
            />
            <FilterButton 
                isActive={filterStreamable} 
                onClick={() => setFilterStreamable(!filterStreamable)} 
                icon={<CloudLightning className="w-3 h-3" />}
                label="Stream"
            />
            </div>
        </div>
      </div>

      {/* 3D Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2 max-w-7xl mx-auto w-full">
        {filteredGames.length > 0 ? (
          filteredGames.map((game) => {
            const isOwned = ownedGameIds.includes(game.id);
            return (
              <div 
                key={game.id} 
                className={`card-3d glass-panel p-5 rounded-2xl relative group cursor-pointer overflow-hidden border transition-colors h-full flex flex-col justify-between ${isOwned ? 'border-green-500/30' : 'border-transparent hover:border-nexus-cyan/30'}`}
              >
                {/* Animated Background Mesh for Card (Subtle) */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.4),transparent)] pointer-events-none"></div>

                {/* Floating Content Layer */}
                <div className="flex flex-col justify-between h-full card-content-3d relative z-10">
                  <div className="mb-8">
                    <h3 className="text-gray-900 dark:text-white font-black text-xl tracking-wide group-hover:text-nexus-cyan transition-colors drop-shadow-md transform translate-z-[5px]">
                      {game.title}
                    </h3>
                    
                    <div className="flex flex-wrap gap-2 mt-3 preserve-3d">
                      <span className="text-[10px] font-bold bg-gray-200 dark:bg-black/50 text-gray-600 dark:text-gray-300 px-3 py-1 rounded border border-gray-300 dark:border-white/10 backdrop-blur-md transform transition-transform group-hover:translate-z-[5px]">
                        {game.controlType}
                      </span>
                      {game.isStreamable && (
                        <span className="text-[10px] font-bold bg-cyan-50 dark:bg-nexus-cyan/20 text-cyan-700 dark:text-nexus-cyan px-3 py-1 rounded border border-cyan-200 dark:border-nexus-cyan/30 flex items-center gap-1 shadow-sm dark:shadow-[0_0_10px_rgba(0,255,255,0.2)] animate-pulse-glow">
                          <CloudLightning className="w-3 h-3" /> LIVE
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-end justify-between preserve-3d mt-auto">
                    <div className="relative transform transition-transform group-hover:translate-z-[15px] duration-500">
                      <div className="absolute inset-0 bg-nexus-cyan blur opacity-20 hidden dark:block group-hover:opacity-40 transition-opacity"></div>
                      <span className={`relative font-black text-2xl ${isOwned ? 'text-green-500' : 'text-cyan-600 dark:text-nexus-cyan'}`} style={{ textShadow: '0 0 10px rgba(0,255,255,0.3)' }}>
                        {isOwned ? 'OWNED' : (game.isFree ? 'FREE' : `$${game.price}`)}
                      </span>
                    </div>
                    
                    <button 
                      onClick={(e) => !isOwned && handleBuyClick(e, game)}
                      disabled={isOwned}
                      className={`text-xs font-black px-4 py-2 rounded shadow-lg transform transition-all duration-300 group-hover:translate-z-[20px] ${
                        isOwned 
                        ? 'bg-green-600/20 text-green-500 border border-green-500 cursor-default flex items-center gap-2' 
                        : 'bg-gray-900 dark:bg-white text-white dark:text-black group-hover:scale-110 hover:bg-nexus-cyan dark:hover:bg-nexus-cyan hover:text-black dark:hover:text-black active:scale-95'
                      }`}
                    >
                      {isOwned ? (
                        <><Check className="w-3 h-3" /> LIBRARY</>
                      ) : (
                        <div className="flex items-center gap-1">
                          {!game.isFree && <ShoppingCart className="w-3 h-3" />}
                          {game.isFree ? 'GET' : 'BUY'}
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                {/* Decorative 3D Elements on Card */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-cyan-400/20 to-transparent rounded-full blur-xl pointer-events-none transform translate-z-[-10px] group-hover:translate-z-[5px] transition-transform duration-700 ease-out"></div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12 glass-panel rounded-xl">
            <p className="text-gray-500 dark:text-gray-400">Void returned no results.</p>
            <button 
              onClick={() => {
                setFilterControl('All');
                setFilterFree(false);
                setFilterStreamable(false);
              }}
              className="mt-4 text-nexus-cyan text-sm underline hover:text-cyan-600 dark:hover:text-white"
            >
              Reboot Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const FilterButton = ({ isActive, onClick, icon, label }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all border transform hover:scale-105 active:scale-95 ${
      isActive 
        ? 'bg-cyan-50 dark:bg-nexus-cyan/20 border-nexus-cyan text-cyan-700 dark:text-nexus-cyan shadow-sm dark:shadow-[0_0_15px_rgba(0,255,255,0.3)]' 
        : 'glass-panel border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-white/20'
    }`}
  >
    {icon} {label}
  </button>
);