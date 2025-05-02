const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5204/api';

export const fetcher = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Asegurarse de que la URL no tenga barras duplicadas
  const normalizedUrl = url.startsWith('/') ? url.substring(1) : url;
  const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
  
  const response = await fetch(`${baseUrl}/${normalizedUrl}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    // Personalizar mensaje según el código de estado
    let errorMessage = '';
    
    if (response.status === 401 || response.status === 403) {
      errorMessage = 'Credenciales incorrectas';
    } else if (response.status === 400) {
      errorMessage = 'Datos inválidos';
    } else if (response.status === 404) {
      errorMessage = 'Recurso no encontrado';
    } else if (response.status >= 500) {
      errorMessage = 'Error en el servidor';
    } else {
      errorMessage = 'Error en la petición API';
    }
    
    const error = new Error(errorMessage);
    
    try {
      error.info = await response.json();
    } catch {
      // Si hay un error al parsear el JSON, usar mensaje predeterminado
      error.info = { message: errorMessage };
    }
    
    error.status = response.status;
    throw error;
  }
  
  return response.json();
};

// Función para crear peticiones POST, PUT, DELETE
export const sendRequest = async (url, { method, body, ...options } = {}) => {
  return fetcher(url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  });
};
