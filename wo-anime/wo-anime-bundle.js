/**
 * ═══════════════════════════════════════════════════════════════
 * WO-ANIME BUNDLE
 * Workalógico Animation System - Complete bundle
 * 
 * Re-exporta todos los módulos para backward compatibility.
 * Usa este archivo cuando necesites todas las funciones de WoAnime.
 * 
 * Para uso selectivo, importa módulos individuales:
 * - import { counter } from './wo-anime-counter.js';
 * - import { cardsEntrance } from './wo-anime-stagger.js';
 * 
 * ═══════════════════════════════════════════════════════════════
 */

// Importar módulos
import { 
  config, 
  formatNumber, 
  parseFormattedValue, 
  detectDecimals,
  stopAllAnimations, 
  trackAnimation,
  getRunningAnimationsCount,
  cleanupCompletedAnimations
} from './wo-anime-core.js';

import { 
  counter, 
  animateRange, 
  formatCounterValue,
  formatPrice,
  animateCounter
} from './wo-anime-counter.js';

import { 
  stagger, 
  cardsEntrance, 
  pricingCards 
} from './wo-anime-stagger.js';

import { 
  cover, 
  section,
  init,
  destroy,
  isInitialized,
  getCurrentSlide
} from './wo-anime-slide.js';

import { 
  ctaGlow, 
  quoteReveal, 
  gauge, 
  flipCard, 
  initPricingFlip, 
  highlightPricingCard,
  particleFlow
} from './wo-anime-effects.js';

import { 
  pathDraw, 
  connectElements, 
  methodologyConnections, 
  animateStepNumbers,
  stepsTimeline
} from './wo-anime-svg.js';

import { 
  ascendingReveal, 
  systemPulse, 
  pilarsAnimation, 
  comparisonAnimation, 
  casesAnimation 
} from './wo-anime-growth.js';

// ═══════════════════════════════════════════════════════════════
// OBJETO PÚBLICO WOانIME
// ═══════════════════════════════════════════════════════════════

export const WoAnime = {
  // Inicialización
  init,
  destroy,
  
  // Configuración
  config,
  
  // Core utilities
  formatNumber,
  parseFormattedValue,
  formatCounterValue,
  stopAllAnimations,
  trackAnimation,
  getRunningAnimationsCount,
  cleanupCompletedAnimations,
  
  // Counter
  counter,
  animateRange,
  animateCounter,
  formatPrice,
  
  // Stagger
  stagger,
  cardsEntrance,
  pricingCards,
  
  // Slide
  cover,
  section,
  
  // Effects
  ctaGlow,
  quoteReveal,
  gauge,
  flipCard,
  initPricingFlip,
  highlightPricingCard,
  particleFlow,
  
  // SVG
  pathDraw,
  connectElements,
  methodologyConnections,
  animateStepNumbers,
  stepsTimeline,
  
  // Growth
  ascendingReveal,
  systemPulse,
  pilarsAnimation,
  comparisonAnimation,
  casesAnimation,
  
  // Estado
  isInitialized,
  getCurrentSlide
};

// ═══════════════════════════════════════════════════════════════
// EXPONER GLOBALMENTE PARA BACKWARD COMPATIBILITY
// ═══════════════════════════════════════════════════════════════

if (typeof window !== 'undefined') {
  window.WoAnime = WoAnime;
}

// Auto-inicializar si Reveal.js está listo
if (typeof Reveal !== 'undefined') {
  if (Reveal.isReady()) {
    WoAnime.init();
  } else {
    Reveal.on('ready', () => WoAnime.init());
  }
}

// Exportar por defecto
export default WoAnime;
