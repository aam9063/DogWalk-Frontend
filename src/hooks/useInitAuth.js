import { useEffect } from 'react';
import useAuthStore from '../store/authStore';

// Hook para inicializar la autenticación al cargar la aplicación
const useInitAuth = () => {
  const verifyAuth = useAuthStore(state => state.verifyAuth);
  
  useEffect(() => {
    // Verificar autenticación solo una vez al montar el componente
    if (localStorage.getItem('token')) {
      verifyAuth();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
};

export default useInitAuth; 