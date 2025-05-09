import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';

const AuthPopup = ({ isOpen, onClose, message }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="relative w-full max-w-md p-6 mx-4 bg-white rounded-lg shadow-xl"
          >
            {/* Botón de cerrar */}
            <button
              onClick={onClose}
              className="absolute p-2 text-gray-400 transition-colors duration-200 rounded-full hover:text-gray-600 right-2 top-2"
            >
              <FaTimes />
            </button>

            {/* Contenido */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4">
                <img src="/icons/huella (1).svg" alt="Dog Walk" className="w-full h-full text-dog-green" />
              </div>
              
              <h3 className="mb-4 text-xl font-semibold text-gray-900">
                Iniciar Sesión Requerido
              </h3>
              
              <p className="mb-6 text-gray-600">
                {message || 'Por favor, inicia sesión para acceder a esta función.'}
              </p>

              {/* Botones */}
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  to="/login"
                  className="px-6 py-2 font-medium text-white transition-colors duration-200 rounded-md bg-dog-green hover:bg-dog-light-green"
                  onClick={onClose}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 font-medium transition-colors duration-200 border rounded-md text-dog-green border-dog-green hover:bg-gray-50"
                  onClick={onClose}
                >
                  Registrarse
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthPopup; 