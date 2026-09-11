import { warmUpAudio } from './audio';
import { WHATSAPP_LINK } from '../constants/rouletteData';

/**
 * Preload and pre-warm strategy for instantaneous visual and audio response.
 */
export function initializePreloadStrategy(): () => void {
  if (typeof window === 'undefined') return () => {};

  // 1. Preload Fonts to prevent FOUT (Flash of Unstyled Text)
  if ('fonts' in document) {
    Promise.all([
      document.fonts.load('bold 24px "Cormorant Garamond"'),
      document.fonts.load('italic 24px "Cormorant Garamond"'),
      document.fonts.load('500 16px "Plus Jakarta Sans"'),
      document.fonts.load('700 16px "Plus Jakarta Sans"'),
      document.fonts.ready,
    ]).catch(() => {
      // Graceful fallback if fonts are blocked
    });
  }

  // 2. Pre-warm Audio Context on first interaction
  const handleFirstInteraction = () => {
    warmUpAudio();
    cleanupListeners();
  };

  const cleanupListeners = () => {
    window.removeEventListener('pointerdown', handleFirstInteraction);
    window.removeEventListener('touchstart', handleFirstInteraction);
    window.removeEventListener('keydown', handleFirstInteraction);
  };

  window.addEventListener('pointerdown', handleFirstInteraction, { passive: true, once: true });
  window.addEventListener('touchstart', handleFirstInteraction, { passive: true, once: true });
  window.addEventListener('keydown', handleFirstInteraction, { passive: true, once: true });

  // 3. Pre-fetch WhatsApp DNS and connection
  try {
    const linkDns = document.createElement('link');
    linkDns.rel = 'dns-prefetch';
    linkDns.href = 'https://wa.me';
    document.head.appendChild(linkDns);

    const linkPreconnect = document.createElement('link');
    linkPreconnect.rel = 'preconnect';
    linkPreconnect.href = 'https://wa.me';
    document.head.appendChild(linkPreconnect);

    // Hidden pre-render intent anchor
    const prefetchAnchor = document.createElement('link');
    prefetchAnchor.rel = 'prefetch';
    prefetchAnchor.href = WHATSAPP_LINK;
    document.head.appendChild(prefetchAnchor);
  } catch {
    // Ignore DOM head append exceptions
  }

  return cleanupListeners;
}
