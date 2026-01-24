/**
 * ═══════════════════════════════════════════════════════════════
 * WO-ANIME SVG MODULE
 * Animaciones SVG y metodología
 * 
 * Dependencias: wo-anime-core.js, anime.js
 * ═══════════════════════════════════════════════════════════════
 */

import { config, trackAnimation } from './wo-anime-core.js';

/**
 * Anima el dibujo de paths SVG
 */
export function pathDraw(paths, options = {}) {
  const {
    duration = 1500,
    staggerDelay = 300,
    easing = 'easeInOutSine'
  } = options;
  
  return trackAnimation(anime({
    targets: paths,
    strokeDashoffset: [anime.setDashoffset, 0],
    easing,
    duration,
    delay: anime.stagger(staggerDelay)
  }));
}

/**
 * Crea línea de conexión entre dos elementos
 */
export function connectElements(fromEl, toEl, options = {}) {
  const {
    container = fromEl.parentElement,
    color = config.getPrimaryColor(),
    strokeWidth = 2,
    curved = true,
    duration = 1000,
    dashArray = null
  } = options;
  
  const containerRect = container.getBoundingClientRect();
  const fromRect = fromEl.getBoundingClientRect();
  const toRect = toEl.getBoundingClientRect();
  
  const startX = fromRect.right - containerRect.left;
  const startY = fromRect.top + fromRect.height / 2 - containerRect.top;
  const endX = toRect.left - containerRect.left;
  const endY = toRect.top + toRect.height / 2 - containerRect.top;
  
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.style.cssText = `position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; overflow: visible;`;
  
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  
  let d;
  if (curved) {
    const midX = (startX + endX) / 2;
    d = `M ${startX} ${startY} Q ${midX} ${startY} ${midX} ${(startY + endY) / 2} T ${endX} ${endY}`;
  } else {
    d = `M ${startX} ${startY} L ${endX} ${endY}`;
  }
  
  path.setAttribute('d', d);
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', color);
  path.setAttribute('stroke-width', strokeWidth);
  if (dashArray) path.setAttribute('stroke-dasharray', dashArray);
  
  svg.appendChild(path);
  container.style.position = 'relative';
  container.appendChild(svg);
  
  const pathLength = path.getTotalLength();
  path.style.strokeDasharray = pathLength;
  path.style.strokeDashoffset = pathLength;
  
  return trackAnimation(anime({
    targets: path,
    strokeDashoffset: [pathLength, 0],
    duration,
    easing: 'easeInOutQuad'
  }));
}

/**
 * Crea conexiones entre cards de metodología
 */
