import { useState, useEffect } from 'react';
import { FaArrowLeft, FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import authService from '../../Services/authService';
import serviceService from '../../Services/serviceService';

const CaregiverRegisterForm = ({ onBack }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    dni: '',
    nombre: '',
    apellido: '',
    direccion: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    latitud: 0,
    longitud: 0,
    servicios: []
  });
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [serviciosDisponibles, setServiciosDisponibles] = useState([]);
  const [loadingServicios, setLoadingServicios] = useState(true);
  const [serviceError, setServiceError] = useState(null);
  
  // Obtener servicios disponibles desde la API
  useEffect(() => {
    const fetchServicios = async () => {
      setLoadingServicios(true);
      setServiceError(null);
      try {
        const data = await serviceService.getAll();
        setServiciosDisponibles(data);
      } catch (error) {
        console.error('Error al obtener servicios:', error);
        setServiceError('No se pudieron cargar los servicios disponibles. Por favor, intenta nuevamente más tarde.');
      } finally {
        setLoadingServicios(false);
      }
    };
    
    fetchServicios();
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleServicioChange = (e, servicioId) => {
    const isChecked = e.target.checked;
    
    setFormData(prev => {
      // Si está marcado, agregamos el servicio con el precio de referencia
      if (isChecked) {
        const servicio = serviciosDisponibles.find(s => s.id === servicioId);
        const precioReferencia = servicio ? servicio.precioReferencia : 0;
        
        return {
          ...prev,
          servicios: [...prev.servicios, { 
            servicioId, 
            precio: precioReferencia // Usamos el precio de referencia
          }]
        };
      }
      // Si está desmarcado, lo quitamos
      else {
        return {
          ...prev,
          servicios: prev.servicios.filter(s => s.servicioId !== servicioId)
        };
      }
    });
  };
  
  const handlePrecioChange = (e, servicioId) => {
    const precio = parseFloat(e.target.value) || 0;
    
    setFormData(prev => {
      return {
        ...prev,
        servicios: prev.servicios.map(s => 
          s.servicioId === servicioId ? { ...s, precio } : s
        )
      };
    });
  };
  
  // Obtener la ubicación actual
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitud: position.coords.latitude,
            longitud: position.coords.longitude
          }));
        },
        (error) => {
          console.error('Error al obtener la ubicación:', error);
        }
      );
    }
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      return;
    }
    
    // Validar que haya seleccionado al menos un servicio
    if (formData.servicios.length === 0) {
      setErrorMessage('Debe seleccionar al menos un servicio');
      return;
    }
    
    // Validar que todos los servicios tengan un precio mayor que cero
    const serviciosSinPrecio = formData.servicios.filter(s => s.precio <= 0);
    if (serviciosSinPrecio.length > 0) {
      setErrorMessage('Todos los servicios seleccionados deben tener un precio mayor que 0');
      return;
    }
    
    setLoading(true);
    setErrorMessage(null);
    
    try {
      // Preparar los datos para el formato esperado por la API
      const caregiverData = {
        dni: formData.dni,
        nombre: formData.nombre,
        apellido: formData.apellido,
        direccion: formData.direccion,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        telefono: formData.telefono,
        latitud: formData.latitud,
        longitud: formData.longitud,
        servicios: formData.servicios.map(s => ({
          servicioId: s.servicioId,
          precio: s.precio
        }))
      };
      
      // Llamar al servicio de registro
      await authService.registerCaregiver(caregiverData);
      
      // Redirección a login con mensaje de éxito
      navigate('/login', { state: { registered: true, message: 'Registro exitoso. Ahora puedes iniciar sesión.' } });
    } catch (error) {
      console.error('Error en el registro:', error);
      setErrorMessage(error.info?.message || 'Error en el registro. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <button 
        onClick={onBack} 
        className="flex items-center mb-4 text-gray-600 hover:text-dog-green"
      >
        <FaArrowLeft className="mr-1" /> Volver
      </button>
            
      {serviceError && (
        <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-md">
          {serviceError}
        </div>
      )}
      
      {errorMessage && (
        <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-md">
          {errorMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Campos básicos, iguales a los del usuario */}
          <div>
            <label htmlFor="nombre" className="block mb-1 text-sm font-medium text-gray-700">
              Nombre:
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-dog-green"
            />
          </div>
          
          <div>
            <label htmlFor="apellido" className="block mb-1 text-sm font-medium text-gray-700">
              Apellidos:
            </label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-dog-green"
            />
          </div>
          
          <div>
            <label htmlFor="dni" className="block mb-1 text-sm font-medium text-gray-700">
              DNI:
            </label>
            <input
              type="text"
              id="dni"
              name="dni"
              value={formData.dni}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-dog-green"
            />
          </div>
          
          <div>
            <label htmlFor="direccion" className="block mb-1 text-sm font-medium text-gray-700">
              Dirección:
            </label>
            <input
              type="text"
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-dog-green"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-dog-green"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
              Contraseña:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-dog-green"
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium text-gray-700">
              Confirmar Contraseña:
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-dog-green"
            />
          </div>
          
          <div>
            <label htmlFor="telefono" className="block mb-1 text-sm font-medium text-gray-700">
              Teléfono:
            </label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-dog-green"
            />
          </div>
          
          {/* Sección de servicios actualizada */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Servicios ofrecidos:
            </label>
            <div className="p-3 border border-gray-300 rounded-md">
              {loadingServicios ? (
                <p className="text-center text-gray-500">Cargando servicios...</p>
              ) : serviciosDisponibles.length === 0 ? (
                <p className="text-center text-gray-500">No hay servicios disponibles</p>
              ) : (
                serviciosDisponibles.map(servicio => (
                  <div key={servicio.id} className="flex flex-col mb-3 last:mb-0">
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id={`servicio-${servicio.id}`}
                        onChange={(e) => handleServicioChange(e, servicio.id)}
                        className="mt-1 mr-2"
                      />
                      <div>
                        <label htmlFor={`servicio-${servicio.id}`} className="font-medium">
                          {servicio.nombre}
                        </label>
                        <p className="text-sm text-gray-600">{servicio.descripcion}</p>
                        <p className="text-xs text-gray-500">
                          Precio referencia: {servicio.precioReferencia}€
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          Recomendado: Entre {Math.max(0, servicio.precioReferencia * 0.8)}€ y {servicio.precioReferencia * 1.2}€
                        </p>
                      </div>
                    </div>
                    
                    {formData.servicios.some(s => s.servicioId === servicio.id) && (
                      <div className="mt-2 ml-6">
                        <label htmlFor={`precio-${servicio.id}`} className="block mb-1 text-xs text-gray-600">
                          Tu precio (€/hora):
                        </label>
                        <input
                          type="number"
                          id={`precio-${servicio.id}`}
                          min="0"
                          step="0.5"
                          value={formData.servicios.find(s => s.servicioId === servicio.id)?.precio || 0}
                          onChange={(e) => handlePrecioChange(e, servicio.id)}
                          className="w-24 px-2 py-1 border border-gray-300 rounded-md"
                        />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="latitud" className="block mb-1 text-sm font-medium text-gray-700">
                Latitud:
              </label>
              <input
                type="number"
                id="latitud"
                name="latitud"
                value={formData.latitud}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-dog-green"
                disabled
              />
            </div>
            
            <div>
              <label htmlFor="longitud" className="block mb-1 text-sm font-medium text-gray-700">
                Longitud:
              </label>
              <input
                type="number"
                id="longitud"
                name="longitud"
                value={formData.longitud}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-dog-green"
                disabled
              />
            </div>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-6 py-3 px-4 bg-dog-green text-white rounded-md hover:bg-dog-light-green transition duration-300 ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Registrando...' : 'Regístrate'}
        </button>

        <p className="text-center">o</p>

        <button className="flex items-center justify-center w-full gap-2 px-4 py-2 mb-6 transition bg-white border border-gray-300 rounded-md hover:bg-gray-50">
          <FaGoogle className="text-red-500" />
          <span>Regístrate con Google</span>
        </button>
      </form>
    </div>
  );
};

export default CaregiverRegisterForm; 