import React, { useState } from 'react';
import { ArrowRight, Tag } from 'lucide-react';

interface GenreSelectScreenProps {
  onNext: (genres: string[]) => void;
}

const GENRES = [
  'RPG', 
  'Стратегии', 
  'Головоломки', 
  'Экшн', 
  'Казуальные', 
  'Соревновательные', 
  'Симуляторы', 
  'Хоррор'
];

export const GenreSelectScreen: React.FC<GenreSelectScreenProps> = ({ onNext }) => {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleNext = () => {
    if (selectedGenres.length >= 3) {
      window.alert(`Выбраны жанры: ${selectedGenres.join(', ')}. Переход далее...`);
      onNext(selectedGenres);
    }
  };

  const isValid = selectedGenres.length >= 3;

  return (
    <div className="flex-1 flex flex-col p-6 bg-nexus-dark relative overflow-hidden z-20">
      {/* Background glow */}
      <div className="absolute bottom-[10%] left-[-10%] w-[250px] h-[250px] bg-nexus-cyan/5 rounded-full blur-[90px]" />
      
      <div className="flex-1 flex flex-col justify-center relative z-10">
        <header className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Какие жанры вас увлекают?</h2>
          <p className="text-nexus-nav text-sm">
            Выберите не менее 3-х жанров для персонализации ленты.
          </p>
        </header>

        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {GENRES.map((genre) => {
            const isSelected = selectedGenres.includes(genre);
            return (
              <button
                key={genre}
                onClick={() => toggleGenre(genre)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 border ${
                  isSelected
                    ? 'bg-nexus-cyan text-black border-nexus-cyan shadow-[0_0_10px_rgba(0,255,255,0.4)] transform scale-105'
                    : 'bg-nexus-card text-gray-400 border-transparent hover:border-white/20 hover:text-white'
                }`}
              >
                {genre}
              </button>
            );
          })}
        </div>

        {/* Selected Count Indicator */}
        <div className="text-center mb-8 text-xs font-mono">
          <span className={isValid ? "text-nexus-cyan" : "text-nexus-nav"}>
            {selectedGenres.length}
          </span>
          <span className="text-nexus-nav"> / 3 required</span>
        </div>

        {/* Next Button */}
        <button 
          onClick={handleNext}
          disabled={!isValid}
          className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all ${
            isValid 
              ? 'bg-nexus-cyan text-black hover:bg-[#80FFFF] active:scale-95 shadow-[0_0_20px_rgba(0,255,255,0.3)]' 
              : 'bg-nexus-card text-gray-500 cursor-not-allowed'
          }`}
        >
          Далее
          <ArrowRight className={`w-5 h-5 ${!isValid && 'opacity-50'}`} />
        </button>
      </div>
    </div>
  );
};