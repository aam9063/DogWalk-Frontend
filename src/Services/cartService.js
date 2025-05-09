import { fetcher } from './api';

const cartService = {
  // Obtener el carrito actual
  getCart: async () => {
    try {
      const response = await fetcher('/api/Carrito', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response;
    } catch (error) {
      console.error('Error al obtener el carrito:', error);
      throw error;
    }
  },

  // Agregar item al carrito
  addItem: async (articuloId, cantidad = 1) => {
    try {
      const response = await fetcher('/api/Carrito/agregar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          articuloId,
          cantidad
        })
      });
      return response;
    } catch (error) {
      console.error('Error al agregar item:', error);
      throw error;
    }
  },

  // Actualizar cantidad de un item
  updateItemQuantity: async (itemCarritoId, cantidad) => {
    try {
      const response = await fetcher('/api/Carrito/actualizar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          itemCarritoId,
          cantidad
        })
      });
      return response;
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
      throw error;
    }
  },

  // Eliminar un item del carrito
  removeItem: async (itemCarritoId) => {
    try {
      await fetcher(`/api/Carrito/eliminar/${itemCarritoId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error al eliminar item:', error);
      throw error;
    }
  },

  // Vaciar el carrito
  clearCart: async () => {
    try {
      await fetcher('/api/Carrito/vaciar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error al vaciar el carrito:', error);
      throw error;
    }
  }
};

export default cartService; 