import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Income {
  id: string;
  amount: number;
  date: string; // ISO date string
  frequency: 'weekly' | 'monthly'; // semanal o mensual
  description: string;
}

export interface Expense {
  id: string;
  amount: number;
  date: string; // ISO date string
  category: string;
  description: string;
}

export interface Reminder {
  id: string;
  title: string;
  amount: number;
  dueDate: string; // ISO date string
  frequency: 'once' | 'monthly' | 'yearly'; // único, mensual, anual
  category: string; // renovaciones, membresías, pagos cotidianos
  isActive: boolean;
}

export interface SavingsPlan {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string; // ISO date string
  priority: 'low' | 'medium' | 'high';
  description: string;
}

const KEYS = {
  INCOMES: '@mysavings:incomes',
  EXPENSES: '@mysavings:expenses',
  REMINDERS: '@mysavings:reminders',
  SAVINGS_PLANS: '@mysavings:savings_plans',
};

// Helper function to generate unique IDs
const generateUniqueId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Helper function to validate amount
const validateAmount = (amount: number): void => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    throw new Error('El monto debe ser un número válido');
  }
  if (amount <= 0) {
    throw new Error('El monto debe ser mayor a cero');
  }
  if (amount > 999999999) {
    throw new Error('El monto es demasiado grande');
  }
};

// Helper function to validate date
const validateDate = (date: string): void => {
  const dateObj = new Date(date + 'T00:00:00');
  if (isNaN(dateObj.getTime())) {
    throw new Error('Fecha inválida');
  }
};

// INCOMES
export const addIncome = async (income: Omit<Income, 'id'>) => {
  try {
    validateAmount(income.amount);
    validateDate(income.date);
    
    const incomes = await getIncomes();
    const newIncome: Income = {
      ...income,
      id: generateUniqueId(),
    };
    await AsyncStorage.setItem(KEYS.INCOMES, JSON.stringify([...incomes, newIncome]));
    return newIncome;
  } catch (error) {
    console.error('Error adding income:', error);
    throw error;
  }
};

export const getIncomes = async (): Promise<Income[]> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.INCOMES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting incomes:', error);
    return [];
  }
};

export const updateIncome = async (id: string, income: Omit<Income, 'id'>) => {
  try {
    const incomes = await getIncomes();
    const updated = incomes.map(i => i.id === id ? { ...income, id } : i);
    await AsyncStorage.setItem(KEYS.INCOMES, JSON.stringify(updated));
  } catch (error) {
    console.error('Error updating income:', error);
    throw error;
  }
};

export const deleteIncome = async (id: string) => {
  try {
    const incomes = await getIncomes();
    const filtered = incomes.filter(i => i.id !== id);
    await AsyncStorage.setItem(KEYS.INCOMES, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting income:', error);
    throw error;
  }
};

// EXPENSES
export const addExpense = async (expense: Omit<Expense, 'id'>) => {
  try {
    validateAmount(expense.amount);
    validateDate(expense.date);
    
    const expenses = await getExpenses();
    const newExpense: Expense = {
      ...expense,
      id: generateUniqueId(),
    };
    await AsyncStorage.setItem(KEYS.EXPENSES, JSON.stringify([...expenses, newExpense]));
    return newExpense;
  } catch (error) {
    console.error('Error adding expense:', error);
    throw error;
  }
};

export const getExpenses = async (): Promise<Expense[]> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.EXPENSES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting expenses:', error);
    return [];
  }
};

export const updateExpense = async (id: string, expense: Omit<Expense, 'id'>) => {
  try {
    const expenses = await getExpenses();
    const updated = expenses.map(e => e.id === id ? { ...expense, id } : e);
    await AsyncStorage.setItem(KEYS.EXPENSES, JSON.stringify(updated));
  } catch (error) {
    console.error('Error updating expense:', error);
    throw error;
  }
};

