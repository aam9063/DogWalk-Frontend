import { sendRequest } from './api';

export const enviarValoracion = async (paseadorId, puntuacion, comentario) => {
  try {
    const response = await sendRequest('/api/RankingPaseador', {
      method: 'POST',
      body: {
        paseadorId,
        puntuacion,
        comentario
      }
    });
    return response;
  } catch (error) {
    console.error('Error al enviar la valoración:', error);
    throw new Error('No se pudo enviar la valoración');
  }
};

// La función para obtener valoraciones se implementará cuando el endpoint esté disponible
/*
export const obtenerMisValoraciones = async () => {
  try {
    const response = await sendRequest('/api/RankingPaseador/mis-valoraciones', {
      method: 'GET'
    });
    return response;
  } catch (error) {
    console.error('Error al obtener las valoraciones:', error);
    throw new Error('No se pudieron obtener las valoraciones');
  }
};
*/ 