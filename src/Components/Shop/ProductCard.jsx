import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import useAuthStore from '../../store/authStore';
import cartService from '../../Services/cartService';
import AuthPopup from '../Common/AuthPopup';
import Toast from '../Common/Toast';

const ProductCard = ({ product, onCartUpdate }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [isAuthPopupOpen, setIsAuthPopupOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  // Formatear el precio con 2 decimales y símbolo de euro
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  // Obtener imagen por defecto según la categoría
  const getDefaultImageByCategory = (category) => {
    // Convertir a minúsculas y eliminar acentos para una comparación más robusta
    const normalizedCategory = category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    switch (normalizedCategory) {
      case 'juguete':
        return '/imgs/juguete.jpg';
      case 'alimentacion':
        return '/imgs/alimentación.jpg';
      case 'snack':
        return '/imgs/snacks.jpg';
      case 'accesorio':
        return '/imgs/accesorio.jpg';
      case 'higiene':
        return '/imgs/higiene.jpg';
      case 'salud':
        return '/imgs/vet.jpg';
      case 'ropa':
        return '/imgs/ropa.png';
      default:
        return '/imgs/DogWalkLogo.jpg';
    }
  };

  // Función para navegar a la página de detalle del producto
  const handleNavigateToProduct = () => {
    navigate(`/tienda/producto/${product.id}`);
  };

  // Función para añadir al carrito
  const handleAddToCart = async (e) => {
    e.stopPropagation(); // Evita que se propague al padre (navegación)
    
    if (!isAuthenticated) {
      setIsAuthPopupOpen(true);
      return;
    }

    try {
      await cartService.addItem(product.id, 1);
      if (onCartUpdate) {
        onCartUpdate();
      }
      setShowToast(true);
      // Cerrar el toast después de 5 segundos
      setTimeout(() => setShowToast(false), 5000);
    } catch (error) {
      console.error('Error al añadir al carrito:', error);
      alert('Error al añadir el producto al carrito');
    }
  };

  const handleViewCart = (e) => {
    e.stopPropagation();
    setShowToast(false);
    // Aquí disparamos el evento para abrir el carrito
    if (onCartUpdate) {
      onCartUpdate(true); // Pasamos true para indicar que queremos abrir el carrito
    }
  };

  return (
    <>
      <motion.div 
        className="flex flex-col h-full overflow-hidden bg-white rounded-lg shadow-md cursor-pointer"
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        onClick={handleNavigateToProduct}
      >
        <div className="relative pb-[100%] overflow-hidden">
          {product.imagenPrincipal && product.imagenPrincipal.trim() !== '' ? (
            <img
              src={product.imagenPrincipal}
              alt={product.nombre}
              className="absolute inset-0 object-cover w-full h-full"
              onError={(e) => {
                console.log('Error al cargar la imagen principal:', product.imagenPrincipal);
                e.target.onerror = null;
                e.target.src = getDefaultImageByCategory(product.categoria);
              }}
            />
          ) : (
            <img
              src={getDefaultImageByCategory(product.categoria)}
              alt={`${product.categoria} - ${product.nombre}`}
              className="absolute inset-0 object-cover w-full h-full"
              onError={(e) => {
                // Si falla la carga de la imagen específica, muestra un fallback visual
                console.log('Error al cargar la imagen de categoría, usando fallback');
                e.target.onerror = null;
                e.target.src = '/imgs/DogWalkLogo.jpg';
              }}
            />
          )}
          
          {product.stock <= 0 && (
            <div className="absolute top-0 right-0 px-2 py-1 text-xs text-white bg-red-500">
              Agotado
            </div>
          )}
        </div>
        
        <div className="flex flex-col flex-grow p-4">
          <div className="mb-1 text-sm font-medium text-dog-green">
            {product.categoria}
          </div>
          
          <h3 className="mb-2 font-semibold text-md">{product.nombre}</h3>
          
          <div className="flex-grow mb-3 text-sm text-gray-600 line-clamp-2">
            {product.descripcion}
          </div>
          
          <div className="flex items-center justify-between mt-auto">
            <div className="text-lg font-bold text-dog-green">
              {formatPrice(product.precio)}
            </div>
            
            <button 
              className={`px-3 py-1 text-white text-sm rounded-md ${
                product.stock > 0 
                  ? 'bg-dog-green hover:bg-dog-light-green' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
              disabled={product.stock <= 0}
              onClick={handleAddToCart}
            >
              Añadir
            </button>
          </div>
          
          <div className="mt-2 text-xs text-gray-500">
            {product.stock > 0 
              ? `${product.stock} unidades disponibles` 
              : "No disponible"
            }
          </div>
        </div>
      </motion.div>

      {/* Auth Popup */}
      <AuthPopup
        isOpen={isAuthPopupOpen}
        onClose={() => setIsAuthPopupOpen(false)}
        message="Por favor, inicia sesión para añadir productos al carrito"
      />

      {/* Toast de confirmación */}
      <Toast
        message={`¡${product.nombre} añadido al carrito!`}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        actionText="Ver Carrito"
        onAction={handleViewCart}
      />
    </>
  );
};

export default ProductCard; 