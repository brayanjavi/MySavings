/**
 * Configuración global de la aplicación MySavings
 */

export const APP_CONFIG = {
  // Información de la aplicación
  appName: 'MySavings',
  version: '1.0.0',
  description: 'Gestor de finanzas personales',

  // Colores de la aplicación
  colors: {
    primary: '#6366F1',
    secondary: '#8B5CF6',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    light: '#F3F4F6',
    lighter: '#F9FAFB',
    dark: '#1F2937',
    border: '#E5E7EB',
    text: '#6B7280',
  },

  // Categorías de gastos
  expenseCategories: [
    'Alimentación',
    'Transporte',
    'Entretenimiento',
    'Salud',
    'Educación',
    'Utilidades',
    'Otro',
  ],

  // Categorías de recordatorios
  reminderCategories: ['Renovaciones', 'Membresías', 'Pagos Cotidianos', 'Otros'],

  // Niveles de prioridad
  priorityLevels: ['low', 'medium', 'high'] as const,

  // Frecuencias
  frequencies: {
    income: ['weekly', 'monthly'] as const,
    reminder: ['once', 'monthly', 'yearly'] as const,
  },

  // Límites y validaciones
  limits: {
    maxDescriptionLength: 500,
    maxTitleLength: 100,
    minAmount: 0.01,
    maxAmount: 999999999,
  },

  // Configuración de almacenamiento
  storage: {
    keys: {
      incomes: '@mysavings:incomes',
      expenses: '@mysavings:expenses',
      reminders: '@mysavings:reminders',
      savingsPlans: '@mysavings:savings_plans',
    },
  },

  // Mensajes y textos
  messages: {
    success: {
      incomeAdded: 'Ingreso registrado correctamente',
      expenseAdded: 'Gasto registrado correctamente',
      reminderCreated: 'Recordatorio creado',
      planCreated: 'Plan de ahorro creado',
      itemDeleted: 'Elemento eliminado',
    },
    error: {
      incomeAddFailed: 'No se pudo registrar el ingreso',
      expenseAddFailed: 'No se pudo registrar el gasto',
      reminderFailed: 'No se pudo crear el recordatorio',
      planFailed: 'No se pudo crear el plan',
      deleteFailed: 'No se pudo eliminar el elemento',
      fillAllFields: 'Por favor completa todos los campos',
    },
  },

  // Consejos financieros
  tips: [
    'Registra tus gastos diarios para mantener el control',
    'Establece metas realistas y sigue tus planes de ahorro',
    'Mantén activos los recordatorios de tus pagos',
    'Revisa tu dashboard regularmente',
    'Trata de ahorrar al menos el 20% de tus ingresos',
  ],
};
