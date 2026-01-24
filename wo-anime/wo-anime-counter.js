/**
 * ═══════════════════════════════════════════════════════════════
 * WO-ANIME COUNTER MODULE
 * Workalógico Animation System - Counter animations
 * 
 * Animaciones de contadores numéricos con soporte para formatos especiales:
 * - Valores simples: 1000, 50
 * - Con sufijos: 2.5M, 500K, 70%
 * - Con prefijos: $45,000, €120K
 * - Rangos: $40K - $60K, 2-6
 * - Combinaciones: $2.5M+, 15%+
 * 
 * Dependencias: wo-anime-core.js, anime.js
 * ═══════════════════════════════════════════════════════════════
 */

import { 
  config, 
  parseFormattedValue, 
  detectDecimals, 
  trackAnimation 
} from './wo-anime-core.js';

// ═══════════════════════════════════════════════════════════════
// CONTADOR PRINCIPAL
// ═══════════════════════════════════════════════════════════════

/**
 * Anima un contador numérico con soporte para formatos especiales
 * Soporta: $2.5M, 70%, 500M+, 15+, $40K - $60K, 2-6, etc.
 * 
 * @param {string|Element|NodeList} target - Selector, elemento o lista
 * @param {Object} options - Configuración
 * @returns {void}
 */
export function counter(target, options = {}) {
  const elements = typeof target === 'string' 
    ? document.querySelectorAll(target) 
    : (target instanceof NodeList ? Array.from(target) : [target]);
  
  const {
    from = 0,
    to = null, // Si es null, usa el contenido del elemento
    duration = config.duration.counter,
    easing = config.easing.expo,
    prefix = null, // Auto-detecta si es null
    suffix = null, // Auto-detecta si es null
    decimals = null, // Auto-detecta si es null
    format = true, // Formatear K, M, etc.
    preserveFormat = true, // Mantener el formato original del texto
    onComplete = null
  } = options;
  
  elements.forEach(el => {
    if (!el) return;
    
    const originalText = el.textContent?.trim() || el.dataset.value || '0';
    
    // Guardar valor original para reset
    el.dataset.originalValue = originalText;
    
    // Detectar si es un rango (ej: "$40K - $60K" o "2-6")
    const rangeMatch = originalText.match(/^([^\d]*)([\d.,]+)([KMB%+]*)\s*[-–]\s*([^\d]*)([\d.,]+)([KMB%+]*)(.*)$/i);
    
    if (rangeMatch && preserveFormat) {
      // Es un rango - animar ambos valores
      animateRange(el, rangeMatch, { duration, easing, from });
      return;
    }
    
    // Parsear valor único
    const parsed = parseFormattedValue(originalText);
    let targetValue = to !== null ? to : parsed.value;
    
    // Auto-detectar configuración del formato
    const autoPrefix = prefix !== null ? prefix : parsed.hasPrefix;
    const autoSuffix = suffix !== null ? suffix : parsed.hasSuffix;
    const autoDecimals = decimals !== null ? decimals : detectDecimals(originalText);
    
    // Agregar clase para animación visual
    el.classList.add('wo-counter--animating');
    
    const anim = anime({
      targets: { value: from },
      value: targetValue,
      duration,
      easing,
      round: autoDecimals === 0 ? 1 : Math.pow(10, autoDecimals),
      update: (a) => {
        const current = a.animations[0].currentValue;
        el.textContent = formatCounterValue(current, {
          prefix: autoPrefix,
          suffix: autoSuffix,
          decimals: autoDecimals,
          format,
          hasPlus: parsed.hasPlus
        });
      },
      complete: () => {
        el.classList.remove('wo-counter--animating');
        el.classList.add('wo-counter--complete');
        // Restaurar texto original exacto para evitar diferencias de formato
        if (preserveFormat) {
          el.textContent = originalText;
        }
        if (onComplete) onComplete(el);
      }
    });
    
    trackAnimation(anim);
  });
}

// ═══════════════════════════════════════════════════════════════
// ANIMACIÓN DE RANGOS
// ═══════════════════════════════════════════════════════════════

