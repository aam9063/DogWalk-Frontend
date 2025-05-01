import { useState } from 'react';
import { FaArrowLeft, FaGoogle } from 'react-icons/fa';

const UserRegisterForm = ({ onBack }) => {
  const [formData, setFormData] = useState({
    dni: '',
    nombre: '',
    apellido: '',
    direccion: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: ''
  });
  
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    
    // Aquí se haría la petición HTTP
    setLoading(true);
    
    try {
      // Simulación de petición
      console.log('Datos del usuario a enviar:', formData);
      
      // La petición HTTP iría aquí
      // const response = await fetch('/api/registro/propietario', {
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

export default UserRegisterForm; 