import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { toggleSound, isSoundEnabled } from '../utils/audio';

interface HeaderProps {
  personalizedName: string;
}

export const Header: React.FC<HeaderProps> = ({ personalizedName }) => {
  const [muted, setMuted] = useState<boolean>(!isSoundEnabled());

  const handleToggleAudio = () => {
    const nextState = toggleSound();
    setMuted(!nextState);
  };

  return (
    <header className="w-full max-w-5xl mx-auto px-6 py-6 flex items-center justify-between border-b border-[#E8E1D5]/60">
      {/* Brand logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-[#1C1917] text-[#F5EFEB] flex items-center justify-center font-serif-luxury font-bold text-sm tracking-wider shadow-sm">
          B
        </div>
        <div className="flex flex-col">
          <span className="font-serif-luxury text-lg font-bold tracking-[0.2em] text-[#1C1917] leading-none">
            BRA
          </span>
          <span className="font-sans-clean text-[9px] uppercase tracking-[0.25em] text-[#8C8276] leading-none mt-0.5">
            Experiencia Privada
          </span>
        </div>
      </div>

      {/* Center personalized badge */}
      <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F3EDE3] border border-[#E4D9C8]/80 text-[#574F45] text-xs font-medium tracking-wide shadow-xs">
        <Sparkles className="w-3.5 h-3.5 text-[#B89658]" />
        <span>Edición exclusiva para <strong className="text-[#1C1917] font-semibold">{personalizedName}</strong></span>
      </div>

      {/* Sound toggle button */}
      <button
        type="button"
        onClick={handleToggleAudio}
        aria-label={muted ? 'Activar sonido' : 'Silenciar sonido'}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#DFD5C5] hover:border-[#BCAE9C] bg-white/70 hover:bg-white text-[#574F45] text-xs transition-all duration-200 shadow-xs cursor-pointer active:scale-95"
      >
        {muted ? (
          <>
            <VolumeX className="w-3.5 h-3.5 text-[#8C8276]" />
            <span className="hidden md:inline font-sans-clean">Silenciado</span>
          </>
        ) : (
          <>
            <Volume2 className="w-3.5 h-3.5 text-[#9A7B4F]" />
            <span className="hidden md:inline font-sans-clean">Sonido</span>
          </>
        )}
      </button>
    </header>
  );
};
