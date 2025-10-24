/**
 * Ejemplos de uso - MySavings
 * 
 * Este archivo muestra cómo usar la aplicación programáticamente
 */

import {
  addIncome,
  addExpense,
  addReminder,
  addSavingsPlan,
  getIncomes,
  getExpenses,
  getReminders,
  getSavingsPlans,
  getTotalIncome,
  getTotalExpenses,
  getBalance,
  deleteIncome,
  updateReminder,
} from './storage';

/**
 * Ejemplo 1: Registrar ingresos
 */
async function exampleAddIncomes() {
  console.log('📊 Registrando ingresos...');

  await addIncome({
    amount: 2000,
    date: '2025-10-15',
    frequency: 'monthly',
    description: 'Salario mensual',
  });

  await addIncome({
    amount: 500,
    date: '2025-10-20',
    frequency: 'weekly',
    description: 'Trabajo freelance',
  });

  const incomes = await getIncomes();
  console.log('Ingresos registrados:', incomes);
}

/**
 * Ejemplo 2: Registrar gastos
 */
async function exampleAddExpenses() {
  console.log('💸 Registrando gastos...');

  await addExpense({
    amount: 50,
    date: '2025-10-23',
    category: 'Alimentación',
    description: 'Almuerzo',
  });

  await addExpense({
    amount: 30,
    date: '2025-10-23',
    category: 'Transporte',
    description: 'Gasolina',
  });

  const expenses = await getExpenses();
  console.log('Gastos registrados:', expenses);
}

/**
 * Ejemplo 3: Crear recordatorios
 */
async function exampleAddReminders() {
  console.log('🔔 Creando recordatorios...');

  await addReminder({
    title: 'Pago de internet',
    amount: 50,
    dueDate: '2025-11-05',
    frequency: 'monthly',
    category: 'Pagos Cotidianos',
    isActive: true,
  });

  await addReminder({
    title: 'Renovar licencia de conducir',
    amount: 150,
    dueDate: '2025-12-15',
    frequency: 'yearly',
    category: 'Renovaciones',
    isActive: true,
  });

  const reminders = await getReminders();
  console.log('Recordatorios creados:', reminders);
}

/**
 * Ejemplo 4: Crear planes de ahorro
 */
async function exampleAddSavingsPlans() {
  console.log('🎯 Creando planes de ahorro...');

  await addSavingsPlan({
    name: 'Viaje a Europa',
    targetAmount: 5000,
    currentAmount: 500,
    deadline: '2026-06-30',
    priority: 'high',
    description: 'Viaje de 2 semanas por Europa',
  });

  await addSavingsPlan({
    name: 'Nueva laptop',
    targetAmount: 2000,
    currentAmount: 300,
    deadline: '2026-03-31',
    priority: 'medium',
    description: 'Laptop para programación',
  });

  const plans = await getSavingsPlans();
  console.log('Planes de ahorro creados:', plans);
}

/**
 * Ejemplo 5: Obtener resumen financiero
 */
async function exampleFinancialSummary() {
  console.log('📊 Obteniendo resumen financiero...');

  const currentMonth = new Date().toISOString().substring(0, 7);

  const income = await getTotalIncome(currentMonth);
  const expenses = await getTotalExpenses(currentMonth);
  const balance = await getBalance(currentMonth);

  console.log('--- RESUMEN DE', currentMonth, '---');
  console.log('Ingresos totales:', income);
  console.log('Gastos totales:', expenses);
  console.log('Balance:', balance);
  console.log('% de gasto:', ((expenses / income) * 100).toFixed(2) + '%');
}

/**
 * Ejemplo 6: Actualizar un recordatorio
 */
async function exampleUpdateReminder() {
  console.log('🔄 Actualizando recordatorio...');

  const reminders = await getReminders();
  if (reminders.length > 0) {
    const firstReminder = reminders[0];

    await updateReminder(firstReminder.id, {
      ...firstReminder,
      isActive: false,
    });

    console.log('Recordatorio actualizado');
  }
}

/**
 * Ejemplo 7: Eliminar un ingreso
 */
async function exampleDeleteIncome() {
  console.log('🗑️  Eliminando ingreso...');

  const incomes = await getIncomes();
  if (incomes.length > 0) {
    await deleteIncome(incomes[0].id);
    console.log('Ingreso eliminado');
  }
}

/**
 * Ejecutar todos los ejemplos
 */
async function runAllExamples() {
  try {
    console.log('=== EJEMPLOS DE MYSAVINGS ===\n');

    // Descomentar para ejecutar
    // await exampleAddIncomes();
    // await exampleAddExpenses();
    // await exampleAddReminders();
    // await exampleAddSavingsPlans();
    // await exampleFinancialSummary();
    // await exampleUpdateReminder();
    // await exampleDeleteIncome();

    console.log('\n=== EJEMPLOS COMPLETADOS ===');
  } catch (error) {
    console.error('Error en ejemplos:', error);
  }
}

// No ejecutar automáticamente, solo exportar funciones
export {
  exampleAddIncomes,
  exampleAddExpenses,
  exampleAddReminders,
  exampleAddSavingsPlans,
  exampleFinancialSummary,
  exampleUpdateReminder,
  exampleDeleteIncome,
  runAllExamples,
};
