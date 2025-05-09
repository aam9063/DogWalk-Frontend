import { fetcher } from './api';

const caregiverService = {
  // Obtener todos los cuidadores (paseadores)
  getAll: async (filters = {}) => {
    // Construir la query string con los filtros
    const queryParams = new URLSearchParams();
    if (filters.servicio) queryParams.append('servicioId', filters.servicio);
    if (filters.localidad) queryParams.append('codigoPostal', filters.localidad);
    if (filters.fechaEntrega) queryParams.append('fechaEntrega', filters.fechaEntrega);
    if (filters.fechaRecogida) queryParams.append('fechaRecogida', filters.fechaRecogida);
    if (filters.cantidad) queryParams.append('cantidad', filters.cantidad);
    
    const queryString = queryParams.toString();
    const response = await fetcher(`/api/Paseador/buscar${queryString ? `?${queryString}` : ''}`);
    
    // Procesar la respuesta para asegurar que devolvemos un array
    if (Array.isArray(response)) {
      return response;
    } else if (response && typeof response === 'object') {
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