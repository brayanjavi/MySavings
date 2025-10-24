import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Card from './ui/Card';
import { getTotalIncome, getTotalExpenses, getBalance } from '../storage';

interface DashboardProps {
  onRefresh?: () => void;
}

const Dashboard = ({ onRefresh }: DashboardProps) => {
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const currentMonth = new Date().toISOString().substring(0, 7);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [incomeData, expensesData, balanceData] = await Promise.all([
        getTotalIncome(currentMonth),
        getTotalExpenses(currentMonth),
        getBalance(currentMonth),
      ]);
      setIncome(incomeData);
      setExpenses(expensesData);
      setBalance(balanceData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    onRefresh?.();
    setRefreshing(false);
  };

  const expensePercentage = income > 0 ? (expenses / income) * 100 : 0;

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>Resumen Financiero</Text>
          <Text style={styles.month}>
            {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Card style={styles.balanceCard}>
          <View style={styles.balanceContainer}>
            <View>
              <Text style={styles.balanceLabel}>Balance Total</Text>
              <Text style={[styles.balanceAmount, balance >= 0 ? styles.positive : styles.negative]}>
                ${balance.toFixed(2)}
              </Text>
            </View>
            <View style={styles.balanceEmoji}>
              <Text style={styles.emoji}>{balance >= 0 ? '📈' : '📉'}</Text>
            </View>
          </View>
        </Card>

        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <Text style={styles.statEmoji}>💰</Text>
              <Text style={styles.statLabel}>Ingresos</Text>
              <Text style={styles.statAmount}>${income.toFixed(2)}</Text>
            </View>
          </Card>

          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <Text style={styles.statEmoji}>💸</Text>
              <Text style={styles.statLabel}>Gastos</Text>
              <Text style={styles.statAmount}>${expenses.toFixed(2)}</Text>
            </View>
          </Card>
        </View>

        <Card title="Análisis de Gastos">
          <View style={styles.analysisContainer}>
            <View style={styles.analysisRow}>
              <Text style={styles.analysisLabel}>Gasto del ingreso</Text>
              <Text style={styles.analysisValue}>{expensePercentage.toFixed(1)}%</Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${Math.min(expensePercentage, 100)}%`,
                    backgroundColor:
                      expensePercentage > 80
                        ? '#EF4444'
                        : expensePercentage > 50
                          ? '#F59E0B'
                          : '#10B981',
                  },
                ]}
              />
            </View>

            <View style={styles.adviceContainer}>
              {expensePercentage > 80 && (
                <Text style={styles.advice}>
                  ⚠️ Estás gastando más del 80% de tus ingresos. Considera reducir gastos.
                </Text>
              )}
              {expensePercentage > 50 && expensePercentage <= 80 && (
                <Text style={styles.advice}>
                  📌 Buen control, pero considera ahorrar más para tus planes.
                </Text>
              )}
              {expensePercentage <= 50 && income > 0 && (
                <Text style={styles.advice}>
                  ✅ Excelente, estás ahorrando una buena porción de tu ingreso.
                </Text>
              )}
            </View>
          </View>
        </Card>

        <Card title="Consejos Financieros">
          <View style={styles.tipsContainer}>
            <View style={styles.tip}>
              <Text style={styles.tipNumber}>1</Text>
              <Text style={styles.tipText}>Registra tus gastos diarios para mantener el control</Text>
            </View>
            <View style={styles.tip}>
              <Text style={styles.tipNumber}>2</Text>
              <Text style={styles.tipText}>Establece metas realistas y sigue tus planes de ahorro</Text>
            </View>
            <View style={styles.tip}>
              <Text style={styles.tipNumber}>3</Text>
              <Text style={styles.tipText}>Mantén activos los recordatorios de tus pagos</Text>
            </View>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: '#6366F1',
  },
  headerContent: {
    marginTop: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  month: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    padding: 16,
  },
  balanceCard: {
    marginBottom: 16,
    backgroundColor: '#FFF',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '800',
    marginTop: 8,
  },
  positive: {
    color: '#10B981',
  },
  negative: {
    color: '#EF4444',
  },
  balanceEmoji: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  statContent: {
    alignItems: 'center',
  },
  statEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  statAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 4,
  },
  analysisContainer: {
    marginBottom: 0,
  },
  analysisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  analysisLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  analysisValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6366F1',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  adviceContainer: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F0F9FF',
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    borderRadius: 6,
  },
  advice: {
    fontSize: 13,
    color: '#1E40AF',
    fontWeight: '500',
  },
  tipsContainer: {
    gap: 12,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
  },
  tipNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
    marginRight: 12,
    minWidth: 24,
    textAlign: 'center',
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#065F46',
    fontWeight: '500',
    lineHeight: 18,
  },
});

export default Dashboard;

