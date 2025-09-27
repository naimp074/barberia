import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Phone, 
  User, 
  Scissors, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { storage } from '../utils/storage';
import { generateAvailableHours } from '../utils/calculations';
import { Reserva } from '../types';

const ClientView: React.FC = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    fecha: '',
    hora: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const horasDisponibles = generateAvailableHours();

  useEffect(() => {
    setReservas(storage.getReservas());
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getHorasOcupadas = (fecha: string) => {
    if (!fecha) return [];
    const reservasFecha = reservas.filter(
      r => r.fecha.toDateString() === new Date(fecha).toDateString() && 
      r.estado !== 'cancelada'
    );
    return reservasFecha.map(r => r.hora);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!formData.nombre || !formData.apellido || !formData.telefono || !formData.fecha || !formData.hora) {
      setError('Por favor, completa todos los campos');
      return;
    }

    const fechaSeleccionada = new Date(formData.fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaSeleccionada < hoy) {
      setError('No puedes reservar en fechas pasadas');
      return;
    }

    const horasOcupadas = getHorasOcupadas(formData.fecha);
    if (horasOcupadas.includes(formData.hora)) {
      setError('Esta hora ya está ocupada, por favor elige otra');
      return;
    }

    // Crear nueva reserva
    const nuevaReserva: Reserva = {
      id: Date.now().toString(),
      nombre: formData.nombre,
      apellido: formData.apellido,
      telefono: formData.telefono,
      fecha: new Date(formData.fecha),
      hora: formData.hora,
      estado: 'pendiente'
    };

    const reservasActualizadas = [...reservas, nuevaReserva];
    setReservas(reservasActualizadas);
    storage.saveReservas(reservasActualizadas);

    // Limpiar formulario y mostrar éxito
    setFormData({
      nombre: '',
      apellido: '',
      telefono: '',
      fecha: '',
      hora: ''
    });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const horasOcupadasHoy = getHorasOcupadas(formData.fecha);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <div className="bg-yellow-400 rounded-full p-4 w-20 h-20 mx-auto mb-4">
              <Scissors className="w-12 h-12 text-black" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Barbería Elite</h1>
            <p className="text-gray-300 text-lg">Reserva tu turno online</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mensaje de éxito */}
        {showSuccess && (
          <div className="bg-green-500 text-white p-4 rounded-lg mb-6 flex items-center space-x-3 animate-pulse">
            <CheckCircle size={24} />
            <div>
              <p className="font-semibold">¡Reserva realizada con éxito!</p>
              <p className="text-sm">Te contactaremos pronto para confirmar tu turno</p>
            </div>
          </div>
        )}

        {/* Formulario de reserva */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Reservar Turno</h2>
            <p className="text-gray-600">Completa el formulario para reservar tu cita</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre y Apellido */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User size={16} className="inline mr-2" />
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                  placeholder="Tu nombre"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User size={16} className="inline mr-2" />
                  Apellido
                </label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                  placeholder="Tu apellido"
                  required
                />
              </div>
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone size={16} className="inline mr-2" />
                Teléfono
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                placeholder="Tu número de teléfono"
                required
              />
            </div>

            {/* Fecha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-2" />
                Fecha
              </label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Hora */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock size={16} className="inline mr-2" />
                Hora
              </label>
              <select
                name="hora"
                value={formData.hora}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                required
              >
                <option value="">Selecciona una hora</option>
                {horasDisponibles.map(hora => (
                  <option 
                    key={hora} 
                    value={hora} 
                    disabled={horasOcupadasHoy.includes(hora)}
                    className={horasOcupadasHoy.includes(hora) ? 'text-gray-400' : ''}
                  >
                    {hora} {horasOcupadasHoy.includes(hora) ? '(Ocupada)' : ''}
                  </option>
                ))}
              </select>
              {formData.fecha && horasOcupadasHoy.length > 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  Las horas marcadas como "Ocupada" ya están reservadas para esta fecha
                </p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center space-x-2">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            {/* Botón de envío */}
            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Calendar size={20} />
              <span>Reservar Turno</span>
            </button>
          </form>

          {/* Información adicional */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Información importante:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Horarios de atención: Lunes a Sábado de 9:00 a 18:30</li>
              <li>• Te contactaremos para confirmar tu reserva</li>
              <li>• Si necesitas cancelar, llámanos con 24hs de anticipación</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientView;