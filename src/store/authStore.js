import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import authService from '../Services/authService';

// Crear el store sin usar hooks fuera de componentes
const useAuthStore = create(
  persist(
    (set) => ({
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
        const token = localStorage.getItem('token');
        if (!token) {
          set({ isAuthenticated: false, user: null });
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
          // No eliminar el token aquí
        }
      },

      // Login
      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const response = await authService.login(credentials);
          localStorage.setItem('token', response.token);
          set({ 
            user: response,
            isAuthenticated: true,
            loading: false,
            error: null
          });
        } catch (error) {
          set({ loading: false, error: error.message });
          throw error;
        }
      },

      // Logout
      logout: () => {
        localStorage.removeItem('token');
        set({ 
          user: null,
          isAuthenticated: false,
          loading: false,
          error: null
        });
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
);

export default useAuthStore; 