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
    const error = new Error('Error en la petición API');
    error.info = await response.json();
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
