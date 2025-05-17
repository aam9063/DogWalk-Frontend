// autoRefreshService.js
import authService from './authService';

let refreshInterval = null;

// Servicio para manejar la renovación automática de tokens
export const startAutoRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
  
  // Verificar cada minuto si el token necesita renovación
  refreshInterval = setInterval(async () => {
    const tokenExpiration = localStorage.getItem('tokenExpiration');
    if (!tokenExpiration) return;
    
    const expiryDate = new Date(tokenExpiration);
    const now = new Date();
    
    // Si el token expira en menos de 5 minutos, refrescarlo
    if ((expiryDate - now) < 5 * 60 * 1000) {
      try {
        await authService.refreshToken();
      } catch (err) {
        console.error('Error en auto-refresh:', err);
      }
    }
  }, 60000);
  
  return refreshInterval;
};

export const stopAutoRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
};
