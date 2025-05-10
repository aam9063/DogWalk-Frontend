const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5204/api';

// Datos mock para desarrollo
const MOCK_USER = {
  userId: '1',
  email: 'usuario@test.com',
  nombre: 'Usuario',
  apellido: 'Test',
  rol: 'Usuario',
  token: 'mock-token-123'
};

export const fetcher = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    // Asegurarse de que la URL no tenga barras duplicadas
    const normalizedUrl = url.startsWith('/') ? url.substring(1) : url;
    const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
    
    // Intentar la petición al backend
    const response = await fetch(`${baseUrl}/${normalizedUrl}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.warn('Error en la petición al backend:', error);
    
    // Si es un login y el backend no está disponible, usar datos mock
    if (url.includes('/api/Auth/login')) {
      console.log('Usando datos mock para login...');
      return Promise.resolve(MOCK_USER);
    }
    
    // Si es una verificación de token y el backend no está disponible
    if (url.includes('/api/Auth/verify')) {
      const mockToken = localStorage.getItem('token');
      if (mockToken === 'mock-token-123') {
        return Promise.resolve(MOCK_USER);
      }
    }
    
    throw error;
  }
};

// Función para crear peticiones POST, PUT, DELETE
export const sendRequest = async (url, { method, body, ...options } = {}) => {
  try {
    return await fetcher(url, {
      method,
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });
  } catch (error) {
    // Si es un error de conexión y estamos en modo desarrollo
    if (error.message.includes('Failed to fetch') && import.meta.env.DEV) {
      if (url.includes('/api/Auth/login')) {
        console.log('Usando respuesta mock para login...');
        return MOCK_USER;
      }
    }
    throw error;
  }
};
