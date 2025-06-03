const API_URL = import.meta.env.VITE_API_URL;


export const fetcher = async (url, options = {}) => {
  const { skipAuth, ...restOptions } = options;
  const token = !skipAuth ? localStorage.getItem('token') : null;
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
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

    if (!response.ok) {
      if (response.status === 401) {
        // Token expirado o inválido
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw new Error('Sesión expirada. Por favor, inicie sesión nuevamente.');
      }
      
      const error = new Error(`HTTP error! status: ${response.status}`);
      error.status = response.status;
      throw error;
    }

    // Verificar si hay contenido antes de intentar parsear JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const text = await response.text();
      return text ? JSON.parse(text) : null;
    }
    
    return null; // Retornar null para respuestas no-JSON o vacías
    
  } catch (error) {
    console.error('Error en la petición al backend:', error);
    throw error;
  }
};

// Función para crear peticiones POST, PUT, DELETE
export const sendRequest = async (url, { method, body, headers = {}, ...options } = {}) => {
  try {
    const requestHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...headers
    };
    
    return await fetcher(url, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });
  } catch (error) {
    if (error.status === 403) {
      console.error('Error de permisos. Asegúrese de tener los permisos necesarios.');
    }
    throw error;
  }
};

