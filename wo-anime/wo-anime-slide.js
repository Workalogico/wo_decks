/**
 * ═══════════════════════════════════════════════════════════════
 * WO-ANIME SLIDE MODULE
 * Workalógico Animation System - Slide animations (Reveal.js)
 * 
 * Animaciones específicas para slides de Reveal.js:
 * - Cover (portada cinematográfica)
 * - Section (títulos de sección)
 * - Handlers de Reveal.js
 * 
 * Dependencias: wo-anime-core.js, wo-anime-counter.js, anime.js
 * ═══════════════════════════════════════════════════════════════
 */

import { config, trackAnimation, stopAllAnimations } from './wo-anime-core.js';
import { counter } from './wo-anime-counter.js';

// ═══════════════════════════════════════════════════════════════
// COVER (PORTADA)
// ═══════════════════════════════════════════════════════════════

/**
 * Animación cinematográfica para portadas
 * Secuencia: Logo → Badge → Título → Subtítulo → Stats → Author
 */
export function cover(slideElement, options = {}) {
  const {
    duration = config.duration.cover,
    staggerStats = 120,
    highlightAccent = true,
    animateCounters = true
  } = options;
  
  const container = slideElement.querySelector('.wo-cover') || slideElement;
  const logo = container.querySelector('.wo-cover__logo');
  const badge = container.querySelector('.wo-badge');
  const title = container.querySelector('.wo-cover__title');
  const titleAccent = title?.querySelector('.accent, .accent-yellow');
  const subtitle = container.querySelector('.wo-cover__subtitle');
  const stats = container.querySelectorAll('.wo-stat');
  const statValues = container.querySelectorAll('.wo-stat__value');
  const author = container.querySelector('.wo-cover__author');
  const gridBg = container.querySelector('.grid-background');
  
  const elements = [logo, badge, title, subtitle, author, ...stats].filter(Boolean);
  elements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
  });
  
  if (titleAccent && highlightAccent) {
    titleAccent.style.opacity = '0';
    titleAccent.style.display = 'inline-block';
  }
  
  if (gridBg) gridBg.style.opacity = '0';
  
  const tl = anime.timeline({ easing: config.easing.expo });
  
  if (gridBg) {
    tl.add({ targets: gridBg, opacity: [0, 0.4], duration: 1200, easing: 'easeOutQuad' }, 0);
  }
  
  if (logo) {
    tl.add({
      targets: logo,
      scale: [0.7, 1],
      opacity: [0, 0.9],
      translateY: [40, 0],
      filter: ['blur(4px)', 'blur(0px)'],
      duration,
      easing: config.easing.expo
    }, 100);
  }
  
  if (badge) {
    tl.add({
      targets: badge,
      opacity: [0, 1],
      translateY: [-15, 0],
      scale: [0.9, 1],
      duration: 450,
      easing: config.easing.back
    }, '-=400');
  }
  
  if (title) {
    tl.add({
      targets: title,
      opacity: [0, 1],
      translateY: [50, 0],
      duration: 700,
      easing: config.easing.expo
    }, '-=250');
    
    if (titleAccent && highlightAccent) {
      tl.add({
        targets: titleAccent,
        opacity: [0, 1],
        scale: [0.95, 1],
        textShadow: [
          `0 0 0px ${config.getPrimaryColor()}`,
          `0 0 20px ${config.getPrimaryColor()}`,
          `0 0 0px ${config.getPrimaryColor()}`
        ],
        duration: 600,
        easing: 'easeOutQuad'
      }, '-=400');
    }
  }
  
  if (subtitle) {
    tl.add({
      targets: subtitle,
      opacity: [0, 1],
      translateY: [25, 0],
      duration: 550,
      easing: config.easing.smooth
    }, '-=350');
  }
  
  if (stats.length > 0) {
    tl.add({
      targets: Array.from(stats),
      scale: [0.85, 1],
      opacity: [0, 1],
      translateY: [25, 0],
      delay: anime.stagger(staggerStats, { from: 'center' }),
      duration: 500,
      easing: config.easing.spring
    }, '-=200');
    
    if (animateCounters && statValues.length > 0) {
      setTimeout(() => {
        statValues.forEach(val => {
          if (val.textContent.match(/[\d.,]+[KMB%+]*/)) {
            counter(val, { duration: 1200, easing: config.easing.expo });
          }
        });
      }, 600);
    }
  }
  
  if (author) {
    tl.add({
      targets: author,
      opacity: [0, 1],
      translateY: [15, 0],
      duration: 400,
      easing: config.easing.smooth,
      complete: () => {
        elements.forEach(el => {
          if (el) el.style.willChange = 'auto';
        });
      }
    }, '-=150');
  }
  
  return trackAnimation(tl);
}

// ═══════════════════════════════════════════════════════════════
// SECTION
// ═══════════════════════════════════════════════════════════════

/**
 * Animación de sección (título + subtítulo)
 */
