import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaUsers, 
  FaDog, 
  FaCalendarCheck, 
  FaMoneyBillWave,
  FaShoppingCart,
  FaChartBar,
  FaUser,
  FaHome,
  FaUsersCog,
  FaEdit,
  FaTrash,
  FaStore,
  FaPlus,
  FaBoxes,
  FaMinus
} from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// eslint-disable-next-line
import { motion } from 'framer-motion';
import adminService from '../Services/adminService';
import useAuthStore from '../store/authStore';
import Navbar from '../Components/Navbar';
import toast, { Toaster } from 'react-hot-toast';
import articleService from '../Services/articleService';

const AdminDashboard = () => {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const sidebarRef = React.useRef(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // Obtener usuarios actuales
  const filteredUsers = users.filter(user => 
    user.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.rol?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Ir a la página anterior
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Ir a la página siguiente
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const [articles, setArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [articlesPagination, setArticlesPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalItems: 0,
    totalPaginas: 0
  });
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [articleForm, setArticleForm] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    categoria: 0,
    imagenes: []
  });

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await adminService.getDashboard();
        setDashboardData(data);
      } catch (err) {
        setError('Error al cargar los datos del dashboard');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (activeTab === 1) {
      loadUsers();
    }
  }, [activeTab]);

  const loadUsers = async () => {
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      toast.error('Error al cargar la lista de usuarios');
    }
  };

  const handleAssignRole = async () => {
    try {
      await adminService.assignRole(selectedUser.id, selectedRole);
      toast.success('Rol asignado correctamente');
      setIsRoleModalOpen(false);
      loadUsers(); // Recargar la lista de usuarios
    } catch (error) {
      console.error('Error al asignar rol:', error);
      toast.error('Error al asignar el rol');
    }
  };

  const handleDeleteUser = async (userId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Eliminar Usuario',
      message: '¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.',
      onConfirm: async () => {
        try {
          await adminService.deleteUser(userId);
          toast.success('Usuario eliminado correctamente');
          loadUsers();
        } catch (error) {
          console.error('Error al eliminar usuario:', error);
          toast.error('Error al eliminar el usuario');
        }
        setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null });
      }
    });
  };

  // Cargar artículos por categoría
  useEffect(() => {
    if (activeTab === 2) {
      loadArticlesByCategory();
    }
  }, [activeTab, selectedCategory, articlesPagination.pageNumber]);

  const loadArticlesByCategory = async () => {
    try {
      const response = await articleService.getByCategoria(selectedCategory, {
        pageNumber: articlesPagination.pageNumber,
        pageSize: articlesPagination.pageSize
      });
      setArticles(response.items || []);
      setArticlesPagination({
        ...articlesPagination,
        totalItems: response.totalItems,
        totalPaginas: response.totalPaginas
      });
    } catch (error) {
      console.error('Error al cargar artículos:', error);
      toast.error('Error al cargar los artículos');
    }
  };

  const handleCreateArticle = async () => {
    try {
      await articleService.create(articleForm);
      toast.success('Artículo creado correctamente');
      setIsArticleModalOpen(false);
      loadArticlesByCategory();
    } catch (error) {
      console.error('Error al crear artículo:', error);
      toast.error('Error al crear el artículo');
    }
  };

  const handleUpdateArticle = async () => {
    try {
      // Validaciones más estrictas
      if (!articleForm.nombre || articleForm.nombre.trim() === '') {
        toast.error('El nombre es requerido');
        return;
      }
      
      if (!articleForm.descripcion || articleForm.descripcion.trim() === '') {
        toast.error('La descripción es requerida');
        return;
      }

      const precio = Number(articleForm.precio);
      if (isNaN(precio) || precio < 0) {
        toast.error('El precio debe ser un número válido y no puede ser negativo');
        return;
      }

      const categoria = Number(articleForm.categoria);
      console.log('Validando categoría:', {
        original: articleForm.categoria,
        convertida: categoria
      });

      if (isNaN(categoria) || categoria < 0) {
        toast.error('Debes seleccionar una categoría válida');
        return;
      }

      // Formatear datos según UpdateArticuloDto
      const formattedArticle = {
        nombre: articleForm.nombre.trim(),
        descripcion: articleForm.descripcion.trim(),
        precio: precio,
        categoria: categoria,
        imagenes: Array.isArray(articleForm.imagenes) ? 
          articleForm.imagenes.filter(url => url && typeof url === 'string' && url.trim() !== '') : 
          []
      };

      console.log('ID del artículo:', selectedArticle.id);
      console.log('Datos del formulario:', articleForm);
      console.log('Datos formateados para enviar:', formattedArticle);

      await articleService.update(selectedArticle.id, formattedArticle);
      toast.success('Artículo actualizado correctamente');
      setIsArticleModalOpen(false);
      loadArticlesByCategory();
    } catch (error) {
      console.error('Error detallado al actualizar artículo:', error);
      const errorMessage = error.message || 'Error desconocido';
      toast.error(`Error al actualizar el artículo: ${errorMessage}`);
    }
  };

  const handleDeleteArticle = async (id) => {
    setConfirmModal({
      isOpen: true,
      title: 'Eliminar Artículo',
      message: '¿Estás seguro de que deseas eliminar este artículo? Esta acción no se puede deshacer.',
      onConfirm: async () => {
        try {
          console.log('Intentando eliminar artículo:', id);
          await articleService.delete(id);
          toast.success('Artículo eliminado correctamente');
          await loadArticlesByCategory();
        } catch (error) {
          console.error('Error al eliminar artículo:', error);
          toast.error(`Error al eliminar el artículo: ${error.message || 'Error desconocido'}`);
        }
        setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null });
      }
    });
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
      title: 'Total Usuarios',
      value: dashboardData?.totalUsuarios || 0,
      icon: <FaUsers className="w-10 h-10 text-blue-500" />
    },
    {
      title: 'Total Paseadores',
      value: dashboardData?.totalPaseadores || 0,
      icon: <FaDog className="w-10 h-10 text-green-500" />
    },
    {
      title: 'Total Reservas',
      value: dashboardData?.totalReservas || 0,
      icon: <FaCalendarCheck className="w-10 h-10 text-purple-500" />
    },
    {
      title: 'Ingresos Totales',
      value: `€${dashboardData?.ingresosTotales?.toFixed(2) || '0.00'}`,
      icon: <FaMoneyBillWave className="w-10 h-10 text-yellow-500" />
    },
    {
      title: 'Ingresos Mensuales',
      value: `€${dashboardData?.ingresosMensuales?.toFixed(2) || '0.00'}`,
      icon: <FaChartBar className="w-10 h-10 text-red-500" />
    },
    {
      title: 'Artículos Vendidos',
      value: dashboardData?.totalArticulosVendidos || 0,
      icon: <FaShoppingCart className="w-10 h-10 text-orange-500" />
    }
  ];

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen py-8 bg-gray-50">
        {/* Header */}
        <header className="mb-3 bg-white shadow-md">
          <div className="container flex items-center justify-between p-4 mx-auto">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-dog-dark">Dashboard de Administrador</h1>
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
                Hola, <span className="font-medium text-dog-green">{user?.nombre || user?.email || 'Administrador'}</span>
              </span>
              <motion.button 
                onClick={() => {
                  logout();
                  window.location.href = '/login';
                }}
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
                  {user?.fotoPerfil ? (
                    <img 
                      src={user.fotoPerfil} 
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
                  {user?.nombre || 'Administrador'}
                </motion.h3>
                <motion.p 
                  className="text-sm text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  {user?.email || 'admin@ejemplo.com'}
                </motion.p>
              </div>
              
              <nav>
                <ul className="space-y-2">
                  <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                    <button 
                      className={`w-full flex items-center p-3 text-left rounded-md ${activeTab === 0 ? 'bg-dog-green text-white' : 'hover:bg-gray-100'}`}
                      onClick={() => setActiveTab(0)}
                    >
                      <FaChartBar className="mr-3" />
                      Dashboard
                    </button>
                  </motion.li>
                  <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                    <button 
                      className={`w-full flex items-center p-3 text-left rounded-md ${activeTab === 1 ? 'bg-dog-green text-white' : 'hover:bg-gray-100'}`}
                      onClick={() => setActiveTab(1)}
                    >
                      <FaUsersCog className="mr-3" />
                      Gestión de Usuarios
                    </button>
                  </motion.li>
                  <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                    <button 
                      className={`w-full flex items-center p-3 text-left rounded-md ${activeTab === 2 ? 'bg-dog-green text-white' : 'hover:bg-gray-100'}`}
                      onClick={() => setActiveTab(2)}
                    >
                      <FaStore className="mr-3" />
                      Gestión de Artículos
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
                    Panel de Control
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
                    {/* Gráfico de Servicios Más Populares */}
                    <div className="p-6 bg-white rounded-lg shadow-sm">
                      <h2 className="mb-6 text-xl font-semibold text-gray-900">
                        Servicios Más Populares
                      </h2>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={dashboardData?.serviciosMasPopulares || []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="key" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#8884d8" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Gráfico de Paseadores Más Reservados */}
                    <div className="p-6 bg-white rounded-lg shadow-sm">
                      <h2 className="mb-6 text-xl font-semibold text-gray-900">
                        Paseadores Más Reservados
                      </h2>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={dashboardData?.paseadoresMasReservados || []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="key" />
                            <YAxis />
                            <Tooltip />
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
                  <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                      Gestión de Usuarios
                    </h1>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Buscar usuarios..."
                          value={searchTerm}
                          onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // Resetear a la primera página al buscar
                          }}
                          className="px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-dog-green"
                        />
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                          🔍
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                            Usuario
                          </th>
                          <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                            Email
                          </th>
                          <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                            Rol
                          </th>
                          <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 w-10 h-10">
                                  {user.fotoPerfil ? (
                                    <img
                                      className="w-10 h-10 rounded-full"
                                      src={user.fotoPerfil}
                                      alt=""
                                    />
                                  ) : (
                                    <div className="flex items-center justify-center w-10 h-10 text-white rounded-full bg-dog-green">
                                      <FaUser />
                                    </div>
                                  )}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {user.nombre} {user.apellido}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{user.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                                {user.rol}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                              <div className="flex space-x-3">
                                <button
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setSelectedRole(user.rol);
                                    setIsRoleModalOpen(true);
                                  }}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  <FaEdit className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <FaTrash className="w-5 h-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Paginación */}
                    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
                      <div className="flex items-center">
                        <p className="text-sm text-gray-700">
                          Mostrando{' '}
                          <span className="font-medium">{indexOfFirstUser + 1}</span>
                          {' '}-{' '}
                          <span className="font-medium">
                            {Math.min(indexOfLastUser, filteredUsers.length)}
                          </span>
                          {' '}de{' '}
                          <span className="font-medium">{filteredUsers.length}</span>
                          {' '}usuarios
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={goToPreviousPage}
                          disabled={currentPage === 1}
                          className={`px-3 py-1 text-sm font-medium rounded-md ${
                            currentPage === 1
                              ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                              : 'text-gray-700 bg-gray-200 hover:bg-gray-300'
                          }`}
                        >
                          Anterior
                        </button>
                        {[...Array(totalPages)].map((_, index) => {
                          const pageNumber = index + 1;
                          // Mostrar solo 5 páginas alrededor de la página actual
                          if (
                            pageNumber === 1 ||
                            pageNumber === totalPages ||
                            (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
                          ) {
                            return (
                              <button
                                key={pageNumber}
                                onClick={() => paginate(pageNumber)}
                                className={`px-3 py-1 text-sm font-medium rounded-md ${
                                  currentPage === pageNumber
                                    ? 'text-white bg-dog-green'
                                    : 'text-gray-700 bg-gray-200 hover:bg-gray-300'
                                }`}
                              >
                                {pageNumber}
                              </button>
                            );
                          } else if (
                            pageNumber === currentPage - 3 ||
                            pageNumber === currentPage + 3
                          ) {
                            return <span key={pageNumber}>...</span>;
                          }
                          return null;
                        })}
                        <button
                          onClick={goToNextPage}
                          disabled={currentPage === totalPages}
                          className={`px-3 py-1 text-sm font-medium rounded-md ${
                            currentPage === totalPages
                              ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                              : 'text-gray-700 bg-gray-200 hover:bg-gray-300'
                          }`}
                        >
                          Siguiente
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 2 && (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                      Gestión de Artículos
                    </h1>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedArticle(null);
                        setArticleForm({
                          nombre: '',
                          descripcion: '',
                          precio: 0,
                          stock: 0,
                          categoria: 0,
                          imagenes: []
                        });
                        setIsArticleModalOpen(true);
                      }}
                      className="flex items-center px-4 py-2 text-white rounded-md bg-dog-green hover:bg-dog-light-green"
                    >
                      <FaPlus className="mr-2" /> Nuevo Artículo
                    </motion.button>
                  </div>

                  {/* Filtro por categorías */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {articleService.getCategorias().map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          setArticlesPagination({ ...articlesPagination, pageNumber: 1 });
                        }}
                        className={`px-4 py-2 text-sm font-medium rounded-full ${
                          selectedCategory === cat.id
                            ? 'bg-dog-green text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {cat.nombre}
                      </button>
                    ))}
                  </div>

                  {/* Lista de artículos */}
                  <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                      <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                Artículo
                              </th>
                              <th scope="col" className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                Precio
                              </th>
                              <th scope="col" className="px-3 py-2 text-xs font-medium tracking-wider text-center text-gray-500 uppercase">
                                Stock
                              </th>
                              <th scope="col" className="px-3 py-2 text-xs font-medium tracking-wider text-center text-gray-500 uppercase">
                                Acciones
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {articles.map((article) => (
                              <tr key={article.id} className="hover:bg-gray-50">
                                <td className="px-3 py-2">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 w-8 h-8">
                                      {article.imagenes?.[0] ? (
                                        <img
                                          className="object-cover w-8 h-8 rounded-full"
                                          src={article.imagenes[0]}
                                          alt={article.nombre}
                                        />
                                      ) : (
                                        <div className="flex items-center justify-center w-8 h-8 text-white rounded-full bg-dog-green">
                                          <FaBoxes className="w-4 h-4" />
                                        </div>
                                      )}
                                    </div>
                                    <div className="ml-2">
                                      <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                                        {article.nombre}
                                      </div>
                                      <div className="text-xs text-gray-500 truncate max-w-[200px]">
                                        {article.descripcion}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-3 py-2 text-sm text-gray-900">
                                  €{article.precio.toFixed(2)}
                                </td>
                                <td className="px-3 py-2">
                                  <div className="flex items-center justify-center space-x-2">
                                    <button
                                      onClick={async () => {
                                        try {
                                          await articleService.updateStock(article.id, -1); // Decrementar 1
                                          loadArticlesByCategory();
                                        } catch (error) {
                                          toast.error('Error al actualizar el stock', error);
                                        }
                                      }}
                                      disabled={article.stock <= 0}
                                      className={`p-1 rounded ${
                                        article.stock <= 0 
                                          ? 'text-gray-400 cursor-not-allowed' 
                                          : 'text-gray-600 hover:bg-gray-100'
                                      }`}
                                    >
                                      <FaMinus className="w-3 h-3" />
                                    </button>
                                    <span className={`px-2 py-1 text-sm font-semibold rounded ${
                                      article.stock > 10
                                        ? 'text-green-800 bg-green-100'
                                        : article.stock > 0
                                        ? 'text-yellow-800 bg-yellow-100'
                                        : 'text-red-800 bg-red-100'
                                    }`}>
                                      {article.stock}
                                    </span>
                                    <button
                                      onClick={async () => {
                                        try {
                                          await articleService.updateStock(article.id, 1); // Incrementar 1
                                          loadArticlesByCategory();
                                        } catch (error) {
                                          toast.error('Error al actualizar el stock', error);
                                        }
                                      }}
                                      className="p-1 text-gray-600 rounded hover:bg-gray-100"
                                    >
                                      <FaPlus className="w-3 h-3" />
                                    </button>
                                  </div>
                                </td>
                                <td className="px-3 py-2 text-sm font-medium text-center">
                                  <div className="flex items-center justify-center space-x-2">
                                    <button
                                      onClick={() => {
                                        const categoriaNum = Number(article.categoria);
                                        console.log('Artículo seleccionado para editar:', {
                                          ...article,
                                          categoria: categoriaNum
                                        });
                                        setSelectedArticle(article);
                                        setArticleForm({
                                          nombre: article.nombre || '',
                                          descripcion: article.descripcion || '',
                                          precio: article.precio || 0,
                                          categoria: categoriaNum,
                                          imagenes: article.imagenes || []
                                        });
                                        setIsArticleModalOpen(true);
                                      }}
                                      className="text-blue-600 hover:text-blue-900"
                                    >
                                      <FaEdit className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteArticle(article.id)}
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      <FaTrash className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal para asignar rol */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div 
            className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Asignar Rol</h3>
              <button 
                onClick={() => setIsRoleModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Seleccionar Rol
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dog-green"
              >
                <option value="Usuario">Usuario</option>
                <option value="Paseador">Paseador</option>
                <option value="Administrador">Administrador</option>
              </select>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setIsRoleModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleAssignRole}
                className="px-4 py-2 text-white rounded-md bg-dog-green hover:bg-dog-light-green"
              >
                Guardar
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal para crear/editar artículo */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div 
            className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">
                {selectedArticle ? 'Editar Artículo' : 'Nuevo Artículo'}
              </h3>
              <button 
                onClick={() => setIsArticleModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  type="text"
                  value={articleForm.nombre}
                  onChange={(e) => setArticleForm({...articleForm, nombre: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Descripción
                </label>
                <textarea
                  value={articleForm.descripcion}
                  onChange={(e) => setArticleForm({...articleForm, descripcion: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  rows="3"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Precio
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={articleForm.precio}
                    onChange={(e) => setArticleForm({...articleForm, precio: parseFloat(e.target.value)})}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Categoría
                  </label>
                  <select
                    value={articleForm.categoria}
                    onChange={(e) => {
                      const categoriaNum = Number(e.target.value);
                      console.log('Valor seleccionado:', {
                        original: e.target.value,
                        convertido: categoriaNum
                      });
                      setArticleForm({
                        ...articleForm,
                        categoria: categoriaNum
                      });
                    }}
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="">Selecciona una categoría</option>
                    {articleService.getCategorias().map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  URLs de Imágenes (una por línea)
                </label>
                <textarea
                  value={articleForm.imagenes.join('\n')}
                  onChange={(e) => setArticleForm({
                    ...articleForm,
                    imagenes: e.target.value.split('\n').filter(url => url.trim() !== '')
                  })}
                  className="w-full p-2 border rounded-md"
                  rows="3"
                  placeholder="https://ejemplo.com/imagen1.jpg&#10;https://ejemplo.com/imagen2.jpg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setIsArticleModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={selectedArticle ? handleUpdateArticle : handleCreateArticle}
                className="px-4 py-2 text-white rounded-md bg-dog-green hover:bg-dog-light-green"
              >
                {selectedArticle ? 'Guardar Cambios' : 'Crear Artículo'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal de Confirmación */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div 
            className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">{confirmModal.title}</h3>
              <button 
                onClick={() => setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null })}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="mb-6 text-gray-700">{confirmModal.message}</p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null })}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={confirmModal.onConfirm}
                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Confirmar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard; 