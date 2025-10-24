// Tipos compartidos de la aplicación
export type TabType = 'dashboard' | 'income' | 'expense' | 'reminders' | 'savings';

export type FrequencyType = 'weekly' | 'monthly' | 'yearly' | 'once';

export type CategoryType = 'low' | 'medium' | 'high';

export type ExpenseCategoryType =
  | 'Alimentación'
  | 'Transporte'
  | 'Entretenimiento'
  | 'Salud'
  | 'Educación'
  | 'Utilidades'
  | 'Otro';

export type ReminderCategoryType = 'Renovaciones' | 'Membresías' | 'Pagos Cotidianos' | 'Otros';

export interface TransactionSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  incomeCount: number;
  expenseCount: number;
}

export interface MonthlySummary extends TransactionSummary {
  month: string;
  expensePercentage: number;
  savingsAmount: number;
}

export interface FinancialStats {
  averageDailyExpense: number;
  highestExpenseDay: string;
  mostCommonCategory: ExpenseCategoryType;
  remainingBudget: number;
}
