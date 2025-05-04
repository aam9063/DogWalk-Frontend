import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registrar plugins
gsap.registerPlugin(ScrollTrigger);

// Componente para animar elementos con GSAP
const GSAPAnimation = ({ 
  children, 
  type = "fade", // fade, scale, rotation, stagger
  trigger = null, 
  start = "top 80%", 
  duration = 0.8,
  delay = 0.1,
  staggerAmount = 0.1,
  className = ""
}) => {
  const elementRef = useRef(null);
  const childrenRef = useRef(null);

  useEffect(() => {
    // Asegurarnos de que el componente está montado
    if (!elementRef.current) return;
    
    const element = elementRef.current;
    let animation;
    let ctx = gsap.context(() => {
      if (type === "fade") {
        animation = gsap.fromTo(
          element,
          { opacity: 0, y: 30 },
          { 
            opacity: 1, 
            y: 0, 
            duration, 
            delay,
            ease: "power2.out",
            paused: trigger ? true : false
          }
        );
      } else if (type === "scale") {
        animation = gsap.fromTo(
          element,
          { opacity: 0, scale: 0.7 },
          { 
            opacity: 1, 
            scale: 1, 
            duration, 
            delay,
            ease: "back.out(1.4)",
            paused: trigger ? true : false 
          }
        );
      } else if (type === "rotation") {
        animation = gsap.fromTo(
          element,
          { opacity: 0, rotation: -5 },
          { 
            opacity: 1, 
            rotation: 0, 
            duration, 
            delay,
            ease: "power1.out",
            paused: trigger ? true : false 
          }
        );
      } else if (type === "stagger" && childrenRef.current) {
        // Para elementos que tienen hijos que queremos animar con un efecto escalonado
        const childElements = childrenRef.current.children;
        if (childElements && childElements.length > 0) {
          animation = gsap.fromTo(
            childElements,
            { opacity: 0, y: 20 },
            { 
              opacity: 1, 
              y: 0, 
              duration, 
              stagger: staggerAmount,
              delay,
              ease: "power1.out",
              paused: trigger ? true : false 
            }
          );
        }
      }

      // Si se proporciona un disparador y el elemento está visible
      if (trigger && element && animation) {
        ScrollTrigger.create({
          trigger: trigger === "self" ? element : trigger,
          start: start,
          onEnter: () => animation.play(),
          once: true
        });
      }
    }, elementRef); // Importante: delimitar el contexto a nuestro elemento

    return () => {
      ctx.revert(); // Limpia todas las animaciones creadas en este contexto
    };
  }, [type, trigger, start, duration, delay, staggerAmount]);

  return (
    <div 
      ref={elementRef} 
      className={className}
    >
      {type === "stagger" ? (
        <div ref={childrenRef}>
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default GSAPAnimation; 