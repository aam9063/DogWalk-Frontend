import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FadeIn from "../Components/FadeIn";

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
    // Aplicar filtro a los iconos SVG para que se muestren en blanco
    const iconElements = document.querySelectorAll('.icon-container img');
    iconElements.forEach(icon => {
      icon.style.filter = 'invert(100%) brightness(200%)';
    });

    // Animación del hero section
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.querySelector("h1"),
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );

      gsap.fromTo(
        heroRef.current.querySelector("a"),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: "power2.out" }
      );
    }

    // Configurar animaciones para las secciones
    const setupSectionAnimation = (ref, direction = "up") => {
      if (!ref.current) return;

      const animProps = {
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
          once: true,
        },
      };

      if (direction === "up") {
        gsap.fromTo(
          ref.current,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, ...animProps }
        );
      } else if (direction === "left") {
        gsap.fromTo(
          ref.current,
          { opacity: 0, x: -80 },
          { opacity: 1, x: 0, ...animProps }
        );
      } else if (direction === "right") {
        gsap.fromTo(
          ref.current,
          { opacity: 0, x: 80 },
          { opacity: 1, x: 0, ...animProps }
        );
      }
    };

    // Aplicar animaciones a las secciones
    setupSectionAnimation(introRef, "up");
    setupSectionAnimation(featuresRef, "left");
    setupSectionAnimation(contactRef, "right");
    setupSectionAnimation(reservationRef, "left");
    setupSectionAnimation(additionalRef, "up");

    // Limpiar los ScrollTriggers al desmontar
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
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
              backgroundImage: "url(/imgs/dog-3344414_1280.jpg)",
              backgroundPosition: "center 50%",
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </motion.div>

        <div className="container relative z-10 flex flex-col items-center justify-center h-full px-4 mx-auto text-center">
          <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl font-adlam">
            ¿Por qué deberías confiar en nosotros?
          </h1>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
                ¿Buscas cuidadores para tu perro mientras estás de vacaciones o
                necesitas ayuda para pasearlo unas cuantas veces a la semana? En
                Dog Walk, te ayudamos a encontrar y reservar un cuidador de
                perros cercano y adaptado a tus necesidades.
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
                  <h2 className="mb-4 text-2xl font-semibold">
                    Busca en tu zona
                  </h2>
                  <p className="text-gray-700">
                    Introduce tu código postal o dirección para obtener un
                    listado de cuidadores de confianza cerca de ti.
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
                    <div className="flex items-center justify-center w-10 h-10 rounded-full icon-container">
                      <img
                        src="/icons/Apply.svg"
                        alt="Cuidadores de confianza"
                        className="w-50 h-50"
                      />
                    </div>
                  </motion.div>
                  <div>
                    <h3 className="mb-2 text-xl font-semibold">
                      Cuidadores de confianza
                    </h3>
                    <p className="text-gray-700">
                      Todos los cuidadores han sido verificados y validados por
                      el equipo de Dog Walk.
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
                    <div className="flex items-center justify-center w-10 h-10 rounded-full icon-container">
                      <img
                        src="/icons/Star.svg"
                        alt="Opiniones verificadas"
                        className="w-50 h-50"
                      />
                    </div>
                  </motion.div>
                  <div>
                    <h3 className="mb-2 text-xl font-semibold">
                      Opiniones verificadas
                    </h3>
                    <p className="text-gray-700">
                      Todas las reseñas provienen de usuarios de Dog Walk que
                      han completado una reserva a través de la web o app de Dog
                      Walk.
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
                  src="/imgs/pet-3635985_1280.jpg"
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
                    src="/imgs/dogs-4220163_1280.jpg"
                    alt="Perros jugando en la playa"
                    className="object-cover w-full h-full"
                  />
                </motion.div>
              </FadeIn>
            </div>

            {/* Right column */}
            <div ref={contactRef} className="order-1 md:order-2">
              <h2 className="mb-4 text-2xl font-semibold">
                Contacta cuidadores
              </h2>
              <p className="mb-4 text-gray-700">
                Contacta con hasta 5 cuidadores a través de la web o app de Dog
                Walk para encontrar el cuidador perfecto para ti y tu amigo
                canino. Conoce los detalles, comportamiento, condiciones de
                salud y su rutina de ejercicios. También te sugerimos negociar
                un encuentro previo para garantizar una buena experiencia para
                ambos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reservation section */}
      <section className="py-12 bg-gray-100">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Left column - Text */}
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
                      <div className="flex items-center justify-center w-8 h-8 rounded-full icon-container">
                        <img 
                          src="/icons/Check Mark.svg" 
                          alt="Cancelación gratuita" 
                          className="w-50 h-50"
                        />
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
                      <div className="flex items-center justify-center w-8 h-8 rounded-full icon-container">
                        <img 
                          src="/icons/Lock.svg" 
                          alt="Pagos seguros" 
                          className="w-50 h-50"
                        />
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
                  src="/imgs/dogs-5995508_1280.jpg" 
                  alt="Propietario reservando cuidador" 
                  className="object-cover w-full h-full"
                />
              </motion.div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Relajate section */}
      <section className="py-12 bg-gray-100">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Left column - Image */}
            <FadeIn direction="left" delay={0.3}>
              <motion.div
                className="overflow-hidden rounded-lg h-80 md:h-auto"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5 }}
              >
                <img
                  src="/imgs/weimaraner-2089405_1280.jpg"
                  alt="Propietario reservando cuidador"
                  className="object-cover w-full h-full"
                />
              </motion.div>
            </FadeIn>

            {/* Right column - Text */}
            <div ref={additionalRef}>
              <h2 className="mb-6 text-2xl font-semibold">Relájate</h2>
              <p className="mb-4 text-gray-700">
                No importa si estás de viaje, si necesitas un servicio de
                guardería o simplemente necesitas que paseen a tu perro, ¡puedes
                estar seguro/a de que tu mascota está en buenas manos! Recibirás
                actualizaciones frecuentes con fotos y mensajes de su
                cuidador/a, y podrás relajarte sabiendo que tu perro cuenta con
                los beneficios de Dog Walk en cada reserva.
              </p>

              <div className="mt-8 space-y-6">
                <FadeIn direction="right" delay={0.1}>
                  <div className="flex items-start gap-4">
                    <motion.div
                      className="flex-shrink-0"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full icon-container">
                        <img
                          src="/icons/Veterinarian.svg"
                          alt="Cobertura veterinaria"
                          className="w-50 h-50"
                        />
                      </div>
                    </motion.div>
                    <div>
                      <h3 className="mb-1 text-lg font-semibold">
                        Cobertura veterinaria
                      </h3>
                      <p className="text-gray-700">en caso de emergencia.</p>
                    </div>
                  </div>
                </FadeIn>

                <FadeIn direction="right" delay={0.2}>
                  <div className="flex items-start gap-4">
                    <motion.div
                      className="flex-shrink-0"
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full icon-container">
                        <img
                          src="/icons/ChatBubble3.svg"
                          alt="Chat de soporte y email"
                          className="w-50 h-50"
                        />
                      </div>
                    </motion.div>
                    <div>
                      <h3 className="mb-1 text-lg font-semibold">
                        Chat de soporte y email
                      </h3>
                      <p className="text-gray-700">
                        Contáctanos a través de nuestro chat o envíanos un email
                        y te ayudaremos lo antes posible
                      </p>
                    </div>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 bg-dog-green">
        <FadeIn direction="up">
          <div className="container px-4 mx-auto text-center">
            <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl font-adlam">
              ¿Estás preparado?
            </h2>
            <p className="max-w-2xl mx-auto mb-8 text-lg text-white">
              Encuentra al cuidador perfecto para tu mascota en minutos. Todos
              verificados y con reseñas de clientes reales.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
