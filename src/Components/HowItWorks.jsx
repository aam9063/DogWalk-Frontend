import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registrar plugins
gsap.registerPlugin(ScrollTrigger);

const HowItWorks = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Timeline principal para mejor sincronización y rendimiento
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 20%",
          toggleActions: "play none none reverse",
          markers: false,
        }
      });

      // Animación del título con mejor rendimiento
      tl.from(titleRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      });

      // Animación de las tarjetas con mejor rendimiento y sincronización
      tl.from(cardsRef.current.children, {
        y: 50,
        opacity: 0,
        duration: 0.6,
        stagger: {
          amount: 0.4,
          ease: "power2.out"
        },
        ease: "power2.out"
      }, "-=0.4"); // Superposición suave con la animación del título
    }, sectionRef);

    // Limpieza mejorada
    return () => {
      ctx.revert(); // Limpia todas las animaciones y ScrollTriggers de este contexto
    };
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="py-16 bg-white"
      style={{ willChange: 'transform' }} // Optimización de rendimiento
    >
      <div className="container px-4 mx-auto">
        <h2 
          ref={titleRef} 
          className="mb-12 text-3xl text-center font-adlam"
          style={{ willChange: 'transform, opacity' }}
        >
          ¿Cómo funciona Dog Walk?
        </h2>

        <div 
          ref={cardsRef} 
          className="grid grid-cols-1 gap-8 md:grid-cols-3"
          style={{ willChange: 'transform' }}
        >
          {/* Paso 1 */}
          <div className="flex flex-col items-center" style={{ willChange: 'transform, opacity' }}>
            <div className="flex items-center justify-center w-12 h-12 mb-4 text-white rounded-full bg-dog-green">
              <span className="text-xl font-bold">1</span>
            </div>
            <h3 className="mb-2 text-xl font-medium">Busca</h3>
            <p className="text-center text-gray-600">
              Busca entre miles de cuidadores de perros de confianza cerca de ti
            </p>
          </div>

          {/* Paso 2 */}
          <div className="flex flex-col items-center" style={{ willChange: 'transform, opacity' }}>
            <div className="flex items-center justify-center w-12 h-12 mb-4 text-white rounded-full bg-dog-green">
              <span className="text-xl font-bold">2</span>
            </div>
            <h3 className="mb-2 text-xl font-medium">Reserva</h3>
            <p className="text-center text-gray-600">
              Envía un mensaje al cuidador perfecto para tu perro, reserva y
              paga a través de Stripe
            </p>
          </div>

          {/* Paso 3 */}
          <div className="flex flex-col items-center" style={{ willChange: 'transform, opacity' }}>
            <div className="flex items-center justify-center w-12 h-12 mb-4 text-white rounded-full bg-dog-green">
              <span className="text-xl font-bold">3</span>
            </div>
            <h3 className="mb-2 text-xl font-medium">Relájate</h3>
            <p className="text-center text-gray-600">
              Tu perro se divertirá y estará en familia y tú recibirás
              fotografías regularmente
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
