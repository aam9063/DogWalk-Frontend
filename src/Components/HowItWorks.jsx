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
    const section = sectionRef.current;
    const title = titleRef.current;
    const cards = cardsRef.current.children;

    // Animación del título
    gsap.fromTo(
      title,
      { opacity: 0, y: -20 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, 
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          once: true
        }
      }
    );

    // Animación para cada tarjeta de pasos
    gsap.fromTo(
      cards,
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.5, 
        stagger: 0.15,
        ease: "power2.out",
        delay: 0.2,
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          once: true
        }
      }
    );

    // Limpieza
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-16 bg-white">
      <div className="container px-4 mx-auto">
        <h2 ref={titleRef} className="mb-12 text-3xl text-center font-adlam">
          ¿Cómo funciona Dog Walk?
        </h2>

        <div ref={cardsRef} className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Paso 1 */}
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-12 h-12 mb-4 text-white rounded-full bg-dog-green">
              <span className="text-xl font-bold">1</span>
            </div>
            <h3 className="mb-2 text-xl font-medium">Busca</h3>
            <p className="text-center text-gray-600">
              Busca entre miles de cuidadores de perros de confianza cerca de ti
            </p>
          </div>

          {/* Paso 2 */}
          <div className="flex flex-col items-center">
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
          <div className="flex flex-col items-center">
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
