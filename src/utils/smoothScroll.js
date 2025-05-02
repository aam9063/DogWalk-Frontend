// Utilidad para implementar scroll suave con JavaScript
// Esta función se puede usar para anular los enlaces internos y proporcionar scroll suave

export const initSmoothScroll = () => {
  // Capturar todos los clics en enlaces internos que comienzan con #
  document.addEventListener('click', (event) => {
    // Verificar si el evento fue desencadenado por un enlace interno
    const link = event.target.closest('a');
    if (!link) return;
    
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    
    // Evitar el comportamiento predeterminado del navegador
    event.preventDefault();
    
    // ID del elemento al que se desea desplazar
    const targetId = href === '#' ? 'body' : href;
    const targetElement = targetId === 'body' 
      ? document.body 
      : document.querySelector(targetId);
    
    if (!targetElement) return;
    
    // Realizar el desplazamiento suave
    smoothScrollTo(targetElement);
  });
};

// Función para realizar el desplazamiento suave a un elemento específico
export const smoothScrollTo = (element, offset = 0, duration = 800) => {
  const startPosition = window.pageYOffset;
  const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    
    const scrollAmount = ease(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, scrollAmount);
    
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  // Función de easing para hacer que el desplazamiento sea más natural
  function ease(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animation);
};

// Navegación programática con smooth scroll
export const scrollToSection = (sectionId, offset = 0) => {
  const target = document.getElementById(sectionId);
  if (target) {
    smoothScrollTo(target, offset);
  }
};

export default {
  initSmoothScroll,
  smoothScrollTo,
  scrollToSection
}; 