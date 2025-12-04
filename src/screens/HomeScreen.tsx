import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/ThemeContext';
import { Colors, Spacing, BorderRadius, Shadows } from '../utils/theme';
import { databaseService } from '../database/migrations';

export default function HomeScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [stats, setStats] = useState({
    characters: 0,
    locations: 0,
    events: 0,
    notes: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const characters = await databaseService.getAll('characters');
      const locations = await databaseService.getAll('locations');
      const events = await databaseService.getAll('events');
      const notes = await databaseService.getAll('notes');
      
      setStats({
        characters: characters.length,
        locations: locations.length,
        events: events.length,
        notes: notes.length,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const QuickAccessCard = ({ title, count, icon, onPress, color }: any) => (
    <TouchableOpacity
      style={[styles.quickCard, { backgroundColor: colors.surface }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={32} color={color} />
      </View>
      <Text style={[styles.cardCount, { color: colors.text }]}>{count}</Text>
      <Text style={[styles.cardTitle, { color: colors.textSecondary }]}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>ArsSétima</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          O Preço do Sétimo Poder
        </Text>
      </View>

      <View style={styles.quickGrid}>
        <QuickAccessCard
          title="Personagens"
          count={stats.characters}
          icon="people"
          color={Colors.primary}
          onPress={() => navigation.navigate('Encyclopedia', { screen: 'Characters' })}
        />
        <QuickAccessCard
          title="Locais"
          count={stats.locations}
          icon="location"
          color={Colors.secondary}
          onPress={() => navigation.navigate('Encyclopedia', { screen: 'Locations' })}
        />
        <QuickAccessCard
          title="Eventos"
          count={stats.events}
          icon="time"
          color={Colors.accent}
          onPress={() => navigation.navigate('Timeline')}
        />
        <QuickAccessCard
          title="Notas"
          count={stats.notes}
          icon="document-text"
          color={colors.success}
          onPress={() => navigation.navigate('Notes')}
        />
      </View>

      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: Colors.primary }]}
        onPress={() => navigation.navigate('Settings')}
      >
        <Ionicons name="settings" size={20} color="#fff" />
        <Text style={styles.actionButtonText}>Configurações</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: Spacing.sm,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: Spacing.md,
    justifyContent: 'space-between',
  },
  quickCard: {
    width: '48%',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    alignItems: 'center',
    ...Shadows.md,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  cardCount: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  cardTitle: {
    fontSize: 14,
    marginTop: Spacing.xs,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: Spacing.sm,
  },
});
