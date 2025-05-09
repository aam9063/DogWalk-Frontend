import React from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
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

  return (
    <motion.div 
      className="flex flex-col h-full overflow-hidden bg-white rounded-lg shadow-md"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className="relative pb-[100%] overflow-hidden">
        {product.imagenPrincipal ? (
          <img
            src={product.imagenPrincipal}
            alt={product.nombre}
            className="absolute inset-0 object-cover w-full h-full"
          />
        ) : (
          <img
            src={getDefaultImageByCategory(product.categoria)}
            alt={`${product.categoria} - ${product.nombre}`}
            className="absolute inset-0 object-cover w-full h-full"
            onError={(e) => {
              // Si falla la carga de la imagen específica, muestra un fallback visual
              e.target.onerror = null;
              e.target.src = '/imgs/categories/default-product.jpg';
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
            className={`px-3 py-1 rounded-md text-white text-sm ${
              product.stock > 0 
                ? 'bg-dog-green hover:bg-dog-light-green' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            disabled={product.stock <= 0}
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
  );
};

export default ProductCard; 