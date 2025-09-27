import { Corte, BalanceData } from '../types';
import { 
  isToday, 
  isThisWeek, 
  isThisMonth, 
  isThisYear, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  startOfYear, 
  endOfYear 
} from 'date-fns';

export const calculateBalance = (cortes: Corte[], precioCorte: number): BalanceData => {
  const hoy = new Date();
  
  const cortesHoy = cortes.filter(corte => isToday(corte.fecha)).length;
  const cortesSemana = cortes.filter(corte => isThisWeek(corte.fecha, { weekStartsOn: 1 })).length;
  const cortesMes = cortes.filter(corte => isThisMonth(corte.fecha)).length;
  const cortesAño = cortes.filter(corte => isThisYear(corte.fecha)).length;
  
  return {
    dia: cortesHoy * precioCorte,
    semana: cortesSemana * precioCorte,
    mes: cortesMes * precioCorte,
    año: cortesAño * precioCorte
  };
};

export const generateAvailableHours = (): string[] => {
  const hours = [];
  for (let i = 9; i <= 18; i++) {
    hours.push(`${i}:00`);
    if (i < 18) hours.push(`${i}:30`);
  }
  return hours;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS'
  }).format(amount);
};