# Workalógico Animation System - Modular Architecture

## Estructura de Módulos

El sistema de animaciones ha sido refactorizado de un archivo monolítico (2253 líneas) a una arquitectura modular de 8 archivos especializados.

### Módulos Disponibles

| Módulo | Tamaño | Funciones | Uso Recomendado |
|--------|--------|-----------|-----------------|
| `wo-anime-core.js` | 5.4KB | Config, formatters, tracking | Base para otros módulos |
| `wo-anime-counter.js` | 9.2KB | counter, animateCounter, formatPrice | Contadores numéricos |
| `wo-anime-stagger.js` | 7.4KB | stagger, cardsEntrance, pricingCards | Animaciones en cascada |
| `wo-anime-slide.js` | 11KB | cover, section, init, destroy | Portadas y secciones |
| `wo-anime-effects.js` | 5.7KB | ctaGlow, quoteReveal, gauge, flip | Efectos especiales |
| `wo-anime-svg.js` | 8.8KB | pathDraw, methodologyConnections | SVG y diagramas |
| `wo-anime-growth.js` | 6.1KB | ascendingReveal, pilarsAnimation | WoOS animations |
| `wo-anime-bundle.js` | 3.7KB | Re-exporta todo | Bundle completo |

**Total**: 57.3KB (8 módulos) vs 75KB (1 archivo monolítico)

---

## Uso

### Opción 1: Bundle Completo (Backward Compatible)

Para proyectos legacy que usaban `wo-anime.js`:

```html
<!-- Antes -->
<script src="../wo-anime.js"></script>

<!-- Después (sin cambios en el código) -->
<script type="module" src="../wo-anime/wo-anime-bundle.js"></script>
```

El bundle expone `window.WoAnime` globalmente con la misma API.

### Opción 2: Carga Selectiva (Recomendado)

Importa solo lo que necesitas:

```html
<script type="module">
  import { counter } from '../wo-anime/wo-anime-counter.js';
  import { cardsEntrance } from '../wo-anime/wo-anime-stagger.js';
  
  // Usar funciones normalmente
  Reveal.on('ready', () => {
    counter('.wo-stat__value', { duration: 1200 });
    cardsEntrance('.wo-card');
  });
</script>
```

### Opción 3: Import desde Script Externo

```javascript
// mi-presentacion.js
import { init, cover, section } from './wo-anime/wo-anime-slide.js';
import { counter } from './wo-anime/wo-anime-counter.js';

Reveal.initialize({ /* ... */ }).then(() => {
  init(); // Activar auto-animaciones
});
```

---

## Ejemplos por Caso de Uso

### Presentación Simple (solo portada)

```html
<script type="module">
  import { cover } from '../wo-anime/wo-anime-slide.js';
  
  Reveal.on('ready', (event) => {
    cover(event.currentSlide);
  });
</script>
```

**Beneficio**: Solo cargas ~11KB en vez de 75KB

### Presentación con Pricing

```html
<script type="module">
  import { init } from '../wo-anime/wo-anime-slide.js';
  import { pricingCards } from '../wo-anime/wo-anime-stagger.js';
  import { counter } from '../wo-anime/wo-anime-counter.js';
  
  Reveal.initialize({ /* ... */ }).then(() => {
    init(); // Auto-animaciones globales
  });
  
  // Pricing slide manual
  Reveal.on('slidechanged', (event) => {
    if (event.currentSlide.dataset.state === 'pricing') {
      const grid = event.currentSlide.querySelector('.wo-grid--pricing');
      pricingCards(grid);
      
      const prices = grid.querySelectorAll('.card-price');
      prices.forEach(p => counter(p));
    }
  });
</script>
```

### Presentación con Metodología/Diagramas

```html
<script type="module">
  import { init } from '../wo-anime/wo-anime-slide.js';
  import { methodologyConnections, animateStepNumbers } from '../wo-anime/wo-anime-svg.js';
  
  Reveal.on('slidechanged', (event) => {
    const grid = event.currentSlide.querySelector('[data-animate="methodology"]');
    if (grid) {
      methodologyConnections(grid, { 
        direction: 'horizontal', 
        curved: true 
      });
      animateStepNumbers(grid);
    }
  });
</script>
```

---

## Migración desde wo-anime.js Legacy

### Cambios Mínimos Requeridos

1. **Actualizar import**:
   ```html
   <!-- Antes -->
   <script src="../wo-anime.js"></script>
   
   <!-- Después -->
   <script type="module" src="../wo-anime/wo-anime-bundle.js"></script>
   ```

2. **Todo el código existente funciona sin cambios**:
   ```javascript
   WoAnime.init();
   WoAnime.counter('.price');
   WoAnime.cardsEntrance('.wo-card');
   ```

### Decks Migrados

- `deck-wo-growth-tesis` - Usa bundle completo
- `deck-wo-miramar-hills` - Usa bundle completo
- `deck-wo-geoanalisis-onepager` - Usa bundle completo

---

## Consolidación con WoPricing

`wo-pricing.js` ahora usa `wo-anime-counter.js` internamente:

```javascript
// wo-pricing.js ahora importa:
import { animateCounter, formatPrice } from '../wo-anime/wo-anime-counter.js';

// No más duplicación de lógica de contadores
```

---

## Dependencias entre Módulos

```
wo-anime-core.js (base)
  ├─→ wo-anime-counter.js
  ├─→ wo-anime-stagger.js
  ├─→ wo-anime-effects.js
  ├─→ wo-anime-svg.js
  └─→ wo-anime-growth.js

wo-anime-slide.js
  ├─→ wo-anime-core.js
  └─→ wo-anime-counter.js

wo-anime-bundle.js
  └─→ Todos los módulos
```

---

## Beneficios

### Antes (Monolítico)
- 1 archivo de 75KB (2253 líneas)
- Todo o nada (carga completa)
- Difícil de mantener
- Duplicación con WoPricing

### Después (Modular)
- 8 módulos de 3-11KB cada uno
- Carga bajo demanda
- Fácil de mantener y testear
- Sin duplicación (WoPricing usa wo-anime-counter)
- Tree-shaking posible con bundlers

---

## Testing

Cada módulo puede testearse independientemente:

```javascript
// test-counter.js
import { counter } from './wo-anime-counter.js';

describe('Counter Module', () => {
  it('should animate simple numbers', () => {
    const el = document.createElement('div');
    el.textContent = '1000';
    counter(el);
    // assertions...
  });
});
```

---

## Roadmap

### Completado
- ✅ Fase 3.1: Módulo Core
- ✅ Fase 3.2: Módulo Counter + consolidación WoPricing
- ✅ Fase 3.3: Módulo Stagger
- ✅ Fase 3.4: Módulo Slide
- ✅ Fase 3.5: Módulos Effects, SVG, Growth
- ✅ Fase 3.6: Bundle y deprecación de wo-anime.js
- ✅ Fase 3.7: Migración de 3 decks activos

### Opcional Futuro
- Crear versión minificada de bundle para producción
- Migrar decks restantes (5 que no usan animaciones)
- Agregar unit tests para cada módulo
- Documentar en Design System Hub

---

## Contacto

Workalógico Design System v2.3  
bo@workalogico.com  
www.workalogico.com
