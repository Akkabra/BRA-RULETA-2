import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { RouletteWheel } from './components/RouletteWheel';
import { ResultView } from './components/ResultView';
import { GoldenConfettiRain } from './components/GoldenConfettiRain';
import { AppStage } from './types';
import { ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { initializePreloadStrategy } from './utils/preload';

const RECIPIENT_NAME = 'María Fernanda';

export default function App() {
  const [stage, setStage] = useState<AppStage>('intro');

  useEffect(() => {
    // Execute proactive preload strategy (fonts, audio context, network DNS)
    const cleanup = initializePreloadStrategy();
    return cleanup;
  }, []);

  const handleStartSpin = () => {
    if (stage === 'spinning' || stage === 'result') return;
    setStage('spinning');
  };

  const handleSpinComplete = () => {
    setStage('result');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex flex-col justify-between selection:bg-[#E9DFCE] selection:text-[#1C1917]">
      {/* Background luxury subtle texture / gradient */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#F4EFE6] via-[#FAF8F5] to-[#FAF8F5]" />

      {/* Pre-warmed golden confetti rain - preloaded from initial render, seamlessly active upon winning */}
      <GoldenConfettiRain active={stage === 'result'} />

      {/* Top Header */}
      <Header personalizedName={RECIPIENT_NAME} />

      {/* Main Content Area */}
      <main className="w-full flex-1 flex flex-col items-center justify-center px-4 py-6 sm:py-10 max-w-4xl mx-auto">
        {stage !== 'result' ? (
          /* INTRO & SPINNING VIEW */
          <div className="w-full flex flex-col items-center text-center">
            {/* Introductory Titles */}
            <div className="max-w-xl mx-auto mb-8 sm:mb-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F2EDE3] border border-[#E3D8C8] text-[#8C7355] text-xs uppercase tracking-[0.25em] font-medium mb-4 shadow-xs fade-in-up delay-1">
                <Sparkles className="w-3.5 h-3.5 text-[#B89658]" />
                <span>Experiencia Exclusiva</span>
              </div>

              {/* Title: BIENVENIDA A BRA RULETA */}
              <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1C1917] mb-2 leading-tight fade-in-up delay-2">
                BIENVENIDA A BRA RULETA
              </h1>

              {/* Recipient: María Fernanda */}
              <div className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl font-semibold italic text-[#8B6B38] mb-4 fade-in-up delay-3">
                {RECIPIENT_NAME}
              </div>

              {/* Phrase: Hoy la suerte está de tu lado */}
              <p className="text-base sm:text-lg text-[#5D554B] font-light tracking-wide fade-in-up delay-3">
                “Hoy la suerte está de tu lado.”
              </p>
            </div>

            {/* The Roulette Wheel */}
            <div className="w-full my-2 sm:my-4 flex items-center justify-center fade-in-up delay-4">
              <RouletteWheel
                isSpinning={stage === 'spinning'}
                onSpinComplete={handleSpinComplete}
              />
            </div>

            {/* Spin CTA Button */}
            <div className="mt-8 sm:mt-10 flex flex-col items-center gap-3 fade-in-up delay-5">
              <button
                id="btn-girar-ruleta"
                type="button"
                onClick={handleStartSpin}
                disabled={stage === 'spinning'}
                className={`group relative inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full font-medium text-sm sm:text-base tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer ${
                  stage === 'spinning'
                    ? 'bg-[#403B37] text-[#D8CFC4] cursor-not-allowed opacity-90 shadow-[0_10px_25px_-5px_rgba(28,25,23,0.2)]'
                    : 'pulse-subtle bg-[#1C1917] hover:bg-[#2C2723] active:bg-[#0E0C0B] text-[#FAF8F5] hover:shadow-[0_16px_32px_-8px_rgba(28,25,23,0.3)] hover:-translate-y-0.5'
                }`}
              >
                {stage === 'spinning' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
                    <span className="font-sans-clean font-semibold">Girando ruleta...</span>
                  </>
                ) : (
                  <>
                    <span className="font-sans-clean font-semibold">GIRAR LA RULETA</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-[#D4AF37]" />
                  </>
                )}
              </button>

              <p className="text-xs text-[#8C8276] font-light">
                {stage === 'spinning'
                  ? 'Calculando tu resultado exclusivo...'
                  : 'Presiona para iniciar el giro'}
              </p>
            </div>
          </div>
        ) : (
          /* RESULT / VICTORY VIEW */
          <div className="w-full flex flex-col items-center justify-center">
            <ResultView personalizedName={RECIPIENT_NAME} />
          </div>
        )}
      </main>

      {/* Discreet Footer */}
      <footer className="w-full py-6 text-center text-xs text-[#A89E90] border-t border-[#ECE5D8]/70">
        <p className="tracking-wider">
          BRA © {new Date().getFullYear()} • Experiencia privada y personalizada para {RECIPIENT_NAME}
        </p>
      </footer>
    </div>
  );
}
