/* ═══════════════════════════════════════════════════════════════
   WORKALÓGICO MOCKUPS - JavaScript
   ═══════════════════════════════════════════════════════════════ */

const WoMockups = {
  currentTab: 'devices',
  currentDevice: 'iphone',
  currentTemplate: 'cover',
  currentComponent: 'card',
  currentTheme: 'yellow',
  
  // ═══════════════════════════════════════════════════════════════
  // TAB MANAGEMENT
  // ═══════════════════════════════════════════════════════════════
  
  switchTab(tabId) {
    // Update tab buttons
    document.querySelectorAll('.mockup-tab').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    
    // Update tab panels
    document.querySelectorAll('.mockup-tab-panel').forEach(panel => {
      panel.classList.remove('active');
    });
    document.getElementById(`tab-${tabId}`).classList.add('active');
    
    this.currentTab = tabId;
    
    // Initialize content for the active tab
    switch(tabId) {
      case 'devices':
        this.renderDevicePreview();
        break;
      case 'slides':
        this.renderSlidePreview();
        break;
      case 'brand':
        this.renderBrandMaterials();
        break;
      case 'playground':
        this.renderPlayground();
        break;
    }
  },
  
  // ═══════════════════════════════════════════════════════════════
  // DEVICE MOCKUPS
  // ═══════════════════════════════════════════════════════════════
  
  renderDevicePreview() {
    const container = document.getElementById('device-preview-container');
    if (!container) return;
    
    const deviceClass = this.currentDevice;
    
    container.innerHTML = `
      <div class="device-frame ${deviceClass}">
        <div class="device-screen">
          ${this.getDeviceContent()}
        </div>
      </div>
    `;
  },
  
  getDeviceContent() {
    return `
      <div style="padding: 2rem; min-height: 100%;">
        <div style="margin-bottom: 2rem;">
          <img src="../LOGOS/SVG/WoLogos_2026-01.svg" alt="Workalógico" style="width: 120px; height: auto;">
        </div>
        
        <div class="wo-card" style="margin-bottom: 1.5rem;">
          <div class="card-number">01</div>
          <h3>Análisis Geoespacial</h3>
          <p>Ubicación estratégica basada en datos.</p>
        </div>
        
        <div class="wo-card" style="margin-bottom: 1.5rem;">
          <div class="card-number">02</div>
          <h3>Inteligencia de Mercado</h3>
          <p>Insights accionables para tu negocio.</p>
        </div>
        
        <div class="wo-stats-row">
          <div class="wo-stat">
            <div class="wo-stat__value">500M+</div>
            <div class="wo-stat__label">Data points</div>
          </div>
          <div class="wo-stat">
            <div class="wo-stat__value">98%</div>
            <div class="wo-stat__label">Precisión</div>
          </div>
        </div>
      </div>
    `;
  },
  
  // ═══════════════════════════════════════════════════════════════
  // SLIDE PREVIEWS
  // ═══════════════════════════════════════════════════════════════
  
  renderSlidePreview() {
    const container = document.getElementById('slide-preview-grid');
    if (!container) return;
    
    const templates = this.getSlideTemplates();
    
    container.innerHTML = templates.map(template => `
      <div class="slide-preview-card">
        <div class="slide-preview-header">
          <span class="slide-preview-title">${template.name}</span>
          <span class="slide-preview-label">${template.type}</span>
        </div>
        <div class="slide-preview-content">
          ${template.html}
        </div>
      </div>
    `).join('');
  },
  
  getSlideTemplates() {
    const theme = this.currentTemplate;
    
    return [
      {
        name: 'Portada',
        type: 'Cover',
        html: `
          <div style="width: 100%; height: 100%; background: radial-gradient(ellipse at center, #252542 0%, #0F0F1A 70%); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; text-align: center;">
            <img src="../LOGOS/SVG/WoLogos_2026-01.svg" style="width: 150px; margin-bottom: 2rem;">
            <h1 style="font-family: 'Space Grotesk', sans-serif; font-size: 2rem; color: white; margin-bottom: 1rem;">
              Análisis de <span style="color: var(--wo-accent-primary);">Vocación</span>
            </h1>
            <p style="color: #94A3B8; font-size: 0.9rem;">Inteligencia Geoespacial para tu negocio</p>
          </div>
        `
      },
      {
        name: 'Sección',
        type: 'Section',
        html: `
          <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #0F0F1A 0%, #252542 100%); display: flex; align-items: center; justify-content: center; text-align: center; padding: 2rem;">
            <div>
              <h1 style="font-family: 'Space Grotesk', sans-serif; font-size: 2.5rem; color: white; margin-bottom: 0.5rem;">
                La <span style="color: var(--wo-accent-primary);">Metodología</span>
              </h1>
              <p style="color: #94A3B8; font-size: 1rem;">Proceso de análisis en 4 pasos</p>
            </div>
          </div>
        `
      },
      {
        name: 'Contenido con Cards',
        type: 'Content',
        html: `
          <div style="width: 100%; height: 100%; background: #0F0F1A; padding: 2rem;">
            <h2 style="font-family: 'Space Grotesk', sans-serif; font-size: 1.5rem; color: white; margin-bottom: 1.5rem;">
              Servicios <span style="color: var(--wo-accent-primary);">Principales</span>
            </h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div style="background: rgba(37,37,66,0.5); border: 1px solid rgba(89,104,234,0.3); border-radius: 8px; padding: 1rem;">
                <div style="font-size: 1.5rem; color: rgba(89,104,234,0.4); font-weight: 700; margin-bottom: 0.25rem;">01</div>
                <h3 style="font-size: 0.9rem; color: white; margin-bottom: 0.5rem;">Geoanálisis</h3>
                <p style="font-size: 0.7rem; color: #94A3B8;">Ubicación estratégica</p>
              </div>
              <div style="background: rgba(37,37,66,0.5); border: 1px solid rgba(89,104,234,0.3); border-radius: 8px; padding: 1rem;">
                <div style="font-size: 1.5rem; color: rgba(89,104,234,0.4); font-weight: 700; margin-bottom: 0.25rem;">02</div>
                <h3 style="font-size: 0.9rem; color: white; margin-bottom: 0.5rem;">Inteligencia</h3>
                <p style="font-size: 0.7rem; color: #94A3B8;">Datos accionables</p>
              </div>
            </div>
          </div>
        `
      },
      {
        name: 'Call to Action',
        type: 'CTA',
        html: `
          <div style="width: 100%; height: 100%; background: radial-gradient(ellipse at center, #252542 0%, #0F0F1A 70%); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; text-align: center;">
            <h1 style="font-family: 'Space Grotesk', sans-serif; font-size: 2rem; color: white; margin-bottom: 1rem;">
              ¿Listo para <span style="color: var(--wo-accent-primary);">empezar</span>?
            </h1>
            <p style="color: #94A3B8; margin-bottom: 2rem; font-size: 0.9rem;">Contáctanos hoy</p>
            <div style="font-size: 0.85rem; color: white;">
              <p style="margin-bottom: 0.5rem;">bo@workalogico.com</p>
              <p>www.workalogico.com</p>
            </div>
          </div>
        `
      }
    ];
  },
  
  // ═══════════════════════════════════════════════════════════════
  // BRAND MATERIALS
  // ═══════════════════════════════════════════════════════════════
  
  renderBrandMaterials() {
    this.renderBusinessCard();
    this.renderEmailSignature();
    this.renderSocialHeaders();
    this.renderIcons();
  },
  
  renderBusinessCard() {
    const container = document.getElementById('business-card-mockup');
    if (!container) return;
    
    container.innerHTML = `
      <div class="business-card">
        <img src="../LOGOS/SVG/WoLogos_2026-01.svg" alt="Workalógico" class="business-card__logo">
        <div class="business-card__info">
          <div class="business-card__name">Boris Orduña</div>
          <div class="business-card__title">Director General</div>
          <div class="business-card__contact">
            bo@workalogico.com<br>
            +52 55 1234 5678<br>
            www.workalogico.com
          </div>
        </div>
      </div>
    `;
  },
  
  renderEmailSignature() {
    const container = document.getElementById('email-signature-mockup');
    if (!container) return;
    
    container.innerHTML = `
      <div class="email-signature">
        <div class="email-signature__name">Boris Orduña</div>
        <div class="email-signature__title">Director General | Workalógico</div>
        <div class="email-signature__divider"></div>
        <div class="email-signature__contact">
          📧 bo@workalogico.com<br>
          📱 +52 55 1234 5678<br>
          🌐 www.workalogico.com
        </div>
        <img src="../LOGOS/SVG/WoLogos_2026-02.svg" alt="Workalógico" class="email-signature__logo">
      </div>
    `;
  },
  
  renderSocialHeaders() {
    const linkedin = document.getElementById('linkedin-header-mockup');
    const twitter = document.getElementById('twitter-header-mockup');
    
    if (linkedin) {
      linkedin.innerHTML += `
        <div class="social-header">
          <div class="social-header__pattern"></div>
          <img src="../LOGOS/SVG/WoLogos_2026-03.svg" alt="Workalógico" class="social-header__logo">
        </div>
      `;
    }
    
    if (twitter) {
      twitter.innerHTML += `
        <div class="social-header">
          <div class="social-header__pattern"></div>
          <img src="../LOGOS/SVG/WoLogos_2026-03.svg" alt="Workalógico" class="social-header__logo">
        </div>
      `;
    }
  },
  
  renderIcons() {
    const container = document.getElementById('icon-preview');
    if (!container) return;
    
    const sizes = [
      { size: 16, label: '16x16' },
      { size: 32, label: '32x32' },
      { size: 64, label: '64x64' },
      { size: 128, label: '128x128' }
    ];
    
    container.innerHTML = sizes.map(s => `
      <div class="icon-preview-item">
        <img src="../LOGOS/teseracto yellow@3x.png" alt="Icon ${s.size}" class="icon-preview-img" style="width: ${s.size}px; height: ${s.size}px;">
        <div class="icon-preview-label">${s.label}</div>
      </div>
    `).join('');
  },
  
  // ═══════════════════════════════════════════════════════════════
  // PLAYGROUND
  // ═══════════════════════════════════════════════════════════════
  
  renderPlayground() {
    this.updatePlaygroundControls();
    this.updateComponentPreview();
  },
  
  updatePlaygroundControls() {
    // Show/hide controls based on component type
    const component = this.currentComponent;
    
    const groups = {
      title: document.getElementById('control-title-group'),
      description: document.getElementById('control-description-group'),
      number: document.getElementById('control-number-group'),
      value: document.getElementById('control-value-group'),
      label: document.getElementById('control-label-group')
    };
    
    // Hide all
    Object.values(groups).forEach(g => {
      if (g) g.style.display = 'none';
    });
    
    // Show relevant controls
    switch(component) {
      case 'card':
        groups.number.style.display = 'block';
        groups.title.style.display = 'block';
        groups.description.style.display = 'block';
        break;
      case 'stat':
        groups.value.style.display = 'block';
        groups.label.style.display = 'block';
        break;
      case 'badge':
        groups.label.style.display = 'block';
        break;
      case 'quote':
        groups.description.style.display = 'block';
        break;
      case 'metric':
        groups.value.style.display = 'block';
        groups.label.style.display = 'block';
        break;
    }
  },
  
  updateComponentPreview() {
    const container = document.getElementById('component-preview');
    const codeContainer = document.getElementById('component-code');
    if (!container || !codeContainer) return;
    
    const data = this.getControlValues();
    const html = this.generateComponentHTML(data);
    
    container.innerHTML = html;
    codeContainer.textContent = html;
  },
  
  getControlValues() {
    return {
      theme: this.currentTheme,
      title: document.getElementById('control-title')?.value || 'Título del Card',
      description: document.getElementById('control-description')?.value || 'Descripción del contenido.',
      number: document.getElementById('control-number')?.value || '01',
      value: document.getElementById('control-value')?.value || '500M+',
      label: document.getElementById('control-label')?.value || 'Data points'
    };
  },
  
  generateComponentHTML(data) {
    switch(this.currentComponent) {
      case 'card':
        return `<div class="wo-card" style="max-width: 400px;">
  <div class="card-number">${data.number}</div>
  <h3>${data.title}</h3>
  <p>${data.description}</p>
</div>`;
        
      case 'stat':
        return `<div class="wo-stat">
  <div class="wo-stat__value">${data.value}</div>
  <div class="wo-stat__label">${data.label}</div>
</div>`;
        
      case 'badge':
        return `<div class="wo-badge">${data.label}</div>`;
        
      case 'quote':
        return `<div class="wo-quote" style="max-width: 500px;">
  <p>"${data.description}"</p>
</div>`;
        
      case 'metric':
        return `<div class="wo-metric">
  <div class="wo-metric__value">${data.value}</div>
  <div class="wo-metric__label">${data.label}</div>
</div>`;
        
      default:
        return '<p>Selecciona un componente</p>';
    }
  },
  
  // ═══════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════════
  
  init() {
    // Tab navigation
    document.querySelectorAll('.mockup-tab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tabId = btn.dataset.tab;
        this.switchTab(tabId);
      });
    });
    
    // Device selector
    document.querySelectorAll('.device-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.device-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentDevice = btn.dataset.device;
        this.renderDevicePreview();
      });
    });
    
    // Template selector
    document.querySelectorAll('.template-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.template-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentTemplate = btn.dataset.template;
        this.renderSlidePreview();
      });
    });
    
    // Component selector
    const componentSelect = document.getElementById('component-select');
    if (componentSelect) {
      componentSelect.addEventListener('change', (e) => {
        this.currentComponent = e.target.value;
        this.updatePlaygroundControls();
        this.updateComponentPreview();
      });
    }
    
    // Theme controls
    document.querySelectorAll('[data-control="theme"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('[data-control="theme"]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentTheme = btn.dataset.value;
        document.body.dataset.woTheme = this.currentTheme;
        this.updateComponentPreview();
      });
    });
    
    // Control inputs
    ['control-title', 'control-description', 'control-number', 'control-value', 'control-label'].forEach(id => {
      const input = document.getElementById(id);
      if (input) {
        input.addEventListener('input', () => {
          this.updateComponentPreview();
        });
      }
    });
    
    // Initial render
    this.renderDevicePreview();
  }
};

// Export copy function globally
window.copyPlaygroundCode = function() {
  const code = document.getElementById('component-code').textContent;
  navigator.clipboard.writeText(code).then(() => {
    const btn = document.querySelector('.playground-preview .hub-btn--copy');
    if (btn) {
      btn.textContent = '✓ Copiado';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = 'Copiar';
        btn.classList.remove('copied');
      }, 2000);
    }
  });
};
