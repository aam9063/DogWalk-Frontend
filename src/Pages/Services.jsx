import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FadeIn from '../Components/FadeIn';

// Registrar plugins
gsap.registerPlugin(ScrollTrigger);

const Services = () => {
  // Estado para controlar la expansión de cada beneficio
  const [expandedBenefit, setExpandedBenefit] = useState(null);

  // Referencias para animaciones
  const heroRef = useRef(null);
  const introRef = useRef(null);
  const alojamientoRef = useRef(null);
  const guarderiaRef = useRef(null);
  const paseoRef = useRef(null);
  const beneficiosRef = useRef(null);

  // Función para manejar el clic en un beneficio
  const toggleBenefit = (benefit) => {
    if (expandedBenefit === benefit) {
      setExpandedBenefit(null);
    } else {
      setExpandedBenefit(benefit);
    }
  };
  
  // Animaciones con GSAP
  useEffect(() => {
    // Animación del hero
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.querySelector('h1'),
        { opacity: 0, y: -50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          ease: "power2.out" 
        }
      );
      
      gsap.fromTo(
        heroRef.current.querySelector('a'),
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          delay: 0.3, 
          ease: "power2.out" 
        }
      );
    }
    
    // Animación para las secciones al hacer scroll
    const triggerAnimation = (ref, animationType) => {
      if (!ref.current) return;
      
      if (animationType === 'fromRight') {
        gsap.fromTo(
          ref.current,
          { opacity: 0, x: 100 },
          { 
            opacity: 1, 
            x: 0, 
            duration: 0.8, 
            ease: "power2.out",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 80%",
              once: true
            }
          }
        );
      } else if (animationType === 'fromLeft') {
        gsap.fromTo(
          ref.current,
          { opacity: 0, x: -100 },
          { 
            opacity: 1, 
            x: 0, 
            duration: 0.8, 
            ease: "power2.out",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 80%",
              once: true
            }
          }
        );
      } else {
        gsap.fromTo(
          ref.current,
          { opacity: 0, y: 50 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.8, 
            ease: "power2.out",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 80%",
              once: true
            }
          }
        );
      }
    };
    
    triggerAnimation(introRef);
    triggerAnimation(alojamientoRef, 'fromLeft');
    triggerAnimation(guarderiaRef, 'fromRight');
    triggerAnimation(paseoRef, 'fromLeft');
    triggerAnimation(beneficiosRef);
    
    // Limpieza
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
              backgroundImage: 'url(public/imgs/dogs-5282275_1280.jpg)',
              backgroundPosition: 'center 40%',
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </motion.div>
        
        <div className="container relative z-10 flex flex-col items-center justify-center h-full px-4 mx-auto text-center">
          <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl font-adlam">
            Nuestros servicios
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
                ¿Buscas un cuidador para tu perro cuando te marchas de vacaciones o ayuda para cuidar de él algunas veces en semana? En Dog Walk te ayudamos a encontrar y reservar un cuidador cerca de ti.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>
      
      {/* Alojamiento section */}
      <section className="py-12 bg-white">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Left column - Text */}
            <div ref={alojamientoRef}>
              <h2 className="mb-4 text-3xl font-bold text-dog-dark font-adlam">Alojamiento</h2>
              <p className="mb-8 text-lg text-gray-700">
                Tu perro se sentirá como en casa cuando lo dejes al cuidado de un cuidador en una casa particular por el cuidador, que ofrece. Nuestros cuidadores de perros se aseguran de que tu perro está cómodo y recibe paseos, juegos y cuidados. Debes hacer reserva para tu perro si necesitas ser alimentado mientras la dueña al cuidado. Precio de la guardería desde 15€ por día.
              </p>
            </div>
            
            {/* Right column - Image */}
            <FadeIn direction="right" delay={0.2}>
              <motion.div 
                className="overflow-hidden rounded-lg h-80 md:h-auto"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src="public/imgs/dogs-1284238_1280.jpg" 
                  alt="Perro durmiendo cómodamente" 
                  className="object-cover w-full h-full"
                />
              </motion.div>
            </FadeIn>
          </div>
        </div>
      </section>
      
      {/* Guardería section */}
      <section className="py-12 bg-gray-100">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Left column - Image (on mobile appears after text) */}
            <div className="order-2 md:order-1">
              <FadeIn direction="left" delay={0.2}>
                <motion.div 
                  className="overflow-hidden rounded-lg h-80 md:h-auto"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <img 
                    src="public/imgs/dog-walker-9141143_1280.jpg" 
                    alt="Perros en guardería de día" 
                    className="object-cover w-full h-full"
                  />
                </motion.div>
              </FadeIn>
            </div>
            
            {/* Right column - Text */}
            <div ref={guarderiaRef} className="order-1 md:order-2">
              <h2 className="mb-4 text-3xl font-bold text-dog-dark font-adlam">Guardería de día</h2>
              <p className="mb-8 text-lg text-gray-700">
                El servicio de guardería es durante el día, generalmente desde la mañana entre las 8 y las 9, hasta la tarde entre las 17 y las 19, pero también puede ser más corto o paseos, juegos y cuidados. Debes hacer reserva para tu perro si necesitas ser alimentado mientras la dueña al cuidado. Precio de la guardería desde 10€ por día.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Paseo section */}
      <section className="py-12 bg-white">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Left column - Text */}
            <div ref={paseoRef}>
              <h2 className="mb-4 text-3xl font-bold text-dog-dark font-adlam">Paseo de perros</h2>
              <p className="mb-8 text-lg text-gray-700">
                ¿No puedes pasear a tu perro tan a menudo como te gustaría? ¡Encuentra un cuidador para que lo haga por ti cuando no tengas tiempo o te resulte imposible! Ofrecemos paseos de 30 a 60 minutos para tu perro, que incluyen cobertura veterinaria, así como servicio de recogida y entrega en tu hogar.
              </p>
            </div>
            
            {/* Right column - Image */}
            <FadeIn direction="right" delay={0.2}>
              <motion.div 
                className="overflow-hidden rounded-lg h-80 md:h-auto"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src="public/imgs/three-dogs-2975649_1280.jpg" 
                  alt="Cuidador paseando perros" 
                  className="object-cover w-full h-full"
                />
              </motion.div>
            </FadeIn>
          </div>
        </div>
      </section>
      
      {/* Beneficios section */}
      <section ref={beneficiosRef} className="py-12 text-white bg-dog-green">
        <div className="container px-4 mx-auto">
          <h2 className="mb-8 text-3xl font-bold text-center md:text-4xl font-adlam">Beneficios de Dog Walk</h2>
          
          <div className="max-w-3xl mx-auto">
            {/* Beneficio 1: Cobertura Veterinaria */}
            <FadeIn direction="up" delay={0.1}>
              <div className="mb-4">
                <motion.button 
                  onClick={() => toggleBenefit('veterinaria')}
                  className="flex items-center justify-between w-full p-4 text-left transition-colors rounded bg-opacity-20 bg-white/10 hover:bg-white/20"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center">
                    <motion.img 
                      src="public/icons/Veterinarian2.svg" 
                      alt="Cobertura Veterinaria" 
                      className="w-6 h-6 mr-3"
                      animate={{ rotate: expandedBenefit === 'veterinaria' ? 360 : 0 }}
                      transition={{ duration: 0.5 }}
                    />
                    <span className="text-xl font-semibold">Cobertura Veterinaria</span>
                  </div>
                  <span className="text-2xl">{expandedBenefit === 'veterinaria' ? '−' : '+'}</span>
                </motion.button>
                <AnimatePresence>
                  {expandedBenefit === 'veterinaria' && (
                    <motion.div 
                      className="p-4 mt-1 rounded bg-opacity-10 bg-white/10"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p>Ofrecemos cobertura veterinaria para tu mascota en caso de emergencia mientras esté bajo el cuidado de nuestros cuidadores certificados.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeIn>
            
            {/* Beneficio 2: Cancelación Gratuita */}
            <FadeIn direction="up" delay={0.2}>
              <div className="mb-4">
                <motion.button 
                  onClick={() => toggleBenefit('cancelacion')}
                  className="flex items-center justify-between w-full p-4 text-left transition-colors rounded bg-opacity-20 bg-white/10 hover:bg-white/20"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center">
                    <motion.img 
                      src="public/icons/VerifiedAccount2.svg" 
                      alt="Cancelación Gratuita" 
                      className="w-6 h-6 mr-3"
                      animate={{ rotate: expandedBenefit === 'cancelacion' ? 360 : 0 }}
                      transition={{ duration: 0.5 }}
                    />
                    <span className="text-xl font-semibold">Cancelación Gratuita</span>
                  </div>
                  <span className="text-2xl">{expandedBenefit === 'cancelacion' ? '−' : '+'}</span>
                </motion.button>
                <AnimatePresence>
                  {expandedBenefit === 'cancelacion' && (
                    <motion.div 
                      className="p-4 mt-1 rounded bg-opacity-10 bg-white/10"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p>Puedes cancelar tu reserva sin coste adicional hasta 24 horas antes del servicio programado.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeIn>
            
            {/* Beneficio 3: Cuidadores Verificados */}
            <FadeIn direction="up" delay={0.3}>
              <div className="mb-4">
                <motion.button 
                  onClick={() => toggleBenefit('verificados')}
                  className="flex items-center justify-between w-full p-4 text-left transition-colors rounded bg-opacity-20 bg-white/10 hover:bg-white/20"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center">
                    <motion.img 
                      src="public/icons/Apply2.svg" 
                      alt="Cuidadores Verificados" 
                      className="w-6 h-6 mr-3"
                      animate={{ rotate: expandedBenefit === 'verificados' ? 360 : 0 }}
                      transition={{ duration: 0.5 }}
                    />
                    <span className="text-xl font-semibold">Cuidadores verificados</span>
                  </div>
                  <span className="text-2xl">{expandedBenefit === 'verificados' ? '−' : '+'}</span>
                </motion.button>
                <AnimatePresence>
                  {expandedBenefit === 'verificados' && (
                    <motion.div 
                      className="p-4 mt-1 rounded bg-opacity-10 bg-white/10"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p>Todos nuestros cuidadores pasan por un riguroso proceso de verificación, incluyendo revisión de antecedentes y entrevistas personales.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeIn>
            
            {/* Beneficio 4: Soporte y Ayuda */}
            <FadeIn direction="up" delay={0.4}>
              <div className="mb-4">
                <motion.button 
                  onClick={() => toggleBenefit('soporte')}
                  className="flex items-center justify-between w-full p-4 text-left transition-colors rounded bg-opacity-20 bg-white/10 hover:bg-white/20"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center">
                    <motion.img 
                      src="public/icons/Support.svg" 
                      alt="Soporte y Ayuda" 
                      className="w-6 h-6 mr-3"
                      animate={{ rotate: expandedBenefit === 'soporte' ? 360 : 0 }}
                      transition={{ duration: 0.5 }}
                    />
                    <span className="text-xl font-semibold">Soporte y Ayuda</span>
                  </div>
                  <span className="text-2xl">{expandedBenefit === 'soporte' ? '−' : '+'}</span>
                </motion.button>
                <AnimatePresence>
                  {expandedBenefit === 'soporte' && (
                    <motion.div 
                      className="p-4 mt-1 rounded bg-opacity-10 bg-white/10"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p>Nuestro equipo de atención al cliente está disponible para ayudarte en cualquier momento, antes, durante y después de tu reserva.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
      
      {/* Call to action */}
      <section className="py-16 bg-white">
        <FadeIn direction="up">
          <div className="container px-4 mx-auto text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl font-adlam">Listo para comenzar?</h2>
            <p className="mb-8 text-lg text-gray-700">
              Encuentra al cuidador perfecto para tu perro hoy mismo.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/buscar-cuidadores" 
                className="px-8 py-3 font-medium text-white transition-colors rounded-md bg-dog-green hover:bg-dog-light-green"
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

export default Services; 