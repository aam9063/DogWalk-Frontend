import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import useAuthStore from '../store/authStore';

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  const verifyAuth = useAuthStore(state => state.verifyAuth);

  useEffect(() => {
    // Verificar autenticación al cargar el componente
    verifyAuth();
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/tienda');
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, verifyAuth]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container px-4 py-8 mx-auto max-w-7xl">
          <div className="max-w-2xl p-8 mx-auto text-center bg-white rounded-lg shadow-md">
            <FaCheckCircle className="w-16 h-16 mx-auto mb-6 text-green-500" />
            
            <h1 className="mb-4 text-3xl font-bold text-gray-800">
              ¡Pago completado con éxito!
            </h1>
            
            <p className="mb-6 text-gray-600">
              Gracias por tu compra. Hemos recibido tu pedido y lo procesaremos lo antes posible.
            </p>
            
            <p className="text-sm text-gray-500">
              Serás redirigido a la tienda en {countdown} segundos...
            </p>
            
            <button
              onClick={() => navigate('/tienda')}
              className="px-6 py-2 mt-6 text-white rounded-md bg-dog-green hover:bg-dog-light-green"
            >
              Volver a la tienda
            </button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CheckoutSuccess; 