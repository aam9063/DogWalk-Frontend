import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Usar selectores estándar de Zustand
  const login = useAuthStore(state => state.login);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const error = useAuthStore(state => state.error);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [loginError, setLoginError] = useState(null);

  // Verificar si hay mensajes de estado (por ejemplo, después de registro exitoso)
  useEffect(() => {
    if (location.state?.registered) {
      setSuccessMessage(location.state.message || 'Registro exitoso. Ahora puedes iniciar sesión.');
    }
  }, [location]);

  // Verificar si el usuario ya está autenticado
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token || isAuthenticated) {
        setIsRedirecting(true);
        // Pequeño retraso para evitar parpadeos
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 100);
      }
    };
    
    checkAuth();
  }, [navigate, isAuthenticated]);

  // Mostrar error de autenticación del store
  useEffect(() => {
    if (error) {
      setLoginError(error);
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Usar useCallback para memoizar la función
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (loading || isRedirecting) return;
    
    setLoading(true);
    setLoginError(null);
    
    try {
      // Usar la acción de login de Zustand
      await login(formData);
      
      // Indicar que estamos redirigiendo para evitar múltiples navegaciones
      setIsRedirecting(true);
      
      // Usar un timeout pequeño para asegurar que el estado se actualice antes de la navegación
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 100);
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      
      // Siempre mostrar un mensaje amigable, independientemente del error
      const errorMessage = error.message || 'Credenciales incorrectas';
      setLoginError(errorMessage);
      setIsRedirecting(false);
    } finally {
      setLoading(false);
    }
  }, [formData, loading, isRedirecting, login, navigate]);

  // Si estamos redirigiendo, mostrar un estado de carga
  if (isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 rounded-full border-t-dog-green border-r-dog-green border-b-transparent border-l-transparent animate-spin"></div>
          <p className="text-xl text-gray-600">Redirigiendo al dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col min-h-screen md:flex-row">
        {/* Columna izquierda con logo */}
        <div className="flex items-center justify-center w-full p-8 md:w-2/5 bg-dog-green">
          <div className="max-w-sm">
            <Link to="/">
              <img 
                src="/imgs/DogWalkLogo.jpg" 
                alt="Dog Walk Logo" 
                className="w-full mx-auto rounded-lg cursor-pointer"
              />
            </Link>
          </div>
        </div>
        
        {/* Columna derecha con formulario */}
        <div className="flex flex-col justify-center w-full p-8 md:w-3/5">
          <h1 className="mb-8 text-3xl text-center font-adlam">
            Iniciar Sesión
          </h1>
          
          {successMessage && (
            <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-md">
              {successMessage}
            </div>
          )}
          
          {loginError && (
            <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-md">
              {loginError}
            </div>
          )}
          
          <div className="w-full max-w-md mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                    Email:
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-dog-green"
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
                    Contraseña:
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-dog-green"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading || isRedirecting}
                className={`w-full mt-6 py-3 px-4 bg-dog-green text-white rounded-md hover:bg-dog-light-green transition duration-300 ${
                  (loading || isRedirecting) ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
            </form>
            
            <div className="mt-4 text-center">
              <p className="text-gray-600">
                ¿No tienes una cuenta?{' '}
                <Link to="/register" className="text-dog-green hover:underline">
                  Regístrate
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;