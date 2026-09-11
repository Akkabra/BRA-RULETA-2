import React, { useEffect, useRef } from 'react';

interface ConfettiPiece {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  tiltAngle: number;
  tiltSpeed: number;
  vx: number;
  vy: number;
  opacity: number;
  shape: 'rect' | 'circle' | 'strip';
  decay: number;
}

// Sophisticated luxury gold palette
const GOLD_PALETTE = [
  '#D4AF37', // Pure warm metallic gold
  '#F3E3B6', // Light champagne gold
  '#E6CA85', // Soft matte gold
  '#B89658', // Deep antique gold
  '#9A7B44', // Rich bronze gold
  '#FAF3E0', // Pearlescent shimmer
];

interface GoldenConfettiRainProps {
  active?: boolean;
}

export const GoldenConfettiRain: React.FC<GoldenConfettiRainProps> = ({ active = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const piecesRef = useRef<ConfettiPiece[]>([]);
  const isInitializedRef = useRef<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Pre-initialize particle pool in memory ahead of time
    if (!isInitializedRef.current || piecesRef.current.length === 0) {
      const particleCount = Math.min(Math.floor(width / 22), 65);
      const pieces: ConfettiPiece[] = [];

      for (let i = 0; i < particleCount; i++) {
        const isStrip = Math.random() > 0.4;
        pieces.push({
          x: Math.random() * width,
          y: -20 - Math.random() * (height * 0.75),
          width: isStrip ? 3.5 + Math.random() * 3 : 5 + Math.random() * 4,
          height: isStrip ? 9 + Math.random() * 9 : 5 + Math.random() * 4,
          color: GOLD_PALETTE[Math.floor(Math.random() * GOLD_PALETTE.length)],
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.04,
          tiltAngle: Math.random() * Math.PI,
          tiltSpeed: 0.02 + Math.random() * 0.035,
          vx: (Math.random() - 0.5) * 0.7,
          vy: 1.1 + Math.random() * 1.5,
          opacity: 0.65 + Math.random() * 0.35,
          shape: isStrip ? 'strip' : Math.random() > 0.5 ? 'rect' : 'circle',
          decay: 0.0006 + Math.random() * 0.0008,
        });
      }
      piecesRef.current = pieces;
      isInitializedRef.current = true;
    }

    if (!active) {
      ctx.clearRect(0, 0, width, height);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }

    let animationFrameId: number;
    const pieces = piecesRef.current;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      let anyAlive = false;

      for (let i = 0; i < pieces.length; i++) {
        const p = pieces[i];

        // Physics updates
        p.tiltAngle += p.tiltSpeed;
        p.rotation += p.rotationSpeed;
        p.y += p.vy;
        p.x += p.vx + Math.sin(p.tiltAngle) * 0.65;

        if (p.y > height * 0.65) {
          p.opacity -= p.decay * 3.5;
        }

        if (p.opacity > 0 && p.y < height + 40) {
          anyAlive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);

          const scaleX = Math.cos(p.tiltAngle);
          ctx.scale(scaleX, 1);

          ctx.globalAlpha = Math.max(0, p.opacity * Math.abs(scaleX) * 0.9 + 0.1);
          ctx.fillStyle = p.color;

          ctx.shadowColor = 'rgba(212, 175, 55, 0.35)';
          ctx.shadowBlur = 4;

          if (p.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, p.width / 2, 0, Math.PI * 2);
            ctx.fill();
          } else {
            const w = p.width;
            const h = p.height;
            ctx.beginPath();
            ctx.roundRect(-w / 2, -h / 2, w, h, 1.5);
            ctx.fill();
          }

          ctx.restore();
        }
      }

      if (anyAlive) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-30 w-full h-full transition-opacity duration-300 ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ pointerEvents: 'none' }}
    />
  );
};
