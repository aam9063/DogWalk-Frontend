import { useState, useEffect, Suspense, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../store/authStore';
import { FaHome, FaUser, FaDog, FaClipboardList, FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import FadeIn from '../Components/FadeIn';
import { getDashboardData, getUserProfile, updateUserProfile, getDogsList, createDog, updateDog, deleteDog, getReservasCompletadas } from '../Services/userDashboardService';
import { gsap } from 'gsap';
import { FixedSizeList as List } from 'react-window';
import { enviarValoracion } from '../Services/rankingService';

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

// Componente para la fila de la tabla
const CompraRow = ({ index, style, data }) => {
  const compra = data[index];
  return (
    <motion.div
      style={style}
      className="flex items-center border-b hover:bg-gray-50"
      whileHover={{ scale: 1.005 }}
    >
      <div className="w-[20%] p-3 whitespace-nowrap">
        {new Date(compra.fechaCompra).toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })}
      </div>
      <div className="w-[60%] p-3 font-mono text-sm truncate" title={compra.numeroFactura}>
        {compra.numeroFactura}
      </div>
      <div className="w-[20%] p-3 text-right whitespace-nowrap">
        {compra.total.toFixed(2)} €
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const loading = useAuthStore(state => state.loading);
  const logout = useAuthStore(state => state.logout);
  const verifyAuth = useAuthStore(state => state.verifyAuth);
  
  const [activeTab, setActiveTab] = useState('resumen');
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    estadisticas: {
      totalReservas: 0,
      totalGastado: 0,
      numeroPerros: 0,
      reservasPendientes: 0,
      reservasCompletadas: 0,
      serviciosMasUsados: [],
      paseadoresFavoritos: []
    },
    historialCompras: []
  });
  const [profileData, setProfileData] = useState(null);
  const [dogsList, setDogsList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    nombre: '',
    apellido: '',
    direccion: '',
    telefono: '',
    fotoPerfil: '',
    email: ''
  });
  
  // Referencias para animaciones
  const headerRef = useRef(null);
  const sidebarRef = useRef(null);
  const contentRef = useRef(null);
  const statsRef = useRef(null);

  // Estados para el modal de mascotas
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' o 'edit'
  const [currentDog, setCurrentDog] = useState({
    nombre: '',
    raza: '',
    edad: 0,
    gpsUbicacion: ''
  });

  // Estados para valoraciones
  const [isValoracionModalOpen, setIsValoracionModalOpen] = useState(false);
  const [valoracionForm, setValoracionForm] = useState({
    reservaId: '',
    paseadorId: '',
    puntuacion: 5,
    comentario: ''
  });

  // Cargar reservas completadas cuando se selecciona la pestaña de valoraciones
  const [reservasCompletadas, setReservasCompletadas] = useState([]);

  // Cargar datos del dashboard
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await getDashboardData();
        setDashboardData(data);
      } catch {
        toast.error('Error al cargar los datos del dashboard');
      }
    };

    if (isAuthenticated && !loading) {
      loadDashboardData();
    }
  }, [isAuthenticated, loading]);

  // Cargar perfil cuando se selecciona la pestaña correspondiente
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const data = await getUserProfile();
        setProfileData(data);
        setEditForm({
          nombre: data.nombre || '',
          apellido: data.apellido || '',
          direccion: data.direccion || '',
          telefono: data.telefono || '',
          fotoPerfil: data.fotoPerfil || '',
          email: data.email || ''
        });
      } catch (error) {
        console.error('Error al cargar el perfil:', error);
        toast.error('Error al cargar el perfil');
      }
    };

    if (activeTab === 'perfil' && isAuthenticated) {
      loadProfileData();
    }
  }, [activeTab, isAuthenticated]);

  // Cargar lista de perros cuando se selecciona la pestaña correspondiente
  useEffect(() => {
    const loadDogsList = async () => {
      try {
        const data = await getDogsList();
        setDogsList(data);
      } catch {
        toast.error('Error al cargar la lista de perros');
      }
    };

    if (activeTab === 'mascotas' && isAuthenticated) {
      loadDogsList();
    }
  }, [activeTab, isAuthenticated]);

  // Cargar reservas completadas cuando se selecciona la pestaña de valoraciones
  useEffect(() => {
    const loadReservasCompletadas = async () => {
      try {
        const data = await getReservasCompletadas();
        setReservasCompletadas(data);
      } catch (error) {
        console.error('Error al cargar las reservas completadas:', error);
        toast.error('Error al cargar las reservas completadas');
      }
    };

    if (activeTab === 'valoraciones' && isAuthenticated) {
      loadReservasCompletadas();
    }
  }, [activeTab, isAuthenticated]);

  // Manejar actualización del perfil
  const handleProfileUpdate = async () => {
    try {
      const updatedProfile = await updateUserProfile({
        ...editForm,
        email: profileData.email
      });
      
      setProfileData({
        ...updatedProfile,
        email: profileData.email
      });
      
      setEditForm({
        nombre: updatedProfile.nombre || '',
        apellido: updatedProfile.apellido || '',
        direccion: updatedProfile.direccion || '',
        telefono: updatedProfile.telefono || '',
        fotoPerfil: updatedProfile.fotoPerfil || '',
        email: profileData.email || ''
      });
      
      setIsEditing(false);
      toast.success('Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      toast.error('Error al actualizar el perfil');
    }
  };

  // Función para abrir el modal en modo creación
  const handleOpenCreateModal = () => {
    setModalMode('create');
    setCurrentDog({
      nombre: '',
      raza: '',
      edad: 0,
      gpsUbicacion: ''
    });
    setIsModalOpen(true);
  };

  // Función para abrir el modal en modo edición
  const handleOpenEditModal = (dog) => {
    setModalMode('edit');
    setCurrentDog({
      id: dog.id,
      nombre: dog.nombre || '',
      raza: dog.raza || '',
      edad: dog.edad || 0,
      gpsUbicacion: dog.gpsUbicacion || ''
    });
    setIsModalOpen(true);
  };

  // Función para manejar el envío del formulario
  const handleSubmitDog = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'create') {
        await createDog(currentDog);
        toast.success('Mascota agregada correctamente');
      } else {
        const updateData = {
          nombre: currentDog.nombre,
          raza: currentDog.raza,
          edad: parseInt(currentDog.edad),
          gpsUbicacion: currentDog.gpsUbicacion || null
        };
        await updateDog(currentDog.id, updateData);
        toast.success('Mascota actualizada correctamente');
      }
      
      // Recargar lista de perros
      const updatedDogs = await getDogsList();
      setDogsList(updatedDogs);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error(modalMode === 'create' 
        ? 'Error al agregar la mascota' 
        : 'Error al actualizar la mascota');
    }
  };

  // Manejar eliminación de perro
  const handleDeleteDog = async (id) => {
    try {
      if (!window.confirm('¿Estás seguro de que deseas eliminar esta mascota?')) {
        return;
      }
      
      await deleteDog(id);
      toast.success('Mascota eliminada correctamente');
      // Recargar lista de perros
      const updatedDogs = await getDogsList();
      setDogsList(updatedDogs);
    } catch (error) {
      console.error('Error al eliminar mascota:', error);
      toast.error('Error al eliminar la mascota. Por favor, inténtalo de nuevo.');
    }
  };

  // Animación inicial con GSAP
  useEffect(() => {
    if (!isPageLoading && headerRef.current && sidebarRef.current && contentRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
      
      gsap.fromTo(
        sidebarRef.current,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.6, delay: 0.2, ease: "power2.out" }
      );
      
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.6, delay: 0.4, ease: "power2.out" }
      );
    }
  }, [isPageLoading, activeTab]);

  // Verificar autenticación
  useEffect(() => {
    const checkAuthentication = async () => {
      if (!loading && !isAuthenticated) {
        navigate('/login', { replace: true });
        return;
      }
      
      if (localStorage.getItem('token') && !user && !loading) {
        await verifyAuth();
      }
      
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

  const handleValoracionSubmit = async (e) => {
    e.preventDefault();
    try {
      await enviarValoracion(
        valoracionForm.paseadorId,
        valoracionForm.puntuacion,
        valoracionForm.comentario
      );
      toast.success('Valoración enviada con éxito');
      setIsValoracionModalOpen(false);
      
      // Actualizar la lista de reservas localmente para marcar esta como valorada
      setReservasCompletadas(prevReservas => 
        prevReservas.map(reserva => 
          reserva.id === valoracionForm.reservaId
            ? { ...reserva, valorada: true }
            : reserva
        )
      );
      
    } catch (error) {
      console.error('Error al enviar la valoración:', error);
      toast.error('Error al enviar la valoración');
    }
  };

  if (loading || isPageLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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

      {/* Main Content */}
      <main className="container p-4 mx-auto mt-6">
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
                    className={`w-full flex items-center p-3 text-left rounded-md ${activeTab === 'valoraciones' ? 'bg-dog-green text-white' : 'hover:bg-gray-100'}`}
                    onClick={() => setActiveTab('valoraciones')}
                  >
                    <FaStar className="mr-3" />
                    Mis Valoraciones
                  </button>
                </motion.li>
              </ul>
            </nav>
          </div>

          {/* Content Area */}
          <div ref={contentRef} className="p-6 bg-white rounded-lg shadow md:col-span-9">
            <Suspense fallback={<div className="p-4 text-center">Cargando contenido...</div>}>
              <AnimatePresence mode="wait">
                {/* Dashboard Summary */}
                {activeTab === 'resumen' && dashboardData && (
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
                          <h3 className="text-lg font-medium">Total Reservas</h3>
                          <span className="px-2 py-1 text-xs text-blue-700 rounded-full bg-blue-50">
                            {dashboardData.estadisticas.totalReservas}
                          </span>
                        </div>
                        <p className="mt-2 text-2xl font-bold">{dashboardData.estadisticas.totalReservas}</p>
                        <p className="text-sm text-gray-500">Reservas realizadas</p>
                      </motion.div>
                      
                      <motion.div 
                        className="p-4 transition border rounded-lg hover:shadow-md"
                        whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium">Reservas Completadas</h3>
                          <span className="px-2 py-1 text-xs text-green-700 rounded-full bg-green-50">
                            {dashboardData.estadisticas.reservasCompletadas}
                          </span>
                        </div>
                        <p className="mt-2 text-2xl font-bold">{dashboardData.estadisticas.reservasCompletadas}</p>
                        <p className="text-sm text-gray-500">Servicios finalizados</p>
                      </motion.div>
                      
                      <motion.div 
                        className="p-4 transition border rounded-lg hover:shadow-md"
                        whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium">Mascotas Registradas</h3>
                          <span className="px-2 py-1 text-xs text-purple-700 rounded-full bg-purple-50">
                            {dashboardData.estadisticas.numeroPerros}
                          </span>
                        </div>
                        <p className="mt-2 text-2xl font-bold">{dashboardData.estadisticas.numeroPerros}</p>
                        <p className="text-sm text-gray-500">Perros registrados</p>
                      </motion.div>
                    </div>

                    {/* Servicios más usados */}
                    {dashboardData.estadisticas.serviciosMasUsados && dashboardData.estadisticas.serviciosMasUsados.length > 0 && (
                      <div className="mb-8">
                        <h3 className="mb-4 text-xl font-medium">Servicios más usados</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          {dashboardData.estadisticas.serviciosMasUsados.map((servicio, index) => (
                            <motion.div
                              key={index}
                              className="p-4 border rounded-lg"
                              whileHover={{ scale: 1.02 }}
                            >
                              <h4 className="font-medium">{servicio.key}</h4>
                              <p className="text-2xl font-bold">{servicio.value}</p>
                              <p className="text-sm text-gray-500">veces solicitado</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Historial de compras */}
                    {dashboardData.historialCompras && dashboardData.historialCompras.length > 0 && (
                      <div className="mb-8">
                        <h3 className="mb-4 text-xl font-medium">Historial de compras</h3>
                        <div className="border rounded-lg shadow-sm">
                          {/* Encabezados de la tabla */}
                          <div className="flex border-b bg-gray-50">
                            <div className="w-[20%] p-3 font-semibold text-left">Fecha</div>
                            <div className="w-[60%] p-3 font-semibold text-left">Nº Factura</div>
                            <div className="w-[20%] p-3 font-semibold text-right">Total</div>
                          </div>
                          
                          {/* Lista virtual */}
                          <div className="overflow-auto">
                            <List
                              height={250}
                              itemCount={dashboardData.historialCompras.length}
                              itemSize={45}
                              width="100%"
                              itemData={dashboardData.historialCompras}
                              className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                            >
                              {CompraRow}
                            </List>
                          </div>
                          
                          {/* Pie de tabla con el total */}
                          <div className="flex border-t bg-gray-50">
                            <div className="w-[20%] p-3"></div>
                            <div className="w-[60%] p-3 font-bold text-right">Total Acumulado:</div>
                            <div className="w-[20%] p-3 font-bold text-right">
                              {dashboardData.historialCompras.reduce((total, compra) => total + compra.total, 0).toFixed(2)} €
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Paseadores favoritos */}
                    {dashboardData.estadisticas.paseadoresFavoritos && dashboardData.estadisticas.paseadoresFavoritos.length > 0 && (
                      <div className="mb-8">
                        <h3 className="mb-4 text-xl font-medium">Paseadores favoritos</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          {dashboardData.estadisticas.paseadoresFavoritos.map((paseador, index) => (
                            <motion.div
                              key={index}
                              className="p-4 border rounded-lg"
                              whileHover={{ scale: 1.02 }}
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-10 h-10 text-white rounded-full bg-dog-green">
                                  <FaUser />
                                </div>
                                <div>
                                  <h4 className="font-medium">{paseador.key}</h4>
                                  <p className="text-sm text-gray-500">{paseador.value} {paseador.value === 1 ? 'servicio' : 'servicios'}</p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Total gastado en servicios */}
                    <motion.div 
                      className="p-4 mb-8 transition border rounded-lg hover:shadow-md"
                      whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Total Gastado en Servicios</h3>
                        <span className="px-2 py-1 text-xs text-green-700 rounded-full bg-green-50">
                          {dashboardData.estadisticas.totalGastado} €
                        </span>
                      </div>
                      <p className="mt-2 text-2xl font-bold">{dashboardData.estadisticas.totalGastado.toFixed(2)} €</p>
                      <p className="text-sm text-gray-500">Total acumulado en servicios de paseo</p>
                    </motion.div>
                  </motion.div>
                )}

                {/* Profile Section */}
                {activeTab === 'perfil' && profileData && (
                  <motion.div
                    key="perfil"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-semibold">Mi Perfil</h2>
                      {!isEditing && (
                        <motion.button
                          onClick={() => setIsEditing(true)}
                          className="px-4 py-2 text-white rounded-md bg-dog-green hover:bg-dog-light-green"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Editar Perfil
                        </motion.button>
                      )}
                    </div>

                    <div className="p-6 border rounded-lg">
                      {isEditing ? (
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          handleProfileUpdate();
                        }}>
                          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                              <label className="block mb-2 text-sm font-medium text-gray-700">
                                Nombre
                              </label>
                              <input
                                type="text"
                                value={editForm.nombre}
                                onChange={(e) => setEditForm({...editForm, nombre: e.target.value})}
                                className="w-full p-2 border rounded-md"
                              />
                            </div>
                            <div>
                              <label className="block mb-2 text-sm font-medium text-gray-700">
                                Apellido
                              </label>
                              <input
                                type="text"
                                value={editForm.apellido}
                                onChange={(e) => setEditForm({...editForm, apellido: e.target.value})}
                                className="w-full p-2 border rounded-md"
                              />
                            </div>
                            <div>
                              <label className="block mb-2 text-sm font-medium text-gray-700">
                                Dirección
                              </label>
                              <input
                                type="text"
                                value={editForm.direccion}
                                onChange={(e) => setEditForm({...editForm, direccion: e.target.value})}
                                className="w-full p-2 border rounded-md"
                              />
                            </div>
                            <div>
                              <label className="block mb-2 text-sm font-medium text-gray-700">
                                Teléfono
                              </label>
                              <input
                                type="text"
                                value={editForm.telefono}
                                onChange={(e) => setEditForm({...editForm, telefono: e.target.value})}
                                className="w-full p-2 border rounded-md"
                              />
                            </div>
                            <div>
                              <label className="block mb-2 text-sm font-medium text-gray-700">
                                Email
                              </label>
                              <p className="p-2 text-lg text-gray-600 rounded-md bg-gray-50">{profileData.email}</p>
                            </div>
                          </div>
                          <div className="flex gap-4 mt-6">
                            <motion.button
                              type="submit"
                              className="px-4 py-2 text-white rounded-md bg-dog-green hover:bg-dog-light-green"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Guardar Cambios
                            </motion.button>
                            <motion.button
                              type="button"
                              onClick={() => {
                                setIsEditing(false);
                                setEditForm({
                                  ...profileData,
                                  email: profileData.email
                                });
                              }}
                              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Cancelar
                            </motion.button>
                          </div>
                        </form>
                      ) : (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <div>
                            <h3 className="mb-2 text-sm font-medium text-gray-700">Nombre</h3>
                            <p className="text-lg">{profileData.nombre || 'No especificado'}</p>
                          </div>
                          <div>
                            <h3 className="mb-2 text-sm font-medium text-gray-700">Apellido</h3>
                            <p className="text-lg">{profileData.apellido || 'No especificado'}</p>
                          </div>
                          <div>
                            <h3 className="mb-2 text-sm font-medium text-gray-700">Dirección</h3>
                            <p className="text-lg">{profileData.direccion || 'No especificada'}</p>
                          </div>
                          <div>
                            <h3 className="mb-2 text-sm font-medium text-gray-700">Teléfono</h3>
                            <p className="text-lg">{profileData.telefono || 'No especificado'}</p>
                          </div>
                          <div>
                            <h3 className="mb-2 text-sm font-medium text-gray-700">Email</h3>
                            <p className="text-lg">{profileData.email}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Pets Section */}
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
                        onClick={handleOpenCreateModal}
                        className="px-4 py-2 text-white rounded-md bg-dog-green hover:bg-dog-light-green"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Agregar Mascota
                      </motion.button>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {dogsList.map((dog) => (
                        <motion.div
                          key={dog.id}
                          className="p-6 border rounded-lg"
                          whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-medium">{dog.nombre || 'Sin nombre'}</h3>
                            <div className="flex gap-2">
                              <motion.button
                                onClick={() => handleOpenEditModal(dog)}
                                className="px-3 py-1 text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Editar
                              </motion.button>
                              <motion.button
                                onClick={() => handleDeleteDog(dog.id)}
                                className="px-3 py-1 text-red-600 bg-red-100 rounded-md hover:bg-red-200"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Eliminar
                              </motion.button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-gray-600">Raza: {dog.raza || 'Sin especificar'}</p>
                            <p className="text-gray-600">Edad: {dog.edad || 0} años</p>
                            {dog.gpsUbicacion && (
                              <p className="text-gray-600">GPS: {dog.gpsUbicacion}</p>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Valoraciones Section */}
                {activeTab === 'valoraciones' && (
                  <motion.div
                    key="valoraciones"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-semibold">Valorar Paseadores</h2>
                    </div>

                    {/* Reservas pendientes de valorar */}
                    <div className="mb-8">
                      <h3 className="mb-4 text-xl font-semibold">Reservas por Valorar</h3>
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {reservasCompletadas.map((reserva) => (
                          <motion.div
                            key={reserva.id}
                            className="p-6 border rounded-lg"
                            whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h4 className="text-lg font-medium">{reserva.nombrePaseador}</h4>
                                <p className="text-sm text-gray-500">
                                  Fecha: {new Date(reserva.fecha).toLocaleDateString()}
                                </p>
                              </div>
                              {reserva.valorada ? (
                                <button
                                  disabled
                                  className="px-4 py-2 text-gray-500 bg-gray-100 rounded-md cursor-not-allowed"
                                >
                                  Valorada
                                </button>
                              ) : (
                                <motion.button
                                  onClick={() => {
                                    setValoracionForm({
                                      reservaId: reserva.id,
                                      paseadorId: reserva.paseadorId,
                                      puntuacion: 5,
                                      comentario: ''
                                    });
                                    setIsValoracionModalOpen(true);
                                  }}
                                  className="px-4 py-2 text-white rounded-md bg-dog-green hover:bg-dog-light-green"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  Valorar
                                </motion.button>
                              )}
                            </div>
                            <p className="text-gray-600">
                              Mascota: {reserva.nombrePerro}
                            </p>
                          </motion.div>
                        ))}
                        {reservasCompletadas.length === 0 && (
                          <div className="col-span-2 p-6 text-center text-gray-500 border rounded-lg">
                            No hay reservas pendientes de valorar
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Suspense>
          </div>
        </div>
      </main>

      {/* Modal de Mascota */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div 
            className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">
                {modalMode === 'create' ? 'Agregar Nueva Mascota' : 'Editar Mascota'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmitDog}>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={currentDog.nombre}
                    onChange={(e) => setCurrentDog({...currentDog, nombre: e.target.value})}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Raza
                  </label>
                  <input
                    type="text"
                    value={currentDog.raza}
                    onChange={(e) => setCurrentDog({...currentDog, raza: e.target.value})}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Edad
                  </label>
                  <input
                    type="number"
                    value={currentDog.edad}
                    onChange={(e) => setCurrentDog({...currentDog, edad: parseInt(e.target.value) || 0})}
                    className="w-full p-2 border rounded-md"
                    min="0"
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Ubicación GPS
                  </label>
                  <input
                    type="text"
                    value={currentDog.gpsUbicacion}
                    onChange={(e) => setCurrentDog({...currentDog, gpsUbicacion: e.target.value})}
                    className="w-full p-2 border rounded-md"
                    placeholder="Opcional"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white rounded-md bg-dog-green hover:bg-dog-light-green"
                >
                  {modalMode === 'create' ? 'Agregar' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Modal de Valoración */}
      {isValoracionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div 
            className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Valorar Paseador</h3>
              <button 
                onClick={() => setIsValoracionModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleValoracionSubmit}>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Puntuación
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setValoracionForm(prev => ({ ...prev, puntuacion: star }))}
                      className="focus:outline-none"
                    >
                      <FaStar
                        className={star <= valoracionForm.puntuacion ? "text-yellow-400" : "text-gray-300"}
                        size={24}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Comentario
                </label>
                <textarea
                  value={valoracionForm.comentario}
                  onChange={(e) => setValoracionForm(prev => ({ ...prev, comentario: e.target.value }))}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-dog-green focus:border-transparent"
                  rows="4"
                  placeholder="Escribe tu comentario aquí..."
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsValoracionModalOpen(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white rounded-md bg-dog-green hover:bg-dog-light-green"
                >
                  Enviar Valoración
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;