import { createContext, useState, useEffect } from 'react';
import authService from '../Services/authService';

// Crear contexto
const AuthContext = createContext();

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Función para verificar el token
  const verifyAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      setIsAuthenticated(false);
      setUser(null);
      return;
    }

    try {
      // Si el token existe pero no tenemos información del usuario, intentamos obtenerla
      // En este punto, también podrías extraer el nombre y email del JWT si lo prefieres
      const userData = await authService.verifyToken();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error verificando token:', error);
      // Si hay un error al verificar el token, lo eliminamos
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Verificar al cargar la aplicación
  useEffect(() => {
    verifyAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      
      // Guardar el token en localStorage
      localStorage.setItem('token', response.token);
      
      // Extraer los datos del usuario de la respuesta
      const userData = {
        id: response.userId,
        email: response.email,
        nombre: response.nombre,
        apellido: response.apellido,
        rol: response.rol
      };
      
      // Actualizar el estado
      setUser(userData);
      setIsAuthenticated(true);
      
      return response;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Valor del contexto
  const contextValue = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    verifyAuth
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 