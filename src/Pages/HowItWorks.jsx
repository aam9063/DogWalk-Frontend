import { Link } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero section */}
      <section className="relative w-full h-[400px]">
        <div className="absolute inset-0 w-full h-full">
          <div 
            className="w-full h-full bg-cover"
            style={{ 
              backgroundImage: 'url(public/imgs/dog-3344414_1280.jpg)',
              backgroundPosition: 'center 50%',
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        
        <div className="container relative z-10 flex flex-col items-center justify-center h-full px-4 mx-auto text-center">
          <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl font-adlam">
            ¿Por qué deberías confiar en nosotros?
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
              ¿Buscas cuidadores para tu perro mientras estás de vacaciones o necesitas ayuda para pasearlo unas cuantas veces a la semana? En Dog Walk, te ayudamos a encontrar y reservar un cuidador de perros cercano y adaptado a tus necesidades.
            </p>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-12 bg-gray-100">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Left column */}
            <div className="space-y-10">
              <div>
                <h2 className="mb-4 text-2xl font-semibold">Busca en tu zona</h2>
                <p className="text-gray-700">
                  Introduce tu código postal o dirección para obtener un listado de cuidadores de confianza cerca de ti.
                </p>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 bg-black rounded-full">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4-8c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4z"></path>
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold">Cuidadores de confianza</h3>
                  <p className="text-gray-700">
                    Todos los cuidadores han sido verificados y validados por el equipo de Dog Walk.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 bg-black rounded-full">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"></path>
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold">Opiniones verificadas</h3>
                  <p className="text-gray-700">
                    Todas las reseñas provienen de usuarios de Dog Walk que han completado una reserva a través de la web o app de Dog Walk.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Right column - Image */}
            <div className="overflow-hidden rounded-lg h-80 md:h-auto">
              <img 
                src="public/imgs/pet-3635985_1280.jpg" 
                alt="Perro feliz con su cuidador" 
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact cuidadores section */}
      <section className="py-12 bg-white">
        <div className="container px-4 mx-auto">
          <div className="grid items-center grid-cols-1 gap-8 md:grid-cols-2">
            {/* Left column - Image */}
            <div className="order-2 overflow-hidden rounded-lg h-80 md:h-auto md:order-1">
              <img 
                src="public/imgs/dogs-4220163_1280.jpg" 
                alt="Perros jugando en la playa" 
                className="object-cover w-full h-full"
              />
            </div>
            
            {/* Right column */}
            <div className="order-1 md:order-2">
              <h2 className="mb-4 text-2xl font-semibold">Contacta cuidadores</h2>
              <p className="mb-4 text-gray-700">
                Contacta con hasta 5 cuidadores a través de la web o app de Dog Walk para encontrar el cuidador perfecto para ti y tu amigo canino. Conoce los detalles, comportamiento, condiciones de salud y su rutina de ejercicios. También te sugerimos negociar un encuentro previo para garantizar una buena experiencia para ambos.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Reservation section */}
      <section className="py-12 bg-gray-100">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h2 className="mb-6 text-2xl font-semibold">Reserva al mejor cuidador para ti</h2>
              <p className="mb-4 text-gray-700">
                Una vez hayas encontrado al cuidador ideal para tu perro, tendrás en marcha una solicitud de reserva para conseguir las fechas, ya sea las noches, jo por las horas durante el día que necesitas.
              </p>
              
              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-8 h-8 bg-black rounded-full">
                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-semibold">Cancelación gratuita</h3>
                    <p className="text-gray-700">
                      Cada reserva en Dog Walk incluye Cancelación Gratuita, ofreciéndote un reembolso del 100% del coste de una reserva, manteniendo flexibilidad y tranquilidad.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-8 h-8 bg-black rounded-full">
                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-semibold">Pagos seguros</h3>
                    <p className="text-gray-700">
                      Cada reserva queda confirmada a través de la web o app de Dog Walk. El dinero no se transfiere al cuidador hasta completarse el servicio, garantizando un proceso fácil y fiable.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right column - Image */}
            <div className="overflow-hidden rounded-lg h-80 md:h-auto">
              <img 
                src="public/imgs/dogs-5995508_1280.jpg" 
                alt="Propietario reservando cuidador" 
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Additional features */}
      <section className="py-12 bg-white">
        <div className="container grid grid-cols-1 gap-8 px-4 mx-auto md:grid-cols-2">
          {/* Left column - Dog sitting */}
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-dog-green">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"></path>
                </svg>
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-xl font-semibold">Relámpago</h3>
              <p className="text-gray-700">
                Tan siquiera a un día vista, si necesitas un servicio de guardería o simplemente quieres pasear a tu perro cuando no puedas hacerlo, busca nuestra función de actualizaciones frecuentes con fotos y mensajes de los cuidadores, y podrás rastrear siempre que tu perro comerá con los horarios de las comidas.
              </p>
            </div>
          </div>
          
          {/* Right column - Vet coverage */}
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-dog-green">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-1.9.9-1.9 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 16H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1zm-4.44-6.19l-2.35 3.02-1.56-1.88c-.2-.25-.58-.24-.78.01l-1.74 2.23c-.2.25-.2.61.01.86.2.25.58.24.78-.01l1.27-1.62 1.57 1.91c.2.25.57.25.78.01l2.34-3c.2-.25.2-.61-.01-.86-.22-.26-.59-.26-.79-.01z"></path>
                </svg>
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-xl font-semibold">Cobertura veterinaria</h3>
              <p className="text-gray-700">
                En caso de emergencia.
              </p>
            </div>
          </div>
          
          {/* Left column - Chat support */}
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-dog-green">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"></path>
                </svg>
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-xl font-semibold">Chat de soporte y email</h3>
              <p className="text-gray-700">
                Disponibles 7 días de la semana tanto en telefóno como en email para ayudarte.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Banner */}
      <section className="py-16 bg-dog-green">
        <div className="container px-4 mx-auto text-center">
          <h2 className="mb-8 text-3xl font-bold text-white md:text-4xl">
            Encuentra el cuidador perfecto para tu perro hoy
          </h2>
          <Link 
            to="/buscar-cuidadores" 
            className="inline-block px-8 py-3 font-medium transition-colors bg-white rounded-md text-dog-green hover:bg-gray-100"
          >
            Buscar cuidadores
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default HowItWorks; 