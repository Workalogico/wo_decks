/**
 * ═══════════════════════════════════════════════════════════════
 * WO-ANIME CORE MODULE
 * Workalógico Animation System - Core utilities and configuration
 * 
 * Este módulo contiene la configuración base y utilidades compartidas
 * por todos los demás módulos de animación.
 * 
 * Dependencias: Ninguna
 * ═══════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════
// CONFIGURACIÓN
// ═══════════════════════════════════════════════════════════════

export const config = {
  // Duraciones base (ms)
  duration: {
    fast: 300,
    normal: 600,
    slow: 1000,
    counter: 1500,
    cover: 800
  },
  // Easings predefinidos
  easing: {
    smooth: 'easeOutQuad',
    softLanding: 'cubicBezier(0.23, 1, 0.32, 1)', // Fluidity overhaul - aterrizaje suave
    bounce: 'easeOutElastic(1, 0.5)',
    spring: 'spring(1, 80, 10, 0)',
    expo: 'easeOutExpo',
    back: 'easeOutBack'
  },
  // Colores de marca
  colors: {
    yellow: '#FFCB00',
    blue: '#5968EA',
    dark: '#0F0F1A'
  },
  // Detectar tema actual
  getTheme: () => document.body.dataset.woTheme || 'yellow',
  getPrimaryColor: () => {
    const theme = document.body.dataset.woTheme || 'yellow';
    return theme === 'yellow' ? '#FFCB00' : '#5968EA';
  }
};

// ═══════════════════════════════════════════════════════════════
// ESTADO INTERNO
// ═══════════════════════════════════════════════════════════════

let runningAnimations = [];

// ═══════════════════════════════════════════════════════════════
// UTILIDADES DE FORMATEO
// ═══════════════════════════════════════════════════════════════

/**
 * Formatea números grandes (1000 → 1K, 1000000 → 1M)
 * @param {number} num - Número a formatear
 * @param {Object} options - Opciones de formato
 * @returns {string} Número formateado
 */
export function formatNumber(num, options = {}) {
  const { suffix = '', prefix = '', decimals = 0 } = options;
  
  if (num >= 1000000) {
    return prefix + (num / 1000000).toFixed(decimals) + 'M' + suffix;
  }
  if (num >= 1000) {
    return prefix + (num / 1000).toFixed(decimals) + 'K' + suffix;
  }
  return prefix + num.toFixed(decimals) + suffix;
}

/**
 * Parsea un valor con formato ($2.5M, 70%, 500K)
 * @param {string} str - String a parsear
 * @returns {Object} Objeto con valor y metadata
 */
export function parseFormattedValue(str) {
  const clean = str.replace(/[^0-9.KMB%+-]/gi, '');
  let num = parseFloat(clean) || 0;
  
  if (clean.includes('M') || clean.includes('m')) num *= 1000000;
  else if (clean.includes('K') || clean.includes('k')) num *= 1000;
  else if (clean.includes('B') || clean.includes('b')) num *= 1000000000;
  
  return {
    value: num,
    hasPercent: str.includes('%'),
    hasPlus: str.includes('+'),
    hasPrefix: str.match(/^[$€£]/)?.[0] || '',
    hasSuffix: str.match(/[KMB%+]+$/i)?.[0] || ''
  };
}

/**
 * Detecta el número de decimales en un string
 * @param {string} str - String a analizar
 * @returns {number} Número de decimales
 */
export function detectDecimals(str) {
  const match = str.match(/\.(\d+)/);
  return match ? match[1].length : 0;
}

// ═══════════════════════════════════════════════════════════════
// GESTIÓN DE ANIMACIONES
// ═══════════════════════════════════════════════════════════════

/**
 * Detiene todas las animaciones en ejecución
 */
export function stopAllAnimations() {
  runningAnimations.forEach(anim => {
    if (anim && typeof anim.pause === 'function') {
      anim.pause();
    }
  });
  runningAnimations = [];
}

/**
 * Registra una animación para tracking
 * @param {Object} anim - Animación de anime.js
 * @returns {Object} La misma animación (para encadenamiento)
 */
export function trackAnimation(anim) {
  runningAnimations.push(anim);
  return anim;
}

/**
 * Obtiene el número de animaciones en ejecución
 * @returns {number} Cantidad de animaciones activas
 */
export function getRunningAnimationsCount() {
  return runningAnimations.length;
}

/**
 * Limpia animaciones completadas de la lista de tracking
 */
export function cleanupCompletedAnimations() {
  runningAnimations = runningAnimations.filter(anim => {
    return anim && !anim.completed;
  });
}
