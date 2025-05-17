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
// Función auxiliar para obtener cookies
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

// Función para crear peticiones POST, PUT, DELETE
export const sendRequest = async (url, { method, body, headers = {}, ...options } = {}) => {
  try {
    // Obtener el token CSRF de las cookies
    const csrfToken = getCookie('XSRF-TOKEN');
    
    // Preparar cabeceras con el token CSRF si existe
    const requestHeaders = {
      'Content-Type': 'application/json',
      ...headers
    };
    
    // Agregar token CSRF para métodos no seguros (POST, PUT, DELETE, PATCH)
    if (csrfToken && (method === 'POST' || method === 'PUT' || method === 'DELETE' || method === 'PATCH')) {
      // No agregar el token para login y refresh-token
      if (!url.includes('/api/Auth/login') && !url.includes('/api/Auth/refresh-token')) {
        requestHeaders['X-CSRF-TOKEN'] = csrfToken;
      }
    }
    
    return await fetcher(url, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });
  } catch (error) {
    // Si es un error de conexión y estamos en modo desarrollo
    if (error.message?.includes('Failed to fetch') && import.meta.env.DEV) {
      if (url.includes('/api/Auth/login')) {
        console.log('Usando respuesta mock para login...');
        return MOCK_USER;
      }
    }
    
    // Si el error es de tipo 403 y posiblemente relacionado con CSRF
    if (error.status === 403) {
      console.error('Error de validación CSRF. Intentando actualizar el token...');
      // Aquí podrías intentar recargar la página o hacer alguna acción para obtener un nuevo token CSRF
    }
    
    throw error;
  }
};

