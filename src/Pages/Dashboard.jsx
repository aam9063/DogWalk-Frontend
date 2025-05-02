import { useState, useEffect, Suspense } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { FaArrowLeft, FaHome, FaUser, FaDog, FaCalendarAlt, FaCreditCard, FaBell, FaClipboardList } from 'react-icons/fa';

// Componente de carga para usar con Suspense
const LoadingIndicator = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="p-4 text-center">
      <div className="w-12 h-12 mx-auto mb-3 border-4 rounded-full border-t-dog-green border-r-dog-green border-b-transparent border-l-transparent animate-spin"></div>
      <p className="text-xl">Cargando dashboard...</p>
    </div>
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
      <header className="bg-white shadow-md">
        <div className="container flex items-center justify-between p-4 mx-auto">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-dog-dark">Dashboard</h1>
            <Link 
              to="/" 
              className="flex items-center px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              <FaHome className="mr-1" /> Inicio
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-gray-500 md:inline-block">
              Hola, <span className="font-medium text-dog-green">{user?.nombre || user?.email || 'Usuario'}</span>
            </span>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 text-white transition rounded-md bg-dog-green hover:bg-dog-light-green"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="container p-4 mx-auto mt-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Sidebar de navegación */}
          <div className="p-4 bg-white rounded-lg shadow md:col-span-3">
            <div className="p-4 mb-6 text-center rounded-lg bg-gray-50">
              <div className="inline-flex items-center justify-center w-20 h-20 mb-3 overflow-hidden text-white rounded-full bg-dog-green">
                <FaUser size={32} />
              </div>
              <h3 className="text-lg font-semibold">{user?.nombre || 'Usuario'}</h3>
              <p className="text-sm text-gray-500">{user?.email || 'email@ejemplo.com'}</p>
              <p className="mt-2 text-xs font-medium text-gray-600">
                {user?.rol === 'Paseador' ? 'Paseador' : 'Cliente'}
              </p>
            </div>
            
            <nav>
              <ul className="space-y-2">
                <li>
                  <button 
                    className={`w-full flex items-center p-3 text-left rounded-md ${activeTab === 'resumen' ? 'bg-dog-green text-white' : 'hover:bg-gray-100'}`}
                    onClick={() => setActiveTab('resumen')}
                  >
                    <FaClipboardList className="mr-3" />
                    Resumen
                  </button>
                </li>
                <li>
                  <button 
                    className={`w-full flex items-center p-3 text-left rounded-md ${activeTab === 'perfil' ? 'bg-dog-green text-white' : 'hover:bg-gray-100'}`}
                    onClick={() => setActiveTab('perfil')}
                  >
                    <FaUser className="mr-3" />
                    Mi Perfil
                  </button>
                </li>
                <li>
                  <button 
                    className={`w-full flex items-center p-3 text-left rounded-md ${activeTab === 'mascotas' ? 'bg-dog-green text-white' : 'hover:bg-gray-100'}`}
                    onClick={() => setActiveTab('mascotas')}
                  >
                    <FaDog className="mr-3" />
                    Mis Mascotas
                  </button>
                </li>
                <li>
                  <button 
                    className={`w-full flex items-center p-3 text-left rounded-md ${activeTab === 'reservas' ? 'bg-dog-green text-white' : 'hover:bg-gray-100'}`}
                    onClick={() => setActiveTab('reservas')}
                  >
                    <FaCalendarAlt className="mr-3" />
                    Mis Reservas
                  </button>
                </li>
                {user?.rol === 'Cliente' && (
                  <li>
                    <button 
                      className={`w-full flex items-center p-3 text-left rounded-md ${activeTab === 'pagos' ? 'bg-dog-green text-white' : 'hover:bg-gray-100'}`}
                      onClick={() => setActiveTab('pagos')}
                    >
                      <FaCreditCard className="mr-3" />
                      Pagos
                    </button>
                  </li>
                )}
                <li>
                  <button 
                    className={`w-full flex items-center p-3 text-left rounded-md ${activeTab === 'notificaciones' ? 'bg-dog-green text-white' : 'hover:bg-gray-100'}`}
                    onClick={() => setActiveTab('notificaciones')}
                  >
                    <FaBell className="mr-3" />
                    Notificaciones
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          {/* Contenido principal */}
          <div className="p-6 bg-white rounded-lg shadow md:col-span-9">
            <Suspense fallback={<div className="p-4 text-center">Cargando contenido...</div>}>
              {activeTab === 'resumen' && (
                <div>
                  <h2 className="mb-6 text-2xl font-semibold">Resumen de actividad</h2>
                  
                  <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
                    <div className="p-4 transition border rounded-lg hover:shadow-md">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Próximos servicios</h3>
                        <span className="px-2 py-1 text-xs text-blue-700 rounded-full bg-blue-50">{proximos.length}</span>
                      </div>
                      <p className="mt-2 text-2xl font-bold">{proximos.length}</p>
                      <p className="text-sm text-gray-500">Servicios programados</p>
                    </div>
                    
                    <div className="p-4 transition border rounded-lg hover:shadow-md">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Mis mascotas</h3>
                        <span className="px-2 py-1 text-xs text-green-700 rounded-full bg-green-50">{mascotas.length}</span>
                      </div>
                      <p className="mt-2 text-2xl font-bold">{mascotas.length}</p>
                      <p className="text-sm text-gray-500">Mascotas registradas</p>
                    </div>
                    
                    <div className="p-4 transition border rounded-lg hover:shadow-md">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Servicios realizados</h3>
                        <span className="px-2 py-1 text-xs text-purple-700 rounded-full bg-purple-50">3</span>
                      </div>
                      <p className="mt-2 text-2xl font-bold">3</p>
                      <p className="text-sm text-gray-500">Servicios completados</p>
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="mb-4 text-xl font-semibold">Próximos servicios</h3>
                    {proximos.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="p-3 text-left text-gray-600">Fecha</th>
                              <th className="p-3 text-left text-gray-600">Hora</th>
                              <th className="p-3 text-left text-gray-600">Servicio</th>
                              <th className="p-3 text-left text-gray-600">Mascota</th>
                              <th className="p-3 text-left text-gray-600">Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {proximos.map(servicio => (
                              <tr key={servicio.id} className="border-b border-gray-100">
                                <td className="p-3">{servicio.fecha}</td>
                                <td className="p-3">{servicio.hora}</td>
                                <td className="p-3">{servicio.tipo}</td>
                                <td className="p-3">{servicio.mascota}</td>
                                <td className="p-3">
                                  <button className="px-3 py-1 text-xs text-white rounded-md bg-dog-green hover:bg-dog-light-green">
                                    Ver detalles
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="p-4 text-center text-gray-500 rounded-md bg-gray-50">No tienes servicios programados.</p>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="mb-4 text-xl font-semibold">Actividad reciente</h3>
                    {actividadReciente.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="p-3 text-left text-gray-600">Fecha</th>
                              <th className="p-3 text-left text-gray-600">Servicio</th>
                              <th className="p-3 text-left text-gray-600">Mascota</th>
                              <th className="p-3 text-left text-gray-600">Estado</th>
                            </tr>
                          </thead>
                          <tbody>
                            {actividadReciente.map(actividad => (
                              <tr key={actividad.id} className="border-b border-gray-100">
                                <td className="p-3">{actividad.fecha}</td>
                                <td className="p-3">{actividad.tipo}</td>
                                <td className="p-3">{actividad.mascota}</td>
                                <td className="p-3">
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    actividad.estado === 'Completado' ? 'bg-green-50 text-green-700' : 
                                    actividad.estado === 'Cancelado' ? 'bg-red-50 text-red-700' : 
                                    'bg-yellow-50 text-yellow-700'
                                  }`}>
                                    {actividad.estado}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="p-4 text-center text-gray-500 rounded-md bg-gray-50">No hay actividad reciente.</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'perfil' && (
                <div>
                  <h2 className="mb-6 text-2xl font-semibold">Mi Perfil</h2>
                  
                  <div className="p-4 mb-6 border rounded-lg">
                    <h3 className="mb-4 text-xl font-medium">Información Personal</h3>
                    
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <p className="mb-1 text-sm text-gray-500">Nombre</p>
                        <p className="font-medium">{user?.nombre || 'No disponible'}</p>
                      </div>
                      
                      <div>
                        <p className="mb-1 text-sm text-gray-500">Apellido</p>
                        <p className="font-medium">{user?.apellido || 'No disponible'}</p>
                      </div>
                      
                      <div>
                        <p className="mb-1 text-sm text-gray-500">Email</p>
                        <p className="font-medium">{user?.email || 'No disponible'}</p>
                      </div>
                      
                      <div>
                        <p className="mb-1 text-sm text-gray-500">Tipo de cuenta</p>
                        <p className="font-medium">{user?.rol === 'Paseador' ? 'Paseador' : 'Cliente'}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <button className="px-4 py-2 text-white rounded-md bg-dog-green hover:bg-dog-light-green">
                        Editar Perfil
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4 mb-6 border rounded-lg">
                    <h3 className="mb-4 text-xl font-medium">Cambiar Contraseña</h3>
                    
                    <form className="space-y-4">
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Contraseña actual</label>
                        <input 
                          type="password" 
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dog-green"
                        />
                      </div>
                      
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Nueva contraseña</label>
                        <input 
                          type="password" 
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dog-green"
                        />
                      </div>
                      
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Confirmar nueva contraseña</label>
                        <input 
                          type="password" 
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dog-green"
                        />
                      </div>
                      
                      <button type="button" className="px-4 py-2 text-white rounded-md bg-dog-green hover:bg-dog-light-green">
                        Actualizar contraseña
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {activeTab === 'mascotas' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">Mis Mascotas</h2>
                    <button className="px-4 py-2 text-white rounded-md bg-dog-green hover:bg-dog-light-green">
                      Agregar mascota
                    </button>
                  </div>
                  
                  {mascotas.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {mascotas.map(mascota => (
                        <div key={mascota.id} className="p-4 transition border rounded-lg hover:shadow-md">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-medium">{mascota.nombre}</h3>
                              <p className="text-sm text-gray-500">{mascota.raza}</p>
                              <p className="mt-2">{mascota.edad} años</p>
                            </div>
                            <div className="p-3 rounded-full bg-gray-50">
                              <FaDog className="text-2xl text-dog-green" />
                            </div>
                          </div>
                          <div className="flex mt-4 space-x-2">
                            <button className="px-3 py-1 text-sm bg-white border rounded-md text-dog-green border-dog-green hover:bg-gray-50">
                              Editar
                            </button>
                            <button className="px-3 py-1 text-sm text-white rounded-md bg-dog-green hover:bg-dog-light-green">
                              Ver detalles
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center rounded-lg bg-gray-50">
                      <FaDog className="mx-auto mb-4 text-4xl text-gray-300" />
                      <h3 className="mb-2 text-xl font-medium">No tienes mascotas registradas</h3>
                      <p className="mb-4 text-gray-500">Registra a tus compañeros peludos para comenzar a utilizar nuestros servicios.</p>
                      <button className="px-4 py-2 text-white rounded-md bg-dog-green hover:bg-dog-light-green">
                        Registrar mascota
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'reservas' && (
                <div>
                  <h2 className="mb-6 text-2xl font-semibold">Mis Reservas</h2>
                  <p className="text-gray-600">Aquí podrás ver y gestionar tus reservas de servicios.</p>
                  {/* Contenido de reservas aquí */}
                </div>
              )}

              {activeTab === 'pagos' && (
                <div>
                  <h2 className="mb-6 text-2xl font-semibold">Historial de Pagos</h2>
                  <p className="text-gray-600">Aquí podrás ver tu historial de pagos y facturas.</p>
                  {/* Contenido de pagos aquí */}
                </div>
              )}

              {activeTab === 'notificaciones' && (
                <div>
                  <h2 className="mb-6 text-2xl font-semibold">Notificaciones</h2>
                  <p className="text-gray-600">Aquí podrás ver tus notificaciones y alertas.</p>
                  {/* Contenido de notificaciones aquí */}
                </div>
              )}
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;