import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
// eslint-disable-next-line no-unused-vars
import { motion } from 'motion/react';
import { gsap } from 'gsap';
import { FaGoogle } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Referencias para animaciones
  const formRef = useRef(null);
  const logoRef = useRef(null);
  
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

  // Animar los elementos al cargar la página
  useEffect(() => {
    if (logoRef.current && formRef.current) {
      // Animación del logo
      gsap.fromTo(
        logoRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }
      );
      
      // Animación del formulario
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.3, ease: "power1.out" }
      );
    }
  }, []);

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
      if (!token) return;

      if (isAuthenticated) {
        setIsRedirecting(true);
        navigate('/dashboard', { replace: true });
      } else {
        // Si hay token pero no está autenticado, intentar verificar
        try {
          await useAuthStore.getState().verifyAuth();
        } catch (error) {
          console.error('Error al verificar autenticación:', error);
        }
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
      
      // Obtener el usuario del store después del login
      const user = useAuthStore.getState().user;
      
      // Indicar que estamos redirigiendo para evitar múltiples navegaciones
      setIsRedirecting(true);
      
      // Redirigir según el rol del usuario
      setTimeout(() => {
        if (user?.rol === 'Paseador') {
          navigate('/paseador/dashboard', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
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
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 mx-auto mb-4 border-4 rounded-full border-t-dog-green border-r-dog-green border-b-transparent border-l-transparent animate-spin"></div>
          <p className="text-xl text-gray-600">Redirigiendo al dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col min-h-screen md:flex-row">
        {/* Columna izquierda con logo */}
        <div className="flex items-center justify-center w-full p-8 md:w-2/5 bg-dog-green">
          <div className="max-w-sm" ref={logoRef}>
            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
              <Link to="/">
                <img 
                  src="/imgs/DogWalkLogo.jpg" 
                  alt="Dog Walk Logo" 
                  className="w-full mx-auto rounded-lg cursor-pointer"
                />
              </Link>
            </motion.div>
          </div>
        </div>
        
        {/* Columna derecha con formulario */}
        <div className="flex flex-col justify-center w-full p-8 md:w-3/5">
          <motion.p
            className="mb-2 text-xl text-center text-dog-green font-adlam"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Bienvenido de nuevo a Dog Walk
          </motion.p>
          
          <motion.h1 
            className="mb-8 text-3xl text-center font-adlam"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Iniciar Sesión
          </motion.h1>
          
          {successMessage && (
            <motion.div 
              className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-md"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {successMessage}
            </motion.div>
          )}
          
          {loginError && (
            <motion.div 
              className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-md"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              {loginError}
            </motion.div>
          )}
          
          <div className="w-full max-w-md mx-auto" ref={formRef}>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                    Email:
                  </label>
                  <motion.input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-dog-green"
                    whileFocus={{ scale: 1.01, borderColor: "#36A269" }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
                    Contraseña:
                  </label>
                  <motion.input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-dog-green"
                    whileFocus={{ scale: 1.01, borderColor: "#36A269" }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </div>
              
              <motion.button
                type="submit"
                disabled={loading || isRedirecting}
                className={`w-full mt-6 py-3 px-4 bg-dog-green text-white rounded-md hover:bg-dog-light-green transition duration-300 ${
                  (loading || isRedirecting) ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </motion.button>

              <div className="my-4">
                <p className="text-center">o</p>

                <button 
                  type="button" 
                  className="flex items-center justify-center w-full gap-2 px-4 py-2 mt-4 mb-6 transition bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <FaGoogle className="text-red-500" />
                  <span>Iniciar sesión con Google</span>
                </button>
              </div>
            </form>
            
            <motion.div 
              className="mt-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <p className="text-gray-600">
                ¿No tienes una cuenta?{' '}
                <Link to="/register" className="text-dog-green hover:underline">
                  Regístrate
                </Link>
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;