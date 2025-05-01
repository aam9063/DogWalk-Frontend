import { useState } from 'react';
import { Link } from 'react-router-dom';
import UserRegisterForm from '../Components/Register/UserRegisterForm';
import CaregiverRegisterForm from '../Components/Register/CaregiverRegisterForm';
import RegisterTypeSelector from '../Components/Register/RegisterTypeSelector';

const Register = () => {
  const [registerType, setRegisterType] = useState(null); // null, 'cuidador', 'propietario'

  // Función para manejar el botón de retroceso
  const handleBack = () => {
    setRegisterType(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col min-h-screen md:flex-row">
        {/* Columna izquierda con logo */}
        <div className="flex items-center justify-center w-full p-8 md:w-2/5 bg-dog-green">
          <div className="max-w-sm">
            <img 
              src="/imgs/DogWalkLogo.jpg" 
              alt="Dog Walk Logo" 
              className="w-full mx-auto rounded-lg"
            />
          </div>
        </div>
        
        {/* Columna derecha con formulario */}
        <div className="flex flex-col justify-center w-full p-8 md:w-3/5">
          <h1 className="mb-8 text-3xl text-center font-adlam">
            Bienvenido a Dog Walk App
          </h1>
          
          {registerType === null ? (
            <RegisterTypeSelector onSelectType={setRegisterType} />
          ) : registerType === 'propietario' ? (
            <UserRegisterForm onBack={handleBack} />
          ) : (
            <CaregiverRegisterForm onBack={handleBack} />
          )}
          
          {/* Burbuja de chat del asistente virtual */}
          <div className="fixed bottom-10 right-10">
            <div className="max-w-xs p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-md">
              <p className="text-sm text-center">
                Hola y Bienvenido a Dog Walk App
                <br />
                ¿En qué te puedo ayudar?
              </p>
            </div>
            <div className="flex justify-end">
              <div className="flex items-center justify-center w-12 h-12 p-3 text-2xl text-white rounded-full bg-dog-green">
                <span role="img" aria-label="Asistente">🐶</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 