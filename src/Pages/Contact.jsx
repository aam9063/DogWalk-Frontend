
import { useState, useEffect, useRef } from "react";
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

const Contact = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "",
    mensaje: "",
  });
  
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Referencias para animaciones GSAP
  const contactInfoRef = useRef(null);
  const formRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
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
    setupSectionAnimation(contactInfoRef, "left");
    setupSectionAnimation(formRef, "right");
    setupSectionAnimation(mapRef, "up");

    // Limpiar los ScrollTriggers al desmontar
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Simulación de envío (aquí se integraría con un servicio real)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Datos enviados:", formData);
      setEnviado(true);
      setFormData({
        nombre: "",
        email: "",
        telefono: "",
        asunto: "",
        mensaje: "",
      });
    } catch (err) {
      console.error("Error al enviar:", err);
      setError("Error al enviar el formulario. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero section */}
      <section className="relative w-full h-[300px]">
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
              backgroundPosition: "center 40%",
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </motion.div>

        <div className="container relative z-10 flex flex-col items-center justify-center h-full px-4 mx-auto text-center">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl font-adlam">
            Contacto
          </h1>
          <p className="max-w-2xl text-lg text-white">
            Estamos aquí para ayudarte. Ponte en contacto con nosotros y responderemos a la brevedad posible.
          </p>
        </div>
      </section>

      {/* Sección de información de contacto y formulario */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            
            {/* Información de contacto */}
            <div ref={contactInfoRef} className="space-y-8">
              <FadeIn direction="left">
                <div>
                  <h2 className="mb-6 text-3xl font-semibold">Datos de contacto</h2>
                  <p className="mb-8 text-gray-700">
                    Nos encantaría escuchar de ti. Contacta con nosotros a través de cualquiera de los siguientes medios:
                  </p>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full icon-container bg-dog-green">
                          <img 
                            src="/icons/Location.svg" 
                            alt="Dirección" 
                            className="w-6 h-6"
                            style={{ filter: 'brightness(0) invert(1)' }}
                          />
                        </div>
                      </div>
                      <div>
                        <h3 className="mb-1 text-lg font-semibold">Dirección</h3>
                        <p className="text-gray-700">
                          Calle San Salvador, 17 PBJ 8<br />
                          03005 Alicante, España
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full icon-container bg-dog-green">
                          <img 
                            src="/icons/ChatBubble3.svg" 
                            alt="Email" 
                            className="w-6 h-6"
                            style={{ filter: 'brightness(0) invert(1)' }}
                          />
                        </div>
                      </div>
                      <div>
                        <h3 className="mb-1 text-lg font-semibold">Email</h3>
                        <p className="text-gray-700">
                          info@dogwalk.es<br />
                          soporte@dogwalk.es
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full icon-container bg-dog-green">
                          <img 
                            src="/icons/Clock.svg" 
                            alt="Horario" 
                            className="w-6 h-6"
                            style={{ filter: 'brightness(0) invert(1)' }}
                          />
                        </div>
                      </div>
                      <div>
                        <h3 className="mb-1 text-lg font-semibold">Horario de atención</h3>
                        <p className="text-gray-700">
                          Lunes a Viernes: 9:00 - 20:00<br />
                          Sábados: 10:00 - 14:00
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full icon-container bg-dog-green">
                          <img 
                            src="/icons/chat-comment-oval-speech-bubble-with-text-lines_icon-icons.com_73302.svg" 
                            alt="Teléfono" 
                            className="w-6 h-6"
                            style={{ filter: 'brightness(0) invert(1)' }}
                          />
                        </div>
                      </div>
                      <div>
                        <h3 className="mb-1 text-lg font-semibold">Teléfono</h3>
                        <p className="text-gray-700">
                          +34 966 123 456<br />
                          +34 600 123 456
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>

              <FadeIn direction="left" delay={0.3}>
                <div className="mt-10">
                  <h3 className="mb-4 text-xl font-semibold">Síguenos en redes sociales</h3>
                  <div className="flex space-x-4">
                    <motion.a 
                      href="https://facebook.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center justify-center w-12 h-12 text-white rounded-full bg-dog-green"
                    >
                      <img 
                        src="/icons/Facebook.svg" 
                        alt="Facebook" 
                        className="w-6 h-6"
                        style={{ filter: 'brightness(0) invert(1)' }}
                      />
                    </motion.a>
                    <motion.a 
                      href="https://instagram.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center justify-center w-12 h-12 text-white rounded-full bg-dog-green"
                    >
                      <img 
                        src="/icons/Instagram.svg" 
                        alt="Instagram" 
                        className="w-6 h-6"
                        style={{ filter: 'brightness(0) invert(1)' }}
                      />
                    </motion.a>
                    <motion.a 
                      href="https://twitter.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center justify-center w-12 h-12 text-white rounded-full bg-dog-green"
                    >
                      <img 
                        src="/icons/TwitterX.svg" 
                        alt="Twitter" 
                        className="w-6 h-6"
                        style={{ filter: 'brightness(0) invert(1)' }}
                      />
                    </motion.a>
                  </div>
                </div>
              </FadeIn>
            </div>
            
            {/* Formulario de contacto */}
            <div ref={formRef}>
              <FadeIn direction="right">
                <div className="p-6 bg-white rounded-lg shadow-lg">
                  <h2 className="mb-6 text-2xl font-semibold">Envíanos un mensaje</h2>
                  
                  {enviado ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 text-center text-green-700 bg-green-100 rounded-md"
                    >
                      <h3 className="mb-2 text-xl font-medium">¡Mensaje enviado!</h3>
                      <p>Gracias por contactarnos. Te responderemos lo antes posible.</p>
                      <button 
                        onClick={() => setEnviado(false)}
                        className="px-4 py-2 mt-4 text-white rounded-md bg-dog-green hover:bg-dog-light-green"
                      >
                        Enviar otro mensaje
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {error && (
                        <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-md">
                          {error}
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label htmlFor="nombre" className="block mb-1 text-sm font-medium text-gray-700">
                            Nombre completo *
                          </label>
                          <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-dog-green"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                            Email *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-dog-green"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label htmlFor="telefono" className="block mb-1 text-sm font-medium text-gray-700">
                            Teléfono
                          </label>
                          <input
                            type="tel"
                            id="telefono"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-dog-green"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="asunto" className="block mb-1 text-sm font-medium text-gray-700">
                            Asunto *
                          </label>
                          <input
                            type="text"
                            id="asunto"
                            name="asunto"
                            value={formData.asunto}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-dog-green"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="mensaje" className="block mb-1 text-sm font-medium text-gray-700">
                          Mensaje *
                        </label>
                        <textarea
                          id="mensaje"
                          name="mensaje"
                          rows="5"
                          value={formData.mensaje}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-dog-green"
                        ></textarea>
                      </div>
                      
                      <div>
                        <motion.button
                          type="submit"
                          className="w-full px-4 py-3 text-white rounded-md bg-dog-green hover:bg-dog-light-green"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          disabled={loading}
                        >
                          {loading ? "Enviando..." : "Enviar mensaje"}
                        </motion.button>
                      </div>
                      
                      <p className="text-xs text-gray-500">
                        Los campos marcados con * son obligatorios. Tu información será tratada conforme a nuestra 
                        <Link to="/politica-de-privacidad" className="ml-1 text-dog-green hover:underline">
                          Política de Privacidad
                        </Link>.
                      </p>
                    </form>
                  )}
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Mapa y ubicación */}
      <section ref={mapRef} className="py-12 bg-gray-100">
        <div className="container px-4 mx-auto">
          <FadeIn direction="up">
            <h2 className="mb-8 text-3xl font-semibold text-center">Nuestra ubicación</h2>
            <div className="overflow-hidden rounded-lg h-96">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.7749001292855!2d-3.698196224416827!3d40.416889971351025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd42287d02537da3%3A0x867e1118a6c7487b!2sPuerta%20del%20Sol%2C%20Madrid!5e0!3m2!1ses!2ses!4v1693404182548!5m2!1ses!2ses"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Dog Walk"
              ></iframe>
            </div>
          </FadeIn>
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

export default Contact; 