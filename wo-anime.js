/* ═══════════════════════════════════════════════════════════════
   WORKALÓGICO ANIMATION SYSTEM - wo-anime.js
   Sistema de animaciones basado en Anime.js para Reveal.js
   
   ⚠️ DEPRECATED: Este archivo se mantiene solo para backward compatibility
   
   MIGRACIÓN RECOMENDADA:
   ------------------------
   Opción 1 (Carga completa - sin cambios):
   <script src="../wo-anime/wo-anime-bundle.js"></script>
   
   Opción 2 (Carga selectiva - recomendado):
   <script type="module">
     import { counter, cardsEntrance } from '../wo-anime/wo-anime-counter.js';
     import { cover, init } from '../wo-anime/wo-anime-slide.js';
   </script>
   
   Módulos disponibles:
   - wo-anime-core.js      → Config y utilidades
   - wo-anime-counter.js   → Contadores numéricos
   - wo-anime-stagger.js   → Animaciones en cascada
   - wo-anime-slide.js     → Portadas y secciones
   - wo-anime-effects.js   → Efectos especiales
   - wo-anime-svg.js       → SVG y metodología
   - wo-anime-growth.js    → WoOS / Growth animations
   - wo-anime-bundle.js    → Bundle completo
   
   Requiere: Anime.js v3.2.2
   CDN: https://cdn.jsdelivr.net/npm/animejs@3.2.2/lib/anime.min.js
   
   Uso legacy:
   1. Incluir Anime.js antes de este archivo
   2. Incluir este archivo después de Reveal.js
   3. Llamar WoAnime.init() después de Reveal.initialize()
   ═══════════════════════════════════════════════════════════════ */

// Cargar el bundle modular
import WoAnime from './wo-anime/wo-anime-bundle.js';

// Exponer globalmente para scripts no-module
if (typeof window !== 'undefined') {
  window.WoAnime = WoAnime;
  
  // Log de deprecación en desarrollo
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    console.warn(
      '%c⚠️ wo-anime.js está DEPRECATED',
      'color: #FFCB00; font-weight: bold; font-size: 14px;',
      '\n\nMigra a los módulos individuales para mejor rendimiento:',
      '\n• wo-anime/wo-anime-bundle.js (completo)',
      '\n• wo-anime/wo-anime-counter.js (solo contadores)',
      '\n• wo-anime/wo-anime-stagger.js (solo stagger/cards)',
      '\n\nVer documentación: site/hub/animations.html'
    );
  }
}

// Export default para compatibilidad con módulos
export default WoAnime;
