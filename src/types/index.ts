export interface Corte {
  id: string;
  fecha: Date;
  precio: number;
}

export interface Reserva {
  id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  fecha: Date;
  hora: string;
  estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
}

export interface BalanceData {
  dia: number;
  semana: number;
  mes: number;
  año: number;
}

export interface AppState {
  isAuthenticated: boolean;
  cortes: Corte[];
  reservas: Reserva[];
  precioCorte: number;
}