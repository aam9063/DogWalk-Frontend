import { fetcher, sendRequest } from './api';

const caregiverService = {
  // Obtener todos los cuidadores (paseadores)
  getAll: async (filtros = {}, pageNumber = 1, pageSize = 10) => {
    try {
      // Construir query params
      const queryParams = new URLSearchParams();
      
      // Parámetros de paginación
      queryParams.append('PageNumber', pageNumber.toString());
      queryParams.append('PageSize', pageSize.toString());
      
      // Añadir filtros si existen
      if (filtros.servicio) queryParams.append('servicioId', filtros.servicio);
      if (filtros.localidad) queryParams.append('codigoPostal', filtros.localidad);
      if (filtros.fechaEntrega) queryParams.append('fechaEntrega', filtros.fechaEntrega);
      if (filtros.fechaRecogida) queryParams.append('fechaRecogida', filtros.fechaRecogida);
      if (filtros.cantidad) queryParams.append('cantidad', filtros.cantidad);

      const response = await sendRequest(`/api/Paseador?${queryParams}`);
      return response;
    } catch (error) {
      console.error('Error en caregiverService.getAll:', error);
      throw error;
    }
  },
  
  // Obtener un cuidador por ID
  getById: (id) => fetcher(`/api/Paseador/${id}`),
  
  // Obtener cuidadores por ubicación para el mapa
  getByLocation: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.servicio) queryParams.append('servicioId', filters.servicio);
    if (filters.localidad) queryParams.append('codigoPostal', filters.localidad);
    if (filters.latitud) queryParams.append('latitud', filters.latitud);
    if (filters.longitud) queryParams.append('longitud', filters.longitud);
    
    const queryString = queryParams.toString();
    const response = await fetcher(`/api/Paseador/mapa${queryString ? `?${queryString}` : ''}`);
    
    // Procesar la respuesta para asegurar que devolvemos un array
    if (Array.isArray(response)) {
      return response;
    } else if (response && typeof response === 'object') {
      // Buscar propiedades comunes que podrían contener los datos
      for (const prop of ['items', 'data', 'results', 'cuidadores', 'paseadores', 'content']) {
        if (response[prop] && Array.isArray(response[prop])) {
          return response[prop];
        }
      }
      
      // Buscar cualquier propiedad que sea un array
      for (const key in response) {
        if (Array.isArray(response[key])) {
          return response[key];
        }
      }
    }
    
    // Si no se pudo encontrar un array, devolver un array vacío
    console.warn('No se pudo encontrar un array de cuidadores en la respuesta:', response);
    return [];
  },
  
  // Obtener reseñas de un cuidador
  getReviews: (id) => fetcher(`/api/Paseador/${id}/resenas`),
};

export default caregiverService; 