import {  sendRequest } from './api';
import useAuthStore from '../store/authStore';

// Obtener datos del dashboard
export const getDashboardData = async () => {
  return await sendRequest('/api/Usuario/dashboard', { method: 'GET' });
};

// Obtener perfil del usuario
export const getUserProfile = async () => {
  return await sendRequest('/api/Usuario/profile', { method: 'GET' });
};

// Actualizar perfil del usuario
export const updateUserProfile = async (profileData) => {
  try {
    const response = await sendRequest('/api/Usuario/profile', { 
      method: 'PUT',
      body: profileData
    });
    return response;
  } catch (error) {
    console.error('Error en updateUserProfile:', error);
    throw new Error('Error al actualizar el perfil');
  }
};

// Servicios para manejo de perros
export const getDogsList = async () => {
  try {
    return await sendRequest('/api/Perro', { 
      method: 'GET'
    });
  } catch (error) {
    console.error('Error al obtener la lista de perros:', error);
    throw new Error('Error al obtener la lista de perros');
  }
};

export const createDog = async (dogData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay sesión activa');
    }

    // Obtener el usuario del store
    const user = useAuthStore.getState().user;
    if (!user || !user.userId) {
      throw new Error('No se pudo obtener el ID del usuario');
    }

    const response = await sendRequest('/api/Perro', {
      method: 'POST',
      body: {
        usuarioId: user.userId,
        nombre: dogData.nombre || 'Nuevo perro',
        raza: dogData.raza || 'Sin especificar',
        edad: parseInt(dogData.edad) || 0,
        gpsUbicacion: dogData.gpsUbicacion || null
      }
    });
    return response;
  } catch (error) {
    console.error('Error al crear el perro:', error);
    throw new Error('Error al crear la mascota');
  }
};

export const updateDog = async (id, dogData) => {
  try {
    if (!id) throw new Error('ID de perro no proporcionado');
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay sesión activa');
    }

    // Obtener el usuario del store
    const user = useAuthStore.getState().user;
    if (!user || !user.userId) {
      throw new Error('No se pudo obtener el ID del usuario');
    }

    const response = await sendRequest('/api/Perro', {
      method: 'PUT',
      body: {
        id: id,
        nombre: dogData.nombre,
        raza: dogData.raza,
        edad: parseInt(dogData.edad),
        gpsUbicacion: dogData.gpsUbicacion
      }
    });
    return response;
  } catch (error) {
    console.error('Error al actualizar el perro:', error);
    throw new Error('Error al actualizar la mascota');
  }
};

export const deleteDog = async (id) => {
  try {
    if (!id) throw new Error('ID de perro no proporcionado');
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay sesión activa');
    }

    await sendRequest(`/api/Perro/${id}`, { 
      method: 'DELETE'
    });
  } catch (error) {
    console.error('Error al eliminar el perro:', error);
    throw new Error('Error al eliminar la mascota');
  }
}; 



