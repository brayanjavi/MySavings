import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import { useState } from 'react';
import Dashboard from './src/components/Dashboard';
import IncomeForm from './src/components/IncomeForm';
import ExpenseForm from './src/components/ExpenseForm';
import Reminders from './src/components/Reminders';
import SavingsPlan from './src/components/SavingsPlan';

type Tab = 'dashboard' | 'income' | 'expense' | 'reminders' | 'savings';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [refreshKey, setRefreshKey] = useState(0);

  const renderContent = () => {
    const onSuccess = () => {
      setRefreshKey((k) => k + 1);
    };

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard key={refreshKey} />;
      case 'income':
        return <IncomeForm onSuccess={onSuccess} />;
      case 'expense':
        return <ExpenseForm onSuccess={onSuccess} />;
      case 'reminders':
        return <Reminders onSuccess={onSuccess} />;
      case 'savings':
        return <SavingsPlan onSuccess={onSuccess} />;
    }
  };

  const tabs: { id: Tab; label: string; emoji: string }[] = [
    { id: 'dashboard', label: 'Inicio', emoji: '📊' },
    { id: 'income', label: 'Ingresos', emoji: '💰' },
    { id: 'expense', label: 'Gastos', emoji: '💸' },
    { id: 'reminders', label: 'Recordatorios', emoji: '🔔' },
    { id: 'savings', label: 'Ahorros', emoji: '🎯' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <View style={styles.content}>{renderContent()}</View>
      
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tabButton, activeTab === tab.id && styles.tabButtonActive]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={styles.tabEmoji}>{tab.emoji}</Text>
            <Text
              style={[styles.tabLabel, activeTab === tab.id && styles.tabLabelActive]}
              numberOfLines={1}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFF',
    paddingBottom: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabButtonActive: {},
  tabEmoji: {
    fontSize: 18,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#6366F1',
    fontWeight: '700',
  },
});
