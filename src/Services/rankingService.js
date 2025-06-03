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
