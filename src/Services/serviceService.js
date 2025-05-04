import { fetcher } from './api';

export const serviceService = {
  // Obtener todos los servicios disponibles
  getAll: async () => {
    const response = await fetcher('/api/Servicio');
    
    // Procesar la respuesta para asegurar que devolvemos un array
    if (Array.isArray(response)) {
      return response;
    } else if (response && typeof response === 'object') {
      // Buscar propiedades comunes que podrían contener los datos
      for (const prop of ['items', 'data', 'results', 'servicios', 'content']) {
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
    console.warn('No se pudo encontrar un array de servicios en la respuesta:', response);
    return [];
  },
  
  // Obtener un servicio por ID
  getById: (id) => fetcher(`/api/Servicio/${id}`),
};

export default serviceService;
