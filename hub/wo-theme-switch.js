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
      ...options
    };
    
    this.currentTheme = this.options.initialTheme;
    this.isAnimating = false;
    
    this.colors = {
      yellow: '#FFCB00',
      blue: '#5968EA',
      dark: '#0F0F1A'
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
    
    this.container.innerHTML = `
      <div class="wo-theme-switch-container">
        <div class="wo-theme-switch" role="switch" aria-checked="${this.currentTheme === 'yellow'}" tabindex="0">
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
    
    // Calcular posiciones
    const fromX = toBlue ? 0 : knobTravel;
    const toX = toBlue ? knobTravel : 0;
    
    // Timeline de animación con Anime.js
    const timeline = anime.timeline({
      easing: 'easeOutElastic(1, 0.5)',
      complete: () => {
        this.currentTheme = theme;
        this.isAnimating = false;
        document.body.dataset.woTheme = theme;
        localStorage.setItem('wo-theme', theme);
        
        // Actualizar ARIA
        this.switch.setAttribute('aria-checked', theme === 'yellow');
        
        // Callback
        if (this.options.onChange) {
          this.options.onChange(theme);
        }
      }
    });
    
    // 1. Squash del knob al inicio
    timeline.add({
      targets: this.knob,
      scaleX: [1, 1.2],
      scaleY: [1, 0.85],
      duration: 150,
      easing: 'easeOutQuad'
    });
    
    // 2. Movimiento del knob
    timeline.add({
      targets: this.knob,
      translateX: [fromX, toX],
      scaleX: [1.2, 1],
      scaleY: [0.85, 1],
      duration: 500,
      easing: 'easeOutElastic(1, 0.6)'
    }, '-=100');
    
    // 3. Cambio de color del knob
    timeline.add({
      targets: this.knob,
      backgroundColor: toBlue ? this.colors.blue : this.colors.yellow,
      boxShadow: toBlue 
        ? '0 2px 8px rgba(0,0,0,0.3), 0 0 20px rgba(89,104,234,0.4), inset 0 2px 4px rgba(255,255,255,0.3)'
        : '0 2px 8px rgba(0,0,0,0.3), 0 0 20px rgba(255,203,0,0.4), inset 0 2px 4px rgba(255,255,255,0.3)',
      duration: 400,
      easing: 'easeInOutQuad'
    }, '-=450');
    
    // 4. Rotación del ícono del knob
    timeline.add({
      targets: this.knobIcon,
      rotate: toBlue ? '180deg' : '0deg',
      duration: 500,
      easing: 'easeOutBack'
    }, '-=500');
    
    // 5. Movimiento del fondo degradado
    timeline.add({
      targets: this.bg,
      translateX: toBlue ? '-50%' : '0%',
      duration: 400,
      easing: 'easeInOutQuad'
    }, '-=500');
    
    // 6. Glows
    timeline.add({
      targets: this.glowYellow,
      opacity: toBlue ? 0 : 0.4,
      duration: 300,
      easing: 'easeInOutQuad'
    }, '-=400');
    
    timeline.add({
      targets: this.glowBlue,
      opacity: toBlue ? 0.4 : 0,
      duration: 300,
      easing: 'easeInOutQuad'
    }, '-=300');
    
    // 7. Íconos laterales
    timeline.add({
      targets: this.iconSun,
      opacity: toBlue ? 0.6 : 0.3,
      scale: toBlue ? 1.1 : 1,
      duration: 300,
      easing: 'easeOutQuad'
    }, '-=400');
    
    timeline.add({
      targets: this.iconLab,
      opacity: toBlue ? 0.3 : 0.6,
      scale: toBlue ? 1 : 1.1,
      duration: 300,
      easing: 'easeOutQuad'
    }, '-=300');
    
    // 8. Partículas de celebración
    this.animateParticles(toBlue);
    
    // 9. Actualizar label
    if (this.label) {
      anime({
        targets: this.label,
        opacity: [1, 0],
        duration: 150,
        easing: 'easeOutQuad',
        complete: () => {
          this.label.textContent = toBlue ? 'Tech' : 'Brand';
          anime({
            targets: this.label,
            opacity: [0, 1],
            duration: 150,
            easing: 'easeInQuad'
          });
        }
      });
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
