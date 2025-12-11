import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, MousePointer2 } from 'lucide-react';
import { Gamepad3D } from './Gamepad3D';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const playSound = (type: 'hover' | 'click') => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        const t = ctx.currentTime;

        if (type === 'hover') {
            // Subtle high-tech chirp
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, t);
            osc.frequency.exponentialRampToValueAtTime(1200, t + 0.05);
            
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.02, t + 0.01); // Very quiet
            gain.gain.linearRampToValueAtTime(0, t + 0.1);
            
            osc.start(t);
            osc.stop(t + 0.1);
        } else if (type === 'click') {
            // Digital confirm
            osc.type = 'square';
            osc.frequency.setValueAtTime(400, t);
            osc.frequency.exponentialRampToValueAtTime(100, t + 0.15);
            
            gain.gain.setValueAtTime(0.05, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
            
            osc.start(t);
            osc.stop(t + 0.15);
        }
    } catch (e) {
        // Ignore audio errors
    }
  };

  const handleStartInteraction = () => {
      playSound('click');
      // Small delay to allow sound to start before unmount if needed, 
      // though React state updates usually allow enough time for async audio triggers
      onStart();
  };

  // Handle Parallax Effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate mouse position relative to center of the container
    // Range: -1 to 1
    const mouseX = ((e.clientX - rect.left) / width) * 2 - 1;
    const mouseY = ((e.clientY - rect.top) / height) * 2 - 1;

    // Apply rotation limits (e.g., max 20 degrees tilt)
    // RotateY corresponds to X movement (left/right)
    // RotateX corresponds to Y movement (up/down) - inverted for natural feel
    setRotation({
        x: mouseY * -20, 
        y: mouseX * 20
    });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setIsHovering(false);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden z-20 perspective-container cursor-default"
    >
      
      <div className="relative z-10 flex flex-col items-center w-full preserve-3d">
        
        {/* INTERACTIVE 3D MODEL CONTAINER */}
        <div 
            className="mb-16 relative group cursor-pointer preserve-3d transition-transform duration-300 ease-out"
            onClick={handleStartInteraction}
            onMouseEnter={() => playSound('hover')}
            style={{ transform: `scale(${isHovering ? 1.05 : 1})` }}
        >
          {/* Holographic Base Grid */}
          <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 w-48 h-48 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.2),transparent_70%)] rounded-full transform rotateX(70deg) translate-z-[-50px] pointer-events-none">
             <div className="absolute inset-0 animate-[spin_10s_linear_infinite] opacity-30 border-2 border-dashed border-nexus-cyan/30 rounded-full"></div>
          </div>

          {/* Back Glow Layer */}
          <div className={`absolute inset-0 bg-nexus-cyan blur-[100px] transition-opacity duration-500 translate-z-[-50px] ${isHovering ? 'opacity-40' : 'opacity-20'}`}></div>
          
          {/* The Interactive Model */}
          <Gamepad3D 
            rotateX={rotation.x} 
            rotateY={rotation.y} 
            isHovered={isHovering}
          />
          
          {/* Interaction Prompt (Only visible when hovering) */}
          <div className={`absolute -right-12 top-0 transition-all duration-300 ${isHovering ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
              <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono text-nexus-cyan border border-nexus-cyan/30 flex items-center gap-1 shadow-[0_0_10px_rgba(0,255,255,0.2)]">
                  <MousePointer2 className="w-3 h-3" /> INTERACT
              </div>
          </div>
        </div>

        {/* 3D Typography */}
        <div className="text-center mb-8 preserve-3d" style={{ transform: `translateZ(20px) rotateX(${rotation.x * 0.5}deg) rotateY(${rotation.y * 0.5}deg)` }}>
            <h1 className="text-5xl font-black text-white leading-tight mb-2" style={{ textShadow: '0 10px 30px rgba(0,0,0,0.8)' }}>
            <span className="block text-2xl bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500 mb-1">WELCOME TO</span>
            <span className="text-nexus-cyan drop-shadow-[0_0_15px_rgba(0,255,255,0.8)] tracking-wider">NEXUS PLAY</span>
            </h1>
            
            <p className="text-gray-400 text-sm font-mono max-w-[280px] mx-auto opacity-80">
            System Online. Neural Link Established.
            </p>
        </div>

        {/* 3D Button */}
        <button 
          onClick={handleStartInteraction}
          onMouseEnter={() => playSound('hover')}
          className="group relative w-full max-w-[280px] h-14 preserve-3d active:scale-95 transition-all duration-200"
          style={{ transform: `translateZ(40px) rotateX(${rotation.x * 0.2}deg) rotateY(${rotation.y * 0.2}deg)` }}
        >
          {/* Button Glow */}
          <div className="absolute inset-0 bg-nexus-cyan rounded-xl blur opacity-20 group-hover:opacity-50 transition-opacity"></div>
          
          {/* Main Button Body */}
          <div className="absolute inset-0 bg-nexus-dark rounded-xl border border-nexus-cyan/50 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(0,255,255,0.15)] group-hover:bg-nexus-cyan/10 transition-colors">
            <span className="text-white font-black uppercase tracking-widest text-xs group-hover:text-nexus-cyan transition-colors">Initialize System</span>
            <ArrowRight className="w-4 h-4 text-nexus-cyan group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>
    </div>
  );
};