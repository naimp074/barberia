import React, { useState, useEffect } from 'react';
import { Scissors, DollarSign, Calendar, Users, TrendingUp, LogOut, Plus, CreditCard as Edit3, Check, X } from 'lucide-react';
import { storage } from '../utils/storage';
import { calculateBalance, formatCurrency } from '../utils/calculations';
import { Corte, Reserva } from '../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface AdminPanelProps {
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const [cortes, setCortes] = useState<Corte[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [precioCorte, setPrecioCorte] = useState(5000);
  const [editingPrice, setEditingPrice] = useState(false);
  const [tempPrice, setTempPrice] = useState('');

  useEffect(() => {
    setCortes(storage.getCortes());
    setReservas(storage.getReservas());
    setPrecioCorte(storage.getPrecio());
  }, []);

  const registrarCorte = () => {
    const nuevoCorte: Corte = {
      id: Date.now().toString(),
      fecha: new Date(),
      precio: precioCorte
    };
    
    const cortesActualizados = [...cortes, nuevoCorte];
    setCortes(cortesActualizados);
    storage.saveCortes(cortesActualizados);
  };

  const actualizarPrecio = () => {
    const nuevoPrecio = parseFloat(tempPrice);
    if (!isNaN(nuevoPrecio) && nuevoPrecio > 0) {
      setPrecioCorte(nuevoPrecio);
      storage.savePrecio(nuevoPrecio);
      setEditingPrice(false);
      setTempPrice('');
    }
  };

  const cancelarEdicionPrecio = () => {
    setEditingPrice(false);
    setTempPrice('');
  };

  const balance = calculateBalance(cortes, precioCorte);

  const actualizarEstadoReserva = (id: string, nuevoEstado: 'confirmada' | 'completada' | 'cancelada') => {
    const reservasActualizadas = reservas.map(reserva =>
      reserva.id === id ? { ...reserva, estado: nuevoEstado } : reserva
    );
    setReservas(reservasActualizadas);
    storage.saveReservas(reservasActualizadas);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-400 rounded-lg p-2">
                <Scissors className="w-6 h-6 text-black" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Panel Admin</h1>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut size={20} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sección de Cortes y Precio */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Registrar Corte */}
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Registrar Corte</h2>
              <Scissors className="w-6 h-6 text-yellow-500" />
            </div>
            
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-gray-800 mb-2">
                {cortes.length}
              </div>
              <p className="text-gray-600">Cortes realizados hoy</p>
            </div>

            <button
              onClick={registrarCorte}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Plus size={24} />
              <span>Registrar Corte</span>
            </button>
          </div>

          {/* Configurar Precio */}
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Precio del Corte</h2>
              <DollarSign className="w-6 h-6 text-green-500" />
            </div>

            {editingPrice ? (
              <div className="space-y-4">
                <input
                  type="number"
                  value={tempPrice}
                  onChange={(e) => setTempPrice(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="Nuevo precio"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={actualizarPrecio}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <Check size={16} />
                    <span>Guardar</span>
                  </button>
                  <button
                    onClick={cancelarEdicionPrecio}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <X size={16} />
                    <span>Cancelar</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800 mb-4">
                  {formatCurrency(precioCorte)}
                </div>
                <button
                  onClick={() => {
                    setEditingPrice(true);
                    setTempPrice(precioCorte.toString());
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 mx-auto"
                >
                  <Edit3 size={16} />
                  <span>Editar Precio</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Balance */}
        <div className="bg-white rounded-xl shadow-sm p-6 border mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Balance</h2>
            <TrendingUp className="w-6 h-6 text-green-500" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {formatCurrency(balance.dia)}
              </div>
              <p className="text-blue-800 font-medium">Hoy</p>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {formatCurrency(balance.semana)}
              </div>
              <p className="text-green-800 font-medium">Esta Semana</p>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {formatCurrency(balance.mes)}
              </div>
              <p className="text-purple-800 font-medium">Este Mes</p>
            </div>

            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 mb-2">
                {formatCurrency(balance.año)}
              </div>
              <p className="text-orange-800 font-medium">Este Año</p>
            </div>
          </div>
        </div>

        {/* Reservas */}
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Reservas</h2>
            <Users className="w-6 h-6 text-blue-500" />
          </div>

          {reservas.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No hay reservas registradas</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reservas.map((reserva) => (
                <div
                  key={reserva.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="mb-3 sm:mb-0">
                      <h3 className="font-semibold text-gray-800">
                        {reserva.nombre} {reserva.apellido}
                      </h3>
                      <p className="text-gray-600">📞 {reserva.telefono}</p>
                      <p className="text-gray-600">
                        📅 {format(reserva.fecha, 'EEEE, d MMMM yyyy', { locale: es })} - {reserva.hora}
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium text-center ${
                        reserva.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                        reserva.estado === 'confirmada' ? 'bg-blue-100 text-blue-800' :
                        reserva.estado === 'completada' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {reserva.estado.charAt(0).toUpperCase() + reserva.estado.slice(1)}
                      </span>
                      
                      {reserva.estado === 'pendiente' && (
                        <div className="flex space-x-1">
                          <button
                            onClick={() => actualizarEstadoReserva(reserva.id, 'confirmada')}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            Confirmar
                          </button>
                          <button
                            onClick={() => actualizarEstadoReserva(reserva.id, 'cancelada')}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      )}
                      
                      {reserva.estado === 'confirmada' && (
                        <button
                          onClick={() => actualizarEstadoReserva(reserva.id, 'completada')}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Completar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;