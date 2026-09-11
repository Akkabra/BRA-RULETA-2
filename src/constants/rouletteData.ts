import { WheelSegment } from '../types';

export const WHEEL_SEGMENTS: WheelSegment[] = [
  {
    id: 'masaje',
    label: 'Un masaje',
    sublabel: 'Exclusivo',
    isWinner: true,
    colorBg: '#23201F', // Deep warm charcoal/espresso
    colorText: '#F3E8D2', // Shimmering champagne gold
    accentColor: '#D4AF37', // Gold accent
  },
  {
    id: 'sorpresa',
    label: 'Premio sorpresa',
    isWinner: false,
    colorBg: '#FAF7F2', // Warm alabaster
    colorText: '#292524',
    accentColor: '#C4B5A5',
  },
  {
    id: 'casi',
    label: 'Casi...',
    isWinner: false,
    colorBg: '#F3EDE4', // Soft warm stone
    colorText: '#57534E',
    accentColor: '#A8A29E',
  },
  {
    id: 'intentalo',
    label: 'Inténtalo',
    isWinner: false,
    colorBg: '#FAF7F2',
    colorText: '#292524',
    accentColor: '#C4B5A5',
  },
  {
    id: 'otro_premio',
    label: 'Otro premio',
    isWinner: false,
    colorBg: '#F3EDE4',
    colorText: '#57534E',
    accentColor: '#A8A29E',
  },
  {
    id: 'suerte',
    label: 'Suerte',
    isWinner: false,
    colorBg: '#FAF7F2',
    colorText: '#292524',
    accentColor: '#C4B5A5',
  },
];

export const WINNER_SEGMENT_INDEX = 0; // "Un masaje"

export const WHATSAPP_PHONE = '573145527342';
export const WHATSAPP_DISPLAY_PHONE = '+57 314 552 7342';
export const WHATSAPP_MESSAGE = 'Hola 👋 Soy María Fernanda. Acabo de ganar mi masaje en BRA RULETA 🎁 y quiero reclamar mi premio.';

export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
