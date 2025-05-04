import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FadeIn from "../Components/FadeIn";

// Registrar plugins
gsap.registerPlugin(ScrollTrigger);

const DSADisclosure = () => {
  // Referencias para animaciones GSAP
  const introRef = useRef(null);
  const sectionsRef = useRef([]);

  useEffect(() => {
    // Animación de las secciones
    const setupSectionAnimation = (ref, index = 0) => {
      if (!ref) return;

      gsap.fromTo(
        ref,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: index * 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ref,
            start: "top 80%",
            once: true,
          },
        }
      );
    };

    // Aplicar animaciones
    setupSectionAnimation(introRef.current);
    sectionsRef.current.forEach(setupSectionAnimation);

    // Limpiar los ScrollTriggers al desmontar
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const addToRefs = (el) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="container px-4 py-10 mx-auto">
        <div className="max-w-4xl mx-auto">
          <FadeIn direction="up">
            <h1 className="mb-8 text-3xl font-bold text-center text-dog-dark font-adlam">
              Divulgación de la Ley de Servicios Digitales para residentes de la UE
            </h1>
          </FadeIn>

          <div ref={introRef} className="prose prose-lg max-w-none">
            <h2 className="mt-8 mb-4 text-2xl font-semibold">Introducción a la Ley de Servicios Digitales (DSA)</h2>
            <p>
              La Ley de Servicios Digitales (DSA) es una regulación implementada por la Unión Europea y Noruega para abordar bienes, servicios y contenidos dañinos o ilegales en línea. En Dog Walk, priorizamos la creación de un entorno seguro para cuidadores de perros, dueños de perros y sus mascotas. Como parte de nuestro compromiso con el cumplimiento de la DSA, hemos implementado diversas medidas para garantizar una experiencia en línea segura para nuestra comunidad.
            </p>

            <div ref={addToRefs}>
              <h2 className="mt-8 mb-4 text-2xl font-semibold">Asegurando la Seguridad en Dog Walk</h2>
              <p>
                Dog Walk conecta a los tutores de las mascotas con cuidadores de confianza. Nuestra plataforma prohíbe estrictamente el uso de Dog Walk para publicar o enviar contenido que sea pornográfico, amenazante, acosador, abusivo, difamatorio, incite a la violencia, viole derechos de propiedad intelectual, sea considerado spam, suplante a otros o realice actividades fraudulentas.
              </p>

              <p className="mt-4">
                Para mantener una plataforma segura, Dog Walk toma las siguientes acciones:
              </p>

              <ul className="pl-5 mt-4 space-y-3 list-disc">
                <li>
                  <strong>Facilitar el Cuidado Seguro de Mascotas:</strong> Dog Walk facilita a los tutores de mascotas encontrar un proveedor de servicios de mascotas ideal.
                </li>
                <li>
                  <strong>Política de Reseñas:</strong> Las reseñas que violen nuestra Política de Valoraciones o los Términos y Condiciones son eliminadas. Aunque generalmente no interferimos con los comentarios, cualquier reseña que se nos informe y que infrinja nuestras políticas será tratada en consecuencia.
                </li>
                <li>
                  <strong>Monitoreo Regular:</strong> Monitoreamos regularmente la actividad entre los usuarios en nuestra plataforma, investigamos informes de conductas inapropiadas y tomamos las medidas apropiadas para abordar las preocupaciones planteadas por los tutores de mascotas y los proveedores de servicios de mascotas. Esto incluye eliminar a los usuarios que violen nuestros Términos de Servicio en https://dogwalk.es/terms.
                </li>
                <li>
                  <strong>Reporte de Usuarios:</strong> Los usuarios pueden reportar otros perfiles por correo electrónico a nuestro equipo de Servicio al Cliente, que revisará la reclamación y tomará las acciones necesarias. Para reportes, por favor contáctenos en: info@dogwalk.es
                </li>
                <li>
                  <strong>Soporte al Usuario:</strong> Nuestro equipo de Confianza y Seguridad está disponible para brindar soporte y solución de problemas a los usuarios.
                </li>
                <li>
                  <strong>Centro de Ayuda:</strong> Dog Walk proporciona un centro de ayuda que educa a los usuarios sobre la plataforma y fomenta un cuidado de mascotas excelente.
                </li>
                <li>
                  <strong>Comunicación Transparente:</strong> Mantenemos una comunicación transparente con los usuarios a través de comunicaciones en la aplicación y pautas claras sobre sus obligaciones en la plataforma, como se detalla en nuestros Términos de Servicio en https://dogwalk.es/terms.
                </li>
                <li>
                  <strong>Protección de Datos:</strong> Protegemos la información financiera y personal utilizando cifrado y procesadores de pago seguros de terceros.
                </li>
              </ul>
            </div>

            <div ref={addToRefs}>
              <h3 className="mt-6 mb-3 text-xl font-semibold">Reporte de Contenido Ilegal</h3>
              <p>
                Los usuarios pueden reportar contenido ilegal a nuestro equipo de Servicio al Cliente por correo electrónico. Para reportes de contenido ilegal dentro de la UE, por favor contáctenos en: <a href="mailto:info@dogwalk.es" className="text-dog-green hover:underline">info@dogwalk.es</a>
              </p>

              <p className="mt-4 font-semibold">Formato de Reporte:</p>
              <ul className="pl-5 mt-2 space-y-2 list-disc">
                <li><strong>Asunto:</strong> Notificación de Contenido Ilegal</li>
                <li><strong>Detalles:</strong> Explicación de por qué el contenido es ilegal, la ubicación exacta (URL) y cualquier evidencia de apoyo.</li>
                <li><strong>Su Información:</strong> Incluya su nombre y correo electrónico.</li>
                <li><strong>Declaración:</strong> "Confirmo que creo de buena fe que la información y las acusaciones contenidas en esta notificación son precisas y completas."</li>
              </ul>

              <p className="mt-4">
                El uso de Dog Walk para publicar contenido que viole nuestros Términos de Servicio o abusar del procedimiento de reporte puede llevar a la suspensión o desactivación de la cuenta, como se detalla en el apartado USO DEL SERVICIO de nuestros Términos y Condiciones. Si no está de acuerdo con nuestra decisión de eliminar contenido, puede contactarnos en: <a href="mailto:info@dogwalk.es" className="text-dog-green hover:underline">info@dogwalk.es</a>
              </p>
            </div>

            <div ref={addToRefs}>
              <h2 className="mt-8 mb-4 text-2xl font-semibold">Transparencia en Dog Walk</h2>
              <p>
                A partir del 17 de febrero de 2024, las plataformas en línea están obligadas a informar información específica. A continuación se muestra la información comercial de Dog Walk para la UE:
              </p>

              <div className="p-4 mt-4 mb-4 overflow-x-auto bg-gray-100 rounded-md">
                <table className="min-w-full">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 pr-6 font-medium">Promedio de destinatarios activos mensuales en la UE (del 01 de septiembre de 2024 al 28 de febrero de 2025)</td>
                      <td className="py-2">19,199</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pr-6 font-medium">Órdenes regulatorias de los Estados miembros de la UE</td>
                      <td className="py-2">0</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-6 font-medium">Notificaciones de contenido ilegal de o sobre usuarios de la UE</td>
                      <td className="py-2">0</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>
                Los dueños de mascotas pueden buscar cuidadores, navegar por perfiles y organizar reservas en Dog Walk. Los resultados de búsqueda están personalizados según la ubicación, las preferencias, la disponibilidad, la calidad del perfil, la tasa de respuesta, el historial de reservas y las reseñas. No hay una clasificación fija para los cuidadores, y los resultados de búsqueda pueden variar para diferentes usuarios.
              </p>
            </div>

            <div ref={addToRefs}>
              <h2 className="mt-8 mb-4 text-2xl font-semibold">Usuarios Menores de 18 Años</h2>
              <p>
                Dog Walk no se dirige a usuarios menores de 18 años. Como se indica en el apartado REGLAMENTOS LOCALES de nuestros Términos y Condiciones, los usuarios deben tener al menos 18 años para usar Dog Walk. Las cuentas pueden ser limitadas, suspendidas o desactivadas según nuestra revisión, tal como se describe en nuestros Términos y Condiciones.
              </p>

              <p className="mt-6">
                Para más información, visite nuestros <Link to="/terminos-de-servicio" className="text-dog-green hover:underline">Términos de Servicio</Link> y <Link to="/politica-de-privacidad" className="text-dog-green hover:underline">Política de Privacidad</Link>.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/"
              className="inline-block px-6 py-3 font-bold text-white rounded-lg bg-dog-green hover:bg-dog-light-green"
            >
              Volver a la página principal
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DSADisclosure; 