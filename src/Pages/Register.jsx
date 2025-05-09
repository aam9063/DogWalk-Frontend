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
        </div>
      </div>
    </div>
  );
};

export default Register; 