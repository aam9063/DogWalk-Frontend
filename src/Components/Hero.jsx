import { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'motion/react';

const Hero = () => {
  const [searchType, setSearchType] = useState('paseo');

  return (
    <section className="relative w-full h-[500px]">
      {/* Imagen de fondo con efecto blur */}
      <div className="absolute inset-0 w-full h-full">
        <motion.div 
          initial={{ scale: 1.05, opacity: 0.9 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="w-full h-full bg-cover filter blur-[1px]"
          style={{ 
            backgroundImage: 'url(/imgs/animal-8782363_1280.webp)',
            backgroundPosition: 'center 40%',
            backgroundSize: '120%',
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-35"></div>
      </div>

      {/* Contenido superpuesto */}
      <div className="container relative z-10 h-full mx-auto">
        <div className="flex items-center justify-end h-full">
          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg"
          >
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-4 text-2xl text-center text-gray-800 font-adlam"
            >
              Encuentra al cuidador de Perros Perfecto
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-6 text-center text-gray-600"
            >
              ¿Qué servicios necesitas?
            </motion.p>
            
            {/* Opciones de servicio */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-3 gap-4 mb-6"
            >
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`flex flex-col items-center p-3 border rounded-lg ${
                  searchType === 'paseo' ? 'bg-dog-green text-white' : 'bg-gray-100 text-gray-700'
                }`}
                onClick={() => setSearchType('paseo')}
              >
                <img 
                  src="/icons/huellas-de-garras.svg" 
                  alt="Paseo de Perros" 
                  className={`w-6 h-6 mb-2 ${searchType === 'paseo' ? 'filter invert' : ''}`}
                />
                <span className="text-xs text-center">Paseo de Perros</span>
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`flex flex-col items-center p-3 border rounded-lg ${
                  searchType === 'alojamiento' ? 'bg-dog-green text-white' : 'bg-gray-100 text-gray-700'
                }`}
                onClick={() => setSearchType('alojamiento')}
              >
                <img 
                  src="/icons/Country House.svg" 
                  alt="Alojamiento en casa" 
                  className={`w-6 h-6 mb-2 ${searchType === 'alojamiento' ? 'filter invert' : ''}`}
                />
                <span className="text-xs text-center">Alojamiento en casa</span>
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`flex flex-col items-center p-3 border rounded-lg ${
                  searchType === 'guarderia' ? 'bg-dog-green text-white' : 'bg-gray-100 text-gray-700'
                }`}
                onClick={() => setSearchType('guarderia')}
              >
                <img 
                  src="/icons/Suitcase.svg" 
                  alt="Guardería durante el día" 
                  className={`w-6 h-6 mb-2 ${searchType === 'guarderia' ? 'filter invert' : ''}`}
                />
                <span className="text-xs text-center">Guardería durante el día</span>
              </motion.button>
            </motion.div>
            
            {/* Botón de búsqueda */}
            <motion.button 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileHover={{ scale: 1.02, backgroundColor: "#50a370" }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-4 py-3 text-white transition-colors rounded-md bg-dog-green"
            >
              Buscar
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 