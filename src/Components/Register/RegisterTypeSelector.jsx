import React from 'react';
import { FaDog, FaUserAlt } from 'react-icons/fa';

const RegisterTypeSelector = ({ onSelectType }) => {
  return (
    <div className="max-w-md mx-auto">
      <h2 className="mb-8 text-xl font-semibold text-center">
        ¿Qué tipo de cuenta quieres crear?
      </h2>
      
      <div className="space-y-4">
        <button
          onClick={() => onSelectType('cuidador')}
          className="flex items-center justify-center w-full gap-2 px-4 py-3 text-white transition duration-300 rounded-md bg-dog-green hover:bg-dog-light-green"
        >
          <FaDog className="text-xl" />
          <span>Cuidador</span>
        </button>
        
        <button
          onClick={() => onSelectType('propietario')}
          className="flex items-center justify-center w-full gap-2 px-4 py-3 text-white transition duration-300 rounded-md bg-dog-green hover:bg-dog-light-green"
        >
          <FaUserAlt className="text-xl" />
          <span>Propietario</span>
        </button>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <a href="/login" className="text-dog-green hover:underline">
            Iniciar Sesión
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterTypeSelector; 