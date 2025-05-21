import { sendRequest } from './api';

const reservaService = {
  crearReserva: async (reservaData) => {
    try {
      console.log('URL de la API:', import.meta.env.VITE_API_URL);
      console.log('Datos enviados al backend:', JSON.stringify(reservaData, null, 2));
      
      // Validaciones adicionales
      if (!reservaData.paseadorId || !reservaData.perroId || !reservaData.servicioId) {
        throw new Error('Faltan IDs requeridos para la reserva');
      }

      const response = await sendRequest('/api/Reserva', {
        method: 'POST',
        body: reservaData
      });

      console.log('Respuesta del backend:', response);
      return response;
    } catch (error) {
      console.error('Error detallado de la reserva:', {
        error,
        status: error.status,
        message: error.message,
        response: error.response,
        apiUrl: import.meta.env.VITE_API_URL
      });

      // Si el error viene del backend con un mensaje específico
      if (error.response?.data) {
        throw new Error(typeof error.response.data === 'string' 
          ? error.response.data 
          : JSON.stringify(error.response.data));
      }

      // Si es un error de validación del backend (400)
      if (error.status === 400) {
        throw new Error('Los datos de la reserva no son válidos. Por favor, verifica que todos los IDs sean correctos y la fecha sea válida.');
      }

      throw new Error('Error al crear la reserva. Por favor, inténtalo de nuevo.');
    }
  }
};

export default reservaService; 