import { create } from 'zustand';
import cartService from '../Services/cartService';

const useCartStore = create((set) => ({
  isOpen: false,
  cart: null,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  
  // Nuevas funciones para manejar el estado del carrito
  setCart: (cart) => set({ cart }),
  
  // Función para actualizar el carrito desde el servidor
  updateCart: async () => {
    try {
      const updatedCart = await cartService.getCart();
      set({ cart: updatedCart });
      return updatedCart;
    } catch (error) {
      console.error('Error al actualizar el carrito:', error);
    }
  },

  // Función para añadir un item al carrito
  addItem: async (productId, quantity) => {
    try {
      await cartService.addItem(productId, quantity);
      const updatedCart = await cartService.getCart();
      set({ cart: updatedCart });
      return updatedCart;
    } catch (error) {
      console.error('Error al añadir item al carrito:', error);
      throw error;
    }
  },

  // Función para limpiar el carrito
  clearCart: () => set({ cart: null })
}));

export default useCartStore; 