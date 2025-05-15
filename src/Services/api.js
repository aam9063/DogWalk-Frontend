const API_URL = import.meta.env.VITE_API_URL;

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
  const { skipAuth, ...restOptions } = options;
  const token = !skipAuth ? localStorage.getItem('token') : null;
  const headers = {
    'Content-Type': 'application/json',
    ...restOptions.headers,
  };
  
  if (token && !skipAuth) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    // Asegurarse de que la URL no tenga barras duplicadas
    const normalizedUrl = url.startsWith('/') ? url.substring(1) : url;
    const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
    
    // Intentar la petición al backend
    const response = await fetch(`${baseUrl}/${normalizedUrl}`, {
      ...restOptions,
      headers,
    });

    // No eliminar el token aquí en caso de error
    if (!response.ok) {
      const error = new Error(`HTTP error! status: ${response.status}`);
      error.status = response.status;
      throw error;
    }
    
    return response.json();
  } catch (error) {
    console.warn('Error en la petición al backend:', error);
    
   
    
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
