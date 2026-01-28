/**
 * ═══════════════════════════════════════════════════════════════
 * WORKALÓGICO THEME SWITCH - Componente Animado
 * Interruptor animado para alternar entre tema amarillo y azul
 * Requiere: Anime.js v4+ (CDN o módulo)
 * ═══════════════════════════════════════════════════════════════
 */

class WoThemeSwitch {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' 
      ? document.querySelector(container) 
      : container;
    
    if (!this.container) {
      console.error('WoThemeSwitch: Container not found');
      return;
    }
    
    this.options = {
      initialTheme: options.initialTheme || this.getStoredTheme() || 'yellow',
      onChange: options.onChange || null,
      showLabel: options.showLabel !== false,
      variant: options.variant || 'default', // DS-103: 'default' | 'minimal' | 'pill' | 'orbital'
      ...options
    };
    
    this.currentTheme = this.options.initialTheme;
    this.isAnimating = false;
    
    this.colors = {
      yellow: '#FFCB00',
      blue: '#5968EA',
      dark: '#1a1a1e'
    };
    
    // DS-103: Variaciones disponibles
    this.variants = {
      default: { name: 'Default', desc: 'Diseño estándar con íconos' },
      minimal: { name: 'Minimal', desc: 'Limpio y compacto' },
      pill: { name: 'Pill', desc: 'Pastilla con degradado' },
      orbital: { name: 'Orbital', desc: 'Anillo decorativo animado' }
    };
    
