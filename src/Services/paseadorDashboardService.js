import { sendRequest } from './api';

// Obtener datos del dashboard del paseador
export const getPaseadorDashboard = async () => {
  try {
    const response = await sendRequest('/api/Paseador/dashboard', {
      method: 'GET'
    });
    
    // Asegurarse de que la valoración promedio tenga un decimal
    if (response && typeof response.valoracionPromedio === 'number') {
      response.valoracionPromedio = Number(response.valoracionPromedio).toFixed(1);
    }
    
    return response;
  } catch (error) {
    console.error('Error al obtener el dashboard del paseador:', error);
    throw new Error('No se pudo obtener la información del dashboard');
  }
};

// Obtener el perfil privado del paseador
export const getPaseadorProfile = async () => {
  try {
    // Obtener el perfil básico
    const profileResponse = await sendRequest('/api/Paseador/profile', {
      method: 'GET'
    });

    // Obtener las valoraciones
    const valoracionesResponse = await sendRequest(`/api/RankingPaseador/paseador/${profileResponse.id}`, {
      method: 'GET'
    });

    // Formatear la valoración promedio
    if (profileResponse && typeof profileResponse.valoracionPromedio === 'number') {
      profileResponse.valoracionPromedio = Number(profileResponse.valoracionPromedio).toFixed(1);
    }

    // Combinar los datos
    return {
      ...profileResponse,
      valoraciones: valoracionesResponse || []
    };
  } catch (error) {
    console.error('Error al obtener el perfil del paseador:', error);
    throw error;
  }
};

// Obtener las reservas del paseador
export const getPaseadorReservas = async () => {
  try {
    const response = await sendRequest('/api/Paseador/reservas', {
      method: 'GET'
    });
    return response;
  } catch (error) {
    console.error('Error al obtener las reservas del paseador:', error);
    throw new Error('No se pudo obtener la información de las reservas');
  }
};

// Actualizar el perfil del paseador
export const updatePaseadorProfile = async (profileData) => {
  try {
    // Formatear los datos exactamente como espera el endpoint
    const updateData = {
      nombre: profileData.nombre,
      apellido: profileData.apellido,
      direccion: profileData.direccion,
      telefono: profileData.telefono,
      latitud: 0,
      longitud: 0
    };

    console.log('%c Datos enviados al backend:', 'color: blue; font-weight: bold', {
      endpoint: '/api/Paseador/profile',
      method: 'PUT',
      data: updateData
    });

    const response = await sendRequest('/api/Paseador/profile', {
      method: 'PUT',
      body: updateData
    });

    console.log('%c Respuesta del backend:', 'color: green; font-weight: bold', response);
    return response;
  } catch (error) {
    console.error('%c Error en la actualización:', 'color: red; font-weight: bold', error);
    throw error;
  }
};


// Confirmar una reserva
export const confirmarReserva = async (reservaId) => {
  try {
    const response = await sendRequest(`/api/Reserva/${reservaId}/confirmar`, {
      method: 'POST'
    });
    return response;
  } catch (error) {
    console.error('Error al confirmar la reserva:', error);
    throw error;
  }
};

// Cancelar una reserva
export const cancelarReserva = async (reservaId) => {
  try {
    const response = await sendRequest(`/api/Reserva/${reservaId}/cancelar`, {
      method: 'POST'
    });
    return response;
  } catch (error) {
    console.error('Error al cancelar la reserva:', error);
    throw error;
  }
};

// Completar una reserva
export const completarReserva = async (reservaId) => {
  try {
    const response = await sendRequest(`/api/Reserva/${reservaId}/completar`, {
      method: 'POST'
    });
    return response;
  } catch (error) {
    console.error('Error al marcar la reserva como completada:', error);
    throw error;
  }
};