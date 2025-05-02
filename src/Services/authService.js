import { fetcher, sendRequest } from './api';

export const authService = {
  // Iniciar sesión
  login: (credentials) => sendRequest('/api/Auth/login', { 
    method: 'POST', 
    body: credentials 
  }),
  
  // Registrar usuario (propietario)
  registerUser: (userData) => sendRequest('/api/Usuario/register', { 
    method: 'POST', 
    body: userData 
  }),
  
  // Registrar cuidador (paseador)
  registerCaregiver: (caregiverData) => sendRequest('/api/Paseador/register', { 
    method: 'POST', 
    body: {
      dni: caregiverData.dni,
      nombre: caregiverData.nombre,
      apellido: caregiverData.apellido,
      direccion: caregiverData.direccion,
      email: caregiverData.email,
      password: caregiverData.password,
      confirmPassword: caregiverData.confirmPassword,
      telefono: caregiverData.telefono,
      latitud: caregiverData.latitud,
      longitud: caregiverData.longitud,
      servicios: caregiverData.servicios.map(s => ({
        servicioId: s.servicioId,
        precio: s.precio
      }))
    }
  }),
  
  // Verificar token
  verifyToken: async () => {
    try {
      const userData = await fetcher('/api/Auth/verify');
      return userData;
    } catch (error) {
      console.error('Error al verificar token:', error);
      // Si es un error 401 o 403, significa que el token no es válido
      if (error.status === 401 || error.status === 403) {
        localStorage.removeItem('token');
      }
      throw error;
    }
  },
  
  // Obtener información del usuario
  getUserInfo: async () => {
    try {
      const userData = await fetcher('/api/Usuario/info');
      return userData;
    } catch (error) {
      console.error('Error al obtener información del usuario:', error);
      throw error;
    }
  },
  
  // Cerrar sesión
  logout: () => {
    localStorage.removeItem('token');
    return Promise.resolve();
  }
};

export default authService;