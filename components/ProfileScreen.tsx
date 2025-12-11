import React from 'react';
import { User } from '../types';
import { Trophy, Clock, ShoppingBag, Settings, LogOut, Edit2 } from 'lucide-react';
import { Icon3D } from './Icon3D';

interface ProfileScreenProps {
  user: User | null;
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onLogout }) => {
  if (!user) return null;

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto pb-24 md:pb-8 perspective-container no-scrollbar">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header / Banner */}
        <div className="relative mb-20 preserve-3d">
            <div className="h-32 md:h-48 bg-gradient-to-r from-gray-200 to-gray-800 dark:from-nexus-card dark:to-nexus-dark rounded-xl border-b border-cyan-400/20 dark:border-nexus-cyan/20 overflow-hidden relative group">
                <div className="absolute inset-0 bg-cyan-400/5 dark:bg-nexus-cyan/5 group-hover:bg-cyan-400/10 dark:group-hover:bg-nexus-cyan/10 transition-colors"></div>
                {/* Animated Mesh Grid inside Banner */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            </div>
            
            {/* 3D Avatar Coin */}
            <div className="absolute -bottom-12 left-6 md:left-10 preserve-3d group cursor-pointer">
                <div className="w-24 h-24 md:w-32 md:h-32 relative preserve-3d transition-transform duration-700 ease-in-out group-hover:rotate-y-[180deg]">
                    {/* Front of Coin */}
                    <div className="absolute inset-0 rounded-full bg-gray-900 dark:bg-black border-4 border-cyan-500 dark:border-nexus-cyan flex items-center justify-center text-3xl md:text-5xl font-bold text-white shadow-[0_0_30px_rgba(0,255,255,0.4)] backface-hidden">
                        {user.avatar ? (
                            <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                        ) : (
                            <span className="drop-shadow-lg">{user.name[0]}{user.surname[0]}</span>
                        )}
                    </div>
                    {/* Back of Coin */}
                    <div className="absolute inset-0 rounded-full bg-cyan-500 dark:bg-nexus-cyan border-4 border-white flex items-center justify-center text-black font-black backface-hidden" style={{ transform: 'rotateY(180deg)' }}>
                        LVL 42
                    </div>
                    {/* Side/Thickness of Coin (Simulated with shadow/border) */}
                    <div className="absolute inset-0 rounded-full border-4 border-cyan-500/50 dark:border-nexus-cyan/50 blur-sm -z-10 translate-z-[-4px]"></div>
                </div>
                
                <button className="absolute -right-2 bottom-0 z-20 bg-white dark:bg-nexus-card border border-gray-200 dark:border-white/20 p-2 rounded-full hover:bg-cyan-400 dark:hover:bg-nexus-cyan hover:text-black transition-all hover:scale-110 shadow-lg translate-z-[10px]">
                    <Edit2 className="w-4 h-4" />
                </button>
            </div>
        </div>

        {/* User Info */}
        <div className="px-2 md:px-0 mb-8 animate-fade-in-up flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
                <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-1 flex items-center gap-2 tracking-tight">
                    {user.name} <span className="text-cyan-600 dark:text-nexus-cyan font-light">{user.surname}</span>
                </h1>
                <p className="text-gray-500 dark:text-nexus-nav text-sm mb-2 font-mono">{user.email}</p>
                <div className="inline-flex items-center px-3 py-1 rounded bg-cyan-50 dark:bg-nexus-cyan/10 border border-cyan-200 dark:border-nexus-cyan/30 text-cyan-700 dark:text-nexus-cyan text-[10px] font-bold tracking-widest uppercase shadow-sm dark:shadow-[0_0_10px_rgba(0,255,255,0.1)]">
                    Nexus Elite Member
                </div>
            </div>
            
            {/* Desktop specific extra info could go here */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column: Stats */}
            <div className="md:col-span-2">
                 {/* 3D Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-8 preserve-3d">
                    <StatsCard 
                        icon={Clock} 
                        value={user.stats.hoursPlayed} 
                        label="Hours" 
                        color="#60A5FA" // blue
                    />
                    <StatsCard 
                        icon={Trophy} 
                        value={user.stats.achievementsUnlocked} 
                        label="Trophies" 
                        color="#FACC15" // yellow
                    />
                    <StatsCard 
                        icon={ShoppingBag} 
                        value={user.stats.gamesOwned} 
                        label="Library" 
                        color="#4ADE80" // green
                    />
                </div>
                
                {/* Account Details Block */}
                 <h2 className="text-gray-900 dark:text-white font-bold text-lg border-b border-gray-200 dark:border-white/10 pb-2 flex items-center gap-2 mb-4">
                    <Settings className="w-5 h-5 text-cyan-600 dark:text-nexus-cyan" />
                    Profile Details
                </h2>
                <div className="glass-panel rounded-xl p-6 space-y-4 card-3d">
                    <div className="flex justify-between items-center text-sm border-b border-gray-200 dark:border-white/5 pb-2">
                        <span className="text-gray-500 dark:text-nexus-nav">Date of Birth</span>
                        <span className="text-gray-800 dark:text-white font-mono">{user.dob}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 dark:text-nexus-nav">Account Status</span>
                        <span className="text-green-600 dark:text-green-400 font-bold bg-green-100 dark:bg-green-400/10 px-2 py-0.5 rounded shadow-sm dark:shadow-[0_0_5px_rgba(74,222,128,0.3)]">Active</span>
                    </div>
                </div>
            </div>

            {/* Right Column: Actions */}
            <div className="space-y-4">
                <button className="w-full flex items-center justify-between p-4 bg-white dark:bg-nexus-card rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all group border border-gray-200 dark:border-transparent hover:border-cyan-400 dark:hover:border-nexus-cyan/30 card-3d shadow-sm dark:shadow-none">
                    <div className="flex items-center gap-3">
                        <Icon3D icon={Settings} size={20} color="#888888" isActive={false} depth={2} />
                        <span className="text-gray-900 dark:text-white text-sm font-medium">Account Settings</span>
                    </div>
                </button>

                <button 
                    onClick={onLogout}
                    className="w-full flex items-center justify-center gap-2 p-4 border border-red-500/30 text-red-500 rounded-xl hover:bg-red-500/10 transition-all active:scale-95 group"
                >
                    <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    <span className="font-bold text-sm">Log Out</span>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

const StatsCard: React.FC<{ icon: any, value: number, label: string, color: string }> = ({ icon, value, label, color }) => (
    <div className="glass-panel p-4 rounded-2xl border border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/20 transition-all text-center group preserve-3d hover:translate-y-[-5px]">
        <div className="flex justify-center mb-3 h-8 preserve-3d">
            <Icon3D icon={icon} size={28} color={color} isActive={true} depth={4} />
        </div>
        <div className="text-2xl font-black text-gray-900 dark:text-white transform translate-z-[10px] drop-shadow-md">{value}</div>
        <div className="text-[10px] text-gray-500 dark:text-nexus-nav uppercase font-bold tracking-wider">{label}</div>
    </div>
);