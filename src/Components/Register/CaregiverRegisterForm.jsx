import { useState, useEffect } from 'react';
import { FaArrowLeft, FaGoogle } from 'react-icons/fa';

const CaregiverRegisterForm = ({ onBack }) => {
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
  const serviciosDisponibles = [
    { id: '1', nombre: 'Paseo de perros', precio: 0 },
    { id: '2', nombre: 'Alojamiento en casa', precio: 0 },
    { id: '3', nombre: 'Guardería de día', precio: 0 }
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleServicioChange = (e, servicioId) => {
    const isChecked = e.target.checked;
    
    setFormData(prev => {
      // Si está marcado, agregamos el servicio
      if (isChecked) {
        return {
          ...prev,
          servicios: [...prev.servicios, { servicioId, precio: 0 }]
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
      alert('Las contraseñas no coinciden');
      return;
    }
    
    // Validar que haya seleccionado al menos un servicio
    if (formData.servicios.length === 0) {
      alert('Debe seleccionar al menos un servicio');
      return;
    }
    
    // Aquí se haría la petición HTTP
    setLoading(true);
    
    try {
      // Simulación de petición
      console.log('Datos del cuidador a enviar:', formData);
      
      // La petición HTTP iría aquí
      // const response = await fetch('/api/registro/cuidador', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      // if (!response.ok) throw new Error('Error en el registro');
      
      // const data = await response.json();
      // console.log('Respuesta del servidor:', data);
      
      // Redirección o mensaje de éxito
      alert('Registro exitoso! (simulado)');
      
    } catch (error) {
      console.error('Error en el registro:', error);
      alert('Error en el registro. Intente nuevamente.');
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
      
      <button className="flex items-center justify-center w-full gap-2 px-4 py-2 mb-6 transition bg-white border border-gray-300 rounded-md hover:bg-gray-50">
        <FaGoogle className="text-red-500" />
        <span>Regístrate con Google</span>
      </button>
      
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
          
          {/* Campos específicos del cuidador */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Servicios ofrecidos:
            </label>
            <div className="p-3 border border-gray-300 rounded-md">
              {serviciosDisponibles.map(servicio => (
                <div key={servicio.id} className="flex flex-col mb-3 last:mb-0">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`servicio-${servicio.id}`}
                      onChange={(e) => handleServicioChange(e, servicio.id)}
                      className="mr-2"
                    />
                    <label htmlFor={`servicio-${servicio.id}`} className="mr-2">
                      {servicio.nombre}
                    </label>
                  </div>
                  
                  {formData.servicios.some(s => s.servicioId === servicio.id) && (
                    <div className="mt-2 ml-6">
                      <label htmlFor={`precio-${servicio.id}`} className="block mb-1 text-xs text-gray-600">
                        Precio (€/hora):
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
              ))}
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
      </form>
    </div>
  );
};

export default CaregiverRegisterForm; 