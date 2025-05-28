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
    console.log('Solicitando datos del perfil al endpoint /api/Paseador/profile');
    // Obtener el perfil básico
    const profileResponse = await sendRequest('/api/Paseador/profile');
    console.log('Respuesta del GET profile:', profileResponse);

    // Obtener las valoraciones
    const valoracionesResponse = await sendRequest(`/api/RankingPaseador/paseador/${profileResponse.id}`, {
      method: 'GET'
    });
    console.log('Respuesta de valoraciones:', valoracionesResponse);

    // Formatear la valoración promedio
    if (profileResponse && typeof profileResponse.valoracionPromedio === 'number') {
      profileResponse.valoracionPromedio = Number(profileResponse.valoracionPromedio).toFixed(1);
    }

    // Combinar los datos
    const combinedResponse = {
      ...profileResponse,
      valoraciones: valoracionesResponse || []
    };

    console.log('Datos combinados del perfil:', combinedResponse);
    return combinedResponse;
  } catch (error) {
    console.error('Error al obtener el perfil:', error);
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
    console.log('Datos enviados en PUT al backend:', {
      endpoint: '/api/Paseador/profile',
      method: 'PUT',
      data: profileData
    });

    const response = await sendRequest('/api/Paseador/profile', {
      method: 'PUT',
      body: profileData
    });

    console.log('Respuesta del PUT profile:', response);
    
    // Hacer un GET inmediato para verificar los datos
    const updatedData = await getPaseadorProfile();
    console.log('Datos después de actualizar (GET inmediato):', updatedData);
    
    return response;
  } catch (error) {
    console.error('Error en la actualización:', error);
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

// Crear slots de disponibilidad horaria
export const crearDisponibilidadHoraria = async (disponibilidad) => {
  try {
    const response = await sendRequest('/api/DisponibilidadHoraria', {
      method: 'POST',
      body: disponibilidad
    });
    return response;
  } catch (error) {
    console.error('Error al crear disponibilidad horaria:', error);
    throw error;
  }
};