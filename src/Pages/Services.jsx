import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const Services = () => {
  // Estado para controlar la expansión de cada beneficio
  const [expandedBenefit, setExpandedBenefit] = useState(null);

  // Función para manejar el clic en un beneficio
  const toggleBenefit = (benefit) => {
    if (expandedBenefit === benefit) {
      setExpandedBenefit(null);
    } else {
      setExpandedBenefit(benefit);
    }
  };
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero section */}
      <section className="relative w-full h-[400px]">
        <div className="absolute inset-0 w-full h-full">
          <div 
            className="w-full h-full bg-cover"
            style={{ 
              backgroundImage: 'url(public/imgs/dogs-5282275_1280.jpg)',
              backgroundPosition: 'center 40%',
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        
        <div className="container relative z-10 flex flex-col items-center justify-center h-full px-4 mx-auto text-center">
          <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl font-adlam">
            Nuestros servicios
          </h1>
          <Link 
            to="/buscar-cuidadores" 
            className="px-8 py-3 font-medium text-white transition-colors rounded-md bg-dog-green hover:bg-dog-light-green"
          >
            Comenzar
          </Link>
        </div>
      </section>
      
      {/* Intro paragraph */}
      <section className="py-12 bg-white">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xl leading-relaxed text-gray-900 md:text-2xl font-adlam">
              ¿Buscas un cuidador para tu perro cuando te marchas de vacaciones o ayuda para cuidar de él algunas veces en semana? En Dog Walk te ayudamos a encontrar y reservar un cuidador cerca de ti.
            </p>
          </div>
        </div>
      </section>
      
      {/* Alojamiento section */}
      <section className="py-12 bg-white">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Left column - Text */}
            <div>
              <h2 className="mb-4 text-3xl font-bold text-dog-dark font-adlam">Alojamiento</h2>
              <p className="mb-8 text-lg text-gray-700">
                Tu perro se sentirá como en casa cuando lo dejes al cuidado de un cuidador en una casa particular por el cuidador, que ofrece. Nuestros cuidadores de perros se aseguran de que tu perro está cómodo y recibe paseos, juegos y cuidados. Debes hacer reserva para tu perro si necesitas ser alimentado mientras la dueña al cuidado. Precio de la guardería desde 15€ por día.
              </p>
            </div>
            
            {/* Right column - Image */}
            <div className="overflow-hidden rounded-lg h-80 md:h-auto">
              <img 
                src="public/imgs/dogs-1284238_1280.jpg" 
                alt="Perro durmiendo cómodamente" 
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Guardería section */}
      <section className="py-12 bg-gray-100">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Left column - Image (on mobile appears after text) */}
            <div className="order-2 overflow-hidden rounded-lg h-80 md:h-auto md:order-1">
              <img 
                src="public/imgs/dog-walker-9141143_1280.jpg" 
                alt="Perros en guardería de día" 
                className="object-cover w-full h-full"
              />
            </div>
            
            {/* Right column - Text */}
            <div className="order-1 md:order-2">
              <h2 className="mb-4 text-3xl font-bold text-dog-dark font-adlam">Guardería de día</h2>
              <p className="mb-8 text-lg text-gray-700">
                El servicio de guardería es durante el día, generalmente desde la mañana entre las 8 y las 9, hasta la tarde entre las 17 y las 19, pero también puede ser más corto o paseos, juegos y cuidados. Debes hacer reserva para tu perro si necesitas ser alimentado mientras la dueña al cuidado. Precio de la guardería desde 10€ por día.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Paseo section */}
      <section className="py-12 bg-white">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Left column - Text */}
            <div>
              <h2 className="mb-4 text-3xl font-bold text-dog-dark font-adlam">Paseo de perros</h2>
              <p className="mb-8 text-lg text-gray-700">
                ¿No puedes pasear a tu perro tan a menudo como te gustaría? ¡Encuentra un cuidador para que lo haga por ti cuando no tengas tiempo o te resulte imposible! Ofrecemos paseos de 30 a 60 minutos para tu perro, que incluyen cobertura veterinaria, así como servicio de recogida y entrega en tu hogar.
              </p>
            </div>
            
            {/* Right column - Image */}
            <div className="overflow-hidden rounded-lg h-80 md:h-auto">
              <img 
                src="public/imgs/three-dogs-2975649_1280.jpg" 
                alt="Cuidador paseando perros" 
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Beneficios section */}
      <section className="py-12 text-white bg-dog-green">
        <div className="container px-4 mx-auto">
          <h2 className="mb-8 text-3xl font-bold text-center md:text-4xl font-adlam">Beneficios de Dog Walk</h2>
          
          <div className="max-w-3xl mx-auto">
            {/* Beneficio 1: Cobertura Veterinaria */}
            <div className="mb-4">
              <button 
                onClick={() => toggleBenefit('veterinaria')}
                className="flex items-center justify-between w-full p-4 text-left transition-colors rounded bg-opacity-20 bg-white/10 hover:bg-white/20"
              >
                <div className="flex items-center">
                  <img src="public/icons/Veterinarian2.svg" alt="Cobertura Veterinaria" className="w-6 h-6 mr-3" />
                  <span className="text-xl font-semibold">Cobertura Veterinaria</span>
                </div>
                <span className="text-2xl">{expandedBenefit === 'veterinaria' ? '−' : '+'}</span>
              </button>
              {expandedBenefit === 'veterinaria' && (
                <div className="p-4 mt-1 rounded bg-opacity-10 bg-white/10">
                  <p>Ofrecemos cobertura veterinaria para tu mascota en caso de emergencia mientras esté bajo el cuidado de nuestros cuidadores certificados.</p>
                </div>
              )}
            </div>
            
            {/* Beneficio 2: Cancelación Gratuita */}
            <div className="mb-4">
              <button 
                onClick={() => toggleBenefit('cancelacion')}
                className="flex items-center justify-between w-full p-4 text-left transition-colors rounded bg-opacity-20 bg-white/10 hover:bg-white/20"
              >
                <div className="flex items-center">
                  <img src="public/icons/VerifiedAccount2.svg" alt="Cancelación Gratuita" className="w-6 h-6 mr-3" />
                  <span className="text-xl font-semibold">Cancelación Gratuita</span>
                </div>
                <span className="text-2xl">{expandedBenefit === 'cancelacion' ? '−' : '+'}</span>
              </button>
              {expandedBenefit === 'cancelacion' && (
                <div className="p-4 mt-1 rounded bg-opacity-10 bg-white/10">
                  <p>Puedes cancelar tu reserva sin coste adicional hasta 24 horas antes del servicio programado.</p>
                </div>
              )}
            </div>
            
            {/* Beneficio 3: Cuidadores Verificados */}
            <div className="mb-4">
              <button 
                onClick={() => toggleBenefit('verificados')}
                className="flex items-center justify-between w-full p-4 text-left transition-colors rounded bg-opacity-20 bg-white/10 hover:bg-white/20"
              >
                <div className="flex items-center">
                  <img src="public/icons/Apply2.svg" alt="Cuidadores Verificados" className="w-6 h-6 mr-3" />
                  <span className="text-xl font-semibold">Cuidadores verificados</span>
                </div>
                <span className="text-2xl">{expandedBenefit === 'verificados' ? '−' : '+'}</span>
              </button>
              {expandedBenefit === 'verificados' && (
                <div className="p-4 mt-1 rounded bg-opacity-10 bg-white/10">
                  <p>Todos nuestros cuidadores pasan por un riguroso proceso de verificación, incluyendo revisión de antecedentes y entrevistas personales.</p>
                </div>
              )}
            </div>
            
            {/* Beneficio 4: Soporte y Ayuda */}
            <div className="mb-4">
              <button 
                onClick={() => toggleBenefit('soporte')}
                className="flex items-center justify-between w-full p-4 text-left transition-colors rounded bg-opacity-20 bg-white/10 hover:bg-white/20"
              >
                <div className="flex items-center">
                  <img src="public/icons/ChatBubble2.svg" alt="Soporte y Ayuda" className="w-6 h-6 mr-3" />
                  <span className="text-xl font-semibold">Soporte y Ayuda</span>
                </div>
                <span className="text-2xl">{expandedBenefit === 'soporte' ? '−' : '+'}</span>
              </button>
              {expandedBenefit === 'soporte' && (
                <div className="p-4 mt-1 rounded bg-opacity-10 bg-white/10">
                  <p>Nuestro equipo de soporte está disponible 7 días a la semana para ayudarte con cualquier duda o problema que puedas tener.</p>
                </div>
              )}
            </div>
            
            {/* Beneficio 5: Pago Seguro */}
            <div className="mb-4">
              <button 
                onClick={() => toggleBenefit('pago')}
                className="flex items-center justify-between w-full p-4 text-left transition-colors rounded bg-opacity-20 bg-white/10 hover:bg-white/20"
              >
                <div className="flex items-center">
                  <img src="public/icons/Lock2.svg" alt="Pago Seguro" className="w-6 h-6 mr-3" />
                  <span className="text-xl font-semibold">Pago Seguro</span>
                </div>
                <span className="text-2xl">{expandedBenefit === 'pago' ? '−' : '+'}</span>
              </button>
              {expandedBenefit === 'pago' && (
                <div className="p-4 mt-1 rounded bg-opacity-10 bg-white/10">
                  <p>Todas las transacciones se realizan de forma segura a través de nuestra plataforma. El pago no se libera hasta que el servicio se haya completado satisfactoriamente.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="py-16 bg-white">
        <div className="container px-4 mx-auto text-center">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl font-adlam text-dog-dark">
            Encuentra al cuidador perfecto para tu mascota
          </h2>
          <p className="max-w-2xl mx-auto mb-8 text-lg text-gray-700">
            Miles de cuidadores verificados listos para cuidar de tu perro como si fuera suyo.
          </p>
          <Link 
            to="/buscar-cuidadores" 
            className="px-8 py-3 font-medium text-white transition-colors rounded-md bg-dog-green hover:bg-dog-light-green"
          >
            Buscar cuidadores
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Services; 