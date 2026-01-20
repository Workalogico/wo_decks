/**
 * ═══════════════════════════════════════════════════════════════
 * WORKALÓGICO DESIGN SYSTEM HUB - JavaScript
 * Funcionalidad interactiva para el Hub de documentación
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * Copia el valor de un color al portapapeles
 * @param {HTMLElement} swatch - El elemento color-swatch clickeado
 */
function copyColor(swatch) {
  const varName = swatch.dataset.copy;
  const button = swatch.querySelector('.hub-btn--copy');
  
  if (!varName) return;
  
  // Copiar la variable CSS
  const textToCopy = `var(${varName})`;
  
  navigator.clipboard.writeText(textToCopy).then(() => {
    // Feedback visual
    if (button) {
      const originalText = button.textContent;
      button.textContent = 'Copiado';
      button.classList.add('copied');
      
      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('copied');
      }, 2000);
    }
  }).catch(err => {
    console.error('Error al copiar:', err);
  });
}

/**
 * Copia el contenido de un bloque de código al portapapeles
 * @param {HTMLElement} button - El botón de copiar
 * @param {string} codeId - ID del elemento <pre> con el código
 */
function copyCode(button, codeId) {
  const codeElement = document.getElementById(codeId);
  
  if (!codeElement) {
    console.error('Elemento de código no encontrado:', codeId);
    return;
  }
  
  const textToCopy = codeElement.textContent;
  
  navigator.clipboard.writeText(textToCopy).then(() => {
    // Feedback visual
    const originalText = button.textContent;
    button.textContent = 'Copiado';
    button.classList.add('copied');
    
    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('copied');
    }, 2000);
  }).catch(err => {
    console.error('Error al copiar:', err);
  });
}

/**
 * Inicializa el botón de volver arriba
 */
function initBackToTop() {
  // Crear el botón si no existe
  let backToTopBtn = document.querySelector('.back-to-top');
  
  if (!backToTopBtn) {
    backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '&uarr;';
    backToTopBtn.setAttribute('aria-label', 'Volver arriba');
    document.body.appendChild(backToTopBtn);
  }
  
  // Mostrar/ocultar según scroll
  const hubMain = document.querySelector('.hub-main');
  
  if (hubMain) {
    hubMain.addEventListener('scroll', () => {
      if (hubMain.scrollTop > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });
  }
  
  // Scroll al hacer click
  backToTopBtn.addEventListener('click', () => {
    if (hubMain) {
      hubMain.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

/**
 * Marca el enlace activo en la navegación según la URL actual
 */
function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.hub-nav a');
  
  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Añade efecto hover a los swatches de color
 */
function initColorSwatches() {
  const swatches = document.querySelectorAll('.color-swatch');
  
  swatches.forEach(swatch => {
    swatch.style.cursor = 'pointer';
    
    swatch.addEventListener('mouseenter', () => {
      swatch.style.transform = 'translateY(-2px)';
    });
    
    swatch.addEventListener('mouseleave', () => {
      swatch.style.transform = 'translateY(0)';
    });
  });
}

/**
 * Inicializa tooltips para elementos con data-tooltip
 */
function initTooltips() {
  const tooltipElements = document.querySelectorAll('[data-tooltip]');
  
  tooltipElements.forEach(el => {
    const tooltipText = el.dataset.tooltip;
    
    el.addEventListener('mouseenter', (e) => {
      const tooltip = document.createElement('div');
      tooltip.className = 'hub-tooltip';
      tooltip.textContent = tooltipText;
      tooltip.style.cssText = `
        position: fixed;
        background: var(--wo-dark-elevated);
        border: 1px solid var(--border-accent);
        color: var(--wo-text);
        padding: 0.5rem 0.75rem;
        border-radius: var(--radius-md);
        font-size: 0.8rem;
        z-index: 1000;
        pointer-events: none;
      `;
      document.body.appendChild(tooltip);
      
      // Posicionar tooltip
      const rect = el.getBoundingClientRect();
      tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8}px`;
      tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
      
      el._tooltip = tooltip;
    });
    
    el.addEventListener('mouseleave', () => {
      if (el._tooltip) {
        el._tooltip.remove();
        el._tooltip = null;
      }
    });
  });
}

/**
 * Añade animación de entrada a las cards
 */
function initCardAnimations() {
  const cards = document.querySelectorAll('.hub-preview-card, .hub-stat-card, .hub-quick-link');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 50);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.4s ease';
    observer.observe(card);
  });
}

/**
 * Inicializa todas las funcionalidades del Hub
 */
function initHub() {
  setActiveNav();
  initBackToTop();
  initColorSwatches();
  initTooltips();
  initCardAnimations();
  
  console.log('Design System Hub initialized');
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHub);
} else {
  initHub();
}
