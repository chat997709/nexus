import React, { useState, useEffect } from 'react';
import { LucideIcon } from 'lucide-react';

interface Icon3DProps {
  icon: LucideIcon;
  size?: number;
  color?: string;
  depth?: number;
  isActive?: boolean;
  rotate?: boolean;
  onClick?: () => void;
}

export const Icon3D: React.FC<Icon3DProps> = ({ 
  icon: Icon, 
  size = 24, 
  color, 
  depth = 5, 
  isActive = false,
  rotate = false,
  onClick
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  // Determine effective color: if 'color' prop is unset, use CSS variable or default based on class
  // For simplicity here, we assume if color is undefined, we use a gray for inactive
  const effectiveColor = color || '#888888'; 

  useEffect(() => {
    if (isActive) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  const layers = Array.from({ length: depth });

  const rotation = rotate 
    ? 'rotateY(360deg)' 
    : isActive 
      ? 'translateY(-12px) rotateY(180deg)' 
      : 'rotateY(0deg)';

  const scale = isAnimating ? 'scale(1.2)' : 'scale(1)';

  return (
    <div 
      className={`relative preserve-3d transition-all duration-500 ease-spring`}
      style={{ 
        width: size, 
        height: size,
        transform: `${rotation} ${scale}`,
        cursor: 'pointer'
      }}
      onClick={onClick}
    >
      {layers.map((_, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{
            transform: `translateZ(-${(i * 0.8) + 0.5}px)`, 
            color: effectiveColor,
            opacity: 0.3 - (i * 0.05),
          }}
        >
           <Icon size={size} strokeWidth={3} />
        </div>
      ))}
      
      {/* Front Face */}
      <div 
        className="absolute inset-0" 
        style={{ 
          transform: 'translateZ(1px)', 
          color: effectiveColor, 
          filter: isActive ? `drop-shadow(0 0 8px ${effectiveColor})` : 'none'
        }}
      >
        <Icon size={size} strokeWidth={isActive ? 2.5 : 2} />
      </div>

      {/* Back Face */}
      <div 
        className="absolute inset-0" 
        style={{ 
          transform: `translateZ(-${depth}px) rotateY(180deg)`, 
          color: isActive ? effectiveColor : '#555',
          opacity: 0.8
        }}
      >
        <Icon size={size} strokeWidth={2} />
      </div>
      
      {isActive && (
        <div 
           className="absolute inset-0 bg-nexus-cyan blur-[15px] rounded-full opacity-30" 
           style={{ transform: 'translateZ(-5px) scale(1.3)' }}
        />
      )}
    </div>
  );
};