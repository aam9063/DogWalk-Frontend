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

  refreshToken: async () => {
    try {
      const accessToken = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!accessToken || !refreshToken) {
        throw new Error('No hay tokens disponibles');
      }
      
      const response = await sendRequest('/api/Auth/refresh-token', {
        method: 'POST',
        body: {
          accessToken,
          refreshToken
        }
      });
      
      if (response) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('tokenExpiration', response.tokenExpiration);
        return response;
      }
      
      throw new Error('Error al refrescar los tokens');
    } catch (error) {
      console.error('Error al refrescar el token:', error);
      // Limpiar tokens si hay un error
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tokenExpiration');
      throw error;
    }
  },
  
  revokeToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return Promise.resolve();
    
    try {
      await sendRequest('/api/Auth/revoke-token', {
        method: 'POST',
        body: { refreshToken }
      });
    } catch (error) {
      console.error('Error al revocar el token:', error);
    }
  },
  
  verifyToken: async () => {
    try {
      // Verificar si el token está por expirar
      const tokenExpiration = localStorage.getItem('tokenExpiration');
      if (tokenExpiration) {
        const expiryDate = new Date(tokenExpiration);
        const now = new Date();
        
        // Si el token expira en menos de 5 minutos, refrescarlo
        if ((expiryDate - now) < 5 * 60 * 1000) {
          await authService.refreshToken();
        }
      }
      
      const userData = await fetcher('/api/Auth/verify');
      return userData;
    } catch (error) {
      console.error('Error al verificar token:', error);
      if (error.status === 401) {
        // Intentar refrescar el token si es error de autorización
        try {
          await authService.refreshToken();
          // Reintentar la verificación
          const userData = await fetcher('/api/Auth/verify');
          return userData;
        } catch (refreshError) {
          // Si falla el refresh, limpiar tokens
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('tokenExpiration');
          throw refreshError;
        }
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
   logout: async () => {
    try {
      await authService.revokeToken();
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tokenExpiration');
      return Promise.resolve();
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tokenExpiration');
      throw error;
    }
  }
};

export default authService;