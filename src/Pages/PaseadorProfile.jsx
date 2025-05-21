import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { FaMapMarkerAlt, FaStar, FaPhone, FaEnvelope, FaUser } from 'react-icons/fa';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import paseadorProfileService from '../Services/paseadorProfileService';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
if (!MAPBOX_TOKEN) {
  console.error('¡ADVERTENCIA! Token de Mapbox no encontrado en variables de entorno');
} else {
  mapboxgl.accessToken = MAPBOX_TOKEN;
}

const PaseadorProfile = () => {
  const { paseadorId } = useParams();
  const [profile, setProfile] = useState(null);
  const [ranking, setRanking] = useState(null);
  const [valoraciones, setValoraciones] = useState([]);
  const [activeSection, setActiveSection] = useState('about');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [disponibilidad, setDisponibilidad] = useState(null);
  const [loadingDisponibilidad, setLoadingDisponibilidad] = useState(false);

  // Referencias para el scroll y el mapa
  const aboutRef = useRef(null);
  const serviciosRef = useRef(null);
  const disponibilidadRef = useRef(null);
  const ubicacionRef = useRef(null);
  const valoracionesRef = useRef(null);
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  const loadProfileData = useCallback(async () => {
    if (!paseadorId) {
      setError('ID de paseador no válido');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const profileData = await paseadorProfileService.getProfile(paseadorId);
      
      if (!profileData) {
        throw new Error('No se pudo cargar el perfil del paseador');
      }

      
      // Verificar y procesar las coordenadas
      if (profileData.coordenadas && 
          typeof profileData.coordenadas.latitud === 'number' && 
          typeof profileData.coordenadas.longitud === 'number') {
        console.log('Coordenadas válidas encontradas:', profileData.coordenadas);
        setProfile({
          ...profileData,
          coordenadas: {
            latitud: profileData.coordenadas.latitud,
            longitud: profileData.coordenadas.longitud
          }
        });
      } else {
        console.warn('El perfil no contiene coordenadas válidas:', profileData.coordenadas);
        setProfile(profileData);
      }

      // Cargar el resto de los datos
      const [rankingData, valoracionesData] = await Promise.all([
        paseadorProfileService.getRankingResumen(paseadorId),
        paseadorProfileService.getValoraciones(paseadorId)
      ]);

      setRanking(rankingData);
      setValoraciones(valoracionesData || []);
    } catch (err) {
      console.error('Error cargando datos del perfil:', err);
      setError('Error al cargar la información del paseador');
    } finally {
      setLoading(false);
    }
  }, [paseadorId]);

  // Cargar datos iniciales
  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  // Inicializar y limpiar mapa
  useEffect(() => {
    // No intentar inicializar el mapa si no hay perfil cargado
    if (!profile || loading) {
      return;
    }

    // Esperar un momento para asegurar que el DOM está listo
    const initializeMap = () => {
      if (!mapContainer.current) {
        console.error('No se puede inicializar el mapa: contenedor no encontrado');
        return;
      }

      if (!MAPBOX_TOKEN) {
        console.error('No se puede inicializar el mapa: token no configurado');
        return;
      }

      const initialCoordinates = profile?.coordenadas ? 
        [profile.coordenadas.longitud, profile.coordenadas.latitud] : 
        [-0.4810, 38.3452];

      const mapInstance = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: initialCoordinates,
        zoom: 12
      });

      // Esperar a que el mapa se cargue antes de agregar marcadores y controles
      mapInstance.on('load', () => {
        
        // Agregar controles de navegación
        mapInstance.addControl(new mapboxgl.NavigationControl());

        // Agregar marcador si hay coordenadas
        if (profile?.coordenadas?.latitud && profile?.coordenadas?.longitud) {
          const { latitud, longitud } = profile.coordenadas;
          console.log('Agregando marcador en:', { latitud, longitud });
          
          const marker = new mapboxgl.Marker({
            color: '#34D399'
          })
            .setLngLat([longitud, latitud])
            .addTo(mapInstance);

          setMarkers([marker]);
          
          // Centrar el mapa en la ubicación del marcador
          mapInstance.flyTo({
            center: [longitud, latitud],
            zoom: 14,
            essential: true
          });
        }
      });

      // Manejar errores
      mapInstance.on('error', (e) => {
        console.error('Error en el mapa:', e.error);
      });

      setMap(mapInstance);
      
      // Cleanup
      return () => {
        markers.forEach(marker => marker.remove());
        mapInstance.remove();
      };
    };

    // Pequeño retraso para asegurar que el DOM está listo
    const timeoutId = setTimeout(initializeMap, 100);

    return () => {
      clearTimeout(timeoutId);
      if (map) {
        markers.forEach(marker => marker.remove());
        map.remove();
      }
    };
  }, [profile, loading, MAPBOX_TOKEN]);

  // Actualizar el mapa cuando cambien las coordenadas
  useEffect(() => {
    if (!map || !profile?.coordenadas?.latitud || !profile?.coordenadas?.longitud) return;

    const { latitud, longitud } = profile.coordenadas;

    try {
      // Limpiar marcadores existentes
      markers.forEach(marker => marker.remove());
      setMarkers([]);

      // Actualizar centro y zoom
      map.setCenter([longitud, latitud]);
      map.setZoom(14);

      // Añadir nuevo marcador
      const newMarker = new mapboxgl.Marker({
        color: '#34D399',
        draggable: false
      })
        .setLngLat([longitud, latitud])
        .addTo(map);

      setMarkers([newMarker]);
    } catch (error) {
      console.error('Error al actualizar el mapa:', error);
    }
  }, [map, profile?.coordenadas]);

  // Memoizar función de scroll
  const scrollToSection = useCallback((ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Memoizar las secciones de navegación
  const navigationSections = useMemo(() => [
    { name: 'Sobre mí', ref: aboutRef },
    { name: 'Servicios y Tarifas', ref: serviciosRef },
    { name: 'Disponibilidad', ref: disponibilidadRef },
    { name: 'Ubicación', ref: ubicacionRef },
    { name: 'Valoraciones', ref: valoracionesRef }
  ], []);

  // Función para cargar la disponibilidad de una fecha específica
  const cargarDisponibilidad = useCallback(async (fecha) => {
    if (!paseadorId) return;
    
    setLoadingDisponibilidad(true);
    try {
      const fechaFormateada = fecha.toISOString().split('T')[0];
      const data = await paseadorProfileService.getDisponibilidad(paseadorId, fechaFormateada);
      
      // Procesar la respuesta para adaptarla al formato esperado
      if (data && data.dias && Array.isArray(data.dias)) {
        const horasDisponibles = data.dias.flatMap(dia => 
          dia.horas.map(hora => ({
            id: hora.id,
            horaInicio: hora.fechaHora.split('T')[1],
            horaFin: new Date(new Date(hora.fechaHora).getTime() + 3600000).toISOString().split('T')[1],
            estado: hora.estado
          }))
        );
        setDisponibilidad(horasDisponibles);
      } else {
        setDisponibilidad([]);
      }
    } catch (error) {
      console.error('Error al cargar disponibilidad:', error);
      setDisponibilidad([]);
    } finally {
      setLoadingDisponibilidad(false);
    }
  }, [paseadorId]);

  // Cargar disponibilidad cuando cambie la fecha seleccionada
  useEffect(() => {
    cargarDisponibilidad(selectedDate);
  }, [selectedDate, cargarDisponibilidad]);

  // Generar días del mes actual
  const diasDelMes = useMemo(() => {
    const ultimoDia = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
    const dias = [];
    
    for (let i = 1; i <= ultimoDia.getDate(); i++) {
      dias.push(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i));
    }
    
    return dias;
  }, [selectedDate]);

  // Función para cambiar de mes
  const cambiarMes = (incremento) => {
    setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() + incremento, 1));
  };

  // Función para formatear hora
  const formatearHora = (hora) => {
    return new Date(`2000-01-01T${hora}`).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Renderizar la sección del mapa solo cuando el perfil esté cargado
  const renderMap = () => {
    if (!profile) return null;

    return (
      <section ref={ubicacionRef} className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Ubicación</h2>
        <div className="overflow-hidden rounded-lg shadow">
          <div 
            ref={mapContainer}
            style={{ 
              width: '100%',
              height: '400px',
              position: 'relative'
            }}
          />
          <div className="p-4 bg-white">
            <div className="flex items-center text-gray-600">
              <FaMapMarkerAlt className="mr-2 text-dog-green" />
              <span>{profile.direccion}</span>
            </div>
          </div>
        </div>
      </section>
    );
  };

  // Renderizar estado de carga
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 rounded-full border-t-dog-green border-r-dog-green border-b-transparent border-l-transparent animate-spin"></div>
          <p className="mt-4 text-gray-600">Cargando perfil del paseador...</p>
        </div>
      </div>
    );
  }

  // Renderizar estado de error
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="p-4 text-center">
          <p className="mb-4 text-xl text-red-600">{error}</p>
          <button
            onClick={loadProfileData}
            className="px-4 py-2 text-white transition rounded-md bg-dog-green hover:bg-dog-light-green"
          >
            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }

  // Renderizar estado sin datos
  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="p-4 text-center text-gray-600">
          No se encontró el perfil del paseador
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header con información principal */}
      <div className="bg-white shadow">
        <div className="container px-4 py-8 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Columna izquierda - Foto y datos básicos */}
            <div className="text-center">
              {profile.foto ? (
                <img 
                  src={profile.foto} 
                  alt={profile.nombre}
                  className="object-cover w-48 h-48 mx-auto mb-4 rounded-full"
                  loading="lazy"
                />
              ) : (
                <div className="flex items-center justify-center w-48 h-48 mx-auto mb-4 text-white rounded-full bg-dog-green">
                  <FaUser size={64} />
                </div>
              )}
              <h1 className="mb-2 text-2xl font-bold">
                {profile.nombre} {profile.apellido}
              </h1>
              <div className="flex items-center justify-center mb-4">
                <FaMapMarkerAlt className="mr-2 text-dog-green" />
                <span className="text-gray-600">{profile.direccion}</span>
              </div>
              <div className="flex justify-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar 
                    key={star}
                    className={`w-6 h-6 ${
                      star <= (ranking?.promedioValoracion || 0)
                        ? 'text-yellow-400' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Columna central - Estadísticas */}
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 bg-white rounded-lg shadow">
                <h3 className="text-sm text-gray-500">Valoración media</h3>
                <p className="text-xl font-semibold">{ranking?.promedioValoracion?.toFixed(1) || 'N/A'}</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow">
                <h3 className="text-sm text-gray-500">Total reseñas</h3>
                <p className="text-xl font-semibold">{ranking?.cantidadValoraciones || 0}</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow">
                <h3 className="text-sm text-gray-500">Servicios completados</h3>
                <p className="text-xl font-semibold">{profile.serviciosCompletados || 0}</p>
              </div>
            </div>

            {/* Columna derecha - Botones de acción */}
            <div className="flex flex-col gap-4">
              <button 
                className="px-6 py-3 text-white transition rounded-md bg-dog-green hover:bg-dog-light-green"
                onClick={() => {/* Implementar modal de reserva */}}
              >
                Contratar Reserva
              </button>
              <button 
                className="px-6 py-3 transition bg-white border rounded-md text-dog-green border-dog-green hover:bg-gray-50"
                onClick={() => {/* Implementar inicio de chat */}}
              >
                Iniciar Chat
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="sticky top-0 z-10 bg-white shadow">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="flex justify-center gap-8">
            {navigationSections.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  scrollToSection(item.ref);
                  setActiveSection(item.name.toLowerCase());
                }}
                className={`px-4 py-4 text-sm font-medium transition border-b-2 ${
                  activeSection === item.name.toLowerCase()
                    ? 'border-dog-green text-dog-green'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <div className="container px-4 py-8 mx-auto max-w-7xl">
        {/* Sobre mí */}
        <section ref={aboutRef} className="mb-12">
          <h2 className="mb-4 text-2xl font-bold">Sobre mí</h2>
          <p className="text-gray-600">
            {profile.descripcion || 'Este paseador aún no ha añadido una descripción.'}
          </p>
        </section>

        {/* Servicios y Tarifas */}
        <section ref={serviciosRef} className="mb-12">
          <h2 className="mb-4 text-2xl font-bold">Servicios y Tarifas</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {profile.servicios?.map((servicio) => (
              <div key={servicio.id} className="p-4 bg-white rounded-lg shadow">
                <h3 className="mb-2 text-lg font-semibold">{servicio.nombre}</h3>
                <p className="text-2xl font-bold text-dog-green">
                  {new Intl.NumberFormat('es-ES', {
                    style: 'currency',
                    currency: 'EUR'
                  }).format(servicio.precio)}
                  /hora
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Disponibilidad */}
        <section ref={disponibilidadRef} className="mb-12">
          <h2 className="mb-4 text-2xl font-bold">Disponibilidad</h2>
          <div className="p-6 bg-white rounded-lg shadow">
            {/* Navegación del calendario */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => cambiarMes(-1)}
                className="p-2 text-gray-600 transition hover:text-dog-green"
              >
                &lt; Mes anterior
              </button>
              <h3 className="text-xl font-semibold">
                {selectedDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
              </h3>
              <button
                onClick={() => cambiarMes(1)}
                className="p-2 text-gray-600 transition hover:text-dog-green"
              >
                Mes siguiente &gt;
              </button>
            </div>

            {/* Días de la semana */}
            <div className="grid grid-cols-7 mb-2 text-sm font-semibold text-center text-gray-600">
              {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(dia => (
                <div key={dia} className="p-2">{dia}</div>
              ))}
            </div>

            {/* Calendario */}
            <div className="grid grid-cols-7 gap-1">
              {Array(diasDelMes[0].getDay()).fill(null).map((_, index) => (
                <div key={`empty-${index}`} className="p-2" />
              ))}
              {diasDelMes.map(dia => {
                const fechaStr = dia.toISOString().split('T')[0];
                // Verificar que disponibilidad sea un array antes de usar some
                const tieneDisponibilidad = Array.isArray(disponibilidad) && 
                  disponibilidad.some(d => d.fecha === fechaStr);
                const esHoy = new Date().toDateString() === dia.toDateString();
                const seleccionado = selectedDate.toDateString() === dia.toDateString();

                return (
                  <button
                    key={dia.getTime()}
                    onClick={() => setSelectedDate(dia)}
                    className={`p-2 text-center rounded-lg transition ${
                      seleccionado
                        ? 'bg-dog-green text-white'
                        : esHoy
                        ? 'bg-dog-light-green text-dog-green'
                        : tieneDisponibilidad
                        ? 'hover:bg-gray-100 text-dog-green'
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    {dia.getDate()}
                  </button>
                );
              })}
            </div>

            {/* Horarios disponibles */}
            <div className="mt-6">
              <h4 className="mb-3 text-lg font-semibold">
                Horarios disponibles para {selectedDate.toLocaleDateString('es-ES', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long'
                })}
              </h4>
              {loadingDisponibilidad ? (
                <div className="flex items-center justify-center p-4">
                  <div className="w-6 h-6 border-2 rounded-full border-t-dog-green border-r-dog-green border-b-transparent border-l-transparent animate-spin"></div>
                  <span className="ml-2 text-gray-600">Cargando disponibilidad...</span>
                </div>
              ) : Array.isArray(disponibilidad) && disponibilidad.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {disponibilidad.map((slot, index) => (
                    <div
                      key={index}
                      className="p-3 text-center border rounded-lg border-dog-light-green text-dog-green"
                    >
                      {formatearHora(slot.horaInicio)} - {formatearHora(slot.horaFin)}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-600">
                  No hay horarios disponibles para esta fecha
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Ubicación */}
        {renderMap()}

        {/* Valoraciones */}
        <section ref={valoracionesRef}>
          <h2 className="mb-4 text-2xl font-bold">Valoraciones</h2>
          <div className="space-y-4">
            {valoraciones.map((valoracion) => (
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
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default PaseadorProfile; 