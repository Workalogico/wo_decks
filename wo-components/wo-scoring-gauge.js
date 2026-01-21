/* ═══════════════════════════════════════════════════════════════
   WORKALÓGICO SCORING GAUGE COMPONENT
   Visualización de scoring radial para Análisis de Vocación
   ═══════════════════════════════════════════════════════════════ */

// Configuración de ubicaciones de ejemplo
const SCORING_DATA = {
  locations: [
    {
      id: 'centro',
      name: 'Centro Histórico',
      score: 87,
      categories: [
        { icon: '👥', label: 'Tráfico peatonal', value: 92, level: 'high' },
        { icon: '🏪', label: 'Competencia', value: 65, level: 'medium' },
        { icon: '💰', label: 'Poder adquisitivo', value: 78, level: 'high' },
        { icon: '🚗', label: 'Accesibilidad', value: 85, level: 'high' }
      ],
      recommendation: {
        type: 'success',
        title: 'Alta Viabilidad',
        desc: 'Ubicación recomendada para formato flagship o experiencial'
      }
    },
    {
      id: 'norte',
      name: 'Zona Norte',
      score: 62,
      categories: [
        { icon: '👥', label: 'Tráfico peatonal', value: 45, level: 'medium' },
        { icon: '🏪', label: 'Competencia', value: 30, level: 'low' },
        { icon: '💰', label: 'Poder adquisitivo', value: 88, level: 'high' },
        { icon: '🚗', label: 'Accesibilidad', value: 72, level: 'medium' }
      ],
      recommendation: {
        type: 'warning',
        title: 'Viabilidad Moderada',
        desc: 'Requiere estrategia de atracción. Blue Ocean potential.'
      }
    },
    {
      id: 'sur',
      name: 'Zona Sur Industrial',
      score: 38,
      categories: [
        { icon: '👥', label: 'Tráfico peatonal', value: 25, level: 'low' },
        { icon: '🏪', label: 'Competencia', value: 15, level: 'low' },
        { icon: '💰', label: 'Poder adquisitivo', value: 42, level: 'medium' },
        { icon: '🚗', label: 'Accesibilidad', value: 55, level: 'medium' }
      ],
      recommendation: {
        type: 'danger',
        title: 'No Recomendada',
        desc: 'Bajo potencial para retail. Considerar B2B únicamente.'
      }
    }
  ]
};

// Clase principal
class WoScoringGauge {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    this.data = options.data || SCORING_DATA;
    this.currentLocation = this.data.locations[0];
    this.animated = false;
    
    this.options = {
      gaugeRadius: options.gaugeRadius || 120,
      strokeWidth: options.strokeWidth || 20,
      animationDuration: options.animationDuration || 1500,
      ...options
    };
    
