import { fetcher } from './api';

const paseadorProfileService = {
  // Obtener el resumen del ranking de un paseador
  getRankingResumen: async (paseadorId) => {
    try {
      const response = await fetcher(`api/RankingPaseador/resumen/${paseadorId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        skipAuth: true // No requiere autenticación
      });
      return response;
    } catch (error) {
      console.error('Error al obtener resumen del ranking:', error);
      throw error;
    }
  },

  // Obtener todas las valoraciones de un paseador
  getValoraciones: async (paseadorId) => {
    try {
      const response = await fetcher(`api/RankingPaseador/paseador/${paseadorId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        skipAuth: true // No requiere autenticación
      });
      return response;
    } catch (error) {
      console.error('Error al obtener valoraciones:', error);
      throw error;
    }
  },

  // Obtener el perfil completo del paseador
  getProfile: async (paseadorId) => {
    try {
      console.log('Llamando a getProfile con ID:', paseadorId);
      
      const response = await fetcher(`api/Paseador/public/${paseadorId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        skipAuth: true
      });
      
      console.log('Respuesta sin procesar:', response);
      
      // Asegurarse de que las coordenadas sean números
      if (response && response.coordenadas) {
        response.coordenadas = {
          latitud: Number(response.coordenadas.latitud),
          longitud: Number(response.coordenadas.longitud)
        };
      }
      
      console.log('Respuesta procesada:', response);
      return response;
    } catch (error) {
      console.error('Error al obtener perfil del paseador:', error);
      throw error;
    }
  },

  // Obtener disponibilidad horaria del paseador
  getDisponibilidad: async (paseadorId, fecha) => {
    try {
      const response = await fetcher(`api/DisponibilidadHoraria/paseador/${paseadorId}?fecha=${fecha}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        skipAuth: true // No requiere autenticación
      });
      return response;
    } catch (error) {
      console.error('Error al obtener disponibilidad:', error);
      throw error;
    }
  }
};

export default paseadorProfileService; 