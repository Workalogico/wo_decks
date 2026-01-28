/**
 * ═══════════════════════════════════════════════════════════════
 * WO-ANIME GROWTH MODULE
 * Animaciones para Growth Tesis / WoOS
 * 
 * Dependencias: wo-anime-core.js, anime.js
 * ═══════════════════════════════════════════════════════════════
 */

import { config, trackAnimation } from './wo-anime-core.js';

/**
 * Revelación ascendente (Sistema Ascendente WoOS)
 */
export function ascendingReveal(container, options = {}) {
  const {
    selector = '.ascending-item',
    duration = 800,
    staggerDelay = 200,
    direction = 'up',
    glowColor = config.getPrimaryColor()
  } = options;
  
  const items = container.querySelectorAll(selector);
  if (items.length === 0) return null;
  
  items.forEach((item, i) => {
    item.style.opacity = '0';
    const baseY = direction === 'spiral' ? 60 - (i * 10) : 60;
    const baseX = direction === 'diagonal' ? 30 : 0;
    item.style.transform = `translateY(${baseY}px) translateX(${baseX}px) scale(0.9)`;
  });
  
  const tl = anime.timeline({ easing: config.easing.expo });
  
  items.forEach((item, i) => {
    const baseY = direction === 'spiral' ? 60 - (i * 10) : 60;
    const baseX = direction === 'diagonal' ? 30 : 0;
    const rotation = direction === 'spiral' ? 5 - i : 0;
    
    tl.add({
      targets: item,
      opacity: [0, 1],
      translateY: [baseY, 0],
      translateX: [baseX, 0],
      scale: [0.9, 1],
      rotate: [rotation, 0],
      duration,
      easing: 'easeOutBack',
      complete: () => {
        item.style.willChange = 'auto';
      }
    }, i * staggerDelay);
    
    tl.add({
      targets: item,
      boxShadow: [
        `0 0 0px ${glowColor}00`,
        `0 0 20px ${glowColor}44`,
        `0 0 0px ${glowColor}00`
      ],
      duration: 600,
      easing: 'easeOutQuad'
    }, i * staggerDelay + 200);
  });
  
  return trackAnimation(tl);
}

/**
 * Pulso de sistema para elementos destacados
 */
export function systemPulse(targets, options = {}) {
  const {
    color = config.getPrimaryColor(),
    intensity = 15,
    duration = 1500,
    loop = true
  } = options;
  
  return trackAnimation(anime({
    targets,
    boxShadow: [
      `0 0 0px ${color}00`,
      `0 0 ${intensity}px ${color}66`,
      `0 0 0px ${color}00`
    ],
    duration,
    loop,
    easing: 'easeInOutSine'
  }));
}

/**
 * Animación de pilares (metodología/pilares)
 */
export function pilarsAnimation(container, options = {}) {
  const {
    cardSelector = '.wo-card',
    numberSelector = '.card-number',
    delay = 150,
    duration = 600
  } = options;
  
  const cards = container.querySelectorAll(cardSelector);
  const numbers = container.querySelectorAll(numberSelector);
  
  if (cards.length === 0) return null;
  
  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px) scale(0.95)';
  });
  
  numbers.forEach(num => {
    num.style.opacity = '0';
    num.style.transform = 'scale(0.5)';
  });
  
  const tl = anime.timeline({ easing: config.easing.spring });
  
  tl.add({
    targets: Array.from(cards),
    opacity: [0, 1],
    translateY: [40, 0],
    scale: [0.95, 1],
    delay: anime.stagger(delay, { from: 'center' }),
    duration,
    complete: () => {
      cards.forEach(card => {
        card.style.willChange = 'auto';
      });
    }
  });
  
  tl.add({
    targets: Array.from(numbers),
    opacity: [0, 0.25],
    scale: [0.5, 1.2, 1],
    delay: anime.stagger(delay / 2, { from: 'first' }),
    duration: 500,
    easing: 'easeOutBack'
  }, '-=400');
  
  return trackAnimation(tl);
}

/**
 * Animación de comparación (antes/después)
 */
export function comparisonAnimation(container, options = {}) {
  const {
    negativeSelector = '.wo-comparison__col--negative',
    positiveSelector = '.wo-comparison__col--positive',
    duration = 600
  } = options;
  
  const negative = container.querySelector(negativeSelector);
  const positive = container.querySelector(positiveSelector);
  
  if (!negative && !positive) return null;
  
  const elements = [negative, positive].filter(Boolean);
  
  elements.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = i === 0 ? 'translateX(-40px)' : 'translateX(40px)';
  });
  
  const tl = anime.timeline({ easing: config.easing.expo });
  
  if (negative) {
    tl.add({
      targets: negative,
      opacity: [0, 1],
      translateX: [-40, 0],
      duration
    });
  }
  
  if (positive) {
    tl.add({
      targets: positive,
      opacity: [0, 1],
      translateX: [40, 0],
      duration
    }, negative ? '-=400' : 0);
    
    tl.add({
      targets: positive,
      boxShadow: [
        `0 0 0px ${config.getPrimaryColor()}00`,
        `0 0 20px ${config.getPrimaryColor()}33`,
        `0 0 10px ${config.getPrimaryColor()}22`
      ],
      duration: 500,
      easing: 'easeOutQuad'
    }, '-=200');
  }
  
  return trackAnimation(tl);
}

/**
 * Animación de casos de éxito
 */
export function casesAnimation(cases, options = {}) {
  const {
    delay = 150,
    duration = 500
  } = options;
  
  const caseArray = Array.from(cases);
  if (caseArray.length === 0) return null;
  
  caseArray.forEach(caseEl => {
    caseEl.style.opacity = '0';
    caseEl.style.transform = 'translateY(30px) scale(0.95)';
  });
  
  const tl = anime.timeline({ easing: config.easing.spring });
  
  tl.add({
    targets: caseArray,
    opacity: [0, 1],
    translateY: [30, 0],
    scale: [0.95, 1],
    delay: anime.stagger(delay),
    duration
  });
  
  caseArray.forEach((caseEl, i) => {
    const metrics = caseEl.querySelectorAll('.wo-case__metric-value');
    if (metrics.length > 0) {
      tl.add({
        targets: Array.from(metrics),
        color: [getTokens().textSecondary, config.getPrimaryColor()],
        duration: 400,
        delay: anime.stagger(80),
        easing: 'easeOutQuad'
      }, (i * delay) + 300);
    }
  });
  
  return trackAnimation(tl);
}
