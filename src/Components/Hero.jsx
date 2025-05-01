import { useState } from 'react';

const Hero = () => {
  const [searchType, setSearchType] = useState('paseo');

  return (
    <section className="relative w-full h-[500px]">
      {/* Imagen de fondo con efecto blur */}
      <div className="absolute inset-0 w-full h-full">
        <div 
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
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
            <h1 className="mb-4 text-2xl text-center text-gray-800 font-adlam">
              Encuentra al cuidador de Perros Perfecto
            </h1>
            <p className="mb-6 text-center text-gray-600">¿Qué servicios necesitas?</p>
            
            {/* Opciones de servicio */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <button 
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
              </button>
              
              <button 
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
              </button>
              
              <button 
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
              </button>
            </div>
            
            {/* Botón de búsqueda */}
            <button className="w-full px-4 py-3 text-white transition-colors rounded-md bg-dog-green hover:bg-dog-light-green">
              Buscar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 