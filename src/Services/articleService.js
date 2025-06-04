import { fetcher, sendRequest } from './api';

const articleService = {
  // Obtener todos los artículos con opciones de filtrado y paginación
  getAll: async (options = {}) => {
    // Construir la query string con las opciones
    const queryParams = new URLSearchParams();
    
    // Paginación
    if (options.pageNumber) queryParams.append('pageNumber', options.pageNumber);
    if (options.pageSize) queryParams.append('pageSize', options.pageSize);
    
    // Filtrado
    if (options.searchTerm) queryParams.append('searchTerm', options.searchTerm);
    if (options.sortBy) queryParams.append('sortBy', options.sortBy);
    if (options.ascending !== undefined) queryParams.append('ascending', options.ascending);
    
    // Filtrado por categoría
    if (options.categoria !== undefined) {
      queryParams.append('categoria', options.categoria);
    }
    
    const queryString = queryParams.toString();
    try {
      const response = await fetcher(`/api/Articulo${queryString ? `?${queryString}` : ''}`);
      return response;
    } catch (error) {
      console.error("Error al obtener artículos:", error);
      throw error;
    }
  },
  
  // Obtener un artículo por ID
  getById: async (id) => {
    try {
      const response = await fetcher(`/api/Articulo/${id}`);
      
      // Procesar la respuesta para asegurarnos de que las imágenes son correctas
      if (response) {
        // Asegurar que el campo imagenes sea siempre un array
        if (!response.imagenes || !Array.isArray(response.imagenes)) {
          response.imagenes = [];
        }
        
        // Filtrar imágenes vacías o no válidas
        response.imagenes = response.imagenes.filter(img => 
          img && typeof img === 'string' && img.trim() !== ''
        );
        
      }
      
      return response;
    } catch (error) {
      console.error(`Error al obtener el artículo con ID ${id}:`, error);
      throw error;
    }
  },
  
  // Obtener categorías de artículos
  getCategorias: () => {
    // Estas categorías corresponden al enum CategoriaArticulo en el backend
    return [
      { id: 0, nombre: 'Juguete' },
      { id: 1, nombre: 'Alimentacion' },
      { id: 2, nombre: 'Snack' },
      { id: 3, nombre: 'Accesorio' },
      { id: 4, nombre: 'Higiene' },
      { id: 5, nombre: 'Salud' },
      { id: 6, nombre: 'Ropa' }
    ];
  },

  // Crear un nuevo artículo
  create: async (createArticuloDto) => {
    try {
      const response = await fetcher('/api/Articulo', {
        method: 'POST',
        body: JSON.stringify(createArticuloDto)
      });
      return response;
    } catch (error) {
      console.error('Error al crear artículo:', error);
      throw error;
    }
  },

  // Crear múltiples artículos
  createBatch: async (createArticuloDtos) => {
    try {
      const response = await fetcher('/api/Articulo/batch', {
        method: 'POST',
        body: JSON.stringify(createArticuloDtos)
      });
      return response;
    } catch (error) {
      console.error('Error al crear artículos en lote:', error);
      throw error;
    }
  },

  // Actualizar un artículo
  update: async (id, updateArticuloDto) => {
    try {
      // Asegurarse de que los datos están en el formato correcto
      const formattedData = {
        nombre: String(updateArticuloDto.nombre || '').trim(),
        descripcion: String(updateArticuloDto.descripcion || '').trim(),
        precio: parseFloat(updateArticuloDto.precio) || 0,
        categoria: parseInt(updateArticuloDto.categoria),
        imagenes: Array.isArray(updateArticuloDto.imagenes) ? 
          updateArticuloDto.imagenes.filter(url => url && typeof url === 'string' && url.trim() !== '') : 
          []
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Articulo/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formattedData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`Error al actualizar: ${errorText}`);
      }

      const data = await response.text();
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error detallado al actualizar artículo:', error);
      throw error;
    }
  },

  // Eliminar un artículo
  delete: async (id) => {
    try {      
      await sendRequest(`/api/Articulo/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error al eliminar artículo:', error);
      throw error;
    }
  },

  // Actualizar stock de un artículo
  updateStock: async (id, cantidad) => {
    try {      
      await sendRequest(`/api/Articulo/${id}/stock`, {
        method: 'PATCH',
        body: cantidad // Enviamos directamente el incremento/decremento
      });
    } catch (error) {
      console.error('Error al actualizar stock:', error);
      throw error;
    }
  },

  // Obtener artículos por categoría
  getByCategoria: async (categoria, options = {}) => {
    const queryParams = new URLSearchParams();
    
    if (options.pageNumber) queryParams.append('pageNumber', options.pageNumber);
    if (options.pageSize) queryParams.append('pageSize', options.pageSize);
    if (options.sortBy) queryParams.append('sortBy', options.sortBy);
    if (options.ascending !== undefined) queryParams.append('ascending', options.ascending);
    
    const queryString = queryParams.toString();
    try {
      const response = await fetcher(`/api/Articulo/categoria/${categoria}${queryString ? `?${queryString}` : ''}`);
      return response;
    } catch (error) {
      console.error('Error al obtener artículos por categoría:', error);
      throw error;
    }
  }
};

export default articleService; 