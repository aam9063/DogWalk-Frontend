import { sendRequest } from '../Services/api';

const assistantService = {
  async consultarAsistente(mensaje, contexto = '', metaDatos = {}) {
    try {
      const response = await sendRequest('api/Asistente/consultar', {
        method: 'POST',
        body: {
          mensaje,
          contexto,
          metaDatos
        }
      });
      
      return response;
    } catch (error) {
      if (error.status === 429) {
        throw new Error(error.response?.data?.error || 'Demasiadas peticiones. Por favor, intenta más tarde.');
      }
      throw new Error('Error al consultar al asistente virtual');
    }
  }
};

export default assistantService; 