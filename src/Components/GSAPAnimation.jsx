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
    const element = elementRef.current;
    let animation;

    if (type === "fade") {
      animation = gsap.fromTo(
        element,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration, 
          delay,
          ease: "power2.out"
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
          ease: "back.out(1.4)" 
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
          ease: "power1.out" 
        }
      );
    } else if (type === "stagger" && childrenRef.current) {
      // Para elementos que tienen hijos que queremos animar con un efecto escalonado
      const childElements = childrenRef.current.children;
      animation = gsap.fromTo(
        childElements,
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration, 
          stagger: staggerAmount,
          delay,
          ease: "power1.out" 
        }
      );
    }

    // Si se proporciona un disparador y el elemento está visible
    if (trigger && element) {
      ScrollTrigger.create({
        trigger: trigger === "self" ? element : trigger,
        start: start,
        onEnter: () => animation.play(),
        once: true
      });

      // Revertir animación si no está en la vista inicial
      animation.pause();
    }

    return () => {
      if (animation) animation.kill();
      ScrollTrigger.getAll().forEach(st => st.kill());
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