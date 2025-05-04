import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'motion/react';
import { FaTimes } from 'react-icons/fa';

const ChatAssistant = () => {
  const [showMessage, setShowMessage] = useState(false);
  
  // Mostrar el mensaje después de 4 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 4000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const closeMessage = () => {
    setShowMessage(false);
  };
  
  return (
    <div className="fixed z-40 bottom-6 right-6 md:bottom-10 md:right-10">
      {/* Mensaje de burbuja */}
      <AnimatePresence>
        {showMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="max-w-[200px] md:max-w-xs p-3 md:p-4 mb-3 md:mb-4 bg-white border border-gray-200 rounded-lg shadow-md"
          >
            <div className="flex items-start justify-between">
              <p className="text-xs text-left md:text-sm">
                Hola y Bienvenido a Dog Walk App
                <br />
                ¿En qué te puedo ayudar?
              </p>
              <button 
                onClick={closeMessage}
                className="ml-2 text-gray-400 transition-colors hover:text-gray-600"
              >
                <FaTimes size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Botón del asistente */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="flex items-center justify-center w-12 h-12 p-2 text-xl text-white rounded-full shadow-md md:w-14 md:h-14 md:p-3 md:text-2xl bg-dog-green focus:outline-none"
      >
        <span role="img" aria-label="Asistente">🐶</span>
      </motion.button>
    </div>
  );
};

export default ChatAssistant; 