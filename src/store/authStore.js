import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import authService from '../Services/authService';

// Crear el store sin usar hooks fuera de componentes
const useAuthStore = create(
  persist(
    (set, get) => ({
      // Estado
      user: null,
      isAuthenticated: false,
      loading: true, // Inicialmente true para evitar parpadeos
      error: null,

      // Acciones
      setUser: (user) => set({ user }),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      // Verificar token al inicio
      verifyAuth: async () => {
        const token = localStorage.getItem('token');
        const currentState = get();
        
        // Si no hay token, limpiar estado
        if (!token) {
          set({ 
            isAuthenticated: false, 
            user: null, 
            loading: false,
            error: null 
          });
          return;
        }

        // Si ya está autenticado y tiene usuario, no necesitamos verificar
        if (currentState.isAuthenticated && currentState.user) {
          set({ loading: false });
          return;
        }

        try {
          const userData = await authService.verifyToken();
          set({ 
            user: userData,
            isAuthenticated: true,
            loading: false,
            error: null
          });
        } catch (error) {
          console.error('Error verificando token:', error);
          // Limpiar todo en caso de error
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('tokenExpiration');
          set({ 
            isAuthenticated: false,
            user: null,
            loading: false,
            error: error.message
          });
        }
      },

      // Login
      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const response = await authService.login(credentials);
          if (!response || !response.token) {
            throw new Error('Respuesta de login inválida');
          }
          
          localStorage.setItem('token', response.token);
          localStorage.setItem('refreshToken', response.refreshToken);
          localStorage.setItem('tokenExpiration', response.tokenExpiration);
          
          set({ 
            user: response.user || response,
            isAuthenticated: true,
            loading: false,
            error: null
          });
          
          return response;
        } catch (error) {
          set({ 
            loading: false,
            isAuthenticated: false,
            error: error.message || 'Error al iniciar sesión'
          });
          throw error;
        }
      },

      // Logout
      logout: async () => {
        set({ loading: true });
        try {
          await authService.logout();
        } finally {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('tokenExpiration');
          set({ 
            user: null,
            isAuthenticated: false,
            loading: false,
            error: null
          });
        }
      },

      // Refresh token
      refreshTokens: async () => {
        try {
          const response = await authService.refreshToken();
          if (response && response.token) {
            set({
              user: response.user || response,
              isAuthenticated: true,
              loading: false,
              error: null
            });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Error al refrescar tokens:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('tokenExpiration');
          set({ 
            user: null, 
            isAuthenticated: false,
            loading: false,
            error: 'Sesión expirada, por favor inicia sesión nuevamente'
          });
          return false;
        }
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading
      })
    }
  )
);

export default useAuthStore; 