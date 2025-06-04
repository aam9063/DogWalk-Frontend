import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { FaArrowLeft, FaShoppingCart, FaMinus, FaPlus } from 'react-icons/fa';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import articleService from '../Services/articleService';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';
import AuthPopup from '../Components/Common/AuthPopup';
import Toast from '../Components/Common/Toast';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { open: openCart, addItem } = useCartStore();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAuthPopupOpen, setIsAuthPopupOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  // Fetch del producto
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await articleService.getById(productId);
        setProduct(data);
      } catch (err) {
        console.error("Error al cargar producto:", err);
        setError("No se pudo cargar el producto solicitado.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [productId]);
  
  // Función para obtener la imagen por defecto según la categoría
  const getDefaultImageByCategory = (category) => {
    // Primero, asegurémonos de que category existe y es un string
    if (!category || typeof category !== 'string') {
      console.warn('Categoría no válida:', category);
      return '/imgs/DogWalkLogo.jpg';
    }

    // Normalizar la categoría exactamente como viene del backend
    const normalizedCategory = category.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    

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
        console.warn('Categoría no encontrada:', normalizedCategory);
        return '/imgs/DogWalkLogo.jpg';
    }
  };
  
  // Formatear el precio con 2 decimales y símbolo de euro
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };
  
  // Formatear la fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };
  
  // Obtener todas las imágenes disponibles
  const getImages = () => {
    if (!product) return [];
    
    const images = [];
    
    // Añadir la imagen principal si existe
    if (product.imagenPrincipal) {
      images.push(product.imagenPrincipal);
    }
    
    // Añadir el resto de imágenes si existen
    if (product.imagenes && Array.isArray(product.imagenes)) {
      product.imagenes.forEach(img => {
        // Añadir solo si la imagen existe y no es un string vacío
        if (img && typeof img === 'string' && img.trim() !== '' && !images.includes(img)) {
          images.push(img);
        }
      });
    }
    
    // Si no hay imágenes, usar la imagen por defecto de la categoría
    if (images.length === 0 && product.categoria) {
      images.push(getDefaultImageByCategory(product.categoria));
    }
    
    return images;
  };
  
  // Manejar cambio de cantidad
  const handleQuantityChange = (value) => {
    const newQuantity = quantity + value;
    if (newQuantity > 0 && newQuantity <= (product?.stock || 1)) {
      setQuantity(newQuantity);
    }
  };
  
  // Volver a la página anterior
  const handleGoBack = () => {
    navigate(-1);
  };
  
  // Añadir al carrito
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      setIsAuthPopupOpen(true);
      return;
    }

    try {
      setIsAddingToCart(true);
      await addItem(product.id, quantity);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      openCart();
    } catch (error) {
      console.error('Error al añadir al carrito:', error);
      alert('Error al añadir el producto al carrito');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleViewCart = () => {
    setShowToast(false);
    openCart();
  };
  
  // Cambiar imagen actual
  const handleImageChange = (index) => {
    setCurrentImageIndex(index);
  };
  
  // Renderizar spinner de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container px-4 py-16 mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 rounded-full border-t-dog-green border-r-dog-green border-b-transparent border-l-transparent animate-spin"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  // Renderizar mensaje de error
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container px-4 py-16 mx-auto">
          <div className="p-6 text-red-700 bg-red-100 rounded-lg shadow-md">
            <h2 className="mb-2 text-xl font-semibold">Error</h2>
            <p>{error || "No se pudo encontrar el producto solicitado."}</p>
            <button 
              onClick={handleGoBack}
              className="flex items-center mt-4 text-dog-green hover:underline"
            >
              <FaArrowLeft className="mr-2" /> Volver a la tienda
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  // Obtener todas las imágenes
  const images = getImages();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container px-4 py-8 mx-auto">
        {/* Botón de volver */}
        <button 
          onClick={handleGoBack}
          className="flex items-center mb-6 text-dog-green hover:underline"
        >
          <FaArrowLeft className="mr-2" /> Volver a la tienda
        </button>
        
        <div className="overflow-hidden bg-white rounded-lg shadow-md">
          <div className="grid grid-cols-1 gap-8 p-6 md:grid-cols-2">
            {/* Columna izquierda - Imágenes */}
            <div className="space-y-4">
              {/* Imagen principal */}
              <div className="relative pb-[100%] bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={images[currentImageIndex]}
                  alt={product.nombre}
                  className="absolute inset-0 object-contain w-full h-full"
                  onError={(e) => {
                    console.error('Error al cargar imagen:', images[currentImageIndex]);
                    e.target.onerror = null;
                    
                    // Intentar cargar la imagen por defecto de la categoría
                    const defaultImg = getDefaultImageByCategory(product.categoria);
                    e.target.src = defaultImg;
                    
                    // Si la imagen por defecto también falla, usar directamente el logo
                    e.target.onerror = () => {
                      console.error('Error al cargar imagen por defecto');
                      e.target.src = '/imgs/DogWalkLogo.jpg';
                    };
                  }}
                />
                
                {product.stock <= 0 && (
                  <div className="absolute px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-full top-4 right-4">
                    Agotado
                  </div>
                )}
              </div>
              
              {/* Miniaturas de imágenes */}
              {images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageChange(index)}
                      className={`w-16 h-16 rounded-md overflow-hidden border-2 ${
                        index === currentImageIndex 
                          ? 'border-dog-green' 
                          : 'border-transparent'
                      }`}
                    >
                      <img 
                        src={img} 
                        alt={`${product.nombre} ${index + 1}`}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/imgs/DogWalkLogo.jpg';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Columna derecha - Información del producto */}
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="px-3 py-1 text-sm bg-white border rounded-full border-dog-green text-dog-green">
                  {product.categoria}
                </span>
               
              </div>
              
              <h1 className="text-2xl font-bold md:text-3xl">{product.nombre}</h1>
              
              <div className="text-3xl font-bold text-dog-green">
                {formatPrice(product.precio)}
              </div>
              
              <div className="text-gray-600">
                {product.descripcion}
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-gray-600">
                    {product.stock > 0 
                      ? `${product.stock} unidades disponibles` 
                      : "No disponible"
                    }
                  </div>
                </div>
              </div>
              
              {/* Selector de cantidad y botón de compra */}
              {product.stock > 0 && (
                <div className="pt-6">
                  <div className="flex space-x-4">
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button 
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className={`px-3 py-2 ${
                          quantity <= 1 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <FaMinus size={12} />
                      </button>
                      
                      <span className="w-12 px-4 py-2 text-center">{quantity}</span>
                      
                      <button 
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= product.stock}
                        className={`px-3 py-2 ${
                          quantity >= product.stock ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <FaPlus size={12} />
                      </button>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddToCart}
                      disabled={isAddingToCart}
                      className="flex items-center justify-center flex-1 px-6 py-2 text-white rounded-md bg-dog-green hover:bg-dog-light-green disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      <FaShoppingCart className="mr-2" />
                      {isAddingToCart ? 'Añadiendo...' : 'Añadir al carrito'}
                    </motion.button>
                  </div>
                </div>
              )}
              
              {/* Mensaje de producto agotado */}
              {product.stock <= 0 && (
                <div className="pt-6">
                  <div className="p-4 text-center text-gray-600 bg-gray-100 rounded-md">
                    Este producto está temporalmente agotado.
                    <br />
                    Por favor, vuelve a consultarlo más tarde.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Información adicional */}
        <div className="p-6 mt-8 bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Información adicional</h2>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-2 font-medium">Detalles del producto</h3>
              <ul className="space-y-2 text-gray-600">
                <li><span className="font-medium">Categoría:</span> {product.categoria}</li>
                <li><span className="font-medium">Stock:</span> {product.stock} unidades</li>
                <li><span className="font-medium">Fecha de creación:</span> {formatDate(product.fechaCreacion)}</li>
                {product.fechaModificacion && (
                  <li><span className="font-medium">Última actualización:</span> {formatDate(product.fechaModificacion)}</li>
                )}
              </ul>
            </div>
            
            <div>
              <h3 className="mb-2 font-medium">Envío y devoluciones</h3>
              <p className="text-gray-600">
                Envío estándar en 2-5 días laborables. Devoluciones gratuitas dentro de los 30 días posteriores a la recepción.
                Consulta nuestra política de devoluciones para más información.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />

      {/* Auth Popup */}
      <AuthPopup
        isOpen={isAuthPopupOpen}
        onClose={() => setIsAuthPopupOpen(false)}
        message="Por favor, inicia sesión para añadir productos al carrito"
      />

      {/* Toast de confirmación */}
      <Toast
        message={`¡${product?.nombre} añadido al carrito!`}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        actionText="Ver Carrito"
        onAction={handleViewCart}
      />
    </div>
  );
};

export default ProductDetail; 