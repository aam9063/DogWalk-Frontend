import { Link, useNavigate } from 'react-router-dom';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GSAPAnimation from './GSAPAnimation';

// Registrar plugins
gsap.registerPlugin(ScrollTrigger);

// Componente de enlace con smooth scroll para navegación interna
const SmoothScrollLink = ({ to, className, children, onClick }) => {
  const navigate = useNavigate();
  
  const handleClick = (e) => {
    // Si es una navegación interna dentro de la misma página (comienza con #)
    if (to.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(to);
      if (element) {
        window.scrollTo({
          top: element.offsetTop - 80, // 80px de offset para considerar la altura de la navbar
          behavior: 'smooth'
        });
      }
      // Ejecutar onClick adicional si se proporciona
      if (onClick) onClick();
    } 
    // Si es una navegación a otra página con un hash
    else if (to.includes('#')) {
      e.preventDefault();
      const [path, hash] = to.split('#');
      navigate(path);
      // Establecer un breve timeout para permitir que la nueva página se cargue
      setTimeout(() => {
        const element = document.querySelector(`#${hash}`);
        if (element) {
          window.scrollTo({
            top: element.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      }, 100);
      // Ejecutar onClick adicional si se proporciona
      if (onClick) onClick();
    } 
    // Para navegación normal a otras páginas
    else if (onClick) {
      onClick();
    }
  };

  return (
    <motion.div
      whileHover={{ x: 3 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={to} className={className} onClick={handleClick}>
        {children}
      </Link>
    </motion.div>
  );
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-12 text-white bg-dog-dark">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-3">
          {/* Servicios */}
          <GSAPAnimation type="stagger" trigger="self" staggerAmount={0.05}>
            <div>
              <h3 className="mb-4 text-xl font-bold">Servicios</h3>
              <ul className="space-y-2">
                <li>
                  <SmoothScrollLink to="/como-funciona" className="text-gray-300 hover:text-white">Cómo funciona</SmoothScrollLink>
                </li>
                <li>
                  <SmoothScrollLink to="/sobre-dog-walk" className="text-gray-300 hover:text-white">Sobre Dog Walk</SmoothScrollLink>
                </li>
                <li>
                  <SmoothScrollLink to="/opiniones" className="text-gray-300 hover:text-white">Opiniones</SmoothScrollLink>
                </li>
                <li>
                  <SmoothScrollLink to="/cobertura-veterinaria" className="text-gray-300 hover:text-white">Cobertura Veterinaria</SmoothScrollLink>
                </li>
                <li>
                  <SmoothScrollLink to="/register" className="text-gray-300 hover:text-white">Hazte Cuidador</SmoothScrollLink>
                </li>
                <li>
                  <SmoothScrollLink to="/tienda" className="text-gray-300 hover:text-white">Tienda</SmoothScrollLink>
                </li>
                <li>
                  <SmoothScrollLink to="/ayuda" className="text-gray-300 hover:text-white">Ayuda</SmoothScrollLink>
                </li>
                <li>
                  <SmoothScrollLink to="/contacto" className="text-gray-300 hover:text-white">Contacto</SmoothScrollLink>
                </li>
              </ul>
            </div>
          </GSAPAnimation>
          
          {/* Términos y Condiciones */}
          <GSAPAnimation type="stagger" trigger="self" staggerAmount={0.05} delay={0.2}>
            <div>
              <h3 className="mb-4 text-xl font-bold">Términos y Condiciones</h3>
              <ul className="space-y-2">
                <li>
                  <SmoothScrollLink to="/politica-de-privacidad" className="text-gray-300 hover:text-white">Política de Privacidad</SmoothScrollLink>
                </li>
                <li>
                  <SmoothScrollLink to="/ley-de-servicios-digitales" className="text-gray-300 hover:text-white">Ley de Servicios Digitales (DSA)</SmoothScrollLink>
                </li>
              </ul>
            </div>
          </GSAPAnimation>
          
          {/* Guardería de Día */}
          <GSAPAnimation type="stagger" trigger="self" staggerAmount={0.05} delay={0.4}>
            <div>
              <h3 className="mb-4 text-xl font-bold">Guardería de Día</h3>
              <ul className="space-y-2">
                <li>
                  <SmoothScrollLink to="/paseo-de-perros" className="text-gray-300 hover:text-white">Paseo de Perros</SmoothScrollLink>
                </li>
                <li>
                  <SmoothScrollLink to="/alojamiento-para-perros" className="text-gray-300 hover:text-white">Alojamiento para perros</SmoothScrollLink>
                </li>
              </ul>
            </div>
          </GSAPAnimation>
        </div>
        
        {/* Social Media y Copyright */}
        <div className="pt-8 border-t border-gray-700">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-4 md:mb-0">
              <div>
                <Link to="/" className="flex items-center text-xl text-white font-adlam">
                  <img src="/icons/Pet Commands Summon.svg" alt="Dog Walk Logo" className="w-8 h-8 mr-2" />
                  Dog Walk
                </Link>
              </div>
            </div>
            <div className="flex mb-4 space-x-4 md:mb-0">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 transition-colors hover:text-white">
                <div>
                  <FaXTwitter className="w-6 h-6" />
                </div>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 transition-colors hover:text-white">
                <div>
                  <FaFacebook className="w-6 h-6" />
                </div>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 transition-colors hover:text-white">
                <div>
                  <FaInstagram className="w-6 h-6" />
                </div>
              </a>
            </div>
            <div className="text-sm text-gray-400">
              © {currentYear} Dog Walk
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 