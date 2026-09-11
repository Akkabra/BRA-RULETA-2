import React, { useEffect, useRef, useState } from 'react';
import { WHEEL_SEGMENTS } from '../constants/rouletteData';
import { playTickSound, playVictoryChime } from '../utils/audio';

interface RouletteWheelProps {
  isSpinning: boolean;
  onSpinComplete: () => void;
}

export const RouletteWheel: React.FC<RouletteWheelProps> = ({ isSpinning, onSpinComplete }) => {
  const [currentRotation, setCurrentRotation] = useState<number>(0);
  const [pointerKick, setPointerKick] = useState<boolean>(false);
  const lastPegRef = useRef<number>(-1);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const startRotationRef = useRef<number>(0);

  const SEGMENT_COUNT = WHEEL_SEGMENTS.length;
  const SEGMENT_ANGLE = 360 / SEGMENT_COUNT; // 60 degrees each
  const TOTAL_ROTATION_SPINS = 7; // 7 complete rounds
  const TARGET_ROTATION = TOTAL_ROTATION_SPINS * 360; // 2520 degrees - lands exactly at index 0 (0 degrees / 12 o'clock)
  const DURATION_MS = 5600; // 5.6 seconds of suspenseful, smooth spin

  useEffect(() => {
    if (!isSpinning) return;

    startTimeRef.current = null;
    startRotationRef.current = currentRotation % 360;
    lastPegRef.current = Math.floor(startRotationRef.current / SEGMENT_ANGLE);

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / DURATION_MS, 1);

      // Smooth custom easing: swift start, sustained spin, long dramatic deceleration
      // f(t) = 1 - Math.pow(1 - t, 3.6)
      const eased = 1 - Math.pow(1 - progress, 3.6);
      const newAngle = startRotationRef.current + TARGET_ROTATION * eased;

      setCurrentRotation(newAngle);

      // Peg detection for tick sound and pointer deflection
      const currentPeg = Math.floor((newAngle + 30) / SEGMENT_ANGLE);
      if (currentPeg !== lastPegRef.current) {
        lastPegRef.current = currentPeg;
        // Pitch variation for natural acoustic realism
        const speed = 1 - progress;
        playTickSound(0.9 + speed * 0.3);
        setPointerKick(true);
        setTimeout(() => setPointerKick(false), 50);
      }

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Complete! Ensure exact target angle
        const finalAngle = startRotationRef.current + TARGET_ROTATION;
        setCurrentRotation(finalAngle);
        playVictoryChime();
        setTimeout(() => {
          onSpinComplete();
        }, 650);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isSpinning, onSpinComplete]);

  // Geometry helper: calculate sector path
  // 0° = North (12 o'clock)
  const getSectorPath = (index: number) => {
    const startAngleDeg = index * SEGMENT_ANGLE - SEGMENT_ANGLE / 2;
    const endAngleDeg = startAngleDeg + SEGMENT_ANGLE;
    const radius = 260;
    const cx = 300;
    const cy = 300;

    const startRad = ((startAngleDeg - 90) * Math.PI) / 180;
    const endRad = ((endAngleDeg - 90) * Math.PI) / 180;

    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);

    return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="relative w-full max-w-[340px] sm:max-w-[420px] md:max-w-[460px] aspect-square mx-auto select-none flex items-center justify-center">
      {/* Ambient background glow */}
      <div className="absolute inset-4 rounded-full bg-[#EADCC7]/30 blur-2xl -z-10 pointer-events-none" />

      {/* Outer framing bezel / shadow */}
      <div className="relative w-full h-full rounded-full p-2.5 sm:p-3 bg-gradient-to-b from-[#EFEAE1] via-[#DFD5C6] to-[#CEC1AF] shadow-[0_16px_45px_-10px_rgba(28,25,23,0.18),0_4px_12px_rgba(28,25,23,0.08)]">
        {/* Fine gold concentric bezel trim */}
        <div className="w-full h-full rounded-full p-1 sm:p-1.5 bg-[#FAF7F2] shadow-inner">
          <div className="relative w-full h-full rounded-full overflow-hidden bg-[#FAF7F2]">
            {/* SVG Wheel that rotates */}
            <svg
              viewBox="0 0 600 600"
              className="w-full h-full transition-transform will-change-transform"
              style={{
                transform: `rotate(${currentRotation}deg)`,
                transformOrigin: '50% 50%',
              }}
            >
              <defs>
                {/* Winner Gold Gradient */}
                <linearGradient id="winnerGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2D2826" />
                  <stop offset="100%" stopColor="#1B1716" />
                </linearGradient>

                {/* Hub Metal Gradient */}
                <radialGradient id="hubGradient" cx="45%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="40%" stopColor="#F5EFE6" />
                  <stop offset="75%" stopColor="#D8C8B4" />
                  <stop offset="100%" stopColor="#B39F85" />
                </radialGradient>

                {/* Gold rim accent */}
                <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D4AF37" />
                  <stop offset="50%" stopColor="#F5E2B3" />
                  <stop offset="100%" stopColor="#AA8529" />
                </linearGradient>
              </defs>

              {/* Segments */}
              {WHEEL_SEGMENTS.map((seg, idx) => {
                const midAngle = idx * SEGMENT_ANGLE;
                return (
                  <g key={seg.id}>
                    {/* Wedge Path */}
                    <path
                      d={getSectorPath(idx)}
                      fill={seg.isWinner ? 'url(#winnerGoldGradient)' : seg.colorBg}
                      stroke="#E3D8C8"
                      strokeWidth="1.5"
                    />

                    {/* Radial Divider separator */}
                    <line
                      x1="300"
                      y1="300"
                      x2={300 + 260 * Math.cos(((midAngle - 30 - 90) * Math.PI) / 180)}
                      y2={300 + 260 * Math.sin(((midAngle - 30 - 90) * Math.PI) / 180)}
                      stroke="#D8CCA8"
                      strokeWidth="1.2"
                      opacity="0.8"
                    />

                    {/* Content Group rotated along radius */}
                    <g transform={`rotate(${midAngle} 300 300)`}>
                      {seg.isWinner ? (
                        /* WINNER SEGMENT: UN MASAJE */
                        <g>
                          {/* Delicate star/sparkle icon */}
                          <path
                            d="M 300 84 L 302 91 L 309 93 L 302 95 L 300 102 L 298 95 L 291 93 L 298 91 Z"
                            fill="#E5C378"
                          />

                          {/* Sublabel */}
                          <text
                            x="300"
                            y="114"
                            textAnchor="middle"
                            fill="#D4AF37"
                            fontSize="11"
                            fontWeight="600"
                            letterSpacing="2.5"
                            className="font-sans-clean uppercase tracking-widest"
                          >
                            ESPECIAL
                          </text>

                          {/* Main Title */}
                          <text
                            x="300"
                            y="142"
                            textAnchor="middle"
                            fill="#FAF5EE"
                            fontSize="21"
                            fontWeight="700"
                            letterSpacing="1"
                            className="font-serif-luxury"
                          >
                            UN MASAJE
                          </text>

                          {/* Subtle golden dot */}
                          <circle cx="300" cy="162" r="2.5" fill="#E5C378" />
                        </g>
                      ) : (
                        /* OTHER SEGMENTS */
                        <g>
                          <text
                            x="300"
                            y="136"
                            textAnchor="middle"
                            fill={seg.colorText}
                            fontSize="17"
                            fontWeight="500"
                            letterSpacing="0.8"
                            className="font-serif-luxury"
                          >
                            {seg.label}
                          </text>
                          <circle cx="300" cy="156" r="2" fill="#D1C3B2" opacity="0.6" />
                        </g>
                      )}

                      {/* Perimeter Peg indicator */}
                      <circle
                        cx="300"
                        cy="46"
                        r="3"
                        fill={seg.isWinner ? '#D4AF37' : '#9E9284'}
                        stroke="#FAF7F2"
                        strokeWidth="1"
                      />
                    </g>
                  </g>
                );
              })}

              {/* Decorative inner circular tracks */}
              <circle
                cx="300"
                cy="300"
                r="259"
                fill="none"
                stroke="url(#goldRim)"
                strokeWidth="1.5"
                opacity="0.65"
              />
              <circle
                cx="300"
                cy="300"
                r="250"
                fill="none"
                stroke="#FAF7F2"
                strokeWidth="1"
                opacity="0.4"
                strokeDasharray="2,6"
              />

              {/* Center Luxury Hub */}
              <g id="hub">
                {/* Hub outer drop ring */}
                <circle cx="300" cy="300" r="54" fill="#C5B5A1" opacity="0.35" />
                <circle cx="300" cy="300" r="48" fill="#1C1917" />
                <circle cx="300" cy="300" r="46" fill="url(#hubGradient)" />
                <circle cx="300" cy="300" r="40" fill="#FAF7F2" />
                <circle
                  cx="300"
                  cy="300"
                  r="37"
                  fill="none"
                  stroke="#D4AF37"
                  strokeWidth="1"
                  opacity="0.75"
                />

                {/* Hub Typography */}
                <text
                  x="300"
                  y="298"
                  textAnchor="middle"
                  fill="#1C1917"
                  fontSize="16"
                  fontWeight="700"
                  letterSpacing="3"
                  className="font-serif-luxury"
                >
                  BRA
                </text>
                <text
                  x="300"
                  y="312"
                  textAnchor="middle"
                  fill="#9A825D"
                  fontSize="8.5"
                  fontWeight="600"
                  letterSpacing="2.2"
                  className="font-sans-clean uppercase tracking-widest"
                >
                  RULETA
                </text>
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* TOP POINTER (Fixed at 12 o'clock / Top Center) */}
      <div
        className={`absolute -top-3 left-1/2 -translate-x-1/2 z-20 transition-transform duration-75 ease-out ${
          pointerKick ? '-translate-y-1 scale-105 rotate-3' : 'translate-y-0 scale-100'
        }`}
      >
        <svg width="44" height="52" viewBox="0 0 44 52" fill="none" className="drop-shadow-md">
          {/* Pointer needle shadow */}
          <path
            d="M 22 48 L 9 14 C 9 6.8 14.8 1 22 1 C 29.2 1 35 6.8 35 14 L 22 48 Z"
            fill="#1C1917"
          />
          {/* Inner metallic accent */}
          <path
            d="M 22 45 L 12 14 C 12 8.5 16.5 4 22 4 C 27.5 4 32 8.5 32 14 L 22 45 Z"
            fill="url(#pointerGold)"
          />
          {/* Central jewel pearl */}
          <circle cx="22" cy="15" r="5" fill="#FAF8F5" />
          <circle cx="22" cy="15" r="3" fill="#D4AF37" />

          <defs>
            <linearGradient id="pointerGold" x1="12" y1="4" x2="32" y2="45" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F5E4BE" />
              <stop offset="50%" stopColor="#CBB17E" />
              <stop offset="100%" stopColor="#8C6E3D" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};
