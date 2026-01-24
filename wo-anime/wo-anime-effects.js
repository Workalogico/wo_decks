/**
 * ═══════════════════════════════════════════════════════════════
 * WO-ANIME EFFECTS MODULE
 * Efectos especiales: glow, quote, gauge, flip
 * 
 * Dependencias: wo-anime-core.js, wo-anime-counter.js, anime.js
 * ═══════════════════════════════════════════════════════════════
 */

import { config, trackAnimation } from './wo-anime-core.js';
import { counter } from './wo-anime-counter.js';

/**
 * Efecto de glow pulsante para CTAs
 */
export function ctaGlow(target, options = {}) {
  const {
    color = config.getPrimaryColor(),
    intensity = 20,
    duration = 2000
  } = options;
  
  return trackAnimation(anime({
    targets: target,
    textShadow: [
      `0 0 0px ${color}`,
      `0 0 ${intensity}px ${color}`,
      `0 0 0px ${color}`
    ],
    duration,
    loop: true,
    easing: 'easeInOutSine'
  }));
}

/**
 * Animación de quotes con diferentes efectos
 */
export function quoteReveal(element, options = {}) {
  const el = typeof element === 'string' 
    ? document.querySelector(element) 
    : element;
  
  if (!el) return null;
  
  const { 
    effect = 'borderDraw',
    duration = 800,
    delay = 0
  } = options;
  
  const computedStyle = getComputedStyle(el);
  const borderColor = computedStyle.borderLeftColor || config.getPrimaryColor();
  
  if (effect === 'borderDraw') {
    const tl = anime.timeline({ easing: 'easeOutQuad', delay });
    
    el.style.opacity = '0';
    el.style.transform = 'translateY(15px)';
    el.style.borderLeftColor = 'transparent';
    
    tl.add({
      targets: el,
      opacity: [0, 1],
      translateY: [15, 0],
      duration: duration * 0.6,
      easing: config.easing.softLanding
    });
    
    tl.add({
      targets: el,
      borderLeftColor: ['transparent', borderColor],
      duration: duration * 0.4,
      easing: 'easeOutExpo'
    }, `-=${duration * 0.2}`);
    
    return trackAnimation(tl);
  }
  
  // Efecto simple fadeSlide por defecto
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  
  return trackAnimation(anime({
    targets: el,
    opacity: [0, 1],
    translateY: [20, 0],
    duration,
    delay,
    easing: config.easing.softLanding
  }));
}

/**
 * Animación de gauge circular
 */
export function gauge(container, options = {}) {
  const {
    score = 0,
    duration = 1500
  } = options;
  
  const progress = container.querySelector('.wo-gauge__progress');
  const scoreEl = container.querySelector('.wo-gauge__score');
  const miniBars = container.querySelectorAll('.wo-mini-gauge__bar');
  
  const circumference = parseFloat(progress?.dataset.circumference) || 471;
  const targetOffset = circumference * (1 - score / 100);
  
  const tl = anime.timeline({ easing: config.easing.expo });
  
  if (progress) {
    tl.add({
      targets: progress,
      strokeDashoffset: [circumference, targetOffset],
      duration
    });
  }
  
  if (scoreEl) {
    tl.add({
      targets: { value: 0 },
      value: score,
      round: 1,
      duration: duration * 0.8,
      easing: config.easing.expo,
      update: (a) => {
        scoreEl.textContent = Math.round(a.animations[0].currentValue);
      }
    }, '-=1200');
  }
  
  if (miniBars.length > 0) {
    tl.add({
      targets: miniBars,
      width: (el) => el.dataset.width + '%',
      delay: anime.stagger(100),
      duration: 600,
      easing: config.easing.expo
    }, '-=800');
  }
  
  return trackAnimation(tl);
}

/**
 * Efecto flip 3D básico para cards
 */
export function flipCard(card, options = {}) {
  const {
    duration = 800,
    direction = 'Y'
  } = options;
  
  const prop = direction === 'Y' ? 'rotateY' : 'rotateX';
  
  return trackAnimation(anime({
    targets: card,
    [prop]: [0, 180],
    scale: [1, 1.05, 1],
    duration,
    easing: 'easeInOutSine'
  }));
}

/**
 * Inicializa un card de pricing con efecto flip 3D
 */
export function initPricingFlip(card, backContent = {}) {
  if (card.classList.contains('wo-card--flip-initialized')) return;
  
  // Implementación simplificada - ver wo-anime.js líneas 1377-1521 para versión completa
  card.classList.add('wo-card--flip-initialized');
  console.warn('initPricingFlip: Implementación simplificada. Usar versión completa si se necesita.');
}

/**
 * Anima el card de pricing destacado
 */
export function highlightPricingCard(card, options = {}) {
  const {
    duration = 1000,
    pulseCount = 2
  } = options;
  
  const tl = anime.timeline({ easing: 'easeOutQuad' });
  
  tl.add({
    targets: card,
    scale: [0.9, 1.03, 1],
    opacity: [0, 1],
    boxShadow: [
      '0 0 0px rgba(255, 203, 0, 0)',
      '0 0 40px rgba(255, 203, 0, 0.5)',
      '0 8px 30px rgba(255, 203, 0, 0.2)'
    ],
    duration,
    easing: 'easeOutBack'
  });
  
  for (let i = 0; i < pulseCount; i++) {
    tl.add({
      targets: card,
      boxShadow: [
        '0 8px 30px rgba(255, 203, 0, 0.2)',
        '0 8px 40px rgba(255, 203, 0, 0.4)',
        '0 8px 30px rgba(255, 203, 0, 0.2)'
      ],
      duration: 800,
      easing: 'easeInOutSine'
    }, `+=${i * 200}`);
  }
  
  return trackAnimation(tl);
}

/**
 * Anima partículas a lo largo de un path
 */
export function particleFlow(particle, pathD, options = {}) {
  const {
    duration = 1500,
    easing = 'easeInOutQuad'
  } = options;
  
  particle.style.offsetPath = `path('${pathD}')`;
  
  return trackAnimation(anime({
    targets: particle,
    offsetDistance: ['0%', '100%'],
    scale: [0.5, 1.2, 0.5],
    opacity: [0, 1, 0],
    duration,
    easing
  }));
}
