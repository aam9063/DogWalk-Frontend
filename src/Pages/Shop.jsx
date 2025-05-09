import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import FilterTree from '../Components/Shop/FilterTree';
import ProductCard from '../Components/Shop/ProductCard';
import articleService from '../Services/articleService';
import { FaSearch, FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';
import useCartStore from '../store/cartStore';

const Shop = () => {
  // Estados para los datos y la paginación
  const [products, setProducts] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  
  // Estados para los filtros
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9); // Número fijo de elementos por página
  
  // Referencia al componente Navbar para actualizar el carrito
  const navbarRef = useRef();
  const { toggle: toggleCart } = useCartStore();
  
  // Cargar categorías
  useEffect(() => {
    setCategorias(articleService.getCategorias());
  }, []);
  
  // Cargar productos según filtros y paginación
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Construir las opciones para la petición
        const options = {
          pageNumber: currentPage,
          pageSize: itemsPerPage,
          searchTerm: searchTerm,
          ascending: true
        };
        
        // Añadir las categorías seleccionadas si hay alguna
        if (selectedCategories.length > 0) {
          // Convertimos el array de IDs a un string separado por comas para la API
          options.categoria = selectedCategories.join(',');
        }
        
        const response = await articleService.getAll(options);
        
        setProducts(response.items || []);
        setTotalPages(response.totalPaginas || 0);
        setTotalItems(response.totalItems || 0);
      } catch (err) {
        console.error("Error al cargar productos:", err);
        setError("No se pudieron cargar los productos. Por favor, intenta nuevamente.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [currentPage, itemsPerPage, searchTerm, selectedCategories]);
  
  // Manejar cambio en filtro de categorías
  const handleCategoryChange = (categoryId) => {
    setSelectedCategories(prev => {
      const categoryIndex = prev.indexOf(categoryId);
      
      // Si ya está seleccionada, la quitamos
      if (categoryIndex !== -1) {
        return prev.filter(id => id !== categoryId);
      }
      
      // Si no está seleccionada, la añadimos a las existentes
      return [...prev, categoryId];
    });
    
    // Resetear a la primera página cuando cambia el filtro
    setCurrentPage(1);
  };
  
  // Manejar cambio en búsqueda por texto
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // La búsqueda se ejecuta en el useEffect cuando cambia searchTerm
    setCurrentPage(1); // Resetear a la primera página al buscar
  };
  
  const handlePageChange = (selectedItem) => {
    setCurrentPage(selectedItem.selected + 1);
  };
  
  // Función para actualizar el carrito y abrirlo opcionalmente
  const handleCartUpdate = (openCart = false) => {
    if (navbarRef.current) {
      navbarRef.current.fetchCart();
      if (openCart) {
        toggleCart();
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar ref={navbarRef} />
      
      {/* Banner de la tienda */}
      <div className="relative">
        <div className="h-[400px] w-full">
          <img 
            src="/imgs/corgi-4415649_1280.jpg" 
            alt="Tienda Dog Walk" 
            className="object-cover w-full h-full opacity-60"
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white shadow-text">Nuestros Productos</h1>
        </div>
      </div>
      
      <div className="container px-4 py-8 mx-auto">
        <div className="flex flex-col gap-8 md:flex-row">
          {/* Columna izquierda - Filtros */}
          <div className="w-full md:w-1/4">
            {/* Árbol de filtros */}
            <FilterTree 
              categorias={categorias} 
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}
            />
            
            {/* Búsqueda */}
            <div className="p-6 mt-6 bg-white rounded-lg shadow-md">
              <h2 className="mb-4 text-xl font-semibold">Buscar</h2>
              <form onSubmit={handleSearchSubmit} className="flex">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Buscar productos..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-dog-green"
                />
                <button 
                  type="submit"
                  className="px-4 py-2 text-white bg-dog-green hover:bg-dog-light-green rounded-r-md"
                >
                  <FaSearch />
                </button>
              </form>
            </div>
          </div>
          
          {/* Columna derecha - Productos */}
          <div className="w-full md:w-3/4">
            {/* Información de resultados */}
            <div className="flex flex-col items-center justify-between mb-6 md:flex-row">
              <div>
                <h2 className="text-2xl font-semibold">Productos</h2>
                <p className="text-gray-600">
                  {totalItems === 0 
                    ? 'No se encontraron productos' 
                    : `Mostrando ${products.length} de ${totalItems} productos`
                  }
                </p>
              </div>
              
              {/* Filtros activos */}
              {selectedCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                  {selectedCategories.map(catId => {
                    const categoria = categorias.find(cat => cat.id === catId);
                    return categoria ? (
                      <div 
                        key={categoria.id}
                        className="flex items-center px-3 py-1 text-sm bg-white border rounded-full border-dog-green text-dog-green"
                      >
                        {categoria.nombre}
                        <button 
                          onClick={() => handleCategoryChange(categoria.id)}
                          className="ml-2 text-dog-green hover:text-dog-dark-green"
                        >
                          ×
                        </button>
                      </div>
                    ) : null;
                  })}
                </div>
              )}
            </div>
            
            {/* Spinner de carga */}
            {loading && (
              <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 rounded-full border-t-dog-green border-r-dog-green border-b-transparent border-l-transparent animate-spin"></div>
              </div>
            )}
            
            {/* Mensaje de error */}
            {error && !loading && (
              <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-md">
                {error}
              </div>
            )}
            
            {/* Lista de productos */}
            {!loading && !error && products.length === 0 && (
              <div className="p-4 text-yellow-800 bg-yellow-100 rounded-md">
                No se encontraron productos con los filtros seleccionados.
              </div>
            )}
            
            {!loading && !error && products.length > 0 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product}
                    onCartUpdate={(openCart = false) => handleCartUpdate(openCart)}
                  />
                ))}
              </div>
            )}
            
            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <ReactPaginate
                  previousLabel={<div className="flex items-center">
                    <button className="px-1 mx-1 text-sm font-medium">{"<<"}</button>
                    <button className="px-1 mx-1 text-sm font-medium">{"<"}</button>
                  </div>}
                  nextLabel={<div className="flex items-center">
                    <button className="px-1 mx-1 text-sm font-medium">{">"}</button>
                    <button className="px-1 mx-1 text-sm font-medium">{">>"}</button>
                  </div>}
                  breakLabel="..."
                  pageCount={totalPages}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={3}
                  onPageChange={handlePageChange}
                  containerClassName="flex items-center justify-center space-x-1"
                  pageClassName="flex items-center justify-center"
                  pageLinkClassName="w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium hover:bg-gray-100"
                  previousClassName="flex items-center text-dog-green"
                  nextClassName="flex items-center text-dog-green"
                  breakClassName="flex items-center justify-center px-2 text-gray-500"
                  activeClassName="bg-dog-green"
                  activeLinkClassName="!text-white hover:!bg-dog-green"
                  disabledClassName="opacity-50 cursor-not-allowed text-gray-300"
                  disabledLinkClassName="cursor-not-allowed"
                  forcePage={currentPage - 1}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
      
      {/* Estilos adicionales */}
      <style jsx="true">{`
        .shadow-text {
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Shop; 