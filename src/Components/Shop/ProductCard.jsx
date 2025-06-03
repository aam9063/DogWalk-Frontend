import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';
import AuthPopup from '../Common/AuthPopup';
import Toast from '../Common/Toast';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { addItem, open: openCart } = useCartStore();
  const [isAuthPopupOpen, setIsAuthPopupOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState(null);
  
  // Formatear el precio con 2 decimales y símbolo de euro
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  // Obtener imagen por defecto según la categoría
  const getDefaultImageByCategory = (category) => {
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

  // Función para añadir al carrito actualizada
  const handleAddToCart = async (e) => {
    e.stopPropagation(); // Evita que se propague al padre (navegación)
    
    if (!isAuthenticated) {
      setIsAuthPopupOpen(true);
      return;
    }

    try {
      await addItem(product.id, 1);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    } catch (error) {
      console.error('Error al añadir al carrito:', error);
      setError('No se pudo añadir el producto al carrito. Por favor, inténtalo de nuevo.');
      setTimeout(() => setError(null), 5000); // Limpiar el error después de 5 segundos
    }
  };

  const handleViewCart = (e) => {
    e.stopPropagation();
    setShowToast(false);
    openCart(); // Usamos la función del store para abrir el carrito
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

        {/* Añadimos mensaje de error */}
        {error && (
          <div className="absolute top-0 left-0 right-0 p-2 text-sm text-white bg-red-500">
            {error}
          </div>
        )}
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