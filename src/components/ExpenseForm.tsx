import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Alert,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';
import { addExpense, getExpenses, deleteExpense, Expense } from '../storage';
import { APP_CONFIG } from '../config';
import { getCategoryEmoji, formatDate } from '../utils';

interface ExpenseFormProps {
  onSuccess?: () => void;
}

const EXPENSE_CATEGORIES = APP_CONFIG.expenseCategories;

const ExpenseForm = ({ onSuccess }: ExpenseFormProps) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Alimentación');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  React.useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const data = await getExpenses();
      setExpenses(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error) {
      console.error('Error loading expenses:', error);
    }
  };

  const handleAddExpense = async () => {
    // Validación de campos
    if (!amount.trim() || !description.trim()) {
      Alert.alert('Error', APP_CONFIG.messages.error.fillAllFields);
      return;
    }

    const amountNum = parseFloat(amount);
    
    // Validación de monto
    if (isNaN(amountNum)) {
      Alert.alert('Error', 'El monto debe ser un número válido');
      return;
    }
    
    if (amountNum <= 0) {
      Alert.alert('Error', 'El monto debe ser mayor a cero');
      return;
    }
    
    if (amountNum > APP_CONFIG.limits.maxAmount) {
      Alert.alert('Error', 'El monto es demasiado grande');
      return;
    }

    setLoading(true);
    try {
      await addExpense({
        amount: amountNum,
        date: selectedDate,
        category,
        description,
      });

      Alert.alert('Éxito', APP_CONFIG.messages.success.expenseAdded);
      setAmount('');
      setDescription('');
      setCategory('Alimentación');
      setSelectedDate(new Date().toISOString().split('T')[0]);
      await loadExpenses();
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : APP_CONFIG.messages.error.expenseAddFailed;
      Alert.alert('Error', errorMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    Alert.alert('Eliminar', '¿Está seguro de que desea eliminar este gasto?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteExpense(id);
            await loadExpenses();
            Alert.alert('Éxito', APP_CONFIG.messages.success.itemDeleted);
          } catch (error) {
            Alert.alert('Error', APP_CONFIG.messages.error.deleteFailed);
          }
        },
      },
    ]);
  };

  const formatDateLocal = (dateString: string) => {
    return formatDate(dateString);
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Card title="Registrar Gasto Diario" subtitle="Controla tus gastos diarios">
        <Input
          label="Monto"
          placeholder="Ej: 25.50"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />

        <Input
          label="Descripción"
          placeholder="Ej: Almuerzo en restaurante"
          value={description}
          onChangeText={setDescription}
        />

        <View style={styles.categoryContainer}>
          <Text style={styles.label}>Categoría</Text>
          <View style={styles.categoryGrid}>
            {EXPENSE_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryButton,
                  category === cat && styles.categoryButtonActive,
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text style={styles.categoryEmoji}>{getCategoryEmoji(cat)}</Text>
                <Text
                  style={[
                    styles.categoryText,
                    category === cat && styles.categoryTextActive,
                  ]}
                  numberOfLines={1}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(!showDatePicker)}
        >
          <Text style={styles.dateButtonText}>📅 {formatDateLocal(selectedDate)}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <View style={styles.datePickerContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {Array.from({ length: 30 }).map((_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];
                const isSelected = dateStr === selectedDate;

                return (
                  <TouchableOpacity
                    key={i}
                    style={[styles.dateOption, isSelected && styles.dateOptionSelected]}
                    onPress={() => {
                      setSelectedDate(dateStr);
                      setShowDatePicker(false);
                    }}
                  >
                    <Text style={styles.dateOptionText}>{date.getDate()}</Text>
                    <Text style={[styles.dateOptionMonth, isSelected && styles.dateOptionMonthActive]}>
                      {date.toLocaleDateString('es-ES', { month: 'short' })}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        <Button
          title="Registrar Gasto"
          onPress={handleAddExpense}
          loading={loading}
          style={styles.submitButton}
        />
      </Card>

      {expenses.length > 0 && (
        <Card
          title={`Gastos Recientes (${expenses.length})`}
          subtitle={`Total: $${totalExpenses.toFixed(2)}`}
        >
          <FlatList
            data={expenses.slice(0, 10)}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.expenseItem}>
                <View style={styles.expenseIconContainer}>
                  <Text style={styles.expenseIcon}>{getCategoryEmoji(item.category)}</Text>
                </View>
                <View style={styles.expenseInfo}>
                  <Text style={styles.expenseDescription}>{item.description}</Text>
                  <View style={styles.expenseMeta}>
                    <Text style={styles.expenseCategory}>{item.category}</Text>
                    <Text style={styles.expenseDate}>• {formatDateLocal(item.date)}</Text>
                  </View>
                </View>
                <View style={styles.expenseRight}>
                  <Text style={styles.expenseAmount}>-${item.amount.toFixed(2)}</Text>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteExpense(item.id)}
                  >
                    <Text style={styles.deleteButtonText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    flex: 1,
    minWidth: '30%',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  categoryButtonActive: {
    borderColor: '#6366F1',
    backgroundColor: '#EDE9FE',
  },
  categoryEmoji: {
    fontSize: 18,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
  },
  categoryTextActive: {
    color: '#6366F1',
    fontWeight: '600',
  },
  dateButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  dateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  datePickerContainer: {
    marginBottom: 16,
    paddingVertical: 8,
  },
  dateOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    minWidth: 60,
  },
  dateOptionSelected: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  dateOptionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  dateOptionMonth: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  dateOptionMonthActive: {
    color: '#FFF',
  },
  submitButton: {
    marginTop: 16,
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  expenseIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  expenseIcon: {
    fontSize: 20,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseDescription: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  expenseMeta: {
    flexDirection: 'row',
    marginTop: 4,
  },
  expenseCategory: {
    fontSize: 12,
    color: '#6366F1',
    fontWeight: '500',
  },
  expenseDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  expenseRight: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  expenseAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#EF4444',
  },
  deleteButton: {
    marginTop: 8,
    padding: 4,
  },
  deleteButtonText: {
    fontSize: 16,
  },
});

export default ExpenseForm;

