import { Link } from 'react-router-dom';
import { create } from 'zustand';
import { useState, useRef, useEffect } from 'react';
import { FaSearch, FaBars, FaTimes } from 'react-icons/fa';

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

const Navbar = () => {
  const { isOpen: isCartOpen, toggle: toggleCart } = useCartStore();
  const { isOpen: isSearchOpen, toggle: toggleSearch, close: closeSearch } = useSearchStore();
  const { isOpen: isMobileMenuOpen, toggle: toggleMobileMenu, close: closeMobileMenu } = useMobileMenuStore();
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  
  // Enfocar el input cuando se abre la barra de búsqueda
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);
  
  // Manejar la búsqueda cuando se presiona Enter
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Aquí irá la lógica de búsqueda cuando tengamos contenido
      console.log('Búsqueda:', searchQuery);
      
      // Por ahora, simplemente cerramos la barra y limpiamos la consulta
      closeSearch();
      setSearchQuery('');
    }
  };
  
  // Cerrar la búsqueda si se hace clic fuera
  const handleClickOutside = (e) => {
    if (isSearchOpen && searchInputRef.current && !searchInputRef.current.contains(e.target)) {
      closeSearch();
    }
  };
  
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);

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
  
  return (
    <nav className="w-full p-4 bg-white shadow-sm">
      <div className="container flex items-center justify-between mx-auto">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src="/icons/huella (1).svg" alt="Dog Walk Logo" className="w-8 h-8 text-dog-green" />
            <span className="text-2xl font-adlam text-dog-dark">Dog Walk</span>
          </Link>
        </div>
        
        {/* Menú de navegación (escritorio) */}
        <div className="hidden space-x-6 md:flex">
          <Link to="/buscar-cuidadores" className="font-bold text-gray-700 hover:text-dog-green">Buscar Cuidadores</Link>
          <Link to="/como-funciona" className="font-bold text-gray-700 hover:text-dog-green">Cómo funciona</Link>
          <Link to="/servicios" className="font-bold text-gray-700 hover:text-dog-green">Servicios</Link>
          <Link to="/tienda" className="font-bold text-gray-700 hover:text-dog-green">Tienda</Link>
        </div>
        
        {/* Iconos */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Botón de menú hamburguesa (solo móvil) */}
          <button 
            className="p-2 md:hidden"
            onClick={toggleMobileMenu}
            aria-label="Menú"
          >
            {isMobileMenuOpen ? (
              <FaTimes className="w-6 h-6 text-dog-dark" />
            ) : (
              <FaBars className="w-6 h-6 text-dog-dark" />
            )}
          </button>

          <div className="relative hidden md:block">
            <button 
              className="p-2"
              onClick={toggleSearch}
              aria-label="Buscar"
            >
              <img src="/icons/search.svg" alt="Buscar" className="w-5 h-5" />
            </button>
            
            {/* Barra de búsqueda */}
            {isSearchOpen && (
              <div 
                className="absolute right-0 z-20 mt-2 overflow-hidden transition-all duration-300 origin-top-right transform bg-white rounded-md shadow-lg w-72"
                style={{ top: '100%' }}
                ref={searchInputRef}
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
                  <button 
                    type="submit" 
                    className="p-2 text-dog-green hover:text-dog-dark"
                    aria-label="Realizar búsqueda"
                  >
                    <FaSearch />
                  </button>
                </form>
              </div>
            )}
          </div>

          <div className="items-center hidden space-x-2 md:flex">
            <Link to="/registro" className="px-4 py-2 text-white rounded-md bg-dog-green hover:bg-dog-light-green">
              Registrarse
            </Link>
            <Link to="/iniciar-sesion" className="px-4 py-2 border rounded-md border-dog-green text-dog-green hover:bg-gray-50">
              Iniciar Sesión
            </Link>
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
                <Link 
                  to="/registro" 
                  className="w-full px-4 py-2 text-center text-white rounded-md bg-dog-green hover:bg-dog-light-green"
                  onClick={closeMobileMenu}
                >
                  Registrarse
                </Link>
                <Link 
                  to="/iniciar-sesion" 
                  className="w-full px-4 py-2 text-center border rounded-md border-dog-green text-dog-green hover:bg-gray-50"
                  onClick={closeMobileMenu}
                >
                  Iniciar Sesión
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Overlay del carrito */}
      {isCartOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-50"
            onClick={toggleCart}
          />
          <div className="fixed top-0 right-0 z-50 h-full p-6 transition-transform duration-300 transform bg-white shadow-xl w-80">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-adlam">Carrito</h2>
              <button onClick={toggleCart} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            <div className="flex flex-col items-center justify-center h-4/5">
              <p className="text-gray-500">Tu carrito está vacío</p>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar; 