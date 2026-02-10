import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Alert,
  TouchableOpacity,
  FlatList,
  Switch,
} from 'react-native';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';
import { addReminder, getReminders, deleteReminder, updateReminder, Reminder } from '../storage';
import { APP_CONFIG } from '../config';
import { getCategoryEmoji, getFrequencyLabel, formatDate } from '../utils';

interface RemindersProps {
  onSuccess?: () => void;
}

const CATEGORIES = APP_CONFIG.reminderCategories;
const FREQUENCIES = APP_CONFIG.frequencies.reminder;

const Reminders = ({ onSuccess }: RemindersProps) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Renovaciones');
  const [selectedFrequency, setSelectedFrequency] = useState<'once' | 'monthly' | 'yearly'>('monthly');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      const data = await getReminders();
      setReminders(data.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()));
    } catch (error) {
      console.error('Error loading reminders:', error);
    }
  };

  const handleAddReminder = async () => {
    // Validación de campos
    if (!title.trim() || !amount.trim()) {
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
      await addReminder({
        title,
        amount: amountNum,
        dueDate,
        category: selectedCategory,
        frequency: selectedFrequency,
        isActive: true,
      });

      Alert.alert('Éxito', APP_CONFIG.messages.success.reminderCreated);
      setTitle('');
      setAmount('');
      setSelectedCategory('Renovaciones');
      setSelectedFrequency('monthly');
      setDueDate(new Date().toISOString().split('T')[0]);
      await loadReminders();
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : APP_CONFIG.messages.error.reminderFailed;
      Alert.alert('Error', errorMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReminder = async (id: string) => {
    Alert.alert('Eliminar', '¿Está seguro de que desea eliminar este recordatorio?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteReminder(id);
            await loadReminders();
            Alert.alert('Éxito', APP_CONFIG.messages.success.itemDeleted);
          } catch (error) {
            Alert.alert('Error', APP_CONFIG.messages.error.deleteFailed);
          }
        },
      },
    ]);
  };

  const handleToggleReminder = async (reminder: Reminder) => {
    try {
      await updateReminder(reminder.id, {
        ...reminder,
        isActive: !reminder.isActive,
      });
      await loadReminders();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el recordatorio');
    }
  };

  const formatDateLocal = (dateString: string) => {
    return formatDate(dateString);
  };

  const upcomingReminders = reminders.filter(
    (r) => new Date(r.dueDate) >= new Date() && r.isActive
  );
  const pastReminders = reminders.filter(
    (r) => new Date(r.dueDate) < new Date() && r.isActive
  );
  const inactiveReminders = reminders.filter((r) => !r.isActive);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Card title="Crear Recordatorio" subtitle="Renovaciones, membresías y pagos cotidianos">
        <Input
          label="Título"
          placeholder="Ej: Renovar licencia de conducir"
          value={title}
          onChangeText={setTitle}
        />

        <Input
          label="Monto"
          placeholder="Ej: 150.00"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />

        <View style={styles.categoryContainer}>
          <Text style={styles.label}>Categoría</Text>
          <View style={styles.optionsContainer}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.optionButton,
                  selectedCategory === cat && styles.optionButtonActive,
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={styles.optionEmoji}>{getCategoryEmoji(cat)}</Text>
                <Text
                  style={[
                    styles.optionText,
                    selectedCategory === cat && styles.optionTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.frequencyContainer}>
          <Text style={styles.label}>Frecuencia</Text>
          <View style={styles.frequencyButtons}>
            {FREQUENCIES.map((freq) => (
              <TouchableOpacity
                key={freq}
                style={[
                  styles.freqButton,
                  selectedFrequency === freq && styles.freqButtonActive,
                ]}
                onPress={() => setSelectedFrequency(freq)}
              >
                <Text
                  style={[
                    styles.freqText,
                    selectedFrequency === freq && styles.freqTextActive,
                  ]}
                >
                  {getFrequencyLabel(freq)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.dateButton} onPress={() => {}}>
          <Text style={styles.dateButtonText}>📅 {formatDateLocal(dueDate)}</Text>
        </TouchableOpacity>

        <Button
          title="Crear Recordatorio"
          onPress={handleAddReminder}
          loading={loading}
          style={styles.submitButton}
        />
      </Card>

      {upcomingReminders.length > 0 && (
        <Card
          title="Próximos Recordatorios"
          subtitle={`${upcomingReminders.length} pendiente${upcomingReminders.length !== 1 ? 's' : ''}`}
        >
          <FlatList
            data={upcomingReminders}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.reminderItem}>
                <View style={styles.reminderLeft}>
                  <Text style={styles.reminderEmoji}>{getCategoryEmoji(item.category)}</Text>
                  <View style={styles.reminderInfo}>
                    <Text style={styles.reminderTitle}>{item.title}</Text>
                    <View style={styles.reminderMeta}>
                      <Text style={styles.reminderCategory}>{item.category}</Text>
                      <Text style={styles.reminderDate}>• {formatDateLocal(item.dueDate)}</Text>
                    </View>
                    <Text style={styles.reminderFrequency}>{getFrequencyLabel(item.frequency)}</Text>
                  </View>
                </View>
                <View style={styles.reminderRight}>
                  <Text style={styles.reminderAmount}>${item.amount.toFixed(2)}</Text>
                  <Switch
                    value={item.isActive}
                    onValueChange={() => handleToggleReminder(item)}
                    trackColor={{ false: '#D1D5DB', true: '#10B981' }}
                    thumbColor={item.isActive ? '#059669' : '#F3F4F6'}
                  />
                </View>
              </View>
            )}
          />
        </Card>
      )}

      {pastReminders.length > 0 && (
        <Card title="Recordatorios Vencidos" subtitle={`${pastReminders.length} vencido${pastReminders.length !== 1 ? 's' : ''}`}>
          <FlatList
            data={pastReminders}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={[styles.reminderItem, styles.reminderItemPast]}>
                <View style={styles.reminderLeft}>
                  <Text style={styles.reminderEmoji}>{getCategoryEmoji(item.category)}</Text>
                  <View style={styles.reminderInfo}>
                    <Text style={[styles.reminderTitle, styles.reminderTitlePast]}>{item.title}</Text>
                    <View style={styles.reminderMeta}>
                      <Text style={styles.reminderCategory}>{item.category}</Text>
                      <Text style={styles.reminderDate}>• {formatDateLocal(item.dueDate)}</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity onPress={() => handleDeleteReminder(item.id)}>
                  <Text style={styles.deleteButtonText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </Card>
      )}

      {reminders.length === 0 && (
        <Card>
          <Text style={styles.emptyText}>📌 No hay recordatorios creados</Text>
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
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  optionButtonActive: {
    borderColor: '#6366F1',
    backgroundColor: '#EDE9FE',
  },
  optionEmoji: {
    fontSize: 18,
    marginBottom: 4,
  },
  optionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
  },
  optionTextActive: {
    color: '#6366F1',
    fontWeight: '600',
  },
  frequencyContainer: {
    marginBottom: 16,
  },
  frequencyButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  freqButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  freqButtonActive: {
    borderColor: '#6366F1',
    backgroundColor: '#EDE9FE',
  },
  freqText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  freqTextActive: {
    color: '#6366F1',
  },
  dateButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
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
  submitButton: {
    marginTop: 16,
  },
  reminderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  reminderItemPast: {
    opacity: 0.6,
  },
  reminderLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  reminderInfo: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  reminderTitlePast: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  reminderMeta: {
    flexDirection: 'row',
    marginTop: 4,
  },
  reminderCategory: {
    fontSize: 12,
    color: '#6366F1',
    fontWeight: '500',
  },
  reminderDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  reminderFrequency: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  reminderRight: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  reminderAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#EF4444',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingVertical: 20,
  },
  deleteButtonText: {
    fontSize: 18,
  },
});

export default Reminders;
