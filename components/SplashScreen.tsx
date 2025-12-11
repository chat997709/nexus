import React, { useEffect, useState, useRef } from 'react';
import { Gamepad2 } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  // Phase control: 0=Init, 1=Zoom, 2=Text, 3=Pulse, 4=Exit
  const [phase, setPhase] = useState(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const hasRunRef = useRef(false);

  // --- Sound Logic ---
  const playSound = (type: 'start' | 'chime' | 'pulse' | 'end') => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    
    // Try to force resume if suspended
    if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
    }

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'start') {
        // Deep digital power up
        osc.type = 'square';
        osc.frequency.setValueAtTime(100, t);
        osc.frequency.linearRampToValueAtTime(400, t + 0.6);
        
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.3, t + 0.1);
        gain.gain.linearRampToValueAtTime(0, t + 0.6);
        
        osc.start(t);
        osc.stop(t + 0.6);

    } else if (type === 'chime') {
        // High ethereal chime
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, t);
        osc.frequency.exponentialRampToValueAtTime(1200, t + 0.1);
        
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.5, t + 0.05); // Louder
        gain.gain.exponentialRampToValueAtTime(0.01, t + 1.2);
        
        osc.start(t);
        osc.stop(t + 1.2);

    } else if (type === 'pulse') {
        // Sharp radar blip
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, t);
        
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.3, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        
        osc.start(t);
        osc.stop(t + 0.3);

    } else if (type === 'end') {
        // Shutdown warp
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, t);
        osc.frequency.exponentialRampToValueAtTime(50, t + 0.4);
        
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.linearRampToValueAtTime(0, t + 0.4);
        
        osc.start(t);
        osc.stop(t + 0.5);
    }
  };

  useEffect(() => {
    // 1. Setup Audio Context
    try {
        const Ctx = window.AudioContext || (window as any).webkitAudioContext;
        if (Ctx) {
            const ctx = new Ctx();
            audioCtxRef.current = ctx;
            // Attempt auto-resume (works if user previously interacted with domain)
            ctx.resume().catch(() => {});
        }
    } catch(e) {
        console.error("Audio init error", e);
    }

    // 2. Global Unmute Listener
    // Since we removed the button, if the browser blocks autoplay, 
    // we catch the first click anywhere to unmute seamlessly.
    const unmuteHandler = () => {
        if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
        }
    };
    window.addEventListener('click', unmuteHandler);
    window.addEventListener('touchstart', unmuteHandler);
    window.addEventListener('keydown', unmuteHandler);

    // 3. Run Animation Sequence
    if (!hasRunRef.current) {
        hasRunRef.current = true;
        
        // Start immediately
        setPhase(1); 
        playSound('start');

        setTimeout(() => {
            setPhase(2); 
            playSound('chime');
        }, 1200);

        setTimeout(() => {
            setPhase(3); 
            playSound('pulse');
        }, 2500);

        setTimeout(() => {
             playSound('pulse');
        }, 3000);

        setTimeout(() => {
            setPhase(4); 
            playSound('end');
        }, 4000);

        setTimeout(() => {
            onComplete();
        }, 4500);
    }

    return () => {
        window.removeEventListener('click', unmuteHandler);
        window.removeEventListener('touchstart', unmuteHandler);
        window.removeEventListener('keydown', unmuteHandler);
        if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[100] bg-nexus-dark flex flex-col items-center justify-center overflow-hidden ${phase === 4 ? 'animate-splash-phase-4' : ''}`}>
      
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      {/* Main Container */}
      <div className={`relative flex flex-col items-center justify-center ${phase === 3 ? 'animate-splash-phase-3' : ''}`}>
        
        {/* ICON CONTAINER */}
        <div className={`mb-6 relative ${phase >= 1 ? 'animate-splash-phase-1' : 'opacity-0'}`}>
          <div className="w-24 h-24 flex items-center justify-center">
            <Gamepad2 className="w-20 h-20 text-white drop-shadow-[0_0_25px_rgba(0,255,255,0.8)]" />
          </div>
          {/* Subtle glow behind icon */}
          <div className="absolute inset-0 bg-nexus-cyan blur-[60px] opacity-30 animate-pulse"></div>
        </div>

        {/* TEXT CONTAINER */}
        <div className="h-12 overflow-hidden relative">
          <div className={`${phase >= 2 ? 'animate-splash-phase-2' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl font-black text-white uppercase tracking-[0.2em] text-center drop-shadow-lg">
              Nexus <span className="text-nexus-cyan">Play</span>
            </h1>
          </div>
        </div>
      </div>
      
      {/* Loading Line */}
      <div className={`absolute bottom-12 w-48 h-1 bg-gray-800 rounded-full overflow-hidden transition-opacity duration-500 ${phase >= 2 ? 'opacity-100' : 'opacity-0'}`}>
        <div className="h-full bg-nexus-cyan w-full animate-shimmer box-shadow-[0_0_10px_#00FFFF]"></div>
      </div>

    </div>
  );
};