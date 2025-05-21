import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import caregiverService from "../Services/caregiverService";
import serviceService from "../Services/serviceService";
import paseadorProfileService from "../Services/paseadorProfileService";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import FadeIn from "../Components/FadeIn";
import { FaUser, FaStar } from "react-icons/fa";

// Establecer token de acceso de Mapbox
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

if (!import.meta.env.VITE_MAPBOX_TOKEN) {
  console.error('VITE_MAPBOX_TOKEN no está definido en el archivo .env');
}

// Prevenir el error "Map container is already a part of a Map instance"
const previousMapInstances = {};

// Limpiar cualquier instancia previa
if (typeof window !== 'undefined') {
  if (previousMapInstances.current) {
    previousMapInstances.current.remove();
    previousMapInstances.current = null;
  }
}

const SearchCaregivers = () => {
  // Estados
  const [cuidadores, setCuidadores] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(false); // Inicialmente no está cargando
  const [error, setError] = useState(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [valoraciones, setValoraciones] = useState({});
  
  // Filtros
  const [filtros, setFiltros] = useState({
    servicio: "",
    localidad: "",
    fechaEntrega: "",
    fechaRecogida: "",
    cantidad: "1"
  });
  
  // Referencias
  const mapContainerRef = useRef(null);
  const isSearchingRef = useRef(false); // Para evitar búsquedas simultáneas
  
  // Carga de servicios disponibles - una sola vez
  useEffect(() => {
    const cargarServicios = async () => {
      try {
        const data = await serviceService.getAll();
        setServicios(data);
      } catch (error) {
        console.error("Error al cargar servicios:", error);
        setError("No se pudieron cargar los servicios disponibles");
      }
    };
    
    cargarServicios();
  }, []); // Solo se ejecuta una vez al montar el componente
  
  // Actualizar marcadores en el mapa
  const actualizarMarcadores = useCallback((cuidadoresData) => {
    if (!map) return;
    
    try {
      // Eliminar marcadores anteriores
      markers.forEach(marker => marker.remove());
      const nuevosMarkers = [];
      
      // Añadir nuevos marcadores
      cuidadoresData.forEach(cuidador => {
        if (cuidador.latitud && cuidador.longitud) {
          const el = document.createElement('div');
          el.className = 'custom-marker';
          el.style.width = '30px';
          el.style.height = '30px';
          el.style.backgroundImage = 'url(/icons/huellas-de-garras.svg)';
          el.style.backgroundSize = 'cover';
          el.style.backgroundPosition = 'center';
          el.style.borderRadius = '50%';
          el.style.border = '2px solid #fff';
          el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
          el.style.cursor = 'pointer';
          
          // Crear popup con verificación de valores nulos o indefinidos
          const nombre = cuidador.nombre || '';
          const apellido = cuidador.apellido || '';
          const direccion = cuidador.direccion || 'Dirección no disponible';
          const id = cuidador.id || '';
          
          // Verificar si existe al menos un servicio con precio para mostrar "Desde X€"
          let precioMinimo = '';
          if (cuidador.servicios && Array.isArray(cuidador.servicios) && cuidador.servicios.length > 0) {
            const precio = obtenerPrecioMinimo(cuidador.servicios);
            if (precio !== null) {
              precioMinimo = `<p style="margin: 0 0 5px; font-size: 14px; color: #4CAF50;">Desde ${formatearPrecio(precio)}</p>`;
            }
          }
          
          const popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div style="padding: 10px;">
                <h3 style="margin: 0 0 5px; font-size: 16px;">${nombre} ${apellido}</h3>
                <p style="margin: 0 0 5px; font-size: 14px;">${direccion}</p>
                ${precioMinimo}
                <a href="/paseador/${id}" style="color: #4CAF50; font-size: 14px;">Ver perfil</a>
              </div>
            `);
          
          // Crear marcador
          const marker = new mapboxgl.Marker(el)
            .setLngLat([cuidador.longitud, cuidador.latitud])
            .setPopup(popup)
            .addTo(map);
          
          nuevosMarkers.push(marker);
        }
      });
      
      setMarkers(nuevosMarkers);
      
      // Ajustar el mapa para mostrar todos los marcadores si hay al menos uno
      if (nuevosMarkers.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        cuidadoresData.forEach(cuidador => {
          if (cuidador.latitud && cuidador.longitud) {
            bounds.extend([cuidador.longitud, cuidador.latitud]);
          }
        });
        
        map.fitBounds(bounds, {
          padding: 50,
          maxZoom: 15
        });
      }
    } catch (error) {
      console.error("Error al actualizar marcadores:", error);
    }
  // Dependencia ref para evitar recreaciones
  }, [map]);
  
  // Referencias para funciones, para evitar recreaciones
  const actualizarMarcadoresRef = useRef(actualizarMarcadores);
  
  // Actualizar ref cuando cambie la función
  useEffect(() => {
    actualizarMarcadoresRef.current = actualizarMarcadores;
  }, [actualizarMarcadores]);
  
  // Función para cargar las valoraciones de un paseador
  const cargarValoraciones = async (paseadorId) => {
    try {
      const rankingData = await paseadorProfileService.getRankingResumen(paseadorId);
      setValoraciones(prev => ({
        ...prev,
        [paseadorId]: {
          promedio: rankingData.promedioValoracion,
          total: rankingData.cantidadValoraciones
        }
      }));
    } catch (error) {
      console.error('Error al cargar valoraciones:', error);
    }
  };
  
  // Modificar la carga inicial de datos para incluir las valoraciones
  const cargarDatosIniciales = useCallback(async () => {
    if (isSearchingRef.current) return;
    isSearchingRef.current = true;
    
    setLoading(true);
    try {
      const data = await caregiverService.getAll();
      console.log("Datos iniciales cargados:", data);
      setCuidadores(data);
      
      // Cargar valoraciones para cada cuidador
      data.forEach(cuidador => {
        cargarValoraciones(cuidador.id);
      });
      
      if (map) {
        actualizarMarcadoresRef.current(data);
      }
    } catch (error) {
      console.error("Error al cargar datos iniciales:", error);
      setError("No se pudieron cargar los cuidadores. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
      isSearchingRef.current = false;
    }
  }, [map]);
  
  // Búsqueda con filtros aplicados - usando ref de actualizarMarcadores
  const buscarCuidadores = useCallback(async () => {
    if (isSearchingRef.current) return;
    isSearchingRef.current = true;
    
    setLoading(true);
    setError(null);
    
    try {
      const cuidadoresData = await caregiverService.getAll(filtros);
      console.log("Datos filtrados:", cuidadoresData);
      
      setCuidadores(cuidadoresData);
      
      // Actualizar marcadores en el mapa
      if (map) {
        actualizarMarcadoresRef.current(cuidadoresData);
      }
    } catch (error) {
      console.error("Error al buscar cuidadores:", error);
      setError("No se pudieron cargar los cuidadores. Por favor, intenta nuevamente.");
      setCuidadores([]);
    } finally {
      setLoading(false);
      isSearchingRef.current = false;
    }
  }, [filtros, map]);
  
  // Ref para la función buscarCuidadores
  const buscarCuidadoresRef = useRef(buscarCuidadores);
  
  // Actualizar ref cuando cambie la función
  useEffect(() => {
    buscarCuidadoresRef.current = buscarCuidadores;
  }, [buscarCuidadores]);
  
  // Ref para la función cargarDatosIniciales
  const cargarDatosInicialesRef = useRef(cargarDatosIniciales);
  
  // Actualizar ref cuando cambie la función
  useEffect(() => {
    cargarDatosInicialesRef.current = cargarDatosIniciales;
  }, [cargarDatosIniciales]);
  
  // Inicialización del mapa - con dependencias mínimas
  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    let mapInstance = null;
    let mapInitialized = false;
    
    try {
      console.log("Intentando inicializar el mapa...");
      mapInstance = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-0.4810, 38.3452], // Alicante como ubicación predeterminada
        zoom: 12
      });
      
      mapInstance.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      mapInstance.once('load', () => {
        console.log('Mapa cargado correctamente');
        setMap(mapInstance);
        mapInitialized = true;
        
        // Cargar datos iniciales después de que el mapa se haya cargado (una sola vez)
        setTimeout(() => {
          if (cargarDatosInicialesRef.current) {
            cargarDatosInicialesRef.current();
          }
        }, 100);
      });
    } catch (error) {
      console.error("Error al inicializar el mapa:", error);
      setError("Error al cargar el mapa. Por favor, recarga la página.");
    }
    
    // Cleanup
    return () => {
      if (mapInstance && mapInitialized) {
        console.log("Limpiando mapa...");
        // Limpiar marcadores
        if (markers && markers.length) {
          markers.forEach(marker => {
            try {
              marker.remove();
            } catch (error) {
              console.error("Error al eliminar marcador:", error);
            }
          });
        }
        mapInstance.remove();
      }
    };
  // Sin dependencias para evitar recargas
  }, []); // Inicialización única
  
  // Manejar cambios en los filtros
  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };
  
  // Limpiar filtros y mostrar todos los cuidadores
  const limpiarFiltros = () => {
    // Restablecer filtros a valores iniciales
    setFiltros({
      servicio: "",
      localidad: "",
      fechaEntrega: "",
      fechaRecogida: "",
      cantidad: "1"
    });
    
    // Buscar todos los cuidadores sin filtros
    if (!isSearchingRef.current) {
      setTimeout(() => {
        buscarCuidadores();
      }, 100);
    }
  };
  
  // Manejar envío del formulario de búsqueda
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isSearchingRef.current) {
      buscarCuidadores();
    }
  };
  
  // Formatear precio
  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(precio);
  };
  
  // Obtener precio mínimo de los servicios de un cuidador
  const obtenerPrecioMinimo = (servicios) => {
    if (!servicios || !Array.isArray(servicios) || servicios.length === 0) {
      return null;
    }
    
    const precios = servicios
      .filter(servicio => servicio.precio !== undefined && servicio.precio !== null)
      .map(servicio => servicio.precio);
    
    return precios.length > 0 ? Math.min(...precios) : null;
  };
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Filtros de búsqueda */}
      <section className="py-6 bg-gray-100">
        <div className="container px-4 mx-auto">
          <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
              {/* Servicio */}
              <div>
                <label htmlFor="servicio" className="block mb-2 text-sm font-medium text-gray-700">
                  Servicio
                </label>
                <select
                  id="servicio"
                  name="servicio"
                  value={filtros.servicio}
                  onChange={handleFiltroChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-dog-green"
                >
                  <option value="">Todos los servicios</option>
                  {Array.isArray(servicios) && servicios.map(servicio => (
                    <option key={servicio.id} value={servicio.id}>
                      {servicio.nombre}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Localidad */}
              <div>
                <label htmlFor="localidad" className="block mb-2 text-sm font-medium text-gray-700">
                  Localidad
                </label>
                <input
                  type="text"
                  id="localidad"
                  name="localidad"
                  placeholder="Código Postal"
                  value={filtros.localidad}
                  onChange={handleFiltroChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-dog-green"
                />
              </div>
              
              {/* Fecha entrega */}
              <div>
                <label htmlFor="fechaEntrega" className="block mb-2 text-sm font-medium text-gray-700">
                  Entrega
                </label>
                <input
                  type="date"
                  id="fechaEntrega"
                  name="fechaEntrega"
                  value={filtros.fechaEntrega}
                  onChange={handleFiltroChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-dog-green"
                />
              </div>
              
              {/* Fecha recogida */}
              <div>
                <label htmlFor="fechaRecogida" className="block mb-2 text-sm font-medium text-gray-700">
                  Recogida
                </label>
                <input
                  type="date"
                  id="fechaRecogida"
                  name="fechaRecogida"
                  value={filtros.fechaRecogida}
                  onChange={handleFiltroChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-dog-green"
                />
              </div>
              
              {/* Cantidad */}
              <div>
                <label htmlFor="cantidad" className="block mb-2 text-sm font-medium text-gray-700">
                  Perros
                </label>
                <select
                  id="cantidad"
                  name="cantidad"
                  value={filtros.cantidad}
                  onChange={handleFiltroChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-dog-green"
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <div className="flex justify-center gap-4">
                <motion.button
                  type="submit"
                  className="px-6 py-2 font-medium text-white rounded-md bg-dog-green hover:bg-dog-light-green"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                >
                  {loading ? "Buscando..." : "Buscar"}
                </motion.button>
                
                <motion.button
                  type="button"
                  onClick={limpiarFiltros}
                  className="px-6 py-2 font-medium bg-white border rounded-md text-dog-green border-dog-green hover:bg-gray-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                >
                  Limpiar filtros
                </motion.button>
              </div>
            </div>
          </form>
        </div>
      </section>
      
      {/* Contenido principal */}
      <section className="py-6">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Columna izquierda - Listado de cuidadores */}
            <div className="md:col-span-1">
              <h2 className="mb-4 text-xl font-semibold">
                Cuidadores de perros cerca de ti, sin jaulas
              </h2>
              <p className="mb-4 text-sm text-gray-600">
                Beneficios de usar Dog Walk App
              </p>
              
              {/* Características */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex flex-col items-center w-[19%]">
                  <div className="flex items-center justify-center w-10 h-10 mb-2 rounded-full bg-dog-light-green">
                    <img src="/icons/Veterinarian.svg" alt="Cobertura veterinaria" className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-center leading-tight min-h-[32px] flex items-center">
                    Cobertura<br/>veterinaria
                  </span>
                </div>
                
                <div className="flex flex-col items-center w-[19%]">
                  <div className="flex items-center justify-center w-10 h-10 mb-2 rounded-full bg-dog-light-green">
                    <img src="/icons/Check Mark.svg" alt="Cancelación gratuita" className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-center leading-tight min-h-[32px] flex items-center">
                    Cancelación<br/>Gratuita
                  </span>
                </div>
                
                <div className="flex flex-col items-center w-[19%]">
                  <div className="flex items-center justify-center w-10 h-10 mb-2 rounded-full bg-dog-light-green">
                    <img src="/icons/Apply.svg" alt="Cuidadores verificados" className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-center leading-tight min-h-[32px] flex items-center">
                    Cuidadores<br/>verificados
                  </span>
                </div>
                
                <div className="flex flex-col items-center w-[19%]">
                  <div className="flex items-center justify-center w-10 h-10 mb-2 rounded-full bg-dog-light-green">
                    <img src="/icons/ChatBubble3.svg" alt="Soporte y Ayuda" className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-center leading-tight min-h-[32px] flex items-center">
                    Soporte<br/>y Ayuda
                  </span>
                </div>
                
                <div className="flex flex-col items-center w-[19%]">
                  <div className="flex items-center justify-center w-10 h-10 mb-2 rounded-full bg-dog-light-green">
                    <img src="/icons/Lock.svg" alt="Pago Seguro" className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-center leading-tight min-h-[32px] flex items-center">
                    Pago<br/>Seguro
                  </span>
                </div>
              </div>
              
              {/* Listado de cuidadores */}
              <div className="mb-4">
                <h3 className="mb-2 text-sm font-medium text-gray-700">Resultados encontrados: {Array.isArray(cuidadores) ? cuidadores.length : 0}</h3>
                
                {/* Selector de ordenación */}
                <div className="relative mb-4 border border-gray-300 rounded-md">
                  <select 
                    className="block w-full py-2 pl-3 pr-10 text-base text-gray-700 bg-white rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-dog-green"
                  >
                    <option value="rating">Ordenar por: Mejor puntuados</option>
                    <option value="price_asc">Ordenar por: Precio (menor a mayor)</option>
                    <option value="price_desc">Ordenar por: Precio (mayor a menor)</option>
                    <option value="distance">Ordenar por: Distancia</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Contenedor con scroll */}
              <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                {loading ? (
                  <div className="flex items-center justify-center p-4 text-center">
                    <div className="w-8 h-8 border-4 rounded-full border-t-dog-green border-r-dog-green border-b-transparent border-l-transparent animate-spin"></div>
                    <span className="ml-2">Buscando cuidadores...</span>
                  </div>
                ) : error ? (
                  <div className="p-4 text-red-700 bg-red-100 rounded-md">
                    {error}
                  </div>
                ) : !Array.isArray(cuidadores) ? (
                  <div className="p-4 text-center">
                    Error al cargar los datos. Por favor, inténtalo de nuevo.
                  </div>
                ) : cuidadores.length === 0 ? (
                  <div className="p-4 text-center">
                    No se encontraron cuidadores con los criterios especificados.
                  </div>
                ) : (
                  Array.isArray(cuidadores) && cuidadores.map(cuidador => (
                    <FadeIn key={cuidador.id} direction="up" delay={0.1}>
                      <div className="p-4 transition-shadow border rounded-lg shadow-sm hover:shadow-md">
                        <div className="flex items-start gap-4">
                          {/* Avatar */}
                          <div className="flex-shrink-0">
                            <Link to={`/paseador/${cuidador.id}`}>
                              {cuidador.foto ? (
                              <img 
                                  src={cuidador.foto} 
                                alt={`${cuidador.nombre} ${cuidador.apellido}`} 
                                className="object-cover w-16 h-16 rounded-full"
                              />
                              ) : (
                                <div className="flex items-center justify-center w-16 h-16 text-white rounded-full bg-dog-green">
                                  <FaUser size={24} />
                                </div>
                              )}
                            </Link>
                          </div>
                          
                          {/* Información */}
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <Link to={`/paseador/${cuidador.id}`} className="hover:underline">
                                <h3 className="mb-1 text-lg font-semibold">
                                  {cuidador.nombre} {cuidador.apellido}
                                </h3>
                              </Link>
                              <div className="font-semibold text-right text-dog-green">
                                {cuidador.servicios && Array.isArray(cuidador.servicios) && cuidador.servicios.length > 0
                                  ? `Desde ${formatearPrecio(obtenerPrecioMinimo(cuidador.servicios))}`
                                  : ""}
                              </div>
                            </div>
                            
                            <div className="flex items-center mb-1">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <FaStar 
                                    key={star} 
                                    className={`w-4 h-4 ${
                                      star <= (valoraciones[cuidador.id]?.promedio || 0)
                                        ? 'text-yellow-400' 
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="ml-1 text-sm text-gray-600">
                                {valoraciones[cuidador.id]?.promedio 
                                  ? `${valoraciones[cuidador.id].promedio.toFixed(1)}` 
                                  : "Sin valoraciones"} 
                                {valoraciones[cuidador.id]?.total > 0 && 
                                  ` (${valoraciones[cuidador.id].total} valoraciones)`}
                              </span>
                            </div>
                            
                            <p className="text-sm text-gray-600">{cuidador.direccion}</p>
                            
                            {/* Etiquetas de servicios */}
                            <div className="flex flex-wrap gap-2 mt-2">
                              {cuidador.servicios && Array.isArray(cuidador.servicios) && cuidador.servicios.map(servicio => (
                                <span 
                                  key={servicio.id}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-dog-light-green text-dog-green"
                                >
                                  {servicio.nombre} {servicio.precio ? `- ${formatearPrecio(servicio.precio)}` : ""}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </FadeIn>
                  ))
                )}
              </div>

              {/* Estilos para el scrollbar personalizado */}
              <style jsx="true">{`
                .custom-scrollbar::-webkit-scrollbar {
                  width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                  background: #f1f1f1;
                  border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background: #888;
                  border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                  background: #555;
                }
              `}</style>
            </div>
            
            {/* Columna derecha - Mapa */}
            <div className="md:col-span-2">
              <div 
                ref={mapContainerRef} 
                className="w-full h-[600px] rounded-lg shadow-md"
                style={{ border: '1px solid #ddd' }}
              />
              <p className="mt-2 text-xs text-center text-gray-500">
                Busca moviéndote por el mapa o utilizando los filtros
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Sección de cómo hacer una reserva */}
      <section className="py-12 bg-gray-100">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Columna izquierda */}
            <div>
              <h2 className="mb-6 text-2xl font-semibold">Cómo hacer una reserva</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-dog-light-green">
                      <img src="/icons/search.svg" alt="Buscar" className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-semibold">Buscar</h3>
                    <p className="text-gray-700">
                      Busca por código postal o dirección para ver un listado de cuidadores de confianza en tu zona.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-dog-light-green">
                      <img src="/icons/Apply.svg" alt="Reserva" className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-semibold">Reserva tu cuidador/a</h3>
                    <p className="text-gray-700">
                      Cuando creas que has encontrado al cuidador perfecto para tu perro, puedes enviar una solicitud de reserva.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-dog-light-green">
                      <img src="/icons/ChatBubble3.svg" alt="Meet & Greet" className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-semibold">Meet & Greet</h3>
                    <p className="text-gray-700">
                      Organiza un encuentro previo para asegurarte de que tu perro encaja bien con el cuidador seleccionado.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-dog-light-green">
                      <img src="/icons/Suitcase.svg" alt="Preparados" className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-semibold">Preparados, listos... ¡Ya!</h3>
                    <p className="text-gray-700">
                      Tu mascota está preparada para comenzar. Asegúrate de que entregar al cuidador todo lo que necesite: correa, comida, correa, juguete favorito.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Columna derecha */}
            <div>
              <h2 className="mb-6 text-2xl font-semibold">Beneficios de Dog Walk</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-dog-light-green">
                      <img src="/icons/Veterinarian.svg" alt="Cobertura veterinaria" className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-semibold">Cobertura veterinaria</h3>
                    <p className="text-gray-700">
                      Todas las reservas incluyen cobertura veterinaria por si surgiera alguna emergencia durante la estancia.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-dog-light-green">
                      <img src="/icons/Check Mark.svg" alt="Cancelación Gratuita" className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-semibold">Cancelación Gratuita</h3>
                    <p className="text-gray-700">
                      Todas las reservas incluyen cancelación gratuita para darte total flexibilidad.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-dog-light-green">
                      <img src="/icons/Apply.svg" alt="Cuidadores verificados" className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-semibold">Cuidadores verificados</h3>
                    <p className="text-gray-700">
                      Todos nuestros cuidadores pasan por un proceso de verificación antes de ser aceptados en la plataforma.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-dog-light-green">
                      <img src="/icons/Star.svg" alt="Opiniones verificadas" className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-semibold">Opiniones verificadas</h3>
                    <p className="text-gray-700">
                      Las opiniones en Dog Walk solo pueden dejarlas usuarios que han completado una reserva a través de nuestra plataforma.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-dog-light-green">
                      <img src="/icons/ChatBubble3.svg" alt="Soporte y Ayuda" className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-semibold">Soporte y Ayuda</h3>
                    <p className="text-gray-700">
                      Nuestro equipo de atención al cliente está disponible para ayudarte con cualquier duda o problema.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default SearchCaregivers; 