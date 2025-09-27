import { Corte, Reserva } from '../types';

const STORAGE_KEYS = {
  CORTES: 'barberia_cortes',
  RESERVAS: 'barberia_reservas',
  PRECIO: 'barberia_precio',
  AUTH: 'barberia_auth'
};

export const storage = {
  // Cortes
  getCortes: (): Corte[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CORTES);
    return data ? JSON.parse(data).map((c: any) => ({ ...c, fecha: new Date(c.fecha) })) : [];
  },
  
  saveCortes: (cortes: Corte[]) => {
    localStorage.setItem(STORAGE_KEYS.CORTES, JSON.stringify(cortes));
  },
  
  // Reservas
  getReservas: (): Reserva[] => {
    const data = localStorage.getItem(STORAGE_KEYS.RESERVAS);
    return data ? JSON.parse(data).map((r: any) => ({ ...r, fecha: new Date(r.fecha) })) : [];
  },
  
  saveReservas: (reservas: Reserva[]) => {
    localStorage.setItem(STORAGE_KEYS.RESERVAS, JSON.stringify(reservas));
  },
  
  // Precio
  getPrecio: (): number => {
    const data = localStorage.getItem(STORAGE_KEYS.PRECIO);
    return data ? parseFloat(data) : 5000;
  },
  
  savePrecio: (precio: number) => {
    localStorage.setItem(STORAGE_KEYS.PRECIO, precio.toString());
  },
  
  // Auth
  getAuth: (): boolean => {
    return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
  },
  
  saveAuth: (isAuth: boolean) => {
    localStorage.setItem(STORAGE_KEYS.AUTH, isAuth.toString());
  },
  
  clearAuth: () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  }
};