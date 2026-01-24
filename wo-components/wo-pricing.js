/**
 * ═══════════════════════════════════════════════════════════════
 * WO-PRICING: Pricing Cards Animation Module
 * Workalógico Design System v2.3
 * 
 * Funciones de animación para slides de pricing.
 * Requiere: wo-components/wo-pricing.css
 * 
 * ACTUALIZADO: Ahora usa wo-anime-counter.js para contadores
 * ═══════════════════════════════════════════════════════════════
 */

// Importar contador desde el módulo compartido
import { animateCounter, formatPrice } from '../wo-anime/wo-anime-counter.js';

const WoPricing = (function() {
  'use strict';
  
  // ─────────────────────────────────────────
  // CONFIGURACIÓN
  // ─────────────────────────────────────────
  
  const config = {
    staggerDelay: 150,        // ms entre cards
    counterDuration: 1200,    // ms para contador de precio
    phaseDelays: {
      basePrices: 700,        // ms para mostrar precios tachados
      discounts: 1000,        // ms para mostrar descuentos
      savings: 1400,          // ms para mostrar ahorros
      footer: 1800            // ms para mostrar footer
    },
    easing: {
      expo: (t) => 1 - Math.pow(1 - t, 4),
      cubic: (t) => 1 - Math.pow(1 - t, 3)
    }
  };
  
  // ─────────────────────────────────────────
  // ANIMACIÓN PRINCIPAL
  // ─────────────────────────────────────────
  
  /**
   * Inicia la animación de pricing cards
   * @param {HTMLElement|string} container - Contenedor o selector
   * @param {Object} options - Opciones de animación
   */
  function animate(container, options = {}) {
    const el = typeof container === 'string' 
      ? document.querySelector(container) 
      : container || document;
    
    const cards = el.querySelectorAll('.wo-card--pricing');
    const discounts = el.querySelectorAll('.wo-pricing-discount');
    const savings = el.querySelectorAll('.wo-pricing-savings');
    const basePrices = el.querySelectorAll('.wo-pricing-base');
    const footer = el.querySelector('.wo-pricing-footer');
    
    if (!cards.length) return;
    
    const delays = { ...config.phaseDelays, ...options.delays };
    const stagger = options.staggerDelay || config.staggerDelay;
    
    // Fase 1: Entrada escalonada de cards
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('animate-in');
        
        // Animar contador de precio
        const priceEl = card.querySelector('.card-price');
        if (priceEl && priceEl.dataset.price) {
          setTimeout(() => animateCounter(priceEl), 300);
        }
      }, index * stagger);
    });
    
    // Fase 2: Mostrar precios base (tachados)
    setTimeout(() => {
      basePrices.forEach(base => base.classList.add('visible'));
    }, delays.basePrices);
    
    // Fase 3: Revelar descuentos
    setTimeout(() => {
      discounts.forEach((discount, index) => {
        setTimeout(() => discount.classList.add('visible'), index * 200);
      });
    }, delays.discounts);
    
    // Fase 4: Mostrar ahorros
    setTimeout(() => {
      savings.forEach((saving, index) => {
        setTimeout(() => saving.classList.add('visible'), index * 150);
      });
    }, delays.savings);
    
    // Fase 5: Footer
    setTimeout(() => {
      if (footer) {
        footer.classList.add('visible');
      }
    }, delays.footer);
  }
  
  // ─────────────────────────────────────────
  // CONTADOR DE PRECIO
  // ─────────────────────────────────────────
  
  /**
   * Re-exporta animateCounter desde wo-anime-counter.js
   * Mantiene la misma API para backward compatibility
   */
  // La función animateCounter ya está importada desde wo-anime-counter.js
  
  /**
   * Re-exporta formatPrice desde wo-anime-counter.js
   */
  // La función formatPrice ya está importada desde wo-anime-counter.js
  
  // ─────────────────────────────────────────
  // RESET
  // ─────────────────────────────────────────
  
  /**
   * Resetea el estado de las pricing cards
   * @param {HTMLElement|string} container - Contenedor o selector
   */
  function reset(container) {
    const el = typeof container === 'string' 
      ? document.querySelector(container) 
      : container || document;
    
    const cards = el.querySelectorAll('.wo-card--pricing');
    const discounts = el.querySelectorAll('.wo-pricing-discount');
    const savings = el.querySelectorAll('.wo-pricing-savings');
    const basePrices = el.querySelectorAll('.wo-pricing-base');
    const footer = el.querySelector('.wo-pricing-footer');
    
    // Remover clases de animación
    cards.forEach(card => {
      card.classList.remove('animate-in');
      const priceEl = card.querySelector('.card-price');
      if (priceEl && priceEl.dataset.price) {
        priceEl.textContent = formatPrice(parseInt(priceEl.dataset.price));
      }
    });
    
    discounts.forEach(d => d.classList.remove('visible'));
    savings.forEach(s => s.classList.remove('visible'));
    basePrices.forEach(b => b.classList.remove('visible'));
    
    if (footer) {
      footer.classList.remove('visible');
    }
  }
  
  // ─────────────────────────────────────────
  // INTEGRACIÓN CON REVEAL.JS
  // ─────────────────────────────────────────
  
  /**
   * Registra el handler de animación para Reveal.js
   * @param {string} slideState - Nombre del data-state del slide
   * @param {Object} options - Opciones de animación
   */
  function registerRevealHandler(slideState = 'pricing-slide', options = {}) {
    if (typeof Reveal === 'undefined') {
      console.warn('WoPricing: Reveal.js not found');
      return;
    }
    
    Reveal.on('slidechanged', (event) => {
      // Reset al salir del slide
      if (event.previousSlide && event.previousSlide.dataset.state === slideState) {
        const container = event.previousSlide.querySelector('.wo-grid--pricing');
        if (container) reset(container);
      }
      
      // Animar al entrar al slide
      if (event.currentSlide.dataset.state === slideState) {
        setTimeout(() => {
          const container = event.currentSlide.querySelector('.wo-grid--pricing');
          animate(container, options);
        }, options.startDelay || 300);
      }
    });
  }
  
  // ─────────────────────────────────────────
  // API PÚBLICA
  // ─────────────────────────────────────────
  
  return {
    animate,
    animateCounter,
    reset,
    formatPrice,
    registerRevealHandler,
    config
  };
  
})();

// Exportar para módulos ES6
if (typeof module !== 'undefined' && module.exports) {
  module.exports = WoPricing;
}
