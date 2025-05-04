import { useState, useEffect, Suspense, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { FaArrowLeft, FaHome, FaUser, FaDog, FaCalendarAlt, FaCreditCard, FaBell, FaClipboardList } from 'react-icons/fa';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'motion/react';
import { gsap } from 'gsap';
import FadeIn from '../Components/FadeIn';

// Componente de carga para usar con Suspense
const LoadingIndicator = () => (
  <div className="flex items-center justify-center min-h-screen">
    <motion.div 
      className="p-4 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-12 h-12 mx-auto mb-3 border-4 rounded-full border-t-dog-green border-r-dog-green border-b-transparent border-l-transparent animate-spin"></div>
      <p className="text-xl">Cargando dashboard...</p>
    </motion.div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  // Usar selectores estándar de Zustand
  const user = useAuthStore(state => state.user);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const loading = useAuthStore(state => state.loading);
  const logout = useAuthStore(state => state.logout);
  const verifyAuth = useAuthStore(state => state.verifyAuth);
  
  const [activeTab, setActiveTab] = useState('resumen');
  const [isPageLoading, setIsPageLoading] = useState(true);
  
  // Referencias para animaciones
  const headerRef = useRef(null);
  const sidebarRef = useRef(null);
  const contentRef = useRef(null);
  const statsRef = useRef(null);

  // Animación inicial con GSAP
  useEffect(() => {
    if (!isPageLoading && headerRef.current && sidebarRef.current && contentRef.current) {
      // Animación del header
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
      
      // Animación del sidebar
      gsap.fromTo(
        sidebarRef.current,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.6, delay: 0.2, ease: "power2.out" }
      );
      
      // Animación del contenido principal
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.6, delay: 0.4, ease: "power2.out" }
      );
      
      // Animación de las estadísticas
      if (statsRef.current && statsRef.current.children) {
        gsap.fromTo(
          statsRef.current.children,
          { opacity: 0, y: 20 },
          { 
            opacity: 1, 
            y: 0, 
            stagger: 0.1, 
            duration: 0.5, 
            delay: 0.6,
            ease: "power1.out" 
          }
        );
      }
    }
  }, [isPageLoading, activeTab]);

  // Redirigir si no está autenticado y verificar estado de autenticación
  useEffect(() => {
    const checkAuthentication = async () => {
      // Si no está cargando y no está autenticado, redirigir al login
      if (!loading && !isAuthenticated) {
        navigate('/login', { replace: true });
        return;
      }
      
      // Si hay un token pero no hay datos del usuario, intentar obtenerlos
      if (localStorage.getItem('token') && !user && !loading) {
        await verifyAuth();
      }
      
      // Después de 300ms establecer isPageLoading a false
      // Esto evita parpadeos y da tiempo a que se carguen los datos
      setTimeout(() => {
        setIsPageLoading(false);
      }, 300);
    };
    
    checkAuthentication();
  }, [isAuthenticated, loading, navigate, user, verifyAuth]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // Mostrar indicador de carga mientras se verifica la autenticación
  if (loading || isPageLoading) {
    return <LoadingIndicator />;
  }

  // Datos de ejemplo para el dashboard
  const actividadReciente = [
    { id: 1, tipo: 'Paseo', fecha: '2023-08-15', estado: 'Completado', mascota: 'Max' },
    { id: 2, tipo: 'Consulta', fecha: '2023-08-10', estado: 'Cancelado', mascota: 'Luna' },
    { id: 3, tipo: 'Paseo', fecha: '2023-08-05', estado: 'Completado', mascota: 'Rocky' }
  ];

  const proximos = [
    { id: 4, tipo: 'Paseo', fecha: '2023-08-20', hora: '15:00', mascota: 'Max' },
    { id: 5, tipo: 'Guardería', fecha: '2023-08-22', hora: '09:00', mascota: 'Luna' }
  ];

  const mascotas = [
    { id: 1, nombre: 'Max', raza: 'Golden Retriever', edad: 3 },
    { id: 2, nombre: 'Luna', raza: 'Beagle', edad: 2 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header ref={headerRef} className="bg-white shadow-md">
        <div className="container flex items-center justify-between p-4 mx-auto">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-dog-dark">Dashboard</h1>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/" 
                className="flex items-center px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                <FaHome className="mr-1" /> Inicio
              </Link>
            </motion.div>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-gray-500 md:inline-block">
              Hola, <span className="font-medium text-dog-green">{user?.nombre || user?.email || 'Usuario'}</span>
            </span>
            <motion.button 
              onClick={handleLogout}
              className="px-4 py-2 text-white transition rounded-md bg-dog-green hover:bg-dog-light-green"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cerrar sesión
            </motion.button>
          </div>
        </div>
      </header>

      <main className="container p-4 mx-auto mt-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Sidebar de navegación */}
          <div ref={sidebarRef} className="p-4 bg-white rounded-lg shadow md:col-span-3">
            <div className="p-4 mb-6 text-center rounded-lg bg-gray-50">
              <motion.div 
                className="inline-flex items-center justify-center w-20 h-20 mb-3 overflow-hidden text-white rounded-full bg-dog-green"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <FaUser size={32} />
              </motion.div>
              <motion.h3 
                className="text-lg font-semibold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {user?.nombre || 'Usuario'}
              </motion.h3>
              <motion.p 
                className="text-sm text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {user?.email || 'email@ejemplo.com'}
              </motion.p>
              <motion.p 
                className="mt-2 text-xs font-medium text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                {user?.rol === 'Paseador' ? 'Paseador' : 'Cliente'}
              </motion.p>
            </div>
            
            <nav>
              <ul className="space-y-2">
                <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <button 
                    className={`w-full flex items-center p-3 text-left rounded-md ${activeTab === 'resumen' ? 'bg-dog-green text-white' : 'hover:bg-gray-100'}`}
                    onClick={() => setActiveTab('resumen')}
                  >
                    <FaClipboardList className="mr-3" />
                    Resumen
                  </button>
                </motion.li>
                <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <button 
                    className={`w-full flex items-center p-3 text-left rounded-md ${activeTab === 'perfil' ? 'bg-dog-green text-white' : 'hover:bg-gray-100'}`}
                    onClick={() => setActiveTab('perfil')}
                  >
                    <FaUser className="mr-3" />
                    Mi Perfil
                  </button>
                </motion.li>
                <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <button 
                    className={`w-full flex items-center p-3 text-left rounded-md ${activeTab === 'mascotas' ? 'bg-dog-green text-white' : 'hover:bg-gray-100'}`}
                    onClick={() => setActiveTab('mascotas')}
                  >
                    <FaDog className="mr-3" />
                    Mis Mascotas
                  </button>
                </motion.li>
                <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <button 
                    className={`w-full flex items-center p-3 text-left rounded-md ${activeTab === 'reservas' ? 'bg-dog-green text-white' : 'hover:bg-gray-100'}`}
                    onClick={() => setActiveTab('reservas')}
                  >
                    <FaCalendarAlt className="mr-3" />
                    Mis Reservas
                  </button>
                </motion.li>
                {user?.rol === 'Cliente' && (
                  <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                    <button 
                      className={`w-full flex items-center p-3 text-left rounded-md ${activeTab === 'pagos' ? 'bg-dog-green text-white' : 'hover:bg-gray-100'}`}
                      onClick={() => setActiveTab('pagos')}
                    >
                      <FaCreditCard className="mr-3" />
                      Pagos
                    </button>
                  </motion.li>
                )}
                <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <button 
                    className={`w-full flex items-center p-3 text-left rounded-md ${activeTab === 'notificaciones' ? 'bg-dog-green text-white' : 'hover:bg-gray-100'}`}
                    onClick={() => setActiveTab('notificaciones')}
                  >
                    <FaBell className="mr-3" />
                    Notificaciones
                  </button>
                </motion.li>
              </ul>
            </nav>
          </div>

          {/* Contenido principal */}
          <div ref={contentRef} className="p-6 bg-white rounded-lg shadow md:col-span-9">
            <Suspense fallback={<div className="p-4 text-center">Cargando contenido...</div>}>
              <AnimatePresence mode="wait">
                {activeTab === 'resumen' && (
                  <motion.div
                    key="resumen"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="mb-6 text-2xl font-semibold">Resumen de actividad</h2>
                    
                    <div ref={statsRef} className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
                      <motion.div 
                        className="p-4 transition border rounded-lg hover:shadow-md"
                        whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium">Próximos servicios</h3>
                          <span className="px-2 py-1 text-xs text-blue-700 rounded-full bg-blue-50">{proximos.length}</span>
                        </div>
                        <p className="mt-2 text-2xl font-bold">{proximos.length}</p>
                        <p className="text-sm text-gray-500">Servicios programados</p>
                      </motion.div>
                      
                      <motion.div 
                        className="p-4 transition border rounded-lg hover:shadow-md"
                        whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium">Servicios completados</h3>
                          <span className="px-2 py-1 text-xs text-green-700 rounded-full bg-green-50">2</span>
                        </div>
                        <p className="mt-2 text-2xl font-bold">2</p>
                        <p className="text-sm text-gray-500">En el último mes</p>
                      </motion.div>
                      
                      <motion.div 
                        className="p-4 transition border rounded-lg hover:shadow-md"
                        whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium">Mascotas registradas</h3>
                          <span className="px-2 py-1 text-xs text-purple-700 rounded-full bg-purple-50">{mascotas.length}</span>
                        </div>
                        <p className="mt-2 text-2xl font-bold">{mascotas.length}</p>
                        <p className="text-sm text-gray-500">Perros a tu cuidado</p>
                      </motion.div>
                    </div>
                    
                    <div className="mb-8">
                      <h3 className="mb-4 text-xl font-medium">Actividad reciente</h3>
                      <FadeIn direction="up" delay={0.2}>
                        <div className="overflow-hidden border rounded-lg">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Tipo</th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Fecha</th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Mascota</th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Estado</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {actividadReciente.map((item, index) => (
                                <motion.tr 
                                  key={item.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                                >
                                  <td className="px-6 py-4 whitespace-nowrap">{item.tipo}</td>
                                  <td className="px-6 py-4 whitespace-nowrap">{item.fecha}</td>
                                  <td className="px-6 py-4 whitespace-nowrap">{item.mascota}</td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                      item.estado === 'Completado' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                    }`}>
                                      {item.estado}
                                    </span>
                                  </td>
                                </motion.tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </FadeIn>
                    </div>
                    
                    <div>
                      <h3 className="mb-4 text-xl font-medium">Próximos servicios</h3>
                      <FadeIn direction="up" delay={0.3}>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          {proximos.map((item, index) => (
                            <motion.div 
                              key={item.id} 
                              className="p-4 border rounded-lg"
                              whileHover={{ scale: 1.02, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                              transition={{ 
                                duration: 0.3,
                                delay: 0.2 * index 
                              }}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">{item.tipo}</span>
                                <span className="px-2 py-1 text-xs text-blue-700 rounded-full bg-blue-50">Programado</span>
                              </div>
                              <p className="mb-1 text-sm text-gray-600">Fecha: {item.fecha}</p>
                              <p className="mb-1 text-sm text-gray-600">Hora: {item.hora}</p>
                              <p className="text-sm text-gray-600">Mascota: {item.mascota}</p>
                            </motion.div>
                          ))}
                        </div>
                      </FadeIn>
                    </div>
                  </motion.div>
                )}
                
                {activeTab === 'perfil' && (
                  <motion.div
                    key="perfil"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="mb-6 text-2xl font-semibold">Mi Perfil</h2>
                    <FadeIn direction="up">
                      <div className="p-4 mb-6 border rounded-lg">
                        <h3 className="mb-4 text-xl font-medium">Información Personal</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Nombre</label>
                            <input 
                              type="text" 
                              className="w-full p-2 border rounded-md"
                              defaultValue={user?.nombre || ''}
                              placeholder="Tu nombre"
                            />
                          </div>
                          <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                            <input 
                              type="email" 
                              className="w-full p-2 border rounded-md"
                              defaultValue={user?.email || ''}
                              placeholder="tu@email.com"
                              disabled
                            />
                          </div>
                          <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Teléfono</label>
                            <input 
                              type="tel" 
                              className="w-full p-2 border rounded-md"
                              placeholder="Tu teléfono"
                            />
                          </div>
                          <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Dirección</label>
                            <input 
                              type="text" 
                              className="w-full p-2 border rounded-md"
                              placeholder="Tu dirección"
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <motion.button 
                            className="px-4 py-2 text-white rounded-md bg-dog-green hover:bg-dog-light-green"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Guardar Cambios
                          </motion.button>
                        </div>
                      </div>
                    </FadeIn>
                    
                    <FadeIn direction="up" delay={0.2}>
                      <div className="p-4 border rounded-lg">
                        <h3 className="mb-4 text-xl font-medium">Cambiar Contraseña</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Contraseña Actual</label>
                            <input 
                              type="password" 
                              className="w-full p-2 border rounded-md"
                              placeholder="******"
                            />
                          </div>
                          <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Nueva Contraseña</label>
                            <input 
                              type="password" 
                              className="w-full p-2 border rounded-md"
                              placeholder="******"
                            />
                          </div>
                          <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Confirmar Nueva Contraseña</label>
                            <input 
                              type="password" 
                              className="w-full p-2 border rounded-md"
                              placeholder="******"
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <motion.button 
                            className="px-4 py-2 text-white rounded-md bg-dog-green hover:bg-dog-light-green"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Actualizar Contraseña
                          </motion.button>
                        </div>
                      </div>
                    </FadeIn>
                  </motion.div>
                )}
                
                {activeTab === 'mascotas' && (
                  <motion.div
                    key="mascotas"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-semibold">Mis Mascotas</h2>
                      <motion.button 
                        className="px-4 py-2 text-white rounded-md bg-dog-green hover:bg-dog-light-green"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Añadir Mascota
                      </motion.button>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {mascotas.map((mascota, index) => (
                        <FadeIn key={mascota.id} direction="up" delay={0.1 * index}>
                          <motion.div 
                            className="p-4 border rounded-lg"
                            whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                          >
                            <div className="flex items-start">
                              <div className="w-16 h-16 mr-4 overflow-hidden rounded-full bg-gray-50">
                                <FaDog className="w-full h-full p-4 text-dog-green" />
                              </div>
                              <div>
                                <h3 className="text-lg font-medium">{mascota.nombre}</h3>
                                <p className="text-sm text-gray-600">{mascota.raza}</p>
                                <p className="text-sm text-gray-600">{mascota.edad} años</p>
                              </div>
                            </div>
                            <div className="flex mt-4 space-x-2">
                              <motion.button 
                                className="px-3 py-1 text-sm text-white rounded-md bg-dog-green hover:bg-dog-light-green"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Editar
                              </motion.button>
                              <motion.button 
                                className="px-3 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Eliminar
                              </motion.button>
                            </div>
                          </motion.div>
                        </FadeIn>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;