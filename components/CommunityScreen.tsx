import React, { useState, useMemo } from 'react';
import { Users, Trophy, ShoppingCart, Star, Heart, MessageSquare, Filter } from 'lucide-react';

type ActivityType = 'Achievement' | 'Review' | 'Purchase';

interface ActivityItem {
  id: string;
  user: string;
  type: ActivityType;
  game: string;
  timestamp: string;
  details: string;
  avatarColor: string;
}

const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    user: 'Alex_Netrunner',
    type: 'Achievement',
    game: 'Cyber Flow 2077',
    timestamp: '5 мин. назад',
    details: 'Разблокировал достижение "Неоновый призрак"',
    avatarColor: 'bg-purple-500',
  },
  {
    id: '2',
    user: 'Kate_Glitch',
    type: 'Review',
    game: 'Puzzle Nexus',
    timestamp: '25 мин. назад',
    details: 'Оставила отзыв: "Лучшая головоломка года!"',
    avatarColor: 'bg-nexus-cyan',
  },
  {
    id: '3',
    user: 'Rogue_AI',
    type: 'Purchase',
    game: 'Galactic Tactics',
    timestamp: '1 час назад',
    details: 'Приобрёл новую игру',
    avatarColor: 'bg-green-500',
  },
  {
    id: '4',
    user: 'SpeedRunner99',
    type: 'Achievement',
    game: 'Stream Racing',
    timestamp: '3 часа назад',
    details: 'Разблокировал достижение "Первая скорость"',
    avatarColor: 'bg-orange-500',
  },
];

export const CommunityScreen: React.FC = () => {
  const [filterType, setFilterType] = useState<'All' | 'Achievement'>('All');

  const filteredActivities = useMemo(() => {
    if (filterType === 'All') return MOCK_ACTIVITIES;
    return MOCK_ACTIVITIES.filter(activity => activity.type === 'Achievement');
  }, [filterType]);

  const handleReaction = (user: string) => {
    window.alert(`Вы оценили активность пользователя ${user}`);
  };

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'Achievement': return <Trophy className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />;
      case 'Review': return <Star className="w-4 h-4 text-cyan-600 dark:text-nexus-cyan" />;
      case 'Purchase': return <ShoppingCart className="w-4 h-4 text-green-600 dark:text-green-400" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 overflow-y-auto pb-24">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Сообщество</h1>
          <p className="text-gray-500 dark:text-nexus-nav text-sm">Активность ваших друзей</p>
        </div>
        <button className="p-3 bg-white dark:bg-nexus-card rounded-full hover:bg-gray-100 dark:hover:bg-white/10 active:scale-95 transition-all border border-gray-200 dark:border-transparent hover:border-cyan-400 dark:hover:border-nexus-cyan/30 group shadow-sm dark:shadow-none">
          <Users className="w-6 h-6 text-gray-500 dark:text-nexus-nav group-hover:text-cyan-600 dark:group-hover:text-nexus-cyan transition-colors" />
        </button>
      </header>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
         <div className="flex items-center gap-2 text-gray-500 dark:text-nexus-nav text-xs font-bold uppercase mr-2">
            <Filter className="w-4 h-4" />
            <span>Фильтр:</span>
        </div>
        <button
          onClick={() => setFilterType('All')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
            filterType === 'All'
              ? 'bg-cyan-50 dark:bg-nexus-cyan/10 border-cyan-500 dark:border-nexus-cyan text-cyan-700 dark:text-nexus-cyan'
              : 'bg-white dark:bg-nexus-card border-gray-200 dark:border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
          }`}
        >
          Вся активность
        </button>
        <button
          onClick={() => setFilterType('Achievement')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border ${
            filterType === 'Achievement'
              ? 'bg-cyan-50 dark:bg-nexus-cyan/10 border-cyan-500 dark:border-nexus-cyan text-cyan-700 dark:text-nexus-cyan'
              : 'bg-white dark:bg-nexus-card border-gray-200 dark:border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
          }`}
        >
          <Trophy className="w-3 h-3" />
          Только достижения
        </button>
      </div>

      {/* Activity Feed */}
      <div className="space-y-4">
        {filteredActivities.map((item) => (
          <div 
            key={item.id}
            className="bg-white dark:bg-nexus-card border border-gray-200 dark:border-transparent hover:border-cyan-400 dark:hover:border-nexus-cyan/30 rounded-xl p-4 transition-all duration-200 shadow-sm dark:shadow-none"
          >
            {/* Top Row: Avatar, User, Timestamp */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${item.avatarColor} flex items-center justify-center font-bold text-black shadow-lg`}>
                  {item.user.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white text-sm">{item.user}</div>
                  <div className="text-[10px] text-gray-500 dark:text-nexus-nav flex items-center gap-1">
                    {getActivityIcon(item.type)}
                    {item.type === 'Achievement' ? 'Достижение' : item.type === 'Review' ? 'Отзыв' : 'Покупка'}
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-gray-400 dark:text-nexus-nav font-mono">{item.timestamp}</span>
            </div>

            {/* Content */}
            <div className="mb-4 pl-[52px]">
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-1">{item.details}</p>
              <div className="text-cyan-600 dark:text-nexus-cyan font-bold text-sm tracking-wide">
                {item.game}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pl-[52px]">
              <button 
                onClick={() => handleReaction(item.user)}
                className="flex items-center gap-1.5 text-gray-500 dark:text-nexus-nav hover:text-red-500 dark:hover:text-red-400 transition-colors group"
              >
                <Heart className="w-4 h-4 group-active:scale-125 transition-transform" />
                <span className="text-xs font-medium group-hover:text-red-500 dark:group-hover:text-red-400">Лайк</span>
              </button>
              
              <button className="flex items-center gap-1.5 text-gray-500 dark:text-nexus-nav hover:text-gray-900 dark:hover:text-white transition-colors">
                <MessageSquare className="w-4 h-4" />
                <span className="text-xs font-medium">Коммент</span>
              </button>
            </div>
          </div>
        ))}

        {filteredActivities.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-nexus-nav">
            Нет активности для отображения.
          </div>
        )}
      </div>
    </div>
  );
};