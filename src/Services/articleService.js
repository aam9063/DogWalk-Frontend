import { fetcher } from './api';

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
    if (options.categoria) {
      // Si es un string con formato "1,2,3" (múltiples categorías) o un solo valor
      queryParams.append('categoria', options.categoria);
    }
    
    const queryString = queryParams.toString();
    try {
      const response = await fetcher(`/api/Articulo${queryString ? `?${queryString}` : ''}`);
      return response;
    } catch (error) {
      console.error("Error al obtener artículos:", error);
      return {
        items: [],
        totalItems: 0,
        totalPaginas: 0,
        paginaActual: 0,
        elementosPorPagina: 0
      };
    }
  },
  
  // Obtener un artículo por ID
  getById: async (id) => {
    try {
      const response = await fetcher(`/api/Articulo/${id}`);
      return response;
    } catch (error) {
      console.error(`Error al obtener el artículo con ID ${id}:`, error);
      return null;
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
  }
};

export default articleService; 