export function section(slideElement, options = {}) {
  const { duration = 600 } = options;
  
  const title = slideElement.querySelector('.wo-section__title');
  const titleAccent = title?.querySelector('.accent, .accent-yellow');
  const subtitle = slideElement.querySelector('.wo-section__subtitle');
  
  const elements = [title, subtitle].filter(Boolean);
  elements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
  });
  
  if (titleAccent) {
    titleAccent.style.opacity = '0';
    titleAccent.style.display = 'inline-block';
  }
  
  const tl = anime.timeline({ easing: config.easing.expo });
  
  if (title) {
    tl.add({
      targets: title,
      opacity: [0, 1],
      translateY: [40, 0],
      duration
    });
    
    if (titleAccent) {
      tl.add({
        targets: titleAccent,
        opacity: [0, 1],
        textShadow: [
          `0 0 0px ${config.getPrimaryColor()}`,
          `0 0 15px ${config.getPrimaryColor()}`,
          `0 0 0px ${config.getPrimaryColor()}`
        ],
        duration: 500
      }, '-=400');
    }
  }
  
  if (subtitle) {
    tl.add({
      targets: subtitle,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 450
    }, '-=300');
  }
  
  return trackAnimation(tl);
}

// ═══════════════════════════════════════════════════════════════
// REVEAL.JS INTEGRATION
// ═══════════════════════════════════════════════════════════════

let initialized = false;
let currentSlide = null;

/**
 * Inicializa el sistema con Reveal.js
 */
export function init(options = {}) {
  if (initialized) {
    console.warn('WoAnime: Already initialized');
    return;
  }
  
  if (typeof anime === 'undefined') {
    console.error('WoAnime: Anime.js is required but not loaded');
    return;
  }
  
  if (typeof Reveal === 'undefined') {
    console.warn('WoAnime: Reveal.js not found, running in standalone mode');
  } else {
    Reveal.on('slidechanged', onSlideChange);
    Reveal.on('fragmentshown', onFragmentShown);
    Reveal.on('fragmenthidden', onFragmentHidden);
    
    Reveal.on('ready', (event) => {
      if (event.currentSlide) {
        onSlideChange({ currentSlide: event.currentSlide });
      }
    });
  }
  
  initialized = true;
  console.log('WoAnime: Initialized successfully');
}

/**
 * Destruye el sistema
 */
export function destroy() {
  stopAllAnimations();
  
  if (typeof Reveal !== 'undefined') {
    Reveal.off('slidechanged', onSlideChange);
    Reveal.off('fragmentshown', onFragmentShown);
    Reveal.off('fragmenthidden', onFragmentHidden);
  }
  
  initialized = false;
}

/**
 * Handler para cambio de slide
 */
function onSlideChange(event) {
  const slide = event.currentSlide;
  const previousSlide = event.previousSlide;
  
  if (previousSlide) {
    animateSlideExit(previousSlide);
  }
  
  stopAllAnimations();
  currentSlide = slide;
  
  if (slide.classList.contains('wo-cover') || slide.querySelector('.wo-cover')) {
    cover(slide, { animateCounters: true });
    return;
  }
  
  if (slide.querySelector('.wo-section__title')) {
    section(slide);
  }
  
  // Más handlers de auto-animación...
}

/**
 * Animación de salida para el slide anterior
 */
function animateSlideExit(slide) {
  if (!slide) return;
  
  const elements = slide.querySelectorAll('.wo-card, .wo-stat, .wo-metric, .wo-column');
  if (elements.length === 0) return;
  
  anime({
    targets: elements,
    opacity: [1, 0],
    translateX: [-20, 0],
    duration: 250,
    easing: 'easeInQuad',
    complete: () => {
      elements.forEach(el => {
        if (el && el.style) el.style.willChange = 'auto';
      });
    }
  });
}

/**
 * Handler para fragment mostrado
 */
function onFragmentShown(event) {
  const fragment = event.fragment;
  
  if (fragment.classList.contains('wo-card')) {
    anime({
      targets: fragment,
      translateY: [30, 0],
      scale: [0.95, 1],
      opacity: [0, 1],
      duration: 500,
      easing: config.easing.spring
    });
  }
  
  if (fragment.classList.contains('wo-stat')) {
    const valueEl = fragment.querySelector('.wo-stat__value');
    if (valueEl && valueEl.textContent.match(/[\d.,]+[KMB%+]*/)) {
      setTimeout(() => counter(valueEl, { duration: 1000 }), 150);
    }
    
    anime({
      targets: fragment,
      scale: [0.85, 1],
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 450,
      easing: config.easing.spring
    });
  }
}

/**
 * Handler para fragment oculto
 */
function onFragmentHidden(event) {
  const fragment = event.fragment;
  
  if (fragment.dataset.originalValue) {
    fragment.textContent = fragment.dataset.originalValue;
  }
}

// ═══════════════════════════════════════════════════════════════
// GETTERS
// ═══════════════════════════════════════════════════════════════

export function isInitialized() {
  return initialized;
}

export function getCurrentSlide() {
  return currentSlide;
}
