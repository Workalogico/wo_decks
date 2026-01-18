/**
 * ═══════════════════════════════════════════════════════════════
 * WORKALÓGICO PARTICLES SYSTEM v1.0
 * Configuración de tsParticles para Reveal.js
 * 
 * CONCEPTO: "Data Network"
 * Red de nodos conectados que representa inteligencia de datos.
 * Colores: 75% azul Wo (#5968EA), 25% amarillo Wo (#FFCB00)
 * 
 * USO:
 * 1. Incluir tsParticles CDN
 * 2. Incluir este script después de Reveal.js
 * 3. Llamar initWoParticles() después de Reveal.initialize()
 * ═══════════════════════════════════════════════════════════════
 */

// Configuración base de partículas Workalógico
const woParticlesConfig = {
  fullScreen: {
    enable: false
  },
  background: {
    color: {
      value: "transparent"
    }
  },
  fpsLimit: 60,
  
  // ─────────────────────────────────────────
  // PARTÍCULAS
  // ─────────────────────────────────────────
  particles: {
    // Colores de marca Workalógico: 75% azul, 25% amarillo
    color: {
      value: ["#5968EA", "#5968EA", "#5968EA", "#FFCB00"]
    },
    
    // Links entre partículas (red de datos)
    links: {
      color: "#5968EA",
      distance: 140,
      enable: true,
      opacity: 0.12,
      width: 1,
      triangles: {
        enable: false
      }
    },
    
    // Movimiento lento y elegante
    move: {
      enable: true,
      speed: 0.6,
      direction: "none",
      random: true,
      straight: false,
      outModes: {
        default: "out"
      },
      attract: {
        enable: false
      }
    },
    
    // Cantidad moderada para no distraer
    number: {
      value: 50,
      density: {
        enable: true,
        area: 900
      }
    },
    
    // Opacidad variable con animación sutil
    opacity: {
      value: {
        min: 0.2,
        max: 0.6
      },
      animation: {
        enable: true,
        speed: 0.4,
        minimumValue: 0.15,
        sync: false
      }
    },
    
    // Forma: círculos simples
    shape: {
      type: "circle"
    },
    
    // Tamaño variable
    size: {
      value: {
        min: 1,
        max: 3
      },
      animation: {
        enable: true,
        speed: 1.5,
        minimumValue: 0.5,
        sync: false
      }
    }
  },
  
  // ─────────────────────────────────────────
  // INTERACTIVIDAD
  // ─────────────────────────────────────────
  interactivity: {
    detectsOn: "window",
    events: {
      onHover: {
        enable: true,
        mode: "grab",
        parallax: {
          enable: true,
          force: 15,
          smooth: 25
        }
      },
      onClick: {
        enable: false // No interferir con navegación
      },
      resize: true
    },
    modes: {
      grab: {
        distance: 180,
        links: {
          opacity: 0.35,
          color: "#FFCB00" // Amarillo al interactuar
        }
      }
    }
  },
  
  detectRetina: true
};

// Variantes de configuración por servicio
const woParticlesVariants = {
  // Geointeligencia: Configuración estándar (más puntos de datos)
  geo: {
    particles: {
      number: { value: 60 },
      links: { distance: 150 }
    }
  },
  
  // AI Experts: Más conexiones, más amarillo
  ai: {
    particles: {
      color: { value: ["#5968EA", "#5968EA", "#FFCB00", "#FFCB00"] },
      links: { opacity: 0.15 },
      number: { value: 55 }
    }
  },
  
  // Marketing: Más dinámico
  marketing: {
    particles: {
      move: { speed: 0.8 },
      number: { value: 45 }
    }
  },
  
  // CRM/Automatización: Más estructurado
  enterprise: {
    particles: {
      move: { speed: 0.5 },
      links: { distance: 160, opacity: 0.1 },
      number: { value: 40 }
    }
  }
};

// ─────────────────────────────────────────
// FUNCIONES DE INICIALIZACIÓN
// ─────────────────────────────────────────

let particlesInstance = null;

/**
 * Mezcla profunda de objetos de configuración
 */
function deepMerge(target, source) {
  const output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Inicializa tsParticles con la configuración Wo
 * @param {string} variant - Variante: 'geo', 'ai', 'marketing', 'enterprise'
 */
async function initWoParticles(variant = null) {
  let config = { ...woParticlesConfig };
  
  // Aplicar variante si existe
  if (variant && woParticlesVariants[variant]) {
    config = deepMerge(config, woParticlesVariants[variant]);
  }
  
  // Reducir partículas en móvil
  if (window.innerWidth < 768) {
    config.particles.number.value = Math.floor(config.particles.number.value * 0.6);
    config.particles.move.speed = config.particles.move.speed * 0.8;
  }
  
  try {
    particlesInstance = await tsParticles.load("tsparticles", config);
    console.log('Wo Particles initialized:', variant || 'default');
  } catch (error) {
    console.warn('Failed to initialize particles:', error);
  }
}

/**
 * Actualiza la visibilidad de partículas según el slide actual
 * Llamar en el evento 'slidechanged' de Reveal.js
 */
function updateWoParticlesVisibility() {
  const currentSlide = Reveal.getCurrentSlide();
  const particlesContainer = document.getElementById('tsparticles');
  const body = document.body;
  
  if (!particlesContainer) return;
  
  if (currentSlide && currentSlide.dataset.particles === 'true') {
    particlesContainer.classList.add('visible');
    body.classList.add('particles-active');
  } else {
    particlesContainer.classList.remove('visible');
    body.classList.remove('particles-active');
  }
}

/**
 * Configuración completa de partículas con Reveal.js
 * Uso: Reveal.initialize({...}).then(() => setupWoParticles('geo'));
 * @param {string} variant - Variante de partículas
 */
async function setupWoParticles(variant = null) {
  await initWoParticles(variant);
  updateWoParticlesVisibility();
  
  // Escuchar cambios de slide
  Reveal.on('slidechanged', updateWoParticlesVisibility);
}

// Exportar para uso global
window.woParticlesConfig = woParticlesConfig;
window.woParticlesVariants = woParticlesVariants;
window.initWoParticles = initWoParticles;
window.updateWoParticlesVisibility = updateWoParticlesVisibility;
window.setupWoParticles = setupWoParticles;
