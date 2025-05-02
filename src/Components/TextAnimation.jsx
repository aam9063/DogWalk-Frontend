import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registrar plugins
gsap.registerPlugin(ScrollTrigger, SplitText);

// Componente para animaciones avanzadas de texto
const TextAnimation = ({ 
  children, 
  type = "chars", // chars, words, lines
  stagger = 0.03,
  duration = 0.5,
  y = 20,
  delay = 0,
  trigger = null,
  start = "top 80%",
  as = "div",
  className = "" 
}) => {
  const textRef = useRef(null);
  const splitRef = useRef(null);
  const Component = as;

  useEffect(() => {
    const element = textRef.current;
    let animation;

    if (element) {
      // Crear la división de texto basada en el tipo
      const splitOption = {};
      splitOption[type] = true;
      
      // Aplicar SplitText
      try {
        splitRef.current = new SplitText(element, splitOption);
        const targets = splitRef.current[type];

        // Animar los elementos divididos
        animation = gsap.fromTo(
          targets,
          { 
            opacity: 0, 
            y: y 
          },
          { 
            opacity: 1, 
            y: 0, 
            stagger: stagger,
            duration: duration,
            delay: delay,
            ease: "power3.out"
          }
        );

        // Configurar ScrollTrigger si se proporciona
        if (trigger) {
          ScrollTrigger.create({
            trigger: trigger === "self" ? element : trigger,
            start: start,
            onEnter: () => animation.play(),
            once: true
          });

          // Pausar la animación inicialmente
          animation.pause();
        }
      } catch (error) {
        console.error("Error al aplicar SplitText:", error);
      }
    }

    return () => {
      // Limpieza
      if (animation) animation.kill();
      if (splitRef.current) splitRef.current.revert();
    };
  }, [type, stagger, duration, y, delay, trigger, start]);

  return (
    <Component ref={textRef} className={className}>
      {children}
    </Component>
  );
};

export default TextAnimation; 