export function methodologyConnections(container, options = {}) {
  const {
    cardSelector = '.wo-card',
    direction = 'horizontal',
    lineColor = config.getPrimaryColor(),
    lineWidth = 2,
    dashPattern = null,
    arrowHead = true,
    duration = 1200,
    staggerDelay = 400,
    curved = false
  } = options;
  
  const cards = container.querySelectorAll(cardSelector);
  if (cards.length < 2) return null;
  
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'wo-methodology-connector');
  svg.style.cssText = `position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; overflow: visible; z-index: 0;`;
  
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  if (arrowHead) {
    defs.innerHTML = `<marker id="methodology-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="${lineColor}" opacity="0.8"/></marker>`;
  }
  svg.appendChild(defs);
  
  const containerStyle = window.getComputedStyle(container);
  if (containerStyle.position === 'static') {
    container.style.position = 'relative';
  }
  
  const containerRect = container.getBoundingClientRect();
  const paths = [];
  const cardArray = Array.from(cards);
  
  for (let i = 0; i < cardArray.length - 1; i++) {
    const fromCard = cardArray[i];
    const toCard = cardArray[i + 1];
    
    const fromRect = fromCard.getBoundingClientRect();
    const toRect = toCard.getBoundingClientRect();
    
    let startX, startY, endX, endY;
    
    if (direction === 'horizontal') {
      startX = fromRect.right - containerRect.left;
      startY = fromRect.top + fromRect.height / 2 - containerRect.top;
      endX = toRect.left - containerRect.left;
      endY = toRect.top + toRect.height / 2 - containerRect.top;
    } else if (direction === 'vertical') {
      startX = fromRect.left + fromRect.width / 2 - containerRect.left;
      startY = fromRect.bottom - containerRect.top;
      endX = toRect.left + toRect.width / 2 - containerRect.left;
      endY = toRect.top - containerRect.top;
    }
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    let d;
    if (curved) {
      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2;
      const controlOffset = 30;
      
      if (direction === 'horizontal') {
        d = `M ${startX} ${startY} Q ${midX} ${startY - controlOffset} ${endX} ${endY}`;
      } else {
        d = `M ${startX} ${startY} Q ${startX + controlOffset} ${midY} ${endX} ${endY}`;
      }
    } else {
      d = `M ${startX} ${startY} L ${endX} ${endY}`;
    }
    
    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', lineColor);
    path.setAttribute('stroke-width', lineWidth);
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('opacity', '0.6');
    if (dashPattern) path.setAttribute('stroke-dasharray', dashPattern);
    if (arrowHead) path.setAttribute('marker-end', 'url(#methodology-arrow)');
    
    const pathLength = path.getTotalLength();
    path.style.strokeDasharray = pathLength;
    path.style.strokeDashoffset = pathLength;
    
    svg.appendChild(path);
    paths.push(path);
  }
  
  container.insertBefore(svg, container.firstChild);
  
  const tl = anime.timeline({ easing: 'easeInOutQuad' });
  
  paths.forEach((path, index) => {
    const pathLength = path.getTotalLength();
    
    tl.add({
      targets: path,
      strokeDashoffset: [pathLength, 0],
      opacity: [0.3, 0.6],
      duration,
      easing: 'easeInOutCubic'
    }, index * staggerDelay);
    
    tl.add({
      targets: path,
      opacity: [0.6, 0.8, 0.6],
      duration: 400,
      easing: 'easeInOutSine'
    }, index * staggerDelay + duration - 200);
  });
  
  return trackAnimation(tl);
}

/**
 * Anima números de pasos en cards
 */
export function animateStepNumbers(container, options = {}) {
  const {
    numberSelector = '.card-number',
    duration = 600,
    staggerDelay = 150
  } = options;
  
  const numbers = container.querySelectorAll(numberSelector);
  if (numbers.length === 0) return null;
  
  numbers.forEach(num => {
    num.style.opacity = '0';
    num.style.transform = 'scale(0.5)';
  });
  
  return trackAnimation(anime({
    targets: Array.from(numbers),
    scale: [0.5, 1.2, 1],
    opacity: [0, 0.25],
    delay: anime.stagger(staggerDelay),
    duration,
    easing: config.easing.back
  }));
}

/**
 * Anima línea de progreso de steps
 */
export function stepsTimeline(container, options = {}) {
  const {
    duration = 2500,
    staggerDelay = 350,
    lineColor = config.getPrimaryColor(),
    showNumbers = true,
    pulseOnComplete = true
  } = options;
  
  const items = container.querySelectorAll('li');
  let progressLine = container.querySelector('.wo-steps__progress-line');
  
  if (!progressLine) {
    progressLine = document.createElement('div');
    progressLine.className = 'wo-steps__progress-line';
    progressLine.style.cssText = `position: absolute; left: 0.8em; top: 1.2em; bottom: 1em; width: 2px; background: linear-gradient(to bottom, ${lineColor}, ${lineColor}88); transform-origin: top; transform: scaleY(0); z-index: 0; border-radius: 2px;`;
    container.style.position = 'relative';
    container.insertBefore(progressLine, container.firstChild);
  }
  
  items.forEach(item => {
    item.style.position = 'relative';
    item.style.zIndex = '1';
    item.style.opacity = '0';
    item.style.transform = 'translateX(-25px)';
  });
  
  const itemCount = items.length;
  const tl = anime.timeline({ easing: config.easing.expo });
  
  tl.add({
    targets: progressLine,
    scaleY: [0, 1],
    duration,
    easing: 'easeInOutCubic'
  }, 0);
  
  items.forEach((item, index) => {
    const itemDelay = (index / itemCount) * duration * 0.6;
    
    tl.add({
      targets: item,
      translateX: [-25, 0],
      opacity: [0, 1],
      duration: 500,
      easing: config.easing.spring
    }, itemDelay + 200);
  });
  
  return trackAnimation(tl);
}