/**
 * Anima un rango de valores (ej: "$40K - $60K")
 * @param {Element} el - Elemento a animar
 * @param {Array} match - Resultado del regex de rango
 * @param {Object} options - Opciones de animación
 */
export function animateRange(el, match, options) {
  const [_, prefix1, val1, suffix1, prefix2, val2, suffix2, extra] = match;
  const { duration, easing, from } = options;
  
  const parsed1 = parseFormattedValue(prefix1 + val1 + suffix1);
  const parsed2 = parseFormattedValue(prefix2 + val2 + suffix2);
  
  const decimals1 = detectDecimals(val1);
  const decimals2 = detectDecimals(val2);
  
  el.classList.add('wo-counter--animating');
  
  const anim = anime({
    targets: { v1: from, v2: from },
    v1: parsed1.value,
    v2: parsed2.value,
    duration,
    easing,
    update: (a) => {
      const c1 = a.animations[0].currentValue;
      const c2 = a.animations[1].currentValue;
      
      const text1 = formatCounterValue(c1, {
        prefix: parsed1.hasPrefix,
        suffix: suffix1.replace(/[%+]/g, ''),
        decimals: decimals1,
        format: true
      });
      
      const text2 = formatCounterValue(c2, {
        prefix: parsed2.hasPrefix || parsed1.hasPrefix,
        suffix: suffix2.replace(/[%+]/g, ''),
        decimals: decimals2,
        format: true
      });
      
      el.textContent = `${text1} - ${text2}${extra}`;
    },
    complete: () => {
      el.classList.remove('wo-counter--animating');
      el.classList.add('wo-counter--complete');
      el.textContent = el.dataset.originalValue;
    }
  });
  
  trackAnimation(anim);
}

// ═══════════════════════════════════════════════════════════════
// FORMATEO DE VALORES
// ═══════════════════════════════════════════════════════════════

/**
 * Formatea el valor del contador con prefijo y sufijo
 * @param {number} value - Valor numérico
 * @param {Object} options - Opciones de formato
 * @returns {string} Valor formateado
 */
export function formatCounterValue(value, options = {}) {
  const { prefix = '', suffix = '', decimals = 0, format = true, hasPlus = false } = options;
  
  let result = '';
  
  // Prefijo ($, €, etc.)
  if (prefix) result += prefix;
  
  // Número formateado
  if (format && Math.abs(value) >= 1000000) {
    result += (value / 1000000).toFixed(decimals > 0 ? decimals : 1) + 'M';
  } else if (format && Math.abs(value) >= 1000) {
    result += (value / 1000).toFixed(decimals) + 'K';
  } else {
    result += decimals > 0 ? value.toFixed(decimals) : Math.round(value);
  }
  
  // Sufijo (%, +, etc.)
  if (suffix && !result.includes(suffix)) {
    result += suffix;
  }
  
  // Plus al final
  if (hasPlus && !result.includes('+')) {
    result += '+';
  }
  
  return result;
}

/**
 * Formatea precio con símbolo de moneda (compatible con WoPricing)
 * @param {number} num - Número a formatear
 * @param {string} currency - Símbolo de moneda
 * @returns {string} Precio formateado
 */
export function formatPrice(num, currency = '$') {
  return currency + Math.floor(num).toLocaleString('en-US');
}

// ═══════════════════════════════════════════════════════════════
// ALIAS PARA BACKWARD COMPATIBILITY
// ═══════════════════════════════════════════════════════════════

/**
 * Alias de counter() para compatibilidad con WoPricing
 * @param {Element} element - Elemento a animar
 * @param {Object} options - Opciones
 */
export function animateCounter(element, options = {}) {
  const targetPrice = parseInt(element.dataset.price) || 0;
  const duration = options.duration || config.duration.counter;
  const format = options.format || formatPrice;
  
  // Usar requestAnimationFrame para compatibilidad con WoPricing
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 4); // expo easing
    
    const currentValue = targetPrice * easeProgress;
    element.textContent = format(currentValue);
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = format(targetPrice);
    }
  }
  
  element.textContent = format(0);
  requestAnimationFrame(update);
}
