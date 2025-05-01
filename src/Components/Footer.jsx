import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-12 text-white bg-dog-dark">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-3">
          {/* Servicios */}
          <div>
            <h3 className="mb-4 text-xl font-bold">Servicios</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/como-funciona" className="text-gray-300 hover:text-white">Cómo funciona</Link>
              </li>
              <li>
                <Link to="/sobre-dog-walk" className="text-gray-300 hover:text-white">Sobre Dog Walk</Link>
              </li>
              <li>
                <Link to="/opiniones" className="text-gray-300 hover:text-white">Opiniones</Link>
              </li>
              <li>
                <Link to="/cobertura-veterinaria" className="text-gray-300 hover:text-white">Cobertura Veterinaria</Link>
              </li>
              <li>
                <Link to="/hazte-cuidador" className="text-gray-300 hover:text-white">Hazte Cuidador</Link>
              </li>
              <li>
                <Link to="/tienda" className="text-gray-300 hover:text-white">Tienda</Link>
              </li>
              <li>
                <Link to="/ayuda" className="text-gray-300 hover:text-white">Ayuda</Link>
              </li>
              <li>
                <Link to="/contacto" className="text-gray-300 hover:text-white">Contacto</Link>
              </li>
            </ul>
          </div>
          
          {/* Términos y Condiciones */}
          <div>
            <h3 className="mb-4 text-xl font-bold">Términos y Condiciones</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/politica-de-privacidad" className="text-gray-300 hover:text-white">Política de Privacidad</Link>
              </li>
              <li>
                <Link to="/ley-de-servicios-digitales" className="text-gray-300 hover:text-white">Ley de Servicios Digitales (DSA)</Link>
              </li>
            </ul>
          </div>
          
          {/* Guardería de Día */}
          <div>
            <h3 className="mb-4 text-xl font-bold">Guardería de Día</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/paseo-de-perros" className="text-gray-300 hover:text-white">Paseo de Perros</Link>
              </li>
              <li>
                <Link to="/alojamiento-para-perros" className="text-gray-300 hover:text-white">Alojamiento para perros</Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Social Media y Copyright */}
        <div className="flex flex-col items-center justify-between pt-8 border-t border-gray-700 md:flex-row">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="flex items-center text-xl text-white font-adlam">
              <img src="/icons/Pet Commands Summon.svg" alt="Dog Walk Logo" className="w-8 h-8 mr-2" />
              Dog Walk
            </Link>
          </div>
          <div className="flex mb-4 space-x-4 md:mb-0">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
              <FaXTwitter className="w-6 h-6" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
              <FaFacebook className="w-6 h-6" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
              <FaInstagram className="w-6 h-6" />
            </a>
          </div>
          <div className="text-sm text-gray-400">
            © {currentYear} Dog Walk
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 