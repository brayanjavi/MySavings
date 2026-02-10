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
import {
  addSavingsPlan,
  getSavingsPlans,
  deleteSavingsPlan,
  updateSavingsPlan,
  SavingsPlan,
} from '../storage';
import { APP_CONFIG } from '../config';
import { getPriorityColor, formatDate, getDaysRemaining } from '../utils';

interface SavingsPlanProps {
  onSuccess?: () => void;
}

const PRIORITY_LEVELS = APP_CONFIG.priorityLevels;

const getPriorityLabel = (priority: 'low' | 'medium' | 'high'): string => {
  const labels = {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta',
  };
  return labels[priority];
};

const SavingsPlanComponent = ({ onSuccess }: SavingsPlanProps) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState(new Date().toISOString().split('T')[0]);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [description, setDescription] = useState('');
  const [plans, setPlans] = useState<SavingsPlan[]>([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const data = await getSavingsPlans();
      setPlans(data.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()));
    } catch (error) {
      console.error('Error loading plans:', error);
    }
  };

  const handleAddPlan = async () => {
    // Validación de campos
    if (!name.trim() || !targetAmount.trim() || !deadline.trim()) {
      Alert.alert('Error', APP_CONFIG.messages.error.fillAllFields);
      return;
    }

    const targetNum = parseFloat(targetAmount);
    
    // Validación de monto
    if (isNaN(targetNum)) {
      Alert.alert('Error', 'El monto objetivo debe ser un número válido');
      return;
    }
    
    if (targetNum <= 0) {
      Alert.alert('Error', 'El monto objetivo debe ser mayor a cero');
      return;
    }
    
    if (targetNum > APP_CONFIG.limits.maxAmount) {
      Alert.alert('Error', 'El monto objetivo es demasiado grande');
      return;
    }

    setLoading(true);
    try {
      await addSavingsPlan({
        name,
        targetAmount: targetNum,
        currentAmount: 0,
        deadline,
        priority,
        description,
      });

      Alert.alert('Éxito', APP_CONFIG.messages.success.planCreated);
      setName('');
      setTargetAmount('');
      setDeadline(new Date().toISOString().split('T')[0]);
      setPriority('medium');
      setDescription('');
      await loadPlans();
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : APP_CONFIG.messages.error.planFailed;
      Alert.alert('Error', errorMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlan = async (id: string) => {
    Alert.alert('Eliminar', '¿Está seguro de que desea eliminar este plan?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteSavingsPlan(id);
            await loadPlans();
            Alert.alert('Éxito', APP_CONFIG.messages.success.itemDeleted);
          } catch (error) {
            Alert.alert('Error', APP_CONFIG.messages.error.deleteFailed);
          }
        },
      },
    ]);
  };

  const handleUpdateAmount = async (plan: SavingsPlan, newAmount: number) => {
    if (isNaN(newAmount) || newAmount < 0) {
      Alert.alert('Error', 'Monto inválido');
      return;
    }
    
    if (newAmount > plan.targetAmount) {
      Alert.alert('Advertencia', 'La cantidad no puede exceder el objetivo');
      return;
    }

    try {
      await updateSavingsPlan(plan.id, { ...plan, currentAmount: newAmount });
      await loadPlans();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el plan');
    }
  };

  const formatDateLocal = (dateString: string) => {
    return formatDate(dateString);
  };

  const activePlans = plans.filter((p) => p.currentAmount < p.targetAmount);
  const completedPlans = plans.filter((p) => p.currentAmount >= p.targetAmount);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Card title="Crear Plan de Ahorro" subtitle="Planifica tus metas financieras">
        <Input
          label="Nombre del Plan"
          placeholder="Ej: Viaje a Europa"
          value={name}
          onChangeText={setName}
        />

        <Input
          label="Monto Objetivo"
          placeholder="Ej: 5000.00"
          value={targetAmount}
          onChangeText={setTargetAmount}
          keyboardType="numeric"
        />

        <Input
          label="Descripción"
          placeholder="Ej: Viaje de 2 semanas"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />

        <View style={styles.priorityContainer}>
          <Text style={styles.label}>Prioridad</Text>
          <View style={styles.priorityButtons}>
            {PRIORITY_LEVELS.map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.priorityButton,
                  priority === level && styles.priorityButtonActive,
                ]}
                onPress={() => setPriority(level)}
              >
                <View
                  style={[
                    styles.priorityDot,
                    { backgroundColor: getPriorityColor(level) },
                  ]}
                />
                <Text
                  style={[
                    styles.priorityText,
                    priority === level && styles.priorityTextActive,
                  ]}
                >
                  {getPriorityLabel(level)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.dateButton} onPress={() => {}}>
          <Text style={styles.dateButtonText}>📅 {formatDateLocal(deadline)}</Text>
        </TouchableOpacity>

        <Button
          title="Crear Plan"
          onPress={handleAddPlan}
          loading={loading}
          style={styles.submitButton}
        />
      </Card>

      {activePlans.length > 0 && (
        <Card
          title="Planes Activos"
          subtitle={`${activePlans.length} en progreso`}
        >
          <FlatList
            data={activePlans}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => {
              const percentage = (item.currentAmount / item.targetAmount) * 100;
              const daysLeft = getDaysRemaining(item.deadline);

              return (
                <View style={styles.planItem}>
                  <View style={styles.planHeader}>
                    <View style={styles.planTitle}>
                      <View
                        style={[
                          styles.priorityBar,
                          { backgroundColor: getPriorityColor(item.priority) },
                        ]}
                      />
                      <View style={styles.planInfo}>
                        <Text style={styles.planName}>{item.name}</Text>
                        <Text style={styles.planDescription}>{item.description}</Text>
                      </View>
                    </View>
                    <TouchableOpacity onPress={() => handleDeletePlan(item.id)}>
                      <Text style={styles.deleteButton}>🗑️</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.progressContainer}>
                    <View style={styles.progressBarBackground}>
                      <View
                        style={[
                          styles.progressBar,
                          {
                            width: `${Math.min(percentage, 100)}%`,
                            backgroundColor: getPriorityColor(item.priority),
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.percentage}>{percentage.toFixed(0)}%</Text>
                  </View>

                  <View style={styles.planStats}>
                    <View style={styles.stat}>
                      <Text style={styles.statLabel}>Ahorrado</Text>
                      <Text style={styles.statValue}>${item.currentAmount.toFixed(2)}</Text>
                    </View>
                    <View style={styles.stat}>
                      <Text style={styles.statLabel}>Objetivo</Text>
                      <Text style={styles.statValue}>${item.targetAmount.toFixed(2)}</Text>
                    </View>
                    <View style={styles.stat}>
                      <Text style={styles.statLabel}>Falta</Text>
                      <Text style={styles.statValue}>
                        ${(item.targetAmount - item.currentAmount).toFixed(2)}
                      </Text>
                    </View>
                    <View style={styles.stat}>
                      <Text style={styles.statLabel}>Días</Text>
                      <Text
                        style={[styles.statValue, daysLeft <= 30 && styles.statValueWarning]}
                      >
                        {daysLeft}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => {
                        Alert.prompt(
                          'Agregar ahorro',
                          `¿Cuánto deseas agregar? (Máximo: $${(item.targetAmount - item.currentAmount).toFixed(2)})`,
                          [
                            { text: 'Cancelar', style: 'cancel' },
                            {
                              text: 'Agregar',
                              onPress: (amount?: string) => {
                                if (amount) {
                                  handleUpdateAmount(
                                    item,
                                    item.currentAmount + parseFloat(amount)
                                  );
                                }
                              },
                            },
                          ],
                          'plain-text'
                        );
                      }}
                    >
                      <Text style={styles.addButtonText}>➕ Agregar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.addButton, styles.addButtonSecondary]}
                      onPress={() => {
                        Alert.prompt(
                          'Establecer cantidad',
                          'Nueva cantidad ahorrada',
                          [
                            { text: 'Cancelar', style: 'cancel' },
                            {
                              text: 'Establecer',
                              onPress: (amount?: string) => {
                                if (amount) {
                                  handleUpdateAmount(item, parseFloat(amount));
                                }
                              },
                            },
                          ],
                          'plain-text'
                        );
                      }}
                    >
                      <Text style={styles.addButtonTextSecondary}>✏️ Editar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />
        </Card>
      )}

      {completedPlans.length > 0 && (
        <Card title="Planes Completados" subtitle={`🎉 ${completedPlans.length}`}>
          <FlatList
            data={completedPlans}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={[styles.planItem, styles.planItemCompleted]}>
                <View style={styles.planHeader}>
                  <View style={styles.planTitle}>
                    <Text style={styles.completedEmoji}>✅</Text>
                    <View style={styles.planInfo}>
                      <Text style={styles.planName}>{item.name}</Text>
                      <Text style={styles.planAmount}>
                        ${item.currentAmount.toFixed(2)} de ${item.targetAmount.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => handleDeletePlan(item.id)}>
                    <Text style={styles.deleteButton}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </Card>
      )}

      {plans.length === 0 && (
        <Card>
          <Text style={styles.emptyText}>🎯 No hay planes de ahorro creados</Text>
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
  priorityContainer: {
    marginBottom: 16,
  },
  priorityButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  priorityButtonActive: {
    borderColor: '#6366F1',
    backgroundColor: '#EDE9FE',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  priorityTextActive: {
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
  planItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  planItemCompleted: {
    opacity: 0.7,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planTitle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  priorityBar: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  planDescription: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  planAmount: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  deleteButton: {
    fontSize: 18,
    marginLeft: 8,
  },
  progressContainer: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  percentage: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6366F1',
    minWidth: 35,
    textAlign: 'right',
  },
  planStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 2,
  },
  statValueWarning: {
    color: '#EF4444',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  addButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#6366F1',
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonSecondary: {
    backgroundColor: '#E0E7FF',
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
  },
  addButtonTextSecondary: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6366F1',
  },
  completedEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingVertical: 20,
  },
});

export default SavingsPlanComponent;