    this.init();
  }

  init() {
    this.createStructure();
    this.bindEvents();
    
    setTimeout(() => this.animate(), 300);
  }

  createStructure() {
    const location = this.currentLocation;
    const { gaugeRadius, strokeWidth } = this.options;
    const circumference = 2 * Math.PI * gaugeRadius;
    const arcLength = circumference * 0.75; // 270 grados
    
    this.container.innerHTML = `
      <div class="wo-scoring-container">
        <!-- Selector de ubicaciones -->
        <div class="wo-location-selector">
          ${this.data.locations.map((loc, i) => `
            <button class="wo-location-btn ${i === 0 ? 'active' : ''}" data-id="${loc.id}">
              📍 ${loc.name}
            </button>
          `).join('')}
        </div>
        
        <div class="wo-scoring-top">
          <!-- Gauge principal -->
          <div class="wo-gauge-wrapper">
            <svg class="wo-gauge" viewBox="0 0 280 280">
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#FF6B6B" />
                  <stop offset="50%" stop-color="#FFCB00" />
                  <stop offset="100%" stop-color="#10B981" />
                </linearGradient>
              </defs>
              
              <!-- Track de fondo -->
              <circle 
                class="wo-gauge__track"
                cx="140" cy="140" r="${gaugeRadius}"
                stroke-dasharray="${arcLength} ${circumference}"
                stroke-dashoffset="${-circumference * 0.125}"
                transform="rotate(135, 140, 140)"
              />
              
              <!-- Progreso -->
              <circle 
                class="wo-gauge__progress wo-gauge__progress--gradient"
                cx="140" cy="140" r="${gaugeRadius}"
                stroke-dasharray="${arcLength} ${circumference}"
                stroke-dashoffset="${arcLength}"
                transform="rotate(135, 140, 140)"
                data-circumference="${arcLength}"
              />
            </svg>
            
            <div class="wo-gauge__center">
              <div class="wo-gauge__score" data-target="${location.score}">0</div>
              <div class="wo-gauge__max">/ 100</div>
              <div class="wo-gauge__label">Score de Potencial</div>
            </div>
            
            <span class="wo-gauge__range wo-gauge__range--min">0</span>
            <span class="wo-gauge__range wo-gauge__range--max">100</span>
          </div>
          
          <!-- Mini gauges por categoría -->
          <div class="wo-mini-gauges">
            ${location.categories.map(cat => `
              <div class="wo-mini-gauge" data-value="${cat.value}">
                <span class="wo-mini-gauge__icon">${cat.icon}</span>
                <div class="wo-mini-gauge__info">
                  <div class="wo-mini-gauge__label">${cat.label}</div>
                  <div class="wo-mini-gauge__bar-container">
                    <div class="wo-mini-gauge__bar wo-mini-gauge__bar--${cat.level}" data-width="${cat.value}"></div>
                  </div>
                </div>
                <span class="wo-mini-gauge__value">${cat.value}</span>
              </div>
            `).join('')}
          </div>
        </div>
        
        <!-- Recomendación -->
        <div class="wo-scoring-recommendation ${location.recommendation.type === 'success' ? '' : location.recommendation.type}">
          <span class="wo-scoring-recommendation__icon">
            ${location.recommendation.type === 'success' ? '✅' : location.recommendation.type === 'warning' ? '⚠️' : '❌'}
          </span>
          <div class="wo-scoring-recommendation__text">
            <div class="wo-scoring-recommendation__title">${location.recommendation.title}</div>
            <div class="wo-scoring-recommendation__desc">${location.recommendation.desc}</div>
          </div>
        </div>
      </div>
    `;
    
    this.progressCircle = this.container.querySelector('.wo-gauge__progress');
    this.scoreElement = this.container.querySelector('.wo-gauge__score');
  }

  bindEvents() {
    const buttons = this.container.querySelectorAll('.wo-location-btn');
    
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const locationId = btn.dataset.id;
        this.selectLocation(locationId);
        
        // Actualizar botones activos
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }

  selectLocation(locationId) {
    const location = this.data.locations.find(l => l.id === locationId);
    if (!location) return;
    
    this.currentLocation = location;
    this.animated = false;
    this.createStructure();
    this.bindEvents();
    setTimeout(() => this.animate(), 100);
  }

  animate() {
    if (this.animated) return;
    this.animated = true;
    
    const location = this.currentLocation;
    const { animationDuration } = this.options;
    
    // Check if Anime.js is available (WoAnime integration)
    if (typeof anime !== 'undefined') {
      this.animateWithAnime(location, animationDuration);
    } else {
      // Fallback to vanilla animation
      this.animateVanilla(location, animationDuration);
    }
  }
  
  /**
   * Animación usando Anime.js timelines (recomendado)
   * Proporciona animaciones más suaves y sincronizadas
   */
  animateWithAnime(location, duration) {
    const circumference = parseFloat(this.progressCircle.dataset.circumference);
    const targetOffset = circumference * (1 - location.score / 100);
    const miniBars = this.container.querySelectorAll('.wo-mini-gauge__bar');
    const miniValues = this.container.querySelectorAll('.wo-mini-gauge__value');
    const recommendation = this.container.querySelector('.wo-scoring-recommendation');
    const gaugeWrapper = this.container.querySelector('.wo-gauge-wrapper');
    
    // Reset estados iniciales
    this.scoreElement.classList.add('counting');
    if (recommendation) {
      recommendation.style.opacity = '0';
      recommendation.style.transform = 'translateY(20px)';
    }
    
    // Crear timeline coordinado
    const tl = anime.timeline({
      easing: 'easeOutExpo'
    });
    
    // 1. Gauge wrapper entrance (si es la primera vez)
    if (gaugeWrapper && !gaugeWrapper.dataset.animated) {
      gaugeWrapper.dataset.animated = 'true';
      tl.add({
        targets: gaugeWrapper,
        scale: [0.9, 1],
        opacity: [0, 1],
        duration: 600,
        easing: 'easeOutBack'
      }, 0);
    }
    
    // 2. Círculo de progreso - animar strokeDashoffset
    tl.add({
      targets: this.progressCircle,
      strokeDashoffset: [circumference, targetOffset],
      duration: duration,
      easing: 'easeOutExpo'
    }, 100);
    
    // 3. Contador numérico del score
    tl.add({
      targets: { value: 0 },
      value: location.score,
      round: 1,
      duration: duration * 0.9,
      easing: 'easeOutExpo',
      update: (anim) => {
        this.scoreElement.textContent = Math.round(anim.animations[0].currentValue);
      },
      complete: () => {
        this.scoreElement.classList.remove('counting');
      }
    }, 100);
    
    // 4. Glow effect en el score al completar
    tl.add({
      targets: this.scoreElement,
      textShadow: [
        '0 0 0px rgba(89, 104, 234, 0)',
        '0 0 25px rgba(89, 104, 234, 0.5)',
        '0 0 0px rgba(89, 104, 234, 0)'
      ],
      duration: 800,
      easing: 'easeInOutSine'
    }, duration * 0.7);
    
    // 5. Mini gauges con stagger
    if (miniBars.length > 0) {
      // Reset barras
      miniBars.forEach(bar => bar.style.width = '0%');
      
      tl.add({
        targets: Array.from(miniBars),
        width: (el) => el.dataset.width + '%',
        delay: anime.stagger(120),
        duration: 600,
        easing: 'easeOutExpo'
      }, 300);
      
      // Animar valores numéricos de mini gauges
      if (miniValues.length > 0) {
        miniValues.forEach((val, i) => {
          const targetVal = parseInt(val.textContent) || 0;
          val.textContent = '0';
          
          tl.add({
            targets: { value: 0 },
            value: targetVal,
            round: 1,
            duration: 500,
            easing: 'easeOutQuad',
            update: (anim) => {
              val.textContent = Math.round(anim.animations[0].currentValue);
            }
          }, 350 + i * 120);
        });
      }
    }
    
    // 6. Recomendación aparece al final
    if (recommendation) {
      tl.add({
        targets: recommendation,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 500,
        easing: 'easeOutQuad'
      }, duration * 0.6);
    }
    
    // Guardar referencia al timeline
    this.animationTimeline = tl;
  }
  
  /**
   * Animación vanilla (fallback si Anime.js no está disponible)
   */
  animateVanilla(location, duration) {
    const circumference = parseFloat(this.progressCircle.dataset.circumference);
    const targetOffset = circumference * (1 - location.score / 100);
    
    this.scoreElement.classList.add('counting');
    
    // Animar score con countUp
    this.countUp(this.scoreElement, 0, location.score, duration);
    
    // Animar círculo después de un pequeño delay
    setTimeout(() => {
      this.progressCircle.style.strokeDashoffset = targetOffset;
    }, 100);
    
    // Animar mini gauges
    const miniBars = this.container.querySelectorAll('.wo-mini-gauge__bar');
    miniBars.forEach((bar, i) => {
      setTimeout(() => {
        bar.style.width = bar.dataset.width + '%';
      }, 300 + i * 150);
    });
  }

  countUp(element, start, end, duration) {
    const startTime = performance.now();
    
    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = this.easeOutQuart(progress);
      const current = Math.round(start + (end - start) * easeProgress);
      
      element.textContent = current;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.classList.remove('counting');
      }
    };
    
    requestAnimationFrame(update);
  }

  easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }
  
  /**
   * Pausa la animación actual (solo con Anime.js)
   */
  pauseAnimation() {
    if (this.animationTimeline) {
      this.animationTimeline.pause();
    }
  }
  
  /**
   * Reanuda la animación actual (solo con Anime.js)
   */
  resumeAnimation() {
    if (this.animationTimeline) {
      this.animationTimeline.play();
    }
  }
  
  /**
   * Reinicia la animación
   */
  restartAnimation() {
    this.animated = false;
    if (this.animationTimeline) {
      this.animationTimeline.restart();
    } else {
      this.animate();
    }
  }

  destroy() {
    this.container.innerHTML = '';
  }
}

// ═══════════════════════════════════════════════════════════════
// INTEGRACIÓN CON REVEAL.JS
// ═══════════════════════════════════════════════════════════════

let woScoringGaugeInstance = null;

function initWoScoringGauge(containerId, options = {}) {
  if (woScoringGaugeInstance) {
    woScoringGaugeInstance.destroy();
  }
  
  woScoringGaugeInstance = new WoScoringGauge(containerId, options);
  return woScoringGaugeInstance;
}

function destroyWoScoringGauge() {
  if (woScoringGaugeInstance) {
    woScoringGaugeInstance.destroy();
    woScoringGaugeInstance = null;
  }
}

// Exportar
if (typeof window !== 'undefined') {
  window.WoScoringGauge = WoScoringGauge;
  window.initWoScoringGauge = initWoScoringGauge;
  window.destroyWoScoringGauge = destroyWoScoringGauge;
}
