import React, { useState } from 'react';
import { Gamepad2, Hand, LayoutGrid, ArrowRight } from 'lucide-react';

interface ControlSelectScreenProps {
  onNext: (preference: 'Touch' | 'Gamepad' | 'Both') => void;
}

type ControlType = 'Touch' | 'Gamepad' | 'Both';

export const ControlSelectScreen: React.FC<ControlSelectScreenProps> = ({ onNext }) => {
  const [selected, setSelected] = useState<ControlType | null>(null);

  const handleNext = () => {
    if (selected) {
      // Requested Alert simulation
      window.alert(`Выбран тип управления: ${selected}`);
      onNext(selected);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 bg-nexus-dark relative overflow-hidden z-20">
      {/* Background glow */}
      <div className="absolute top-[20%] right-[-10%] w-[200px] h-[200px] bg-nexus-cyan/5 rounded-full blur-[80px]" />
      
      <div className="flex-1 flex flex-col justify-center relative z-10">
        <header className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Как вы предпочитаете играть?</h2>
          <p className="text-nexus-nav text-sm">Мы настроим фильтры под ваш выбор.</p>
        </header>

        <div className="space-y-4 mb-8">
          {/* Card 1: Touch */}
          <button
            onClick={() => setSelected('Touch')}
            className={`w-full p-5 rounded-xl border flex items-center gap-4 transition-all duration-300 group ${
              selected === 'Touch'
                ? 'bg-nexus-cyan/10 border-nexus-cyan shadow-[0_0_15px_rgba(0,255,255,0.15)]'
                : 'bg-nexus-card border-transparent hover:bg-white/5'
            }`}
          >
            <div className={`p-3 rounded-full transition-colors ${selected === 'Touch' ? 'bg-nexus-cyan text-black' : 'bg-white/10 text-gray-400'}`}>
              <Hand className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className={`font-bold text-lg transition-colors ${selected === 'Touch' ? 'text-nexus-cyan' : 'text-white'}`}>
                Сенсорный экран (Touch)
              </div>
              <div className="text-xs text-nexus-nav">Для игр на ходу</div>
            </div>
          </button>

          {/* Card 2: Gamepad */}
          <button
            onClick={() => setSelected('Gamepad')}
            className={`w-full p-5 rounded-xl border flex items-center gap-4 transition-all duration-300 group ${
              selected === 'Gamepad'
                ? 'bg-nexus-cyan/10 border-nexus-cyan shadow-[0_0_15px_rgba(0,255,255,0.15)]'
                : 'bg-nexus-card border-transparent hover:bg-white/5'
            }`}
          >
            <div className={`p-3 rounded-full transition-colors ${selected === 'Gamepad' ? 'bg-nexus-cyan text-black' : 'bg-white/10 text-gray-400'}`}>
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className={`font-bold text-lg transition-colors ${selected === 'Gamepad' ? 'text-nexus-cyan' : 'text-white'}`}>
                Геймпад (Gamepad)
              </div>
              <div className="text-xs text-nexus-nav">Для максимального контроля</div>
            </div>
          </button>

          {/* Card 3: Both */}
          <button
            onClick={() => setSelected('Both')}
            className={`w-full p-5 rounded-xl border flex items-center gap-4 transition-all duration-300 group ${
              selected === 'Both'
                ? 'bg-nexus-cyan/10 border-nexus-cyan shadow-[0_0_15px_rgba(0,255,255,0.15)]'
                : 'bg-nexus-card border-transparent hover:bg-white/5'
            }`}
          >
            <div className={`p-3 rounded-full transition-colors ${selected === 'Both' ? 'bg-nexus-cyan text-black' : 'bg-white/10 text-gray-400'}`}>
              <LayoutGrid className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className={`font-bold text-lg transition-colors ${selected === 'Both' ? 'text-nexus-cyan' : 'text-white'}`}>
                Оба варианта
              </div>
              <div className="text-xs text-nexus-nav">Показывать все игры</div>
            </div>
          </button>
        </div>

        {/* Next Button */}
        <button 
          onClick={handleNext}
          disabled={!selected}
          className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all ${
            selected 
              ? 'bg-nexus-cyan text-black hover:bg-[#80FFFF] active:scale-95 shadow-[0_0_20px_rgba(0,255,255,0.3)]' 
              : 'bg-nexus-card text-gray-500 cursor-not-allowed'
          }`}
        >
          Далее
          <ArrowRight className={`w-5 h-5 ${!selected && 'opacity-50'}`} />
        </button>
      </div>
    </div>
  );
};