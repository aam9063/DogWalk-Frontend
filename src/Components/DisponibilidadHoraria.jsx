import React, { useState } from 'react';
import { FaPlus, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { crearDisponibilidadHoraria } from '../Services/paseadorDashboardService';
import { toast } from 'react-toastify';

const DisponibilidadHoraria = () => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [intervaloMinutos, setIntervaloMinutos] = useState(60);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!fechaInicio || !fechaFin || !horaInicio || !horaFin) {
      toast.error('Por favor, completa todos los campos');
      return;
    }

    try {
      setLoading(true);
      
      // Construir las fechas en formato ISO
      const fechaHoraInicio = new Date(`${fechaInicio}T${horaInicio}`).toISOString();
      const fechaHoraFin = new Date(`${fechaFin}T${horaFin}`).toISOString();

      // Validar que la fecha/hora de fin sea después de la fecha/hora de inicio
      if (new Date(fechaHoraFin) <= new Date(fechaHoraInicio)) {
        toast.error('La fecha y hora de fin debe ser posterior a la fecha y hora de inicio');
        return;
      }

      const disponibilidad = {
        fechaHoraInicio,
        fechaHoraFin,
        intervaloMinutos: parseInt(intervaloMinutos)
      };

      console.log('Enviando disponibilidad:', disponibilidad);
      await crearDisponibilidadHoraria(disponibilidad);
      toast.success('Disponibilidad horaria creada con éxito');
      
      // Limpiar el formulario
      setFechaInicio('');
      setFechaFin('');
      setHoraInicio('');
      setHoraFin('');
      setIntervaloMinutos(60);
    } catch (error) {
      console.error('Error al crear disponibilidad:', error);
      toast.error('Error al crear la disponibilidad horaria');
    } finally {
      setLoading(false);
    }
  };

  // Obtener la fecha mínima (hoy) en formato YYYY-MM-DD
  const fechaMinima = new Date().toISOString().split('T')[0];

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">
        Gestionar Disponibilidad
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              <FaCalendarAlt className="inline mb-1 mr-2" />
              Fecha de inicio
            </label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              min={fechaMinima}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-dog-green focus:border-dog-green"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              <FaCalendarAlt className="inline mb-1 mr-2" />
              Fecha de fin
            </label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              min={fechaInicio || fechaMinima}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-dog-green focus:border-dog-green"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              <FaClock className="inline mb-1 mr-2" />
              Hora de inicio
            </label>
            <input
              type="time"
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-dog-green focus:border-dog-green"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              <FaClock className="inline mb-1 mr-2" />
              Hora de fin
            </label>
            <input
              type="time"
              value={horaFin}
              onChange={(e) => setHoraFin(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-dog-green focus:border-dog-green"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Intervalo (minutos)
          </label>
          <select
            value={intervaloMinutos}
            onChange={(e) => setIntervaloMinutos(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-dog-green focus:border-dog-green"
          >
            <option value="30">30 minutos</option>
            <option value="60">1 hora</option>
            <option value="120">2 horas</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center w-full px-4 py-2 text-white transition-colors rounded-md bg-dog-green hover:bg-dog-light-green disabled:opacity-50"
        >
          <FaPlus className="mr-2" />
          {loading ? 'Creando...' : 'Crear Disponibilidad'}
        </button>
      </form>
    </div>
  );
};

export default DisponibilidadHoraria; 