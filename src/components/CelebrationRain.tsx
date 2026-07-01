import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number; // percentage across screen (0-100)
  size: number; // size in pixels
  type: 'hongbao' | 'yuanbao' | 'coin';
  delay: number; // seconds
  duration: number; // seconds
  rotation: number; // initial rotation degrees
  spinSpeed: number; // rotation change speed/direction
}

interface CelebrationRainProps {
  active: boolean;
  onClose: () => void;
}

export function CelebrationRain({ active, onClose }: CelebrationRainProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    // Generate 30 beautiful fortune particles (red packets, gold ingots, coins)
    const generated: Particle[] = Array.from({ length: 30 }).map((_, idx) => {
      const types: ('hongbao' | 'yuanbao' | 'coin')[] = ['hongbao', 'yuanbao', 'coin'];
      const type = types[idx % types.length];
      
      return {
        id: idx,
        x: Math.random() * 100, // 0% to 100% of viewport width
        size: type === 'hongbao' ? 32 + Math.random() * 24 : 24 + Math.random() * 18,
        type,
        delay: Math.random() * 0.3, // staggered start in first 0.3s
        duration: 1.2 + Math.random() * 0.5, // fast fall (1.2s to 1.7s)
        rotation: Math.random() * 360,
        spinSpeed: (Math.random() - 0.5) * 180,
      };
    });

    setParticles(generated);

    // Auto terminate rain after 2 seconds to free resources
    const timer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [active, onClose]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {particles.map((p) => {
        // Red envelope 🧧, Coin 🪙, and gold bag/ingot 💰
        const emoji = p.type === 'hongbao' ? '🧧' : p.type === 'yuanbao' ? '🪙' : '💰';
        return (
          <div
            key={p.id}
            className="absolute text-center select-none"
            style={{
              left: `${p.x}%`,
              top: `-60px`,
              fontSize: `${p.size}px`,
              animation: `fallAndSpin ${p.duration}s linear ${p.delay}s 1 forwards`,
              transform: `rotate(${p.rotation}deg)`,
              opacity: 0.95,
              willChange: 'transform, opacity',
            }}
          >
            {emoji}
          </div>
        );
      })}
      <style>{`
        @keyframes fallAndSpin {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(115vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
export default CelebrationRain;
