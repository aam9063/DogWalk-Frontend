import { fetcher } from './api';

export const serviceService = {
  // Obtener todos los servicios disponibles
  getAll: () => fetcher('/api/Servicio'),
  
  // Obtener un servicio por ID
  getById: (id) => fetcher(`/api/Servicio/${id}`),
};

export default serviceService;