    this.init();
  }
  
  getStoredTheme() {
    return localStorage.getItem('wo-theme');
  }
  
  init() {
    this.render();
    this.cacheElements();
    this.bindEvents();
    this.setInitialState();
  }
  
  render() {
    const labelText = this.currentTheme === 'yellow' ? 'Brand' : 'Tech';
    const variantClass = this.options.variant !== 'default' 
      ? `wo-theme-switch--${this.options.variant}` 
      : '';
    
    this.container.innerHTML = `
      <div class="wo-theme-switch-container">
        <div class="wo-theme-switch ${variantClass}" role="switch" aria-checked="${this.currentTheme === 'yellow'}" tabindex="0">
          <div class="wo-theme-switch__track">
            <div class="wo-theme-switch__bg"></div>
            <div class="wo-theme-switch__glow wo-theme-switch__glow--yellow"></div>
            <div class="wo-theme-switch__glow wo-theme-switch__glow--blue"></div>
            <div class="wo-theme-switch__particles">
              ${this.createParticles(8)}
            </div>
          </div>
          
          <div class="wo-theme-switch__icons">
            <div class="wo-theme-switch__icon wo-theme-switch__icon--sun">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="4"/>
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
              </svg>
            </div>
            <div class="wo-theme-switch__icon wo-theme-switch__icon--lab">
              <svg viewBox="0 0 24 24">
                <path d="M9 3h6v2H9zM10 5v4l-5 8h14l-5-8V5"/>
                <circle cx="10" cy="14" r="1"/>
                <circle cx="14" cy="15" r="1"/>
                <circle cx="12" cy="12" r="0.5"/>
              </svg>
            </div>
          </div>
          
          <div class="wo-theme-switch__knob">
            <div class="wo-theme-switch__knob-icon">
              <svg viewBox="0 0 24 24">
                <!-- Teseracto simplificado -->
                <rect x="6" y="6" width="12" height="12" rx="1"/>
                <rect x="9" y="9" width="6" height="6" rx="0.5"/>
                <line x1="6" y1="6" x2="9" y2="9"/>
                <line x1="18" y1="6" x2="15" y2="9"/>
                <line x1="6" y1="18" x2="9" y2="15"/>
                <line x1="18" y1="18" x2="15" y2="15"/>
              </svg>
            </div>
            <div class="wo-theme-switch__knob-shine"></div>
          </div>
        </div>
        ${this.options.showLabel ? `
          <div class="wo-theme-switch__label">
            <span class="wo-theme-switch__label-text">${labelText}</span>
          </div>
        ` : ''}
      </div>
    `;
  }
  
  createParticles(count) {
    let html = '';
    for (let i = 0; i < count; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      html += `<div class="wo-theme-switch__particle" style="left: ${x}%; top: ${y}%; background: ${i % 2 === 0 ? this.colors.yellow : this.colors.blue};"></div>`;
    }
    return html;
  }
  
  cacheElements() {
    this.switch = this.container.querySelector('.wo-theme-switch');
    this.track = this.container.querySelector('.wo-theme-switch__track');
    this.bg = this.container.querySelector('.wo-theme-switch__bg');
    this.knob = this.container.querySelector('.wo-theme-switch__knob');
    this.knobIcon = this.container.querySelector('.wo-theme-switch__knob-icon svg');
    this.glowYellow = this.container.querySelector('.wo-theme-switch__glow--yellow');
    this.glowBlue = this.container.querySelector('.wo-theme-switch__glow--blue');
    this.iconSun = this.container.querySelector('.wo-theme-switch__icon--sun');
    this.iconLab = this.container.querySelector('.wo-theme-switch__icon--lab');
    this.particles = this.container.querySelectorAll('.wo-theme-switch__particle');
    this.label = this.container.querySelector('.wo-theme-switch__label-text');
  }
  
  bindEvents() {
    this.switch.addEventListener('click', () => this.toggle());
    this.switch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggle();
      }
    });
  }
  
  setInitialState() {
    const knobTravel = this.switch.offsetWidth - this.knob.offsetWidth - 12;
    
    if (this.currentTheme === 'blue') {
      // Posición azul (derecha)
      this.knob.style.transform = `translateX(${knobTravel}px)`;
      this.knob.style.background = this.colors.blue;
      this.knob.style.boxShadow = `0 2px 8px rgba(0,0,0,0.3), 0 0 20px rgba(89,104,234,0.4), inset 0 2px 4px rgba(255,255,255,0.3)`;
      this.bg.style.transform = 'translateX(-50%)';
      this.glowYellow.style.opacity = '0';
      this.glowBlue.style.opacity = '0.4';
    } else {
      // Posición amarilla (izquierda)
      this.knob.style.transform = 'translateX(0)';
      this.knob.style.background = this.colors.yellow;
      this.glowYellow.style.opacity = '0.4';
      this.glowBlue.style.opacity = '0';
    }
    
    // Aplicar tema al body
    document.body.dataset.woTheme = this.currentTheme;
  }
  
  toggle() {
    if (this.isAnimating) return;
    
    const newTheme = this.currentTheme === 'yellow' ? 'blue' : 'yellow';
    this.animateToTheme(newTheme);
  }
  
  animateToTheme(theme) {
    if (this.isAnimating || theme === this.currentTheme) return;
    
    this.isAnimating = true;
    const toBlue = theme === 'blue';
    const knobTravel = this.switch.offsetWidth - this.knob.offsetWidth - 12;
    
    // ═══════════════════════════════════════════════════════════════
    // OPTIMIZACIÓN DS-101: Respuesta instantánea (<100ms)
    // El tema se aplica INMEDIATAMENTE, la animación es cosmética
    // ═══════════════════════════════════════════════════════════════
    
    // 1. INMEDIATO: Actualizar estado interno y tema global
    this.currentTheme = theme;
    document.body.dataset.woTheme = theme;
    this.switch.setAttribute('aria-checked', theme === 'yellow');
    
    // 2. ASYNC: localStorage en microtask para no bloquear
    queueMicrotask(() => {
      localStorage.setItem('wo-theme', theme);
    });
    
    // 3. INMEDIATO: Callback para que otros componentes reaccionen
    if (this.options.onChange) {
      this.options.onChange(theme);
    }
    
    // Calcular posiciones para animación
    const fromX = toBlue ? 0 : knobTravel;
    const toX = toBlue ? knobTravel : 0;
    
    // ═══════════════════════════════════════════════════════════════
    // ANIMACIÓN VISUAL (no bloquea la funcionalidad)
    // ═══════════════════════════════════════════════════════════════
    
    // Timeline optimizado - todas las animaciones en paralelo donde sea posible
    const timeline = anime.timeline({
      easing: 'easeOutQuad',
      complete: () => {
        this.isAnimating = false;
      }
    });
    
    // Knob: squash + movimiento + color (combinados para menos overhead)
    timeline.add({
      targets: this.knob,
      translateX: [fromX, toX],
      scaleX: [1, 1.15, 1],
      scaleY: [1, 0.9, 1],
      backgroundColor: toBlue ? this.colors.blue : this.colors.yellow,
      boxShadow: toBlue 
        ? '0 2px 8px rgba(0,0,0,0.3), 0 0 20px rgba(89,104,234,0.4), inset 0 2px 4px rgba(255,255,255,0.3)'
        : '0 2px 8px rgba(0,0,0,0.3), 0 0 20px rgba(255,203,0,0.4), inset 0 2px 4px rgba(255,255,255,0.3)',
      duration: 400,
      easing: 'easeOutElastic(1, 0.7)'
    });
    
    // Rotación del ícono (paralelo)
    timeline.add({
      targets: this.knobIcon,
      rotate: toBlue ? '180deg' : '0deg',
      duration: 350,
      easing: 'easeOutBack'
    }, 0);
    
    // Fondo degradado (paralelo)
    timeline.add({
      targets: this.bg,
      translateX: toBlue ? '-50%' : '0%',
      duration: 300,
      easing: 'easeInOutQuad'
    }, 0);
    
    // Glows en paralelo
    anime({
      targets: this.glowYellow,
      opacity: toBlue ? 0 : 0.4,
      duration: 250,
      easing: 'easeInOutQuad'
    });
    
    anime({
      targets: this.glowBlue,
      opacity: toBlue ? 0.4 : 0,
      duration: 250,
      easing: 'easeInOutQuad'
    });
    
    // Íconos laterales en paralelo
    anime({
      targets: this.iconSun,
      opacity: toBlue ? 0.6 : 0.3,
      scale: toBlue ? 1.1 : 1,
      duration: 200,
      easing: 'easeOutQuad'
    });
    
    anime({
      targets: this.iconLab,
      opacity: toBlue ? 0.3 : 0.6,
      scale: toBlue ? 1 : 1.1,
      duration: 200,
      easing: 'easeOutQuad'
    });
    
    // Partículas (efecto secundario, no crítico)
    requestAnimationFrame(() => {
      this.animateParticles(toBlue);
    });
    
    // Label con transición más rápida
    if (this.label) {
      this.label.style.transition = 'opacity 100ms ease';
      this.label.style.opacity = '0';
      setTimeout(() => {
        this.label.textContent = toBlue ? 'Tech' : 'Brand';
        this.label.style.opacity = '1';
      }, 100);
    }
  }
  
  animateParticles(toBlue) {
    const color = toBlue ? this.colors.blue : this.colors.yellow;
    
    this.particles.forEach((particle, i) => {
      // Posición inicial aleatoria cerca del knob
      const startX = toBlue ? 30 : 70;
      const startY = 50;
      
      // Posición final aleatoria
      const endX = startX + (Math.random() - 0.5) * 80;
      const endY = startY + (Math.random() - 0.5) * 80;
      
      anime({
        targets: particle,
        left: [`${startX}%`, `${endX}%`],
        top: [`${startY}%`, `${endY}%`],
        opacity: [0, 1, 0],
        scale: [0, 1.5, 0],
        backgroundColor: color,
        duration: 600 + Math.random() * 300,
        delay: i * 30,
        easing: 'easeOutExpo'
      });
    });
  }
  
  setTheme(theme) {
    if (theme !== 'yellow' && theme !== 'blue') return;
    if (theme === this.currentTheme) return;
    
    this.animateToTheme(theme);
  }
  
  getTheme() {
    return this.currentTheme;
  }
  
  // DS-103: Cambiar variación visual
  setVariant(variant) {
    if (!this.variants[variant]) return;
    
    this.options.variant = variant;
    localStorage.setItem('wo-theme-switch-variant', variant);
    
    // Re-renderizar con la nueva variación
    this.render();
    this.cacheElements();
    this.bindEvents();
    this.setInitialState();
  }
  
  getVariant() {
    return this.options.variant;
  }
  
  // DS-103: Renderizar selector de variaciones
  static renderVariantSelector(containerId, switchInstance) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const variants = switchInstance.variants;
    const currentVariant = switchInstance.options.variant;
    
    let html = '<div class="wo-theme-switch-variants">';
    
    for (const [key, info] of Object.entries(variants)) {
      const isActive = key === currentVariant ? 'active' : '';
      html += `
        <div class="wo-theme-switch-variant ${isActive}" data-variant="${key}">
          <div class="wo-theme-switch-variant__preview">
            <div class="wo-theme-switch ${key !== 'default' ? `wo-theme-switch--${key}` : ''}" style="pointer-events: none;">
              <div class="wo-theme-switch__track">
                <div class="wo-theme-switch__bg"></div>
                <div class="wo-theme-switch__glow wo-theme-switch__glow--yellow"></div>
              </div>
              <div class="wo-theme-switch__knob">
                <div class="wo-theme-switch__knob-icon">
                  <svg viewBox="0 0 24 24">
                    <rect x="6" y="6" width="12" height="12" rx="1"/>
                    <rect x="9" y="9" width="6" height="6" rx="0.5"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <span class="wo-theme-switch-variant__name">${info.name}</span>
          <span class="wo-theme-switch-variant__desc">${info.desc}</span>
        </div>
      `;
    }
    
    html += '</div>';
    container.innerHTML = html;
    
    // Bind eventos
    container.querySelectorAll('.wo-theme-switch-variant').forEach(el => {
      el.addEventListener('click', () => {
        const variant = el.dataset.variant;
        switchInstance.setVariant(variant);
        
        // Actualizar estado activo
        container.querySelectorAll('.wo-theme-switch-variant').forEach(v => {
          v.classList.toggle('active', v.dataset.variant === variant);
        });
      });
    });
  }
  
  destroy() {
    this.container.innerHTML = '';
  }
}

// Auto-inicializar si hay elementos con data-wo-theme-switch
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-wo-theme-switch]').forEach(el => {
    new WoThemeSwitch(el);
  });
});

// Exportar para uso global
window.WoThemeSwitch = WoThemeSwitch;
