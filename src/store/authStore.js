import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authService from '../Services/authService';

// Crear el store sin usar hooks fuera de componentes
const useAuthStore = create(
  persist(
    (set, get) => ({
      // Estado
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // Acciones
      setUser: (user) => set({ user }),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      // Verificar token al inicio
      verifyAuth: async () => {
        // Si ya estamos cargando o no hay token, no hacer nada
        if (get().loading || !localStorage.getItem('token')) {
          set({ loading: false, isAuthenticated: false });
          return;
        }

        set({ loading: true, error: null });

        try {
          const userData = await authService.verifyToken();
          set({ 
            user: userData, 
            isAuthenticated: true, 
            loading: false,
            error: null
          });
          return userData;
        } catch (error) {
          console.error('Error verificando token:', error);
          localStorage.removeItem('token');
          set({ 
            user: null, 
            isAuthenticated: false, 
            loading: false,
            error: 'Sesión expirada o inválida'
          });
          return null;
        }
      },

      // Login
      login: async (credentials) => {
        set({ loading: true, error: null });
        
        try {
          const response = await authService.login(credentials);
          
          localStorage.setItem('token', response.token);
          
          const userData = {
            id: response.userId,
            email: response.email,
            nombre: response.nombre,
            apellido: response.apellido,
            rol: response.rol
          };
          
          set({ 
            user: userData, 
            isAuthenticated: true, 
            loading: false,
            error: null
          });
          
          return response;
        } catch (error) {
          console.error('Error en login:', error);
          
          // Personalizar el mensaje de error según el código de estado
          let errorMessage = 'Credenciales incorrectas';
          
          // Si hay un mensaje específico del servidor, usarlo
          if (error.info && error.info.message) {
            errorMessage = error.info.message;
          } else if (error.status === 401 || error.status === 403) {
            errorMessage = 'Credenciales incorrectas';
          } else if (error.status === 400) {
            errorMessage = 'Datos de inicio de sesión inválidos';
          } else if (error.status === 404) {
            errorMessage = 'Usuario no encontrado';
          } else if (error.status >= 500) {
            errorMessage = 'Error en el servidor. Intente más tarde.';
          }
          
          set({ 
            loading: false, 
            error: errorMessage
          });
          
          throw {
            ...error,
            message: errorMessage
          };
        }
      },

      // Logout
      logout: () => {
        authService.logout();
        set({ 
          user: null, 
          isAuthenticated: false, 
          loading: false,
          error: null
        });
      }
    }),
    { name: 'auth-storage' }
  )
);

export default useAuthStore; 