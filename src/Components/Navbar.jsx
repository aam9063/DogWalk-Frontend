import { Link, useNavigate } from 'react-router-dom';
import { create } from 'zustand';
import { useState, useRef, useEffect, useCallback } from 'react';
import { FaSearch, FaBars, FaTimes, FaUser } from 'react-icons/fa';
import useAuthStore from '../store/authStore';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'motion/react';
import { gsap } from 'gsap';

// Store para el estado del carrito
const useCartStore = create((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  close: () => set({ isOpen: false }),
}));

// Store para el estado de la barra de búsqueda
const useSearchStore = create((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  close: () => set({ isOpen: false }),
}));

// Store para el estado del menú móvil
const useMobileMenuStore = create((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  close: () => set({ isOpen: false }),
}));

// Store para el menú de usuario
const useUserMenuStore = create((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  close: () => set({ isOpen: false }),
}));

const Navbar = () => {
  const navigate = useNavigate();
  const { isOpen: isCartOpen, toggle: toggleCart } = useCartStore();
  const { isOpen: isSearchOpen, toggle: toggleSearch, close: closeSearch } = useSearchStore();
  const { isOpen: isMobileMenuOpen, toggle: toggleMobileMenu, close: closeMobileMenu } = useMobileMenuStore();
  const { isOpen: isUserMenuOpen, toggle: toggleUserMenu, close: closeUserMenu } = useUserMenuStore();
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const userMenuRef = useRef(null);
  
  // Usar el store de autenticación con selectores
  const user = useAuthStore(state => state.user);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const loading = useAuthStore(state => state.loading);
  const logout = useAuthStore(state => state.logout);
  const verifyAuth = useAuthStore(state => state.verifyAuth);
  
  // Verificar estado de autenticación al cargar el componente
  useEffect(() => {
    // Comprobar si hay un token pero no hay usuario (por ejemplo, después de un refresh)
    if (localStorage.getItem('token') && !user && !loading) {
      verifyAuth();
    }
  }, [user, loading, verifyAuth]); // Includimos verifyAuth como dependencia ya que ahora es estable
  
  // Enfocar el input cuando se abre la barra de búsqueda
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);
  
  // Manejar la búsqueda cuando se presiona Enter
  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Aquí irá la lógica de búsqueda cuando tengamos contenido
      console.log('Búsqueda:', searchQuery);
      
      // Por ahora, simplemente cerramos la barra y limpiamos la consulta
      closeSearch();
      setSearchQuery('');
    }
  }, [searchQuery, closeSearch]);
  
  // Cerrar la búsqueda si se hace clic fuera
  const handleClickOutside = useCallback((e) => {
    if (isSearchOpen && searchInputRef.current && !searchInputRef.current.contains(e.target)) {
      closeSearch();
    }
    
    if (isUserMenuOpen && userMenuRef.current && !userMenuRef.current.contains(e.target)) {
      closeUserMenu();
    }
  }, [isSearchOpen, isUserMenuOpen, closeSearch, closeUserMenu]);
  
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  // Cerrar menú móvil al cambiar el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        closeMobileMenu();
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [closeMobileMenu]);
  
  // Manejar el cierre de sesión
  const handleLogout = useCallback(() => {
    logout();
    closeUserMenu();
    navigate('/');
  }, [logout, closeUserMenu, navigate]);

  // Ir al dashboard
  const goToDashboard = useCallback(() => {
    navigate('/dashboard');
    closeUserMenu();
  }, [navigate, closeUserMenu]);
  
  // Debug info - solo para desarrollo
  useEffect(() => {
    console.log('Estado de autenticación:', { isAuthenticated, user, token: localStorage.getItem('token') });
  }, [isAuthenticated, user]);

  // Referencia para el logo y navegación
  const logoRef = useRef(null);
  const navItemsRef = useRef(null);
  
  // Animación inicial con GSAP
  useEffect(() => {
    // Animación del logo
    gsap.fromTo(
      logoRef.current,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
    );
    
    // Animación de elementos de navegación
    if (navItemsRef.current) {
      const navLinks = navItemsRef.current.children;
      gsap.fromTo(
        navLinks,
        { opacity: 0, y: -10 },
        { 
          opacity: 1, 
          y: 0, 
          stagger: 0.1, 
          duration: 0.3, 
          ease: "power1.out",
          delay: 0.2
        }
      );
    }
  }, []);

  return (
    <nav className="w-full p-4 bg-white shadow-sm">
      <div className="container flex items-center justify-between mx-auto">
        {/* Logo */}
        <div className="flex items-center" ref={logoRef}>
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
            <Link to="/" className="flex items-center gap-2">
              <motion.img 
                src="/icons/huella (1).svg" 
                alt="Dog Walk Logo" 
                className="w-8 h-8 text-dog-green"
                whileHover={{ rotate: 15 }}
                transition={{ duration: 0.3 }}
              />
              <span className="text-2xl font-adlam text-dog-dark">Dog Walk</span>
            </Link>
          </motion.div>
        </div>
        
        {/* Menú de navegación (escritorio) */}
        <div className="hidden space-x-6 md:flex" ref={navItemsRef}>
          <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
            <Link to="/buscar-cuidadores" className="font-bold text-gray-700 hover:text-dog-green">Buscar Cuidadores</Link>
          </motion.div>
          <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
            <Link to="/como-funciona" className="font-bold text-gray-700 hover:text-dog-green">Cómo funciona</Link>
          </motion.div>
          <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
            <Link to="/servicios" className="font-bold text-gray-700 hover:text-dog-green">Servicios</Link>
          </motion.div>
          <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
            <Link to="/tienda" className="font-bold text-gray-700 hover:text-dog-green">Tienda</Link>
          </motion.div>
        </div>
        
        {/* Iconos */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Botón de menú hamburguesa (solo móvil) */}
          <motion.button 
            className="p-2 md:hidden"
            onClick={toggleMobileMenu}
            aria-label="Menú"
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaTimes className="w-6 h-6 text-dog-dark" />
                </motion.div>
              ) : (
                <motion.div
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaBars className="w-6 h-6 text-dog-dark" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          <div className="relative hidden md:block">
            <motion.button 
              className="p-2"
              onClick={toggleSearch}
              aria-label="Buscar"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <img src="/icons/search.svg" alt="Buscar" className="w-5 h-5" />
            </motion.button>
            
            {/* Barra de búsqueda */}
            <AnimatePresence>
              {isSearchOpen && (
                <motion.div 
                  className="absolute right-0 z-20 mt-2 overflow-hidden bg-white rounded-md shadow-lg w-72"
                  style={{ top: '100%' }}
                  ref={searchInputRef}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <form onSubmit={handleSearch} className="flex items-center border-b border-gray-200">
                    <input
                      type="text"
                      className="w-full px-4 py-2 focus:outline-none"
                      placeholder="Buscar..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      ref={searchInputRef}
                    />
                    <motion.button 
                      type="submit" 
                      className="p-2 text-dog-green hover:text-dog-dark"
                      aria-label="Realizar búsqueda"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaSearch />
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="items-center hidden space-x-2 md:flex">
            {isAuthenticated && user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center px-3 py-2 space-x-2 text-sm rounded-md bg-gray-50 hover:bg-gray-100"
                >
                  <FaUser className="text-dog-green" />
                  <span className="font-medium text-gray-700">
                    {user.nombre || user.email || 'Usuario'}
                  </span>
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 z-20 w-48 py-2 mt-2 bg-white rounded-md shadow-lg">
                    <button
                      onClick={goToDashboard}
                      className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                    >
                      Dashboard
                    </button>
                    <Link
                      to="/perfil"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={closeUserMenu}
                    >
                      Mi Perfil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/register" className="px-4 py-2 text-white rounded-md bg-dog-green hover:bg-dog-light-green">
                  Registrarse
                </Link>
                <Link to="/login" className="px-4 py-2 border rounded-md border-dog-green text-dog-green hover:bg-gray-50">
                  Iniciar Sesión
                </Link>
              </>
            )}
          </div>
          
          <button className="relative p-2" onClick={toggleCart}>
            <img src="/icons/cart.svg" alt="Carrito" className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Menú móvil */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeMobileMenu}></div>
          <div className="relative flex flex-col w-4/5 h-full max-w-sm py-6 overflow-y-auto bg-white">
            <div className="px-6">
              <div className="flex items-center justify-between mb-6">
                <Link to="/" className="text-2xl font-adlam text-dog-dark">Dog Walk</Link>
                <button onClick={closeMobileMenu} className="text-gray-500 hover:text-gray-700">
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>
              
              {/* Mostrar información del usuario si está autenticado */}
              {isAuthenticated && user && (
                <div className="py-3 mb-4 text-center border-b border-gray-200">
                  <p className="font-medium text-gray-800">
                    Hola, {user.nombre || 'Usuario'}
                  </p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <Link 
                    to="/dashboard"
                    className="inline-block px-3 py-1 mt-2 text-xs text-white rounded-md bg-dog-green hover:bg-dog-light-green"
                    onClick={closeMobileMenu}
                  >
                    Ir al Dashboard
                  </Link>
                </div>
              )}
              
              {/* Opciones de búsqueda en móvil */}
              <div className="mb-6">
                <form onSubmit={handleSearch} className="flex items-center border border-gray-200 rounded-md">
                  <input
                    type="text"
                    className="w-full px-4 py-2 focus:outline-none"
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button 
                    type="submit" 
                    className="p-2 text-dog-green hover:text-dog-dark"
                    aria-label="Realizar búsqueda"
                  >
                    <FaSearch />
                  </button>
                </form>
              </div>
              
              {/* Enlaces de navegación */}
              <div className="flex flex-col space-y-4">
                {isAuthenticated && user && (
                  <Link 
                    to="/dashboard" 
                    className="py-2 font-bold text-gray-700 border-b border-gray-100 hover:text-dog-green"
                    onClick={closeMobileMenu}
                  >
                    Dashboard
                  </Link>
                )}
                <Link 
                  to="/buscar-cuidadores" 
                  className="py-2 font-bold text-gray-700 border-b border-gray-100 hover:text-dog-green"
                  onClick={closeMobileMenu}
                >
                  Buscar Cuidadores
                </Link>
                <Link 
                  to="/como-funciona" 
                  className="py-2 font-bold text-gray-700 border-b border-gray-100 hover:text-dog-green"
                  onClick={closeMobileMenu}
                >
                  Cómo funciona
                </Link>
                <Link 
                  to="/servicios" 
                  className="py-2 font-bold text-gray-700 border-b border-gray-100 hover:text-dog-green"
                  onClick={closeMobileMenu}
                >
                  Servicios
                </Link>
                <Link 
                  to="/tienda" 
                  className="py-2 font-bold text-gray-700 border-b border-gray-100 hover:text-dog-green"
                  onClick={closeMobileMenu}
                >
                  Tienda
                </Link>
              </div>
              
              {/* Botones de cuenta */}
              <div className="flex flex-col mt-6 space-y-3">
                {isAuthenticated && user ? (
                  <button 
                    onClick={() => {
                      handleLogout();
                      closeMobileMenu();
                    }} 
                    className="w-full px-4 py-2 text-center text-white bg-red-500 rounded-md hover:bg-red-600"
                  >
                    Cerrar Sesión
                  </button>
                ) : (
                  <>
                    <Link 
                      to="/register" 
                      className="w-full px-4 py-2 text-center text-white rounded-md bg-dog-green hover:bg-dog-light-green"
                      onClick={closeMobileMenu}
                    >
                      Registrarse
                    </Link>
                    <Link 
                      to="/login" 
                      className="w-full px-4 py-2 text-center border rounded-md border-dog-green text-dog-green hover:bg-gray-50"
                      onClick={closeMobileMenu}
                    >
                      Iniciar Sesión
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal del carrito */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto">
          <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50" onClick={toggleCart}></div>
          <div className="relative z-10 w-full max-w-md p-6 mx-auto my-8 overflow-hidden bg-white shadow-xl rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Carrito de Compras</h3>
              <button onClick={toggleCart} className="text-gray-400 hover:text-gray-500">
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 text-center border-2 border-gray-200 border-dashed rounded-lg">
              <p className="text-gray-500">Tu carrito está vacío</p>
              <button 
                onClick={toggleCart}
                className="px-4 py-2 mt-4 text-white rounded-md bg-dog-green hover:bg-dog-light-green"
              >
                Continuar Comprando
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;