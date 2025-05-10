import React, { useState } from 'react';
// eslint-disable-next-line
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaTrash, FaPlus, FaMinus, FaShoppingBag } from 'react-icons/fa';
import cartService from '../../Services/cartService';
import checkoutService from '../../Services/checkoutService';
import useCartStore from '../../store/cartStore';

const CartDrawer = ({ cart, onCartUpdate }) => {
  const { isOpen, close } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpdateQuantity = async (itemId, currentQuantity, increment) => {
    try {
      const newQuantity = currentQuantity + (increment ? 1 : -1);
      if (newQuantity < 0) return;
      
      await cartService.updateItemQuantity(itemId, newQuantity);
      onCartUpdate();
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await cartService.removeItem(itemId);
      onCartUpdate();
    } catch (error) {
      console.error('Error al eliminar item:', error);
    }
  };

  const handleClearCart = async () => {
    try {
      await cartService.clearCart();
      onCartUpdate();
    } catch (error) {
      console.error('Error al vaciar el carrito:', error);
    }
  };

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      const response = await checkoutService.createCheckoutSession();
      
      if (response.success && response.redirectUrl) {
        window.location.href = response.redirectUrl;
      }
    } catch (error) {
      console.error('Error al procesar el checkout:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-40 bg-black"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween' }}
            className="fixed top-0 right-0 z-50 w-full h-full max-w-md bg-white shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Carrito de Compra</h2>
              <button
                onClick={close}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex flex-col h-full overflow-hidden">
              <div className="flex-1 p-4 overflow-y-auto">
                {cart?.items?.length > 0 ? (
                  <div className="space-y-4">
                    {cart.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center p-4 bg-white border rounded-lg shadow-sm"
                      >
                        <div className="relative w-20 h-20 overflow-hidden rounded">
                          <img
                            src={item.imagenUrl || '/imgs/DogWalkLogo.jpg'}
                            alt={item.nombreArticulo}
                            className="absolute inset-0 object-cover w-full h-full"
                          />
                        </div>
                        <div className="flex-1 ml-4">
                          <h3 className="font-medium">{item.nombreArticulo}</h3>
                          <p className="text-sm text-gray-500">
                            {new Intl.NumberFormat('es-ES', {
                              style: 'currency',
                              currency: 'EUR'
                            }).format(item.precioUnitario)}
                          </p>
                          <div className="flex items-center mt-2 space-x-2">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.cantidad, false)}
                              className="p-1 text-gray-500 border rounded hover:bg-gray-100"
                            >
                              <FaMinus size={12} />
                            </button>
                            <span className="px-2">{item.cantidad}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.cantidad, true)}
                              className="p-1 text-gray-500 border rounded hover:bg-gray-100"
                            >
                              <FaPlus size={12} />
                            </button>
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="p-1 ml-2 text-red-500 border border-red-500 rounded hover:bg-red-50"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        </div>
                        <div className="ml-4 text-right">
                          <p className="font-medium text-dog-green">
                            {new Intl.NumberFormat('es-ES', {
                              style: 'currency',
                              currency: 'EUR'
                            }).format(item.subtotal)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <p>Tu carrito está vacío</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              {cart?.items?.length > 0 && (
                <div className="p-4 pb-6 border-t bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-medium">Total</span>
                    <span className="text-xl font-bold text-dog-green">
                      {new Intl.NumberFormat('es-ES', {
                        style: 'currency',
                        currency: 'EUR'
                      }).format(cart.total)}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <button
                      onClick={handleCheckout}
                      disabled={isProcessing}
                      className="flex items-center justify-center w-full px-4 py-3 text-white rounded-md bg-dog-green hover:bg-dog-light-green disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <span>Procesando...</span>
                      ) : (
                        <>
                          <FaShoppingBag className="mr-2" />
                          Comprar Ahora
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleClearCart}
                      className="flex items-center justify-center w-full px-4 py-2 text-sm text-gray-500 hover:text-red-500"
                    >
                      <FaTrash className="mr-2 text-sm" />
                      Vaciar carrito
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer; 