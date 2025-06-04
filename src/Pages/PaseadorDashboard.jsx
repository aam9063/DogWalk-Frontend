import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  getPaseadorDashboard, 
  getPaseadorProfile,
  getPaseadorReservas,
  updatePaseadorProfile,
  confirmarReserva,
  cancelarReserva,
  completarReserva
} from '../Services/paseadorDashboardService';
import { 
  FaMoneyBillWave, 
  FaStar, 
  FaUsers, 
  FaClock, 
  FaCheckCircle, 
  FaHourglassHalf,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaDog,
  FaHome,
  FaClipboardList,
  FaCalendarAlt
} from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// eslint-disable-next-line
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore';
import Navbar from '../Components/Navbar';
import DisponibilidadHoraria from '../Components/DisponibilidadHoraria';
import { toast } from 'react-toastify';

const PaseadorDashboard = () => {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const [dashboardData, setDashboardData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [reservasData, setReservasData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [editProfileForm, setEditProfileForm] = useState({
    nombre: '',
    apellido: '',
    direccion: '',
    telefono: '',
    latitud: '',
    longitud: ''
  });
  const sidebarRef = React.useRef(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [dashboard, profile, reservas] = await Promise.all([
          getPaseadorDashboard(),
          getPaseadorProfile(),
          getPaseadorReservas()
        ]);
        setDashboardData(dashboard);
        setProfileData(profile);
        setReservasData(reservas);
      } catch (err) {
        setError('Error al cargar los datos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // Función para abrir el modal de edición de perfil
  const handleOpenEditProfileModal = () => {
    setEditProfileForm({
      nombre: profileData?.nombre || '',
      apellido: profileData?.apellido || '',
      direccion: profileData?.direccion || '',
      telefono: profileData?.telefono || '',
      latitud: profileData?.latitud?.toString() || '',
      longitud: profileData?.longitud?.toString() || ''
    });
    setIsEditProfileModalOpen(true);
  };

  // Efecto para mantener sincronizados los datos del perfil
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const data = await getPaseadorProfile();
        setProfileData(data);
        setEditProfileForm({
          nombre: data.nombre || '',
          apellido: data.apellido || '',
          direccion: data.direccion || '',
          telefono: data.telefono || '',
          latitud: data.latitud?.toString() || '0',
          longitud: data.longitud?.toString() || '0'
        });
      } catch (error) {
        console.error('Error al cargar el perfil:', error);
        toast.error('Error al cargar los datos del perfil');
      }
    };

    // Cargar datos del perfil al montar el componente y cuando cambie la pestaña
    loadProfileData();
  }, [activeTab]);

  // Función para recargar los datos del perfil
  const reloadProfileData = async () => {
    try {
      const data = await getPaseadorProfile();
      setProfileData(data);
      setEditProfileForm({
        nombre: data.nombre || '',
        apellido: data.apellido || '',
        direccion: data.direccion || '',
        telefono: data.telefono || '',
        latitud: data.latitud?.toString() || '0',
        longitud: data.longitud?.toString() || '0'
      });
    } catch (error) {
      console.error('Error al recargar el perfil:', error);
    }
  };

  // Función para manejar la actualización del perfil
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      // Validar que todos los campos requeridos estén presentes
      if (!editProfileForm.nombre || !editProfileForm.apellido || !editProfileForm.direccion || !editProfileForm.telefono) {
        toast.error('Todos los campos son requeridos');
        return;
      }

      // Validar el formato del teléfono (solo números)
      if (!/^\d+$/.test(editProfileForm.telefono)) {
        toast.error('El teléfono solo debe contener números');
        return;
      }

      // Preparar los datos exactamente como los espera el endpoint
      const formData = {
        nombre: editProfileForm.nombre.trim(),
        apellido: editProfileForm.apellido.trim(),
        direccion: editProfileForm.direccion.trim(),
        telefono: editProfileForm.telefono.trim(),
        latitud: parseFloat(editProfileForm.latitud) || 0,
        longitud: parseFloat(editProfileForm.longitud) || 0
      };

      // Intentar actualizar el perfil
      await updatePaseadorProfile(formData);
      
      // Recargar los datos inmediatamente después de la actualización
      await reloadProfileData();
      
      // Cerrar el modal
      setIsEditProfileModalOpen(false);
      
      toast.success('Perfil actualizado correctamente');

    } catch (error) {
      console.error('Error completo:', error);
      toast.error('Error al actualizar el perfil. Por favor, inténtalo de nuevo.');
    }
  };

  // Función para manejar los cambios de estado de las reservas
  const handleReservaStatusChange = async (reservaId, action) => {
    try {
      let actionFn;
      let successMessage;
      
      switch (action) {
        case 'confirmar':
          actionFn = confirmarReserva;
          successMessage = 'Reserva confirmada correctamente';
          break;
        case 'cancelar':
          if (!window.confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
            return;
          }
          actionFn = cancelarReserva;
          successMessage = 'Reserva cancelada correctamente';
          break;
        case 'completar':
          actionFn = completarReserva;
          successMessage = 'Reserva marcada como completada';
          break;
        default:
          return;
      }

      await actionFn(reservaId);
      
      // Recargar las reservas después de la acción
      const updatedReservas = await getPaseadorReservas();
      setReservasData(updatedReservas);
      
      toast.success(successMessage);
    } catch (error) {
      console.error(`Error al ${action} la reserva:`, error);
      toast.error(`Error al ${action} la reserva. Por favor, inténtalo de nuevo.`);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-16 h-16 border-4 rounded-full border-t-dog-green border-r-dog-green border-b-transparent border-l-transparent animate-spin"></div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-red-600">{error}</p>
        </div>
      </>
    );
  }

  const statsCards = [
    {
      title: 'Total Ingresos',
      value: `€${dashboardData?.totalIngresos || 0}`,
      icon: <FaMoneyBillWave className="w-10 h-10 text-green-500" />
    },
    {
      title: 'Valoración Promedio',
      value: `${Number(dashboardData?.valoracionPromedio || 0).toFixed(1)}`,
      icon: <FaStar className="w-10 h-10 text-yellow-500" />
    },
    {
      title: 'Total Valoraciones',
      value: dashboardData?.totalValoraciones || 0,
      icon: <FaUsers className="w-10 h-10 text-blue-500" />
    },
    {
      title: 'Total Reservas',
      value: dashboardData?.totalReservas || 0,
      icon: <FaClock className="w-10 h-10 text-purple-500" />
    },
    {
      title: 'Reservas Completadas',
      value: dashboardData?.reservasCompletadas || 0,
      icon: <FaCheckCircle className="w-10 h-10 text-green-500" />
    },
    {
      title: 'Reservas Pendientes',
      value: dashboardData?.reservasPendientes || 0,
      icon: <FaHourglassHalf className="w-10 h-10 text-orange-500" />
    }
  ];

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completada':
        return 'bg-green-100 text-green-800';
      case 'Cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <div className="min-h-screen py-8 bg-gray-50">
        {/* Header */}
        <header className="mb-3 bg-white shadow-md">
          <div className="container flex items-center justify-between p-4 mx-auto">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-dog-dark">Dashboard de Paseador</h1>
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
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

        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Grid para sidebar y contenido principal */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            {/* Sidebar */}
            <div ref={sidebarRef} className="p-4 bg-white rounded-lg shadow md:col-span-3">
              <div className="p-4 mb-6 text-center rounded-lg bg-gray-50">
                <motion.div 
                  className="inline-flex items-center justify-center w-20 h-20 mb-3 overflow-hidden text-white rounded-full bg-dog-green"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {profileData?.fotoPerfil ? (
                    <img 
                      src={profileData.fotoPerfil} 
                      alt="Perfil" 
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <FaUser size={32} />
                  )}
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
              </div>
              
              <nav>
                <ul className="space-y-2">
                  <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                    <button 
                      className={`w-full flex items-center p-3 text-left rounded-md ${activeTab === 0 ? 'bg-dog-green text-white' : 'hover:bg-gray-100'}`}
                      onClick={() => setActiveTab(0)}
                    >
                      <FaClipboardList className="mr-3" />
                      Dashboard
                    </button>
                  </motion.li>
                  <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                    <button 
                      className={`w-full flex items-center p-3 text-left rounded-md ${activeTab === 1 ? 'bg-dog-green text-white' : 'hover:bg-gray-100'}`}
                      onClick={() => setActiveTab(1)}
                    >
                      <FaUser className="mr-3" />
                      Mi Perfil
                    </button>
                  </motion.li>
                  <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                    <button 
                      className={`w-full flex items-center p-3 text-left rounded-md ${activeTab === 2 ? 'bg-dog-green text-white' : 'hover:bg-gray-100'}`}
                      onClick={() => setActiveTab(2)}
                    >
                      <FaDog className="mr-3" />
                      Mis Reservas
                    </button>
                  </motion.li>
                  <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                    <button 
                      className={`w-full flex items-center p-3 text-left rounded-md ${activeTab === 3 ? 'bg-dog-green text-white' : 'hover:bg-gray-100'}`}
                      onClick={() => setActiveTab(3)}
                    >
                      <FaStar className="mr-3" />
                      Valoraciones
                    </button>
                  </motion.li>
                  <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                    <button 
                      className={`w-full flex items-center p-3 text-left rounded-md ${activeTab === 4 ? 'bg-dog-green text-white' : 'hover:bg-gray-100'}`}
                      onClick={() => setActiveTab(4)}
                    >
                      <FaCalendarAlt className="mr-3" />
                      Disponibilidad
                    </button>
                  </motion.li>
                </ul>
              </nav>
            </div>

            {/* Contenido Principal */}
            <div className="p-6 bg-white rounded-lg shadow md:col-span-9">
              {activeTab === 0 && (
                <>
                  <h1 className="mb-8 text-3xl font-bold text-gray-900">
                    Dashboard de Paseador
                  </h1>

                  <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
                    {statsCards.map((stat, index) => (
                      <div
                        key={index}
                        className="p-6 transition-shadow bg-white rounded-lg shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-center mb-4">
                          {stat.icon}
                          <h2 className="ml-3 text-lg font-semibold text-gray-700">
                            {stat.title}
                          </h2>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="p-6 bg-white rounded-lg shadow-sm">
                      <h2 className="mb-6 text-xl font-semibold text-gray-900">
                        Servicios Más Reservados
                      </h2>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={dashboardData?.serviciosMasReservados || []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="key" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#8884d8" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="p-6 bg-white rounded-lg shadow-sm">
                      <h2 className="mb-6 text-xl font-semibold text-gray-900">
                        Reservas por Día
                      </h2>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={dashboardData?.reservasPorDia || []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="key" 
                              tickFormatter={(value) => new Date(value).toLocaleDateString()} 
                            />
                            <YAxis />
                            <Tooltip 
                              labelFormatter={(value) => new Date(value).toLocaleDateString()} 
                            />
                            <Bar dataKey="value" fill="#82ca9d" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 1 && (
                <>
                  <h1 className="mb-8 text-3xl font-bold text-gray-900">
                    Mi Perfil
                  </h1>
                  <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center">
                          <div className="ml-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                              {profileData?.nombre} {profileData?.apellido}
                            </h2>
                            <p className="text-gray-600">Paseador</p>
                          </div>
                        </div>
                        <motion.button
                          onClick={handleOpenEditProfileModal}
                          className="px-4 py-2 text-white rounded-md bg-dog-green hover:bg-dog-light-green"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Editar Perfil
                        </motion.button>
                      </div>

                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                          <div className="flex items-center">
                            <FaUser className="w-5 h-5 text-dog-green" />
                            <span className="ml-3"><strong>Nombre:</strong> {profileData?.nombre}</span>
                          </div>
                          <div className="flex items-center">
                            <FaUser className="w-5 h-5 text-dog-green" />
                            <span className="ml-3"><strong>Apellido:</strong> {profileData?.apellido}</span>
                          </div>
                          <div className="flex items-center">
                            <FaMapMarkerAlt className="w-5 h-5 text-dog-green" />
                            <span className="ml-3"><strong>Dirección:</strong> {profileData?.direccion}</span>
                          </div>
                          <div className="flex items-center">
                            <FaPhone className="w-5 h-5 text-dog-green" />
                            <span className="ml-3"><strong>Teléfono:</strong> {profileData?.telefono}</span>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center">
                            <FaStar className="w-5 h-5 text-dog-green" />
                            <span className="ml-3"><strong>Valoración:</strong> {profileData?.valoracionPromedio}/5</span>
                          </div>
                          <div className="flex items-center">
                            <FaUsers className="w-5 h-5 text-dog-green" />
                            <span className="ml-3"><strong>Valoraciones:</strong> {profileData?.cantidadValoraciones}</span>
                          </div>
                          <div className="flex items-center">
                            <FaMapMarkerAlt className="w-5 h-5 text-dog-green" />
                            <span className="ml-3"><strong>Radio de servicio:</strong> {profileData?.radioServicio} km</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 2 && (
                <>
                  <h1 className="mb-8 text-3xl font-bold text-gray-900">
                    Mis Reservas
                  </h1>
                  <div className="space-y-4">
                    {reservasData.map((reserva) => (
                      <div
                        key={reserva.id}
                        className="p-6 bg-white rounded-lg shadow-sm"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className="p-3 rounded-full bg-dog-green bg-opacity-10">
                              <FaDog className="w-6 h-6 text-dog-green" />
                            </div>
                            <h3 className="ml-4 text-lg font-semibold text-gray-900">
                              {reserva.nombrePerro || 'Mascota'}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(reserva.estado)}`}>
                              {reserva.estado || 'Pendiente'}
                            </span>
                            <div className="flex gap-2 ml-4">
                              {reserva.estado === 'Pendiente' && (
                                <>
                                  <button
                                    onClick={() => handleReservaStatusChange(reserva.id, 'confirmar')}
                                    className="px-3 py-1 text-white bg-green-500 rounded-md hover:bg-green-600"
                                  >
                                    Confirmar
                                  </button>
                                  <button
                                    onClick={() => handleReservaStatusChange(reserva.id, 'cancelar')}
                                    className="px-3 py-1 text-white bg-red-500 rounded-md hover:bg-red-600"
                                  >
                                    Cancelar
                                  </button>
                                </>
                              )}
                              {reserva.estado === 'Confirmada' && (
                                <button
                                  onClick={() => handleReservaStatusChange(reserva.id, 'completar')}
                                  className="px-3 py-1 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                                >
                                  Marcar como Completada
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 text-sm text-gray-600 md:grid-cols-2">
                          <div>
                            <p><span className="font-medium"><strong>Cliente:</strong></span> {reserva.nombreUsuario}</p>
                            <p><span className="font-medium"><strong>Servicio:</strong></span> {reserva.nombreServicio}</p>
                          </div>
                          <div>
                            <p><span className="font-medium"><strong>Fecha:</strong></span> {new Date(reserva.fechaReserva).toLocaleDateString()}</p>
                            <p><span className="font-medium"><strong>Dirección:</strong></span> {reserva.direccionRecogida}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {reservasData.length === 0 && (
                      <div className="p-6 text-center bg-white rounded-lg">
                        <p className="text-gray-500"><strong>No tienes reservas pendientes</strong></p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {activeTab === 3 && (
                <>
                  <h1 className="mb-8 text-2xl font-bold text-gray-900">
                    Mis Valoraciones
                  </h1>
                  <div className="mb-8">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="p-6 bg-white rounded-lg shadow-sm">
                        <h3 className="mb-2 text-lg font-semibold text-gray-700">Valoración Promedio</h3>
                        <div className="flex items-center">
                          <FaStar className="w-6 h-6 mr-2 text-yellow-400" />
                          <p className="text-3xl font-bold text-gray-900">{Number(dashboardData?.valoracionPromedio || 0).toFixed(1)}</p>
                        </div>
                      </div>
                      <div className="p-6 bg-white rounded-lg shadow-sm">
                        <h3 className="mb-2 text-lg font-semibold text-gray-700">Total Valoraciones</h3>
                        <div className="flex items-center">
                          <FaUsers className="w-6 h-6 text-blue-500" />
                          <span className="ml-2 text-3xl font-bold text-gray-900">{profileData?.cantidadValoraciones || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h2 className="mb-4 text-xl font-bold">Valoraciones</h2>
                  <div className="space-y-4">
                    {profileData?.valoraciones?.map((valoracion) => (
                      <div key={valoracion.id} className="p-4 bg-white rounded-lg shadow">
                        <div className="flex items-center mb-2">
                          {valoracion.fotoUsuario ? (
                            <img 
                              src={valoracion.fotoUsuario} 
                              alt={valoracion.nombreUsuario}
                              className="object-cover w-10 h-10 mr-3 rounded-full"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-10 h-10 mr-3 text-white rounded-full bg-dog-green">
                              <FaUser size={20} />
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold">{valoracion.nombreUsuario}</h3>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar 
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= valoracion.puntuacion 
                                      ? 'text-yellow-400' 
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600">{valoracion.comentario}</p>
                        <p className="mt-2 text-sm text-gray-500">
                          {new Date(valoracion.fechaValoracion).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                    {(!profileData?.valoraciones || profileData.valoraciones.length === 0) && (
                      <div className="p-6 text-center bg-white rounded-lg">
                        <p className="text-gray-500">No has recibido valoraciones todavía</p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {activeTab === 4 && (
                <>
                  <h1 className="mb-8 text-2xl font-bold text-gray-900">
                    Gestión de Disponibilidad
                  </h1>
                  <DisponibilidadHoraria />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Edición de Perfil */}
      {isEditProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div 
            className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Editar Perfil</h3>
              <button 
                onClick={() => setIsEditProfileModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleProfileUpdate}>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={editProfileForm.nombre}
                    onChange={(e) => setEditProfileForm({...editProfileForm, nombre: e.target.value})}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Apellido
                  </label>
                  <input
                    type="text"
                    value={editProfileForm.apellido}
                    onChange={(e) => setEditProfileForm({...editProfileForm, apellido: e.target.value})}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Dirección
                  </label>
                  <input
                    type="text"
                    value={editProfileForm.direccion}
                    onChange={(e) => setEditProfileForm({...editProfileForm, direccion: e.target.value})}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    value={editProfileForm.telefono}
                    onChange={(e) => setEditProfileForm({...editProfileForm, telefono: e.target.value})}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Latitud
                  </label>
                  <input
                    type="text"
                    value={editProfileForm.latitud}
                    onChange={(e) => setEditProfileForm({...editProfileForm, latitud: e.target.value})}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Longitud
                  </label>
                  <input
                    type="text"
                    value={editProfileForm.longitud}
                    onChange={(e) => setEditProfileForm({...editProfileForm, longitud: e.target.value})}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                
                
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditProfileModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white rounded-md bg-dog-green hover:bg-dog-light-green"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default PaseadorDashboard; 