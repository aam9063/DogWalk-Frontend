import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
// eslint-disable-next-line no-unused-vars
import { motion } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FadeIn from '../Components/FadeIn';

// Registrar plugins
gsap.registerPlugin(ScrollTrigger);

const HowItWorks = () => {
  // Referencias para animaciones GSAP
  const heroRef = useRef(null);
  const introRef = useRef(null);
  const featuresRef = useRef(null);
  const contactRef = useRef(null);
  const reservationRef = useRef(null);
  const additionalRef = useRef(null);

  useEffect(() => {
    // Animación del hero section
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.querySelector('h1'),
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
      
      gsap.fromTo(
        heroRef.current.querySelector('a'),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: "power2.out" }
      );
    }
    
    // Configurar animaciones para las secciones
    const setupSectionAnimation = (ref, direction = 'up') => {
      if (!ref.current) return;
      
      const animProps = {
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
          once: true
        }
      };
      
      if (direction === 'up') {
        gsap.fromTo(ref.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, ...animProps });
      } else if (direction === 'left') {
        gsap.fromTo(ref.current, { opacity: 0, x: -80 }, { opacity: 1, x: 0, ...animProps });
      } else if (direction === 'right') {
        gsap.fromTo(ref.current, { opacity: 0, x: 80 }, { opacity: 1, x: 0, ...animProps });
      }
    };
    
    // Aplicar animaciones a las secciones
    setupSectionAnimation(introRef, 'up');
    setupSectionAnimation(featuresRef, 'left');
    setupSectionAnimation(contactRef, 'right');
    setupSectionAnimation(reservationRef, 'left');
    setupSectionAnimation(additionalRef, 'up');
    
    // Limpiar los ScrollTriggers al desmontar
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero section */}
      <section ref={heroRef} className="relative w-full h-[400px]">
        <motion.div 
          className="absolute inset-0 w-full h-full"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <div 
            className="w-full h-full bg-cover"
            style={{ 
              backgroundImage: 'url(public/imgs/dog-3344414_1280.jpg)',
              backgroundPosition: 'center 50%',
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </motion.div>
        
        <div className="container relative z-10 flex flex-col items-center justify-center h-full px-4 mx-auto text-center">
          <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl font-adlam">
            ¿Por qué deberías confiar en nosotros?
          </h1>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/buscar-cuidadores" 
              className="px-8 py-3 font-medium text-white transition-colors rounded-md bg-dog-green hover:bg-dog-light-green"
            >
              Comenzar
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Intro paragraph */}
      <section ref={introRef} className="py-12 bg-white">
        <div className="container px-4 mx-auto">
          <FadeIn direction="up">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-xl leading-relaxed text-gray-900 md:text-2xl font-adlam">
                ¿Buscas cuidadores para tu perro mientras estás de vacaciones o necesitas ayuda para pasearlo unas cuantas veces a la semana? En Dog Walk, te ayudamos a encontrar y reservar un cuidador de perros cercano y adaptado a tus necesidades.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-12 bg-gray-100">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Left column */}
            <div ref={featuresRef} className="space-y-10">
              <FadeIn direction="left" delay={0.1}>
                <div>
                  <h2 className="mb-4 text-2xl font-semibold">Busca en tu zona</h2>
                  <p className="text-gray-700">
                    Introduce tu código postal o dirección para obtener un listado de cuidadores de confianza cerca de ti.
                  </p>
                </div>
              </FadeIn>
              
              <FadeIn direction="left" delay={0.2}>
                <div className="flex items-start gap-4">
                  <motion.div 
                    className="flex-shrink-0"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-black rounded-full">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4-8c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4z"></path>
                      </svg>
                    </div>
                  </motion.div>
                  <div>
                    <h3 className="mb-2 text-xl font-semibold">Cuidadores de confianza</h3>
                    <p className="text-gray-700">
                      Todos los cuidadores han sido verificados y validados por el equipo de Dog Walk.
                    </p>
                  </div>
                </div>
              </FadeIn>
              
              <FadeIn direction="left" delay={0.3}>
                <div className="flex items-start gap-4">
                  <motion.div 
                    className="flex-shrink-0"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-black rounded-full">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"></path>
                      </svg>
                    </div>
                  </motion.div>
                  <div>
                    <h3 className="mb-2 text-xl font-semibold">Opiniones verificadas</h3>
                    <p className="text-gray-700">
                      Todas las reseñas provienen de usuarios de Dog Walk que han completado una reserva a través de la web o app de Dog Walk.
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>
            
            {/* Right column - Image */}
            <FadeIn direction="right" delay={0.2}>
              <motion.div 
                className="overflow-hidden rounded-lg h-80 md:h-auto"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5 }}
              >
                <img 
                  src="public/imgs/pet-3635985_1280.jpg" 
                  alt="Perro feliz con su cuidador" 
                  className="object-cover w-full h-full"
                />
              </motion.div>
            </FadeIn>
          </div>
        </div>
      </section>
      
      {/* Contact cuidadores section */}
      <section className="py-12 bg-white">
        <div className="container px-4 mx-auto">
          <div className="grid items-center grid-cols-1 gap-8 md:grid-cols-2">
            {/* Left column - Image */}
            <div className="order-2 md:order-1">
              <FadeIn direction="left" delay={0.2}>
                <motion.div 
                  className="overflow-hidden rounded-lg h-80 md:h-auto"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.5 }}
                >
                  <img 
                    src="public/imgs/dogs-4220163_1280.jpg" 
                    alt="Perros jugando en la playa" 
                    className="object-cover w-full h-full"
                  />
                </motion.div>
              </FadeIn>
            </div>
            
            {/* Right column */}
            <div ref={contactRef} className="order-1 md:order-2">
              <h2 className="mb-4 text-2xl font-semibold">Contacta cuidadores</h2>
              <p className="mb-4 text-gray-700">
                Contacta con hasta 5 cuidadores a través de la web o app de Dog Walk para encontrar el cuidador perfecto para ti y tu amigo canino. Conoce los detalles, comportamiento, condiciones de salud y su rutina de ejercicios. También te sugerimos negociar un encuentro previo para garantizar una buena experiencia para ambos.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Reservation section */}
      <section className="py-12 bg-gray-100">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div ref={reservationRef}>
              <h2 className="mb-6 text-2xl font-semibold">Reserva al mejor cuidador para ti</h2>
              <p className="mb-4 text-gray-700">
                Una vez hayas encontrado al cuidador ideal para tu perro, tendrás en marcha una solicitud de reserva para conseguir las fechas, ya sea las noches, jo por las horas durante el día que necesitas.
              </p>
              
              <div className="mt-8 space-y-6">
                <FadeIn direction="left" delay={0.1}>
                  <div className="flex items-start gap-4">
                    <motion.div 
                      className="flex-shrink-0"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center justify-center w-8 h-8 bg-black rounded-full">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                    </motion.div>
                    <div>
                      <h3 className="mb-1 text-lg font-semibold">Cancelación gratuita</h3>
                      <p className="text-gray-700">
                        Cada reserva en Dog Walk incluye Cancelación Gratuita, ofreciéndote un reembolso del 100% del coste de una reserva, manteniendo flexibilidad y tranquilidad.
                      </p>
                    </div>
                  </div>
                </FadeIn>
                
                <FadeIn direction="left" delay={0.2}>
                  <div className="flex items-start gap-4">
                    <motion.div 
                      className="flex-shrink-0"
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center justify-center w-8 h-8 bg-black rounded-full">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                        </svg>
                      </div>
                    </motion.div>
                    <div>
                      <h3 className="mb-1 text-lg font-semibold">Pagos seguros</h3>
                      <p className="text-gray-700">
                        Cada reserva queda confirmada a través de la web o app de Dog Walk. El dinero no se transfiere al cuidador hasta completarse el servicio, garantizando un proceso fácil y fiable.
                      </p>
                    </div>
                  </div>
                </FadeIn>
              </div>
            </div>
            
            {/* Right column - Image */}
            <FadeIn direction="right" delay={0.3}>
              <motion.div 
                className="overflow-hidden rounded-lg h-80 md:h-auto"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5 }}
              >
                <img 
                  src="public/imgs/dogs-5995508_1280.jpg" 
                  alt="Propietario reservando cuidador" 
                  className="object-cover w-full h-full"
                />
              </motion.div>
            </FadeIn>
          </div>
        </div>
      </section>
      
      {/* Additional features */}
      <section ref={additionalRef} className="py-12 bg-white">
        <div className="container grid grid-cols-1 gap-8 px-4 mx-auto md:grid-cols-2">
          {/* Left column - Dog sitting */}
          <FadeIn direction="up" delay={0.1}>
            <div className="flex items-start gap-6">
              <motion.div 
                className="flex-shrink-0"
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-dog-green">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"></path>
                  </svg>
                </div>
              </motion.div>
              <div>
                <h3 className="mb-2 text-xl font-semibold">Relámpago</h3>
                <p className="text-gray-700">
                  Solicita una reserva con tan solo 3 horas de antelación. Las tarifas a menudo son más económicas que en las residencias caninas, ideal para viajes imprevistos.
                </p>
              </div>
            </div>
          </FadeIn>
          
          {/* Right column - Tranquilidad */}
          <FadeIn direction="up" delay={0.2}>
            <div className="flex items-start gap-6">
              <motion.div 
                className="flex-shrink-0"
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-dog-green">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm7 10c0 4.52-2.98 8.69-7 9.93-4.02-1.24-7-5.41-7-9.93V6.3l7-3.11 7 3.11V11zm-11.59.59L6 13l4 4 8-8-1.41-1.42L10 14.17z"></path>
                  </svg>
                </div>
              </motion.div>
              <div>
                <h3 className="mb-2 text-xl font-semibold">Tranquilidad</h3>
                <p className="text-gray-700">
                  Todas las estancias para perros cuentan con asistencia veterinaria, cobertura de daños y atención 24/7 del equipo de Dog Walk.
                </p>
              </div>
            </div>
          </FadeIn>
          
          {/* Left column - Simplifica */}
          <FadeIn direction="up" delay={0.3}>
            <div className="flex items-start gap-6">
              <motion.div 
                className="flex-shrink-0"
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-dog-green">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path>
                  </svg>
                </div>
              </motion.div>
              <div>
                <h3 className="mb-2 text-xl font-semibold">Simplifica</h3>
                <p className="text-gray-700">
                  Gestiona tus reservas, chats y pagos con un perfil en Dog Walk. Cuenta con soporte las 24 horas, los 7 días de la semana.
                </p>
              </div>
            </div>
          </FadeIn>
          
          {/* Right column - Comunidad */}
          <FadeIn direction="up" delay={0.4}>
            <div className="flex items-start gap-6">
              <motion.div 
                className="flex-shrink-0"
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-dog-green">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"></path>
                  </svg>
                </div>
              </motion.div>
              <div>
                <h3 className="mb-2 text-xl font-semibold">Comunidad</h3>
                <p className="text-gray-700">
                  Conviértete en cuidador para crear un entorno donde los perros se sientan como en casa. Una comunidad apasionada por el cuidado de mascotas.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="py-16 bg-dog-green">
        <FadeIn direction="up">
          <div className="container px-4 mx-auto text-center">
            <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl font-adlam">¿Estás preparado?</h2>
            <p className="max-w-2xl mx-auto mb-8 text-lg text-white">
              Encuentra al cuidador perfecto para tu mascota en minutos. Todos verificados y con reseñas de clientes reales.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/buscar-cuidadores" 
                className="px-8 py-3 font-medium transition-colors bg-white rounded-md text-dog-green"
              >
                Buscar cuidadores
              </Link>
            </motion.div>
          </div>
        </FadeIn>
      </section>
      
      <Footer />
    </div>
  );
};

export default HowItWorks; 