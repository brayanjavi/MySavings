/**
 * Utilidades compartidas para la aplicación MySavings
 */

/**
 * Formatea una fecha al formato legible en español
 */
export const formatDate = (dateString: string, format: 'long' | 'short' = 'short'): string => {
  const date = new Date(dateString + 'T00:00:00');
  const options: Intl.DateTimeFormatOptions =
    format === 'long'
      ? {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }
      : {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        };
  return date.toLocaleDateString('es-ES', options);
};

/**
 * Formatea un número como moneda
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Formatea un número como cantidad con 2 decimales
 */
export const formatAmount = (amount: number): string => {
  return amount.toFixed(2);
};

/**
 * Calcula el porcentaje de un valor respecto a un total
 */
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return (value / total) * 100;
};

/**
 * Obtiene el mes actual en formato YYYY-MM
 */
export const getCurrentMonth = (): string => {
  return new Date().toISOString().substring(0, 7);
};

/**
 * Obtiene el rango de fechas del mes actual
 */
export const getMonthRange = (): { start: string; end: string } => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const lastDay = new Date(year, parseInt(month), 0).getDate();

  return {
    start: `${year}-${month}-01`,
    end: `${year}-${month}-${lastDay}`,
  };
};

/**
 * Valida si una fecha es válida
 */
export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString + 'T00:00:00');
  return date instanceof Date && !isNaN(date.getTime());
};

/**
 * Obtiene el nombre del mes en español
 */
export const getMonthName = (monthIndex: number): string => {
  const months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];
  return months[monthIndex] || '';
};

/**
 * Calcula los días restantes hasta una fecha
 */
export const getDaysRemaining = (deadline: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadlineDate = new Date(deadline + 'T00:00:00');
  const diffTime = deadlineDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Redondea un número a 2 decimales
 */
export const roundToTwo = (value: number): number => {
  return Math.round(value * 100) / 100;
};

/**
 * Genera un ID único basado en timestamp
 */
export const generateId = (): string => {
  return Date.now().toString();
};

/**
 * Valida si una cantidad es positiva
 */
export const isPositiveAmount = (amount: number): boolean => {
  return amount > 0;
};

/**
 * Obtiene el color según la prioridad
 */
export const getPriorityColor = (priority: 'low' | 'medium' | 'high'): string => {
  const colors = {
    low: '#3B82F6',
    medium: '#F59E0B',
    high: '#EF4444',
  };
  return colors[priority];
};

/**
 * Obtiene el emoji según la categoría de gasto
 */
export const getCategoryEmoji = (category: string): string => {
  const emojiMap: { [key: string]: string } = {
    Alimentación: '🍔',
    Transporte: '🚗',
    Entretenimiento: '🎬',
    Salud: '⚕️',
    Educación: '📚',
    Utilidades: '💡',
    Otro: '💳',
    Renovaciones: '🔄',
    Membresías: '🎫',
    'Pagos Cotidianos': '💰',
    Otros: '📌',
  };
  return emojiMap[category] || '💳';
};

/**
 * Obtiene la etiqueta de frecuencia
 */
export const getFrequencyLabel = (frequency: string): string => {
  const labels: { [key: string]: string } = {
    weekly: 'Semanal',
    monthly: 'Mensual',
    yearly: 'Anual',
    once: 'Una sola vez',
  };
  return labels[frequency] || '';
};
