import React, { useState, useEffect } from 'react';

interface Gamepad3DProps {
  className?: string;
  rotateX?: number; // Tilt up/down
  rotateY?: number; // Tilt left/right
  isHovered?: boolean;
}

export const Gamepad3D: React.FC<Gamepad3DProps> = ({ 
  className, 
  rotateX = 0, 
  rotateY = 0,
  isHovered = false
}) => {
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [ledPulse, setLedPulse] = useState(false);

  // Auto pulse LED if not hovered
  useEffect(() => {
    const interval = setInterval(() => {
        setLedPulse(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleBtnClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // Prevent triggering parent click immediately
    setActiveButton(id);
    setTimeout(() => setActiveButton(null), 200);
  };

  // Smooth out the rotation values for CSS
  const style = {
    transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateX * 0.1}deg)`,
    transition: 'transform 0.1s ease-out'
  };

  return (
    <div className={`relative w-64 h-40 preserve-3d ${className}`} style={style}>
      
      {/* FLOATING PARTICLES (Parallax layer) */}
      <div className="absolute inset-[-40px] pointer-events-none preserve-3d">
         <div className="absolute top-0 right-0 w-2 h-2 bg-nexus-cyan rounded-full opacity-60 transform translate-z-[40px]" style={{ transform: `translateZ(40px) translate(${rotateY * 2}px, ${rotateX * 2}px)` }}></div>
         <div className="absolute bottom-10 left-0 w-1 h-1 bg-white rounded-full opacity-40 transform translate-z-[60px]" style={{ transform: `translateZ(60px) translate(${rotateY * -1}px, ${rotateX * -1}px)` }}></div>
         <div className="absolute top-1/2 left-1/2 w-24 h-24 border border-nexus-cyan/20 rounded-full transform -translate-x-1/2 -translate-y-1/2 translate-z-[-20px] animate-pulse"></div>
      </div>

      {/* --- MAIN BODY --- */}
      <div className="absolute inset-0 preserve-3d">
        {/* Front Face */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2a2a2a] to-[#111] rounded-[50px] border-b-4 border-r-2 border-nexus-cyan/40 shadow-[0_20px_50px_rgba(0,0,0,0.8)] preserve-3d overflow-hidden">
           {/* Texture/Grid */}
           <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:10px_10px]"></div>
           {/* Sheen */}
           <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent skew-x-12"></div>
        </div>
        
        {/* Thickness/Side Layers for 3D depth illusion */}
        {[1,2,3,4,5].map(i => (
             <div key={i} className="absolute inset-0 bg-[#0f0f0f] rounded-[50px] -z-10" style={{ transform: `translateZ(-${i * 2}px)` }}></div>
        ))}
        
        {/* Grips */}
        <div className="absolute -left-2 bottom-[-15px] w-20 h-28 bg-[#1a1a1a] rounded-[30px] -z-20 transform rotate-[-15deg] translate-z-[-10px] border-l border-white/5"></div>
        <div className="absolute -right-2 bottom-[-15px] w-20 h-28 bg-[#1a1a1a] rounded-[30px] -z-20 transform rotate-[15deg] translate-z-[-10px] border-r border-white/5"></div>
      </div>

      {/* --- CONTROLS LAYER (Lifted off body) --- */}
      <div className="absolute inset-0 preserve-3d" style={{ transform: 'translateZ(10px)' }}>
          
          {/* D-Pad */}
          <div className="absolute top-10 left-10 w-16 h-16 preserve-3d">
             <div className="absolute top-5 left-0 w-full h-6 bg-[#222] rounded shadow-[0_2px_5px_black]"></div>
             <div className="absolute top-0 left-5 w-6 h-full bg-[#222] rounded shadow-[0_2px_5px_black]"></div>
             {/* Center indentation */}
             <div className="absolute top-5 left-5 w-6 h-6 bg-[#151515] rounded-full flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-black opacity-50 shadow-inner"></div>
             </div>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-10 right-10 w-16 h-16 preserve-3d">
             <div className="relative w-full h-full">
                <GamepadButton active={activeButton === 1} onClick={(e) => handleBtnClick(e, 1)} color="bg-cyan-500" pos="bottom-0 left-1/2 -translate-x-1/2" label="A" />
                <GamepadButton active={activeButton === 2} onClick={(e) => handleBtnClick(e, 2)} color="bg-red-500" pos="right-0 top-1/2 -translate-y-1/2" label="B" />
                <GamepadButton active={activeButton === 3} onClick={(e) => handleBtnClick(e, 3)} color="bg-blue-500" pos="left-0 top-1/2 -translate-y-1/2" label="X" />
                <GamepadButton active={activeButton === 4} onClick={(e) => handleBtnClick(e, 4)} color="bg-yellow-500" pos="top-0 left-1/2 -translate-x-1/2" label="Y" />
             </div>
          </div>

          {/* Analog Sticks */}
          <div className="absolute bottom-8 left-20 w-12 h-12 preserve-3d">
              <div className="w-full h-full rounded-full bg-[#111] border border-gray-700 shadow-xl flex items-center justify-center"
                   style={{ transform: `translateZ(5px) rotateX(${rotateX * -0.5}deg) rotateY(${rotateY * -0.5}deg)` }}>
                  <div className="w-10 h-10 rounded-full bg-gray-800 border-t border-white/10 shadow-[inset_0_2px_5px_rgba(0,0,0,1)]"></div>
              </div>
          </div>
          <div className="absolute bottom-4 right-20 w-12 h-12 preserve-3d">
              <div className="w-full h-full rounded-full bg-[#111] border border-gray-700 shadow-xl flex items-center justify-center"
                   style={{ transform: `translateZ(5px) rotateX(${rotateX * -0.5}deg) rotateY(${rotateY * -0.5}deg)` }}>
                   <div className="w-10 h-10 rounded-full bg-gray-800 border-t border-white/10 shadow-[inset_0_2px_5px_rgba(0,0,0,1)]"></div>
              </div>
          </div>

          {/* Center Display / Status Light */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-20 h-12 bg-black rounded-lg border border-gray-800 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)]">
             {/* Scanline */}
             <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[size:100%_4px] z-10 pointer-events-none"></div>
             
             {/* Screen Glow */}
             <div className={`w-16 h-8 bg-nexus-cyan/10 rounded flex items-center justify-center relative transition-all duration-1000 ${isHovered || ledPulse ? 'shadow-[0_0_20px_rgba(0,255,255,0.4)]' : ''}`}>
                 <span className={`font-mono text-[8px] tracking-widest text-nexus-cyan transition-opacity duration-300 ${isHovered || ledPulse ? 'opacity-100' : 'opacity-50'}`}>
                    {isHovered ? 'LINKED' : 'READY'}
                 </span>
             </div>
          </div>
      </div>

    </div>
  );
};

const GamepadButton = ({ active, onClick, color, pos, label }: any) => (
    <div 
        onClick={onClick}
        className={`absolute ${pos} w-5 h-5 rounded-full ${color} shadow-[0_2px_4px_black,inset_0_1px_2px_rgba(255,255,255,0.4)] flex items-center justify-center cursor-pointer transition-all duration-100`}
        style={{ 
            transform: active ? 'translateZ(2px) scale(0.9)' : 'translateZ(6px)',
            filter: active ? 'brightness(1.5)' : 'brightness(1)'
        }}
    >
        <span className="text-[8px] font-black text-black/70">{label}</span>
    </div>
);