export const deleteExpense = async (id: string) => {
  try {
    const expenses = await getExpenses();
    const filtered = expenses.filter(e => e.id !== id);
    await AsyncStorage.setItem(KEYS.EXPENSES, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
};

// REMINDERS
export const addReminder = async (reminder: Omit<Reminder, 'id'>) => {
  try {
    validateAmount(reminder.amount);
    validateDate(reminder.dueDate);
    
    const reminders = await getReminders();
    const newReminder: Reminder = {
      ...reminder,
      id: generateUniqueId(),
    };
    await AsyncStorage.setItem(KEYS.REMINDERS, JSON.stringify([...reminders, newReminder]));
    return newReminder;
  } catch (error) {
    console.error('Error adding reminder:', error);
    throw error;
  }
};

export const getReminders = async (): Promise<Reminder[]> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.REMINDERS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting reminders:', error);
    return [];
  }
};

export const updateReminder = async (id: string, reminder: Omit<Reminder, 'id'>) => {
  try {
    const reminders = await getReminders();
    const updated = reminders.map(r => r.id === id ? { ...reminder, id } : r);
    await AsyncStorage.setItem(KEYS.REMINDERS, JSON.stringify(updated));
  } catch (error) {
    console.error('Error updating reminder:', error);
    throw error;
  }
};

export const deleteReminder = async (id: string) => {
  try {
    const reminders = await getReminders();
    const filtered = reminders.filter(r => r.id !== id);
    await AsyncStorage.setItem(KEYS.REMINDERS, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting reminder:', error);
    throw error;
  }
};

// SAVINGS PLANS
export const addSavingsPlan = async (plan: Omit<SavingsPlan, 'id'>) => {
  try {
    validateAmount(plan.targetAmount);
    if (plan.currentAmount < 0 || plan.currentAmount > plan.targetAmount) {
      throw new Error('El monto actual debe estar entre 0 y el monto objetivo');
    }
    validateDate(plan.deadline);
    
    const plans = await getSavingsPlans();
    const newPlan: SavingsPlan = {
      ...plan,
      id: generateUniqueId(),
    };
    await AsyncStorage.setItem(KEYS.SAVINGS_PLANS, JSON.stringify([...plans, newPlan]));
    return newPlan;
  } catch (error) {
    console.error('Error adding savings plan:', error);
    throw error;
  }
};

export const getSavingsPlans = async (): Promise<SavingsPlan[]> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.SAVINGS_PLANS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting savings plans:', error);
    return [];
  }
};

export const updateSavingsPlan = async (id: string, plan: Omit<SavingsPlan, 'id'>) => {
  try {
    const plans = await getSavingsPlans();
    const updated = plans.map(p => p.id === id ? { ...plan, id } : p);
    await AsyncStorage.setItem(KEYS.SAVINGS_PLANS, JSON.stringify(updated));
  } catch (error) {
    console.error('Error updating savings plan:', error);
    throw error;
  }
};

export const deleteSavingsPlan = async (id: string) => {
  try {
    const plans = await getSavingsPlans();
    const filtered = plans.filter(p => p.id !== id);
    await AsyncStorage.setItem(KEYS.SAVINGS_PLANS, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting savings plan:', error);
    throw error;
  }
};

// UTILITY FUNCTIONS
export const getTotalIncome = async (month?: string): Promise<number> => {
  try {
    const incomes = await getIncomes();
    if (month) {
      return incomes
        .filter(i => i.date.startsWith(month))
        .reduce((sum, i) => sum + i.amount, 0);
    }
    return incomes.reduce((sum, i) => sum + i.amount, 0);
  } catch (error) {
    console.error('Error calculating total income:', error);
    return 0;
  }
};

export const getTotalExpenses = async (month?: string): Promise<number> => {
  try {
    const expenses = await getExpenses();
    if (month) {
      return expenses
        .filter(e => e.date.startsWith(month))
        .reduce((sum, e) => sum + e.amount, 0);
    }
    return expenses.reduce((sum, e) => sum + e.amount, 0);
  } catch (error) {
    console.error('Error calculating total expenses:', error);
    return 0;
  }
};

export const getBalance = async (month?: string): Promise<number> => {
  try {
    const income = await getTotalIncome(month);
    const expenses = await getTotalExpenses(month);
    return income - expenses;
  } catch (error) {
    console.error('Error calculating balance:', error);
    return 0;
  }
};
