/**
 * ═══════════════════════════════════════════════════════════════
 * WO-ANIME STAGGER MODULE
 * Workalógico Animation System - Stagger animations
 * 
 * Animaciones de entrada en cascada para múltiples elementos
 * (cards, stats, listas, etc.)
 * 
 * Dependencias: wo-anime-core.js, anime.js
 * ═══════════════════════════════════════════════════════════════
 */

import { config, trackAnimation } from './wo-anime-core.js';

// ═══════════════════════════════════════════════════════════════
// STAGGER BÁSICO
// ═══════════════════════════════════════════════════════════════

/**
 * Anima múltiples elementos con efecto cascada
 * @param {string|NodeList} targets - Selectores o elementos
 * @param {Object} options - Configuración
 * @returns {Object} Animación de anime.js
 */
export function stagger(targets, options = {}) {
  const {
    from = 'first', // 'first', 'last', 'center', index number
    delay = 80,
    translateY = [30, 0],
    translateX = null,
    opacity = [0, 1],
    scale = null,
    rotate = null,
    duration = config.duration.normal,
    easing = config.easing.spring,
    onComplete = null
  } = options;
  
  const animProps = {
    targets,
    duration,
    easing,
    delay: anime.stagger(delay, { from }),
    complete: () => {
      // Fluidity Overhaul: Cleanup will-change para rendimiento
      const targetEls = typeof targets === 'string' 
        ? document.querySelectorAll(targets) 
        : targets;
      if (targetEls.forEach) {
        targetEls.forEach(el => {
          if (el && el.style) el.style.willChange = 'auto';
        });
      }
      if (onComplete) onComplete();
    }
  };
  
  if (translateY) animProps.translateY = translateY;
  if (translateX) animProps.translateX = translateX;
  if (opacity) animProps.opacity = opacity;
  if (scale) animProps.scale = scale;
  if (rotate) animProps.rotate = rotate;
  
  return trackAnimation(anime(animProps));
}

// ═══════════════════════════════════════════════════════════════
// CARDS ENTRANCE
// ═══════════════════════════════════════════════════════════════

/**
 * Anima entrada de cards con efecto spring orgánico
 * Reemplaza fragment fade-up con animaciones más fluidas
 * 
 * @param {NodeList|Array|string} cards - Cards a animar
 * @param {Object} options - Configuración
 * @returns {Object} Animación de anime.js
 */
export function cardsEntrance(cards, options = {}) {
  const cardArray = typeof cards === 'string' 
    ? Array.from(document.querySelectorAll(cards))
    : Array.from(cards);
  
  if (cardArray.length === 0) return null;
  
  const {
    from = 'center',     // 'first', 'last', 'center', o índice numérico
    delay = 100,         // Delay entre cards
    duration = 650,      // Duración de cada animación
    staggerGrid = null,  // { cols: 2, rows: 3 } para stagger 2D
    effect = 'spring',   // 'spring', 'slide', 'scale', 'flip'
    direction = 'up',    // 'up', 'down', 'left', 'right'
    reset = true         // Resetear estado inicial
  } = options;
  
  // Configuración de efectos
  const effects = {
    spring: {
      translateY: direction === 'up' ? [40, 0] : direction === 'down' ? [-40, 0] : [0, 0],
      translateX: direction === 'left' ? [40, 0] : direction === 'right' ? [-40, 0] : [0, 0],
      scale: [0.92, 1],
      opacity: [0, 1],
      easing: config.easing.spring
    },
    slide: {
      translateY: direction === 'up' ? [60, 0] : direction === 'down' ? [-60, 0] : [0, 0],
      translateX: direction === 'left' ? [60, 0] : direction === 'right' ? [-60, 0] : [0, 0],
      opacity: [0, 1],
      easing: config.easing.expo
    },
    scale: {
      scale: [0.8, 1],
      opacity: [0, 1],
      easing: config.easing.back
    },
    flip: {
      rotateX: [-15, 0],
      translateY: [30, 0],
      opacity: [0, 1],
      easing: config.easing.expo
    }
  };
  
  const effectConfig = effects[effect] || effects.spring;
  
  // Reset estado inicial si está habilitado
  if (reset) {
    cardArray.forEach(card => {
      card.style.opacity = '0';
      card.style.willChange = 'transform, opacity';
      
      if (effect === 'flip') {
        card.style.transformStyle = 'preserve-3d';
        card.style.perspective = '1000px';
      }
    });
  }
  
  // Configurar stagger
  let staggerConfig;
  if (staggerGrid) {
    // Stagger 2D para grids
    staggerConfig = anime.stagger(delay, {
      grid: [staggerGrid.cols, staggerGrid.rows],
      from: from
    });
  } else {
    staggerConfig = anime.stagger(delay, { from });
  }
  
  const anim = anime({
    targets: cardArray,
    ...effectConfig,
    delay: staggerConfig,
    duration,
    complete: () => {
      // Limpiar will-change para rendimiento
      cardArray.forEach(card => {
        card.style.willChange = 'auto';
      });
    }
  });
  
  return trackAnimation(anim);
}

// ═══════════════════════════════════════════════════════════════
// PRICING CARDS
// ═══════════════════════════════════════════════════════════════

/**
 * Anima cards de pricing con highlight especial para el card recomendado
 * @param {Element} container - Contenedor de los cards de pricing
 * @param {Object} options - Configuración
 * @returns {Object} Timeline de anime.js
 */
export function pricingCards(container, options = {}) {
  const {
    highlightClass = 'wo-card--highlight',
    delay = 150,
    highlightDelay = 300
  } = options;
  
  const cards = container.querySelectorAll('.wo-card');
  const highlightCard = container.querySelector(`.${highlightClass}`);
  const regularCards = Array.from(cards).filter(c => !c.classList.contains(highlightClass));
  
  // Reset
  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px) scale(0.95)';
  });
  
  const tl = anime.timeline({ easing: config.easing.spring });
  
  // Primero los cards regulares
  if (regularCards.length > 0) {
    tl.add({
      targets: regularCards,
      translateY: [40, 0],
      scale: [0.95, 1],
      opacity: [0, 1],
      delay: anime.stagger(delay, { from: 'first' }),
      duration: 600
    });
  }
  
  // Luego el card destacado con efecto especial
  if (highlightCard) {
    tl.add({
      targets: highlightCard,
      translateY: [60, 0],
      scale: [0.85, 1.02, 1],
      opacity: [0, 1],
      boxShadow: [
        '0 0 0px rgba(255, 203, 0, 0)',
        '0 0 30px rgba(255, 203, 0, 0.4)',
        '0 8px 30px rgba(255, 203, 0, 0.2)'
      ],
      duration: 800,
      easing: config.easing.back
    }, `-=${highlightDelay}`);
  }
  
  return trackAnimation(tl);
}
