import React, { useState } from 'react';
import { Check, Star, Zap, Crown, ArrowRight } from 'lucide-react';

interface SubscriptionScreenProps {
  onComplete: (plan: 'Free' | 'Plus' | 'Ultra') => void;
}

type PlanType = 'Free' | 'Plus' | 'Ultra';

export const SubscriptionScreen: React.FC<SubscriptionScreenProps> = ({ onComplete }) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('Plus'); // Default to Plus for conversion

  const handleFinish = () => {
    // Simulate Alert
    window.alert("Онбординг завершен! Ваши настройки применены.");
    onComplete(selectedPlan);
  };

  return (
    <div className="flex-1 flex flex-col p-6 bg-nexus-dark relative overflow-hidden z-20">
      {/* Background glow */}
      <div className="absolute top-[40%] left-[-20%] w-[300px] h-[300px] bg-nexus-cyan/5 rounded-full blur-[100px]" />
      
      <div className="flex-1 flex flex-col justify-center relative z-10">
        <header className="mb-6 text-center">
          <div className="flex justify-center mb-4">
             <div className="p-3 bg-nexus-cyan/10 rounded-full border border-nexus-cyan/30">
                <Crown className="w-8 h-8 text-nexus-cyan" />
             </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 leading-tight">Получите максимальную выгоду!</h2>
          <p className="text-nexus-nav text-sm">Выберите уровень доступа, который подходит вам.</p>
        </header>

        <div className="space-y-3 mb-8">
          {/* Option 1: Free */}
          <button
            onClick={() => setSelectedPlan('Free')}
            className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all duration-300 ${
              selectedPlan === 'Free'
                ? 'bg-white/10 border-white text-white'
                : 'bg-nexus-card border-transparent hover:bg-white/5 text-gray-400'
            }`}
          >
            <div className="flex items-center gap-3 text-left">
              <div className={`p-2 rounded-full ${selectedPlan === 'Free' ? 'bg-white text-black' : 'bg-white/5 text-gray-500'}`}>
                <Check className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-sm">Продолжить бесплатно</div>
                <div className="text-[10px] opacity-70">Базовый доступ к магазину</div>
              </div>
            </div>
            {selectedPlan === 'Free' && <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_8px_white]"></div>}
          </button>

          {/* Option 2: Plus */}
          <button
            onClick={() => setSelectedPlan('Plus')}
            className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all duration-300 relative overflow-hidden ${
              selectedPlan === 'Plus'
                ? 'bg-nexus-cyan/10 border-nexus-cyan text-white'
                : 'bg-nexus-card border-transparent hover:bg-white/5 text-gray-400'
            }`}
          >
            <div className="flex items-center gap-3 text-left relative z-10">
              <div className={`p-2 rounded-full ${selectedPlan === 'Plus' ? 'bg-nexus-cyan text-black' : 'bg-white/5 text-gray-500'}`}>
                <Star className="w-4 h-4" />
              </div>
              <div>
                <div className={`font-bold text-sm ${selectedPlan === 'Plus' ? 'text-nexus-cyan' : ''}`}>Nexus Play+</div>
                <div className="text-[10px] opacity-70">7 дней бесплатно • Расширенные скидки</div>
              </div>
            </div>
             {selectedPlan === 'Plus' && <div className="absolute right-4 w-3 h-3 bg-nexus-cyan rounded-full shadow-[0_0_8px_#00FFFF]"></div>}
          </button>

          {/* Option 3: Ultra */}
          <button
            onClick={() => setSelectedPlan('Ultra')}
            className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all duration-300 relative overflow-hidden group ${
              selectedPlan === 'Ultra'
                ? 'bg-gradient-to-r from-purple-500/20 to-nexus-cyan/20 border-nexus-cyan text-white'
                : 'bg-nexus-card border-transparent hover:bg-white/5 text-gray-400'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-200%] group-hover:animate-shimmer"></div>
            
            <div className="flex items-center gap-3 text-left relative z-10">
              <div className={`p-2 rounded-full ${selectedPlan === 'Ultra' ? 'bg-gradient-to-br from-nexus-cyan to-purple-500 text-black' : 'bg-white/5 text-gray-500'}`}>
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className={`font-bold text-sm ${selectedPlan === 'Ultra' ? 'text-transparent bg-clip-text bg-gradient-to-r from-nexus-cyan to-purple-400' : ''}`}>Nexus Ultra</div>
                <div className="text-[10px] opacity-70 max-w-[200px]">3 дня бесплатно • Play+ и Стриминг ПК-игр</div>
              </div>
            </div>
             {selectedPlan === 'Ultra' && <div className="absolute right-4 w-3 h-3 bg-nexus-cyan rounded-full shadow-[0_0_8px_#00FFFF]"></div>}
          </button>
        </div>

        {/* Action Button */}
        <button 
          onClick={handleFinish}
          className="w-full bg-nexus-cyan text-black font-bold py-4 rounded-xl uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-[#80FFFF] active:scale-95 transition-all shadow-[0_0_20px_rgba(0,255,255,0.3)]"
        >
          Завершить и перейти в Магазин
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};