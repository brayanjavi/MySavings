import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Alert,
  Modal,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';
import { addIncome, getIncomes, deleteIncome, Income } from '../storage';
import { APP_CONFIG } from '../config';
import { formatDate, getFrequencyLabel } from '../utils';

interface IncomeFormProps {
  onSuccess?: () => void;
}

const IncomeForm = ({ onSuccess }: IncomeFormProps) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<'weekly' | 'monthly'>('monthly');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    loadIncomes();
  }, []);

  const loadIncomes = async () => {
    try {
      const data = await getIncomes();
      setIncomes(data);
    } catch (error) {
      console.error('Error loading incomes:', error);
    }
  };

  const handleAddIncome = async () => {
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
      await addIncome({
        amount: amountNum,
        date: selectedDate,
        frequency,
        description,
      });

      Alert.alert('Éxito', APP_CONFIG.messages.success.incomeAdded);
      setAmount('');
      setDescription('');
      setFrequency('monthly');
      setSelectedDate(new Date().toISOString().split('T')[0]);
      await loadIncomes();
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : APP_CONFIG.messages.error.incomeAddFailed;
      Alert.alert('Error', errorMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteIncome = async (id: string) => {
    Alert.alert('Eliminar', '¿Está seguro de que desea eliminar este ingreso?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteIncome(id);
            await loadIncomes();
            Alert.alert('Éxito', APP_CONFIG.messages.success.itemDeleted);
          } catch (error) {
            Alert.alert('Error', APP_CONFIG.messages.error.deleteFailed);
          }
        },
      },
    ]);
  };

  const formatDateLocal = (dateString: string) => {
    return formatDate(dateString, 'long');
  };

  const generateDateOptions = () => {
    const dates = [];
    for (let i = 0; i < 90; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Card title="Registrar Ingreso" subtitle="Ingresa tus ingresos semanales o mensuales">
        <Input
          label="Monto"
          placeholder="Ej: 1000.00"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />

        <Input
          label="Descripción"
          placeholder="Ej: Salario, Freelance, Otros"
          value={description}
          onChangeText={setDescription}
        />

        <View style={styles.frequencyContainer}>
          <Text style={styles.label}>Frecuencia</Text>
          <View style={styles.frequencyButtons}>
            {(['weekly', 'monthly'] as const).map((freq) => (
              <TouchableOpacity
                key={freq}
                style={[
                  styles.frequencyButton,
                  frequency === freq && styles.frequencyButtonActive,
                ]}
                onPress={() => setFrequency(freq)}
              >
                <Text
                  style={[
                    styles.frequencyButtonText,
                    frequency === freq && styles.frequencyButtonTextActive,
                  ]}
                >
                  {getFrequencyLabel(freq)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>📅 {formatDateLocal(selectedDate)}</Text>
        </TouchableOpacity>

        <Modal
          visible={showDatePicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowDatePicker(false)}
        >
          <View style={styles.calendarModal}>
            <View style={styles.calendarContainer}>
              <Text style={styles.calendarTitle}>Selecciona una fecha</Text>
              <ScrollView style={styles.dateScrollView}>
                {generateDateOptions().map((dateStr) => {
                  const date = new Date(dateStr + 'T00:00:00');
                  const isSelected = dateStr === selectedDate;
                  return (
                    <TouchableOpacity
                      key={dateStr}
                      style={[styles.dateOption, isSelected && styles.dateOptionSelected]}
                      onPress={() => {
                        setSelectedDate(dateStr);
                        setShowDatePicker(false);
                      }}
                    >
                      <Text style={[styles.dateOptionText, isSelected && styles.dateOptionTextActive]}>
                        {date.toLocaleDateString('es-ES', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              <Button
                title="Cerrar"
                onPress={() => setShowDatePicker(false)}
                style={styles.closeButton}
              />
            </View>
          </View>
        </Modal>

        <Button
          title="Registrar Ingreso"
          onPress={handleAddIncome}
          loading={loading}
          style={styles.submitButton}
        />
      </Card>

      {incomes.length > 0 && (
        <Card title={`Ingresos Registrados (${incomes.length})`}>
          <FlatList
            data={incomes}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.incomeItem}>
                <View style={styles.incomeInfo}>
                  <Text style={styles.incomeDescription}>{item.description}</Text>
                  <Text style={styles.incomeDate}>
                    {formatDateLocal(item.date)} • {getFrequencyLabel(item.frequency)}
                  </Text>
                </View>
                <View style={styles.incomeRight}>
                  <Text style={styles.incomeAmount}>+${item.amount.toFixed(2)}</Text>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteIncome(item.id)}
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
  frequencyContainer: {
    marginBottom: 16,
  },
  frequencyButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  frequencyButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  frequencyButtonActive: {
    borderColor: '#6366F1',
    backgroundColor: '#EDE9FE',
  },
  frequencyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  frequencyButtonTextActive: {
    color: '#6366F1',
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
  calendarModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  calendarContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    maxHeight: '70%',
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  dateScrollView: {
    marginBottom: 16,
  },
  dateOption: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dateOptionSelected: {
    backgroundColor: '#EDE9FE',
  },
  dateOptionText: {
    fontSize: 15,
    color: '#1F2937',
  },
  dateOptionTextActive: {
    color: '#6366F1',
    fontWeight: '700',
  },
  closeButton: {
    marginTop: 0,
  },
  submitButton: {
    marginTop: 16,
  },
  incomeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  incomeInfo: {
    flex: 1,
  },
  incomeDescription: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  incomeDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  incomeRight: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  incomeAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
  },
  deleteButton: {
    marginTop: 8,
    padding: 4,
  },
  deleteButtonText: {
    fontSize: 16,
  },
});

export default IncomeForm;

