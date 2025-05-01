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
  
  const response = await fetch(`${API_URL}${url}`, {
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
