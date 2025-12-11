import React from 'react';
import { CreditCard, Wallet, Plus, Zap, History, ChevronRight, Hexagon } from 'lucide-react';
import { useNotification } from './NotificationSystem';
import { Transaction } from '../types';

interface NexusWalletScreenProps {
  userBalance: number;
  transactions: Transaction[];
  onTopUp: (amount: number, bonusPercent: number) => void;
}

export const NexusWalletScreen: React.FC<NexusWalletScreenProps> = ({ userBalance, transactions, onTopUp }) => {
  const { addNotification } = useNotification();

  const handleTopUpClick = (amount: number, bonusPercent: number) => {
    const bonus = amount * (bonusPercent / 100);
    const totalCredit = amount + bonus;
    
    const confirm = window.confirm(`Initiate Transfer: $${amount.toFixed(2)}? \nBonus Credits: +$${bonus.toFixed(2)}`);
    if (confirm) {
      onTopUp(amount, bonusPercent);
      addNotification('Wallet Updated', `Successfully added $${totalCredit.toFixed(2)} to your balance.`, 'system');
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto pb-24 md:pb-8 perspective-container no-scrollbar">
      <header className="mb-8 max-w-5xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1" style={{ textShadow: '0 4px 10px rgba(0,0,0,0.1) dark:rgba(0,0,0,0.5)' }}>Wallet</h1>
        <p className="text-gray-500 dark:text-nexus-nav text-sm">Crypto-Credit Management</p>
      </header>

      <div className="max-w-5xl mx-auto w-full flex flex-col lg:flex-row gap-8">
          {/* Left Column: Card & Top Up */}
          <div className="flex-1 space-y-8">
            {/* 3D Holographic Card */}
            <div className="relative w-full h-64 transition-transform duration-500 transform-style-3d hover:rotate-x-2 group">
                {/* Glow behind - Only in dark mode */}
                <div className="absolute inset-4 bg-nexus-cyan blur-[50px] opacity-0 dark:opacity-30 animate-pulse-glow"></div>

                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black dark:glass-panel rounded-2xl border border-white/20 overflow-hidden flex flex-col justify-between p-6 shadow-2xl transform transition-transform group-hover:scale-[1.02]">
                    {/* Holographic Sheen */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-50 pointer-events-none"></div>
                    
                    <div className="flex justify-between items-start relative z-10">
                    <div className="flex items-center gap-2 text-nexus-cyan">
                        <Hexagon className="w-6 h-6 animate-spin-slow" />
                        <span className="font-mono text-xs tracking-[0.2em]">NEXUS_CREDIT</span>
                    </div>
                    <Wallet className="w-6 h-6 text-white/50" />
                    </div>

                    <div className="relative z-10 text-center transform translate-z-[20px]">
                    <div className="text-5xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]">
                        <span className="text-3xl align-top opacity-50">$</span>{userBalance.toFixed(2)}
                    </div>
                    </div>

                    <div className="flex justify-between items-end relative z-10 text-xs font-mono text-white/60">
                    <div>
                        <div>ACCT: 8842-X</div>
                        <div className="text-nexus-cyan">ACTIVE</div>
                    </div>
                    <div className="w-12 h-8 bg-yellow-500/20 rounded border border-yellow-500/50 flex items-center justify-center">
                        <div className="w-6 h-4 border border-yellow-500 rounded-sm opacity-50"></div>
                    </div>
                    </div>
                </div>
            </div>

            {/* 3D Action Buttons */}
            <div className="preserve-3d">
                <h2 className="text-gray-900 dark:text-white font-bold text-lg mb-4 flex items-center gap-2 pl-2">
                <Zap className="w-5 h-5 text-nexus-cyan" /> Instant Charge
                </h2>
                <div className="grid grid-cols-3 gap-4">
                <TopUpButton amount={10} bonus={2} onClick={() => handleTopUpClick(10, 2)} />
                <TopUpButton amount={25} bonus={5} isPopular onClick={() => handleTopUpClick(25, 5)} />
                <TopUpButton amount={50} bonus={10} onClick={() => handleTopUpClick(50, 10)} />
                </div>
            </div>
          </div>

          {/* Right Column: History */}
          <div className="flex-1 lg:max-w-md">
            <div className="glass-panel rounded-xl p-6 h-full min-h-[400px]">
                <h2 className="text-gray-900 dark:text-white font-bold text-lg mb-4 flex items-center gap-2">
                <History className="w-5 h-5 text-gray-500 dark:text-nexus-nav" /> Purchase History
                </h2>
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {transactions.length > 0 ? (
                        transactions.map((tx) => (
                            <TransactionItem 
                                key={tx.id}
                                title={tx.description} 
                                date={formatDate(tx.date)} 
                                amount={(tx.type === 'TOP_UP' ? '+' : '-') + tx.amount.toFixed(2)} 
                                isPositive={tx.type === 'TOP_UP'} 
                            />
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-500 text-sm">
                            <div className="bg-gray-100 dark:bg-white/5 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                                <History className="w-6 h-6 opacity-50" />
                            </div>
                            No transactions found.
                        </div>
                    )}
                </div>
            </div>
          </div>
      </div>
    </div>
  );
};

const TopUpButton: React.FC<{ 
  amount: number; 
  bonus: number; 
  onClick: () => void;
  isPopular?: boolean;
}> = ({ amount, bonus, onClick, isPopular }) => (
  <button 
    onClick={onClick}
    className={`group relative h-24 rounded-xl border transition-all duration-200 active:scale-95 transform-style-3d ${
      isPopular 
        ? 'bg-cyan-50 dark:bg-nexus-cyan/20 border-nexus-cyan shadow-sm dark:shadow-[0_0_20px_rgba(0,255,255,0.2)]' 
        : 'glass-panel border-gray-200 dark:border-white/10 hover:bg-white/50 dark:hover:bg-white/5'
    }`}
  >
    {isPopular && (
      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-nexus-cyan text-black text-[9px] font-black px-3 py-0.5 rounded-full shadow-lg z-20">
        POPULAR
      </span>
    )}
    <div className="flex flex-col items-center justify-center h-full transform group-hover:translate-z-[10px] transition-transform">
        <span className="text-gray-900 dark:text-white font-bold text-xl drop-shadow-md">${amount}</span>
        <span className={`text-[10px] font-medium mt-1 ${isPopular ? 'text-cyan-700 dark:text-nexus-cyan' : 'text-gray-500 dark:text-gray-400'}`}>+{bonus}% Bonus</span>
    </div>
  </button>
);

const TransactionItem: React.FC<{
    title: string;
    date: string;
    amount: string;
    isPositive?: boolean;
}> = ({ title, date, amount, isPositive }) => (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors group cursor-pointer">
        <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-inner ${isPositive ? 'bg-cyan-100 dark:bg-nexus-cyan/20 shadow-none dark:shadow-nexus-cyan/20' : 'bg-gray-200 dark:bg-black/40'}`}>
                {isPositive ? <Plus className="w-4 h-4 text-cyan-700 dark:text-nexus-cyan" /> : <CreditCard className="w-4 h-4 text-gray-500 dark:text-gray-400" />}
            </div>
            <div>
                <div className="text-gray-900 dark:text-white text-sm font-medium group-hover:text-nexus-cyan transition-colors">{title}</div>
                <div className="text-gray-500 dark:text-nexus-nav text-xs">{date}</div>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <span className={`font-bold ${isPositive ? 'text-cyan-600 dark:text-nexus-cyan drop-shadow-sm dark:drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]' : 'text-gray-900 dark:text-white'}`}>
                {amount}
            </span>
            <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600 group-hover:translate-x-1 transition-transform" />
        </div>
    </div>
);