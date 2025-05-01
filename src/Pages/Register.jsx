import { useState } from 'react';
import { Link } from 'react-router-dom';
import UserRegisterForm from '../Components/Register/UserRegisterForm';
import CaregiverRegisterForm from '../Components/Register/CaregiverRegisterForm';
import RegisterTypeSelector from '../Components/Register/RegisterTypeSelector';

const Register = () => {
  const [registerType, setRegisterType] = useState(null); // null, 'cuidador', 'propietario'
  const [showChatBubble, setShowChatBubble] = useState(false);

  // Función para manejar el botón de retroceso
  const handleBack = () => {
    setRegisterType(null);
  };

  // Función para mostrar/ocultar la burbuja de chat
  const toggleChatBubble = () => {
    setShowChatBubble(!showChatBubble);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col min-h-screen md:flex-row">
        {/* Columna izquierda con logo */}
        <div className="flex items-center justify-center w-full p-8 md:w-2/5 bg-dog-green">
          <div className="max-w-sm">
            <Link to="/">
              <img 
                src="/imgs/DogWalkLogo.jpg" 
                alt="Dog Walk Logo" 
                className="w-full mx-auto rounded-lg cursor-pointer"
              />
            </Link>
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
          <div className="fixed z-10 bottom-4 right-4 md:bottom-10 md:right-10">
            {/* En móviles, el mensaje solo se muestra si showChatBubble es true */}
            {(showChatBubble || window.innerWidth >= 768) && (
              <div className="max-w-[200px] md:max-w-xs p-3 md:p-4 mb-2 md:mb-4 bg-white border border-gray-200 rounded-lg shadow-md">
                <p className="text-xs text-center md:text-sm">
                  Hola y Bienvenido a Dog Walk App
                  <br />
                  ¿En qué te puedo ayudar?
                </p>
              </div>
            )}
            <div className="flex justify-end">
              <button 
                onClick={toggleChatBubble} 
                className="flex items-center justify-center w-10 h-10 p-2 text-xl text-white rounded-full md:w-12 md:h-12 md:p-3 md:text-2xl bg-dog-green focus:outline-none"
              >
                <span role="img" aria-label="Asistente">🐶</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 