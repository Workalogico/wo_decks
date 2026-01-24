/* ═══════════════════════════════════════════════════════════════
   WORKALÓGICO COLOR LAB
   Generador de paletas de color, verificación WCAG y simulación de daltonismo
   ═══════════════════════════════════════════════════════════════ */

const WoColorLab = {
  currentColor: '#FFCB00',
  currentHarmony: 'complementary',
  currentPalette: [],
  currentExportFormat: 'css',
  currentColorBlindType: 'normal',
  
  // ═══════════════════════════════════════════════════════════════
  // CONVERSIONES DE COLOR
  // ═══════════════════════════════════════════════════════════════
  
  hexToRGB(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },
  
  rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
  },
  
  hexToHSL(hex) {
    const rgb = this.hexToRGB(hex);
    if (!rgb) return null;
    
    let r = rgb.r / 255;
    let g = rgb.g / 255;
    let b = rgb.b / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  },
  
  hslToHex(h, s, l) {
    h = h / 360;
    s = s / 100;
    l = l / 100;
    
    let r, g, b;
    
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    
    return this.rgbToHex(
      Math.round(r * 255),
      Math.round(g * 255),
      Math.round(b * 255)
    );
  },
  
  // ═══════════════════════════════════════════════════════════════
  // GENERADORES DE ARMONÍAS
  // ═══════════════════════════════════════════════════════════════
  
  generateComplementary(baseHex) {
    const hsl = this.hexToHSL(baseHex);
    if (!hsl) return [baseHex];
    
    const complementaryH = (hsl.h + 180) % 360;
    const complementary = this.hslToHex(complementaryH, hsl.s, hsl.l);
    
    return [
      baseHex,
      complementary,
      this.hslToHex(hsl.h, Math.max(20, hsl.s - 20), Math.min(90, hsl.l + 20)),
      this.hslToHex(complementaryH, Math.max(20, hsl.s - 20), Math.min(90, hsl.l + 20)),
      this.hslToHex(hsl.h, hsl.s, Math.max(10, hsl.l - 30))
    ];
  },
  
  generateAnalogous(baseHex, angle = 30) {
    const hsl = this.hexToHSL(baseHex);
    if (!hsl) return [baseHex];
    
    return [
      this.hslToHex((hsl.h - angle * 2 + 360) % 360, hsl.s, hsl.l),
      this.hslToHex((hsl.h - angle + 360) % 360, hsl.s, hsl.l),
      baseHex,
      this.hslToHex((hsl.h + angle) % 360, hsl.s, hsl.l),
      this.hslToHex((hsl.h + angle * 2) % 360, hsl.s, hsl.l)
    ];
  },
  
  generateTriadic(baseHex) {
    const hsl = this.hexToHSL(baseHex);
    if (!hsl) return [baseHex];
    
    const h1 = (hsl.h + 120) % 360;
    const h2 = (hsl.h + 240) % 360;
    
    return [
      baseHex,
      this.hslToHex(h1, hsl.s, hsl.l),
      this.hslToHex(h2, hsl.s, hsl.l),
      this.hslToHex(hsl.h, Math.max(20, hsl.s - 30), Math.min(90, hsl.l + 20)),
      this.hslToHex(hsl.h, hsl.s, Math.max(10, hsl.l - 30))
    ];
  },
  
  generateSplitComplementary(baseHex) {
    const hsl = this.hexToHSL(baseHex);
    if (!hsl) return [baseHex];
    
    const complementary = (hsl.h + 180) % 360;
    const split1 = (complementary - 30 + 360) % 360;
    const split2 = (complementary + 30) % 360;
    
    return [
      baseHex,
      this.hslToHex(split1, hsl.s, hsl.l),
      this.hslToHex(split2, hsl.s, hsl.l),
      this.hslToHex(hsl.h, Math.max(20, hsl.s - 30), Math.min(90, hsl.l + 20)),
      this.hslToHex(hsl.h, hsl.s, Math.max(10, hsl.l - 30))
    ];
  },
  
  generateTetradic(baseHex) {
    const hsl = this.hexToHSL(baseHex);
    if (!hsl) return [baseHex];
    
    return [
      baseHex,
      this.hslToHex((hsl.h + 90) % 360, hsl.s, hsl.l),
      this.hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
      this.hslToHex((hsl.h + 270) % 360, hsl.s, hsl.l),
      this.hslToHex(hsl.h, Math.max(20, hsl.s - 30), Math.min(90, hsl.l + 20))
    ];
  },
  
  generatePalette(baseHex, harmonyType) {
    switch (harmonyType) {
      case 'complementary':
        return this.generateComplementary(baseHex);
      case 'analogous':
        return this.generateAnalogous(baseHex);
      case 'triadic':
        return this.generateTriadic(baseHex);
      case 'split-complementary':
        return this.generateSplitComplementary(baseHex);
      case 'tetradic':
        return this.generateTetradic(baseHex);
      default:
        return [baseHex];
    }
  },
  
  // ═══════════════════════════════════════════════════════════════
  // CÁLCULO DE CONTRASTE Y ACCESIBILIDAD WCAG
  // ═══════════════════════════════════════════════════════════════
  
  getLuminance(hex) {
    const rgb = this.hexToRGB(hex);
    if (!rgb) return 0;
    
    const rsRGB = rgb.r / 255;
    const gsRGB = rgb.g / 255;
    const bsRGB = rgb.b / 255;
    
    const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
    const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
    const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  },
  
  calculateContrast(fg, bg) {
    const lum1 = this.getLuminance(fg);
    const lum2 = this.getLuminance(bg);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  },
  
  checkWCAG(ratio, isLargeText = false) {
    if (isLargeText) {
      if (ratio >= 4.5) return 'AAA';
      if (ratio >= 3) return 'AA';
    } else {
      if (ratio >= 7) return 'AAA';
      if (ratio >= 4.5) return 'AA';
    }
    return 'Fail';
  },
  
  // ═══════════════════════════════════════════════════════════════
  // SIMULACIÓN DE DALTONISMO
  // ═══════════════════════════════════════════════════════════════
  
  simulateColorBlindness(hex, type) {
    const rgb = this.hexToRGB(hex);
    if (!rgb) return hex;
    
    let r = rgb.r / 255;
    let g = rgb.g / 255;
    let b = rgb.b / 255;
    
    let nr, ng, nb;
    
    switch (type) {
      case 'protanopia': // Sin rojo
        nr = 0.567 * r + 0.433 * g;
        ng = 0.558 * r + 0.442 * g;
        nb = 0.242 * g + 0.758 * b;
        break;
        
      case 'deuteranopia': // Sin verde
        nr = 0.625 * r + 0.375 * g;
        ng = 0.700 * r + 0.300 * g;
        nb = 0.300 * g + 0.700 * b;
        break;
        
      case 'tritanopia': // Sin azul
        nr = 0.950 * r + 0.050 * g;
        ng = 0.433 * g + 0.567 * b;
        nb = 0.475 * g + 0.525 * b;
        break;
        
      default:
        return hex;
    }
    
    return this.rgbToHex(
      Math.round(Math.min(255, nr * 255)),
      Math.round(Math.min(255, ng * 255)),
      Math.round(Math.min(255, nb * 255))
    );
  },
  
  // ═══════════════════════════════════════════════════════════════
  // EXPORTACIÓN
  // ═══════════════════════════════════════════════════════════════
  
  exportAsCSS(palette) {
    const names = ['primary', 'secondary', 'tertiary', 'light', 'dark'];
    let css = '/* Generated Color Palette */\n:root {\n';
    
    palette.forEach((color, i) => {
      const name = names[i] || `color-${i + 1}`;
      css += `  --color-${name}: ${color};\n`;
    });
    
    css += '}';
    return css;
  },
  
  exportAsJSON(palette) {
    const names = ['primary', 'secondary', 'tertiary', 'light', 'dark'];
    const obj = {};
    
    palette.forEach((color, i) => {
      const name = names[i] || `color${i + 1}`;
      obj[name] = color;
    });
    
    return JSON.stringify(obj, null, 2);
  },
  
  // ═══════════════════════════════════════════════════════════════
  // UI RENDERING
  // ═══════════════════════════════════════════════════════════════
  
  renderPalettePreview(palette) {
    const container = document.getElementById('palette-preview');
    if (!container) return;
    
    container.innerHTML = '';
    
    palette.forEach((color, index) => {
      const swatch = document.createElement('div');
      swatch.className = 'colorlab-palette-swatch';
      swatch.style.background = color;
      
      const info = document.createElement('div');
      info.className = 'colorlab-palette-info';
      info.innerHTML = `
        <div class="colorlab-palette-hex">${color}</div>
        <button class="colorlab-palette-copy" onclick="WoColorLab.copyColor('${color}')" title="Copiar">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        </button>
      `;
      
      swatch.appendChild(info);
      container.appendChild(swatch);
    });
  },
  
  updateContrast() {
    const fg = document.getElementById('contrast-fg').value;
    const bg = document.getElementById('contrast-bg').value;
    
    document.getElementById('contrast-fg-hex').value = fg.toUpperCase();
    document.getElementById('contrast-bg-hex').value = bg.toUpperCase();
    
    const preview = document.getElementById('contrast-preview');
    preview.style.color = fg;
    preview.style.background = bg;
    
    const ratio = this.calculateContrast(fg, bg);
    document.getElementById('contrast-ratio').textContent = ratio.toFixed(2) + ':1';
    
    const normalAA = this.checkWCAG(ratio, false);
    const normalAAA = normalAA === 'AAA' ? 'AAA' : 'Fail';
    const largeAA = this.checkWCAG(ratio, true);
    const largeAAA = largeAA === 'AAA' ? 'AAA' : 'Fail';
    
    const normalBadges = document.getElementById('wcag-normal');
    normalBadges.innerHTML = `
      <span class="badge-aa ${normalAA !== 'Fail' ? 'pass' : 'fail'}">AA ${normalAA !== 'Fail' ? '✓' : '✗'}</span>
      <span class="badge-aaa ${normalAAA !== 'Fail' ? 'pass' : 'fail'}">AAA ${normalAAA !== 'Fail' ? '✓' : '✗'}</span>
    `;
    
    const largeBadges = document.getElementById('wcag-large');
    largeBadges.innerHTML = `
      <span class="badge-aa ${largeAA !== 'Fail' ? 'pass' : 'fail'}">AA ${largeAA !== 'Fail' ? '✓' : '✗'}</span>
      <span class="badge-aaa ${largeAAA !== 'Fail' ? 'pass' : 'fail'}">AAA ${largeAAA !== 'Fail' ? '✓' : '✗'}</span>
    `;
  },
  
  renderColorBlindPreview() {
    const container = document.getElementById('colorblind-preview');
    if (!container) return;
    
    container.innerHTML = '';
    
    this.currentPalette.forEach(color => {
      const simulatedColor = this.currentColorBlindType === 'normal' 
        ? color 
        : this.simulateColorBlindness(color, this.currentColorBlindType);
      
      const swatch = document.createElement('div');
      swatch.className = 'colorlab-colorblind-swatch';
      swatch.style.background = simulatedColor;
      
      const label = document.createElement('div');
      label.className = 'colorlab-colorblind-label';
      label.textContent = simulatedColor;
      
      swatch.appendChild(label);
      container.appendChild(swatch);
    });
  },
  
  updateExportCode() {
    const code = this.currentExportFormat === 'css'
      ? this.exportAsCSS(this.currentPalette)
      : this.exportAsJSON(this.currentPalette);
    
    document.getElementById('export-code').textContent = code;
    document.getElementById('export-lang').textContent = 
      this.currentExportFormat === 'css' ? 'CSS Variables' : 'JSON';
  },
  
  // ═══════════════════════════════════════════════════════════════
  // UTILIDADES
  // ═══════════════════════════════════════════════════════════════
  
  copyColor(color) {
    navigator.clipboard.writeText(color).then(() => {
      console.log('Color copiado:', color);
    });
  },
  
  // ═══════════════════════════════════════════════════════════════
  // INICIALIZACIÓN
  // ═══════════════════════════════════════════════════════════════
  
  init() {
    // Color picker
    const colorInput = document.getElementById('color-input');
    const colorHex = document.getElementById('color-hex');
    
    if (colorInput && colorHex) {
      colorInput.addEventListener('input', (e) => {
        this.currentColor = e.target.value.toUpperCase();
        colorHex.value = this.currentColor;
        this.updatePalette();
      });
      
      colorHex.addEventListener('input', (e) => {
        const value = e.target.value;
        if (/^#[0-9A-F]{6}$/i.test(value)) {
          this.currentColor = value.toUpperCase();
          colorInput.value = this.currentColor;
          this.updatePalette();
        }
      });
    }
    
    // Presets
    document.querySelectorAll('.colorlab-preset').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const color = e.target.dataset.color;
        this.currentColor = color.toUpperCase();
        colorInput.value = this.currentColor;
        colorHex.value = this.currentColor;
        this.updatePalette();
      });
    });
    
    // Harmony selector
    document.querySelectorAll('.colorlab-harmony-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.colorlab-harmony-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentHarmony = btn.dataset.harmony;
        this.updatePalette();
      });
    });
    
    // Contrast checker
    const contrastFg = document.getElementById('contrast-fg');
    const contrastFgHex = document.getElementById('contrast-fg-hex');
    const contrastBg = document.getElementById('contrast-bg');
    const contrastBgHex = document.getElementById('contrast-bg-hex');
    
    [contrastFg, contrastFgHex, contrastBg, contrastBgHex].forEach(el => {
      if (el) {
        el.addEventListener('input', () => this.updateContrast());
      }
    });
    
    // Color blindness simulator
    document.querySelectorAll('.colorlab-colorblind-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.colorlab-colorblind-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentColorBlindType = btn.dataset.type;
        this.renderColorBlindPreview();
      });
    });
    
    // Export format selector
    document.querySelectorAll('.colorlab-export-tab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.colorlab-export-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentExportFormat = btn.dataset.format;
        this.updateExportCode();
      });
    });
    
    // Initial render
    this.updatePalette();
    this.updateContrast();
  },
  
  updatePalette() {
    this.currentPalette = this.generatePalette(this.currentColor, this.currentHarmony);
    this.renderPalettePreview(this.currentPalette);
    this.renderColorBlindPreview();
    this.updateExportCode();
  }
};

// Export copy function globally
window.copyExportCode = function() {
  const code = document.getElementById('export-code').textContent;
  navigator.clipboard.writeText(code).then(() => {
    const btn = document.querySelector('.hub-btn--copy');
    btn.textContent = '✓ Copiado';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = 'Copiar';
      btn.classList.remove('copied');
    }, 2000);
  });
};
