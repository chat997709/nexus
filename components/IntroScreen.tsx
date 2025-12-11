import React, { useState, useEffect } from 'react';
import { Power, Cpu, ShieldCheck, Wifi, Loader2 } from 'lucide-react';

export const IntroScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [active, setActive] = useState(false);
  const [textStage, setTextStage] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const playBootSound = () => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        
        const ctx = new AudioContext();
        
        // Oscillator 1: Low Drone / Bass / Power Up
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(40, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3); // Pitch up
        osc1.frequency.linearRampToValueAtTime(40, ctx.currentTime + 1.8); // Pitch down
        
        gain1.gain.setValueAtTime(0, ctx.currentTime);
        gain1.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.1);
        gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);
        
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start();
        osc1.stop(ctx.currentTime + 1.8);

        // Oscillator 2: High Tech Chirp / Scanner
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'square';
        osc2.frequency.setValueAtTime(800, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.1);
        osc2.frequency.setValueAtTime(2000, ctx.currentTime + 0.1);
        osc2.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.3);
        
        gain2.gain.setValueAtTime(0, ctx.currentTime);
        gain2.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.05);
        gain2.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);

        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.4);

        // Oscillator 3: Digital Data Noise
        const osc3 = ctx.createOscillator();
        const gain3 = ctx.createGain();
        osc3.type = 'sine';
        osc3.frequency.setValueAtTime(1500, ctx.currentTime);
        
        gain3.gain.setValueAtTime(0, ctx.currentTime + 0.3);
        gain3.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.35);
        gain3.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
        gain3.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.5);
        gain3.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);

        osc3.connect(gain3);
        gain3.connect(ctx.destination);
        osc3.start();
        osc3.stop(ctx.currentTime + 1.0);

    } catch (e) {
        console.error("Audio error", e);
    }
  }

  const handleStart = () => {
    setActive(true);
    playBootSound();

    // Sequence the text
    setTimeout(() => setTextStage(1), 400); // System Check
    setTimeout(() => setTextStage(2), 1200); // Connection
    setTimeout(() => setTextStage(3), 2000); // Ready

    // Finish
    setTimeout(() => {
        setIsExiting(true);
        setTimeout(onComplete, 500); // Wait for exit animation
    }, 2800);
  };

  return (
    <div className={`fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden transition-opacity duration-500 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
        {/* CRT Scanline Overlay */}
        <div className="absolute inset-0 crt-overlay z-20 pointer-events-none opacity-50"></div>
        
        {/* Animated Background Grid */}
        <div className="absolute inset-0 z-0 opacity-20">
             <div className="w-full h-full bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px] animate-[pulse_4s_infinite]"></div>
        </div>

        <div className="relative z-10 w-full max-w-xs flex flex-col items-center">
            
            {/* Logo Section */}
            <div className={`mb-12 relative transition-all duration-700 ${active ? 'scale-110' : 'scale-100'}`}>
                <div className={`w-24 h-24 rounded-2xl border-2 border-nexus-cyan flex items-center justify-center relative shadow-[0_0_30px_rgba(0,255,255,0.3)] ${active ? 'animate-glitch bg-nexus-cyan/10' : 'bg-black'}`}>
                    <Power className={`w-12 h-12 text-nexus-cyan ${active ? 'animate-pulse' : ''}`} />
                    
                    {/* Corner accents */}
                    <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-white"></div>
                    <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-white"></div>
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-white"></div>
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-white"></div>
                </div>
                {active && <div className="absolute inset-0 bg-nexus-cyan blur-[40px] opacity-40 animate-pulse"></div>}
            </div>

            {/* Text Output Terminal */}
            <div className="h-24 w-full flex flex-col items-center justify-start space-y-2 font-mono text-xs tracking-widest text-nexus-cyan">
                {!active ? (
                    <button 
                        onClick={handleStart}
                        className="group relative px-8 py-3 overflow-hidden rounded border border-nexus-cyan/50 hover:border-nexus-cyan transition-all"
                    >
                        <div className="absolute inset-0 w-full h-full bg-nexus-cyan/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                        <span className="relative text-white font-bold animate-pulse">INITIALIZE SYSTEM</span>
                    </button>
                ) : (
                    <>
                         <div className="text-white">NEXUS_OS v4.2</div>
                         
                         {textStage >= 1 && (
                            <div className="flex items-center gap-2 text-emerald-400 animate-in slide-in-from-bottom-2 fade-in">
                                <Cpu className="w-3 h-3" /> CORE SYSTEMS... ONLINE
                            </div>
                         )}
                         {textStage >= 2 && (
                            <div className="flex items-center gap-2 text-emerald-400 animate-in slide-in-from-bottom-2 fade-in">
                                <Wifi className="w-3 h-3" /> NEURAL NET... CONNECTED
                            </div>
                         )}
                         {textStage >= 3 && (
                            <div className="flex items-center gap-2 text-white animate-in slide-in-from-bottom-2 fade-in font-bold">
                                <ShieldCheck className="w-3 h-3" /> ACCESS GRANTED
                            </div>
                         )}
                    </>
                )}
            </div>

            {/* Loading Bar (Visual only) */}
            {active && (
                <div className="w-64 h-1 bg-gray-900 rounded-full mt-8 overflow-hidden relative">
                    <div className="absolute inset-0 bg-nexus-cyan shadow-[0_0_10px_#00FFFF] animate-[shimmer_2s_infinite]"></div>
                </div>
            )}
        </div>
        
        {/* Footer */}
        <div className="absolute bottom-8 text-[10px] text-gray-600 font-mono">
            SECURE CONNECTION ESTABLISHED
        </div>
    </div>
  );
};