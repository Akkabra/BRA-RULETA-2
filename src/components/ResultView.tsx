import React, { useState } from 'react';
import { MessageCircle, Check, Copy, Sparkles, ShieldCheck } from 'lucide-react';
import { WHATSAPP_LINK, WHATSAPP_MESSAGE, WHATSAPP_DISPLAY_PHONE } from '../constants/rouletteData';

interface ResultViewProps {
  personalizedName: string;
}

export const ResultView: React.FC<ResultViewProps> = ({ personalizedName }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(WHATSAPP_MESSAGE).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }).catch(() => {});
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col items-center text-center">
      {/* Subtle celebration sparkle badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F3EDE3] border border-[#E3D6C3] text-[#8C6D3B] text-xs uppercase tracking-[0.2em] font-medium mb-6 shadow-xs fade-in-up delay-1">
        <Sparkles className="w-3.5 h-3.5 text-[#B89658] animate-pulse" />
        <span>Resultado Oficial BRA RULETA</span>
      </div>

      {/* Recipient note */}
      <p className="text-xs uppercase tracking-[0.25em] text-[#857A6D] mb-2 font-medium fade-in-up delay-2">
        Felicidades, {personalizedName}
      </p>

      {/* Main Victory Title - Large, bold, luxurious */}
      <h1 className="font-serif-luxury text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#1C1917] leading-[1.1] mb-6 fade-in-up delay-2">
        GANASTE UN MASAJE
      </h1>

      {/* Digital Voucher Presentation Card */}
      <div className="w-full bg-[#FFFFFF] border border-[#E7DECF] rounded-2xl p-6 sm:p-8 shadow-[0_12px_36px_-10px_rgba(28,25,23,0.08)] mb-8 relative overflow-hidden fade-in-up delay-3">
        {/* Subtle decorative inner framing */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#D8C7B0] via-[#C4A77D] to-[#D8C7B0]" />

        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-[#FAF6EE] border border-[#E3D4BE] flex items-center justify-center text-[#9A7B4F] mb-4">
            <Sparkles className="w-6 h-6 text-[#9A7B4F]" />
          </div>

          <p className="text-sm font-serif-luxury italic text-[#443F38] max-w-md mb-4">
            “Una sesión exclusiva de relajación y bienestar diseñada especialmente para ti.”
          </p>

          <div className="w-full border-t border-dashed border-[#E7DFD3] my-4" />

          {/* Discreet Legal & Coupon Texts as explicitly requested */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-[11px] sm:text-xs text-[#8A8175] font-light tracking-wide">
            <span className="italic">Valido hasta agotar existencias</span>
            <span className="hidden sm:inline text-[#D4C8B8]">•</span>
            <span className="font-medium uppercase tracking-wider text-[#6B6358] bg-[#F7F3EC] px-2.5 py-0.5 rounded border border-[#E8DFD3]">
              CUpon 1/10
            </span>
          </div>

          <div className="flex items-center gap-1.5 mt-3 text-[10px] text-[#A89E90]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#9A7B4F]" />
            <span>Premio verificado y reservado para {personalizedName}</span>
          </div>
        </div>
      </div>

      {/* Primary Action Button: RECLAMAR MI MASAJE (WhatsApp) */}
      <div className="w-full max-w-md flex flex-col gap-3 fade-in-up delay-4">
        <a
          id="btn-reclamar-masaje"
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-3 py-4 px-8 rounded-full bg-[#1C1917] hover:bg-[#2C2723] active:bg-[#0D0B0A] text-[#FAF8F5] text-sm sm:text-base font-medium tracking-wide shadow-[0_8px_24px_rgba(28,25,23,0.18)] hover:shadow-[0_12px_28px_rgba(28,25,23,0.25)] transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <MessageCircle className="w-5 h-5 text-[#25D366]" fill="#25D366" />
          <span className="font-sans-clean font-semibold tracking-wider">RECLAMAR MI MASAJE</span>
        </a>

        {/* WhatsApp Contact Note */}
        <p className="text-[11px] text-[#8A8175] font-light">
          Contacto directo vía WhatsApp ({WHATSAPP_DISPLAY_PHONE})
        </p>

        {/* Optional quick copy button for convenience */}
        <button
          type="button"
          onClick={handleCopyMessage}
          className="inline-flex items-center justify-center gap-2 text-xs text-[#786E62] hover:text-[#1C1917] py-2 transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-medium">Mensaje copiado al portapapeles</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-[#9E9486]" />
              <span>Copiar mensaje para enviar manualmente</span>
            </>
          )}
        </button>
      </div>

      {/* Message preview quotation */}
      <div className="mt-8 p-3.5 rounded-xl bg-[#F6F2EA]/80 border border-[#E6DDCE] text-left max-w-md w-full fade-in-up delay-5">
        <div className="text-[10px] uppercase tracking-wider text-[#9E9486] font-semibold mb-1">
          Mensaje preparado para enviar:
        </div>
        <p className="text-xs text-[#443F38] italic">
          “{WHATSAPP_MESSAGE}”
        </p>
      </div>
    </div>
  );
};
