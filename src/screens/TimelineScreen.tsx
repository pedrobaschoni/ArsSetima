import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { TimelineItem } from '../components/TimelineItem';
import { EmptyState } from '../components/EmptyState';
import { useTheme } from '../utils/ThemeContext';
import { TimelineEvent } from '../types/event';
import { databaseService } from '../database/migrations';
import { Colors, Shadows } from '../utils/theme';

export default function TimelineScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Cor temática (Accent / Âmbar)
  const ACCENT_COLOR = Colors.accent;

  useFocusEffect(
    useCallback(() => {
      loadEvents();
    }, [])
  );

  const loadEvents = async () => {
    try {
      const data = await databaseService.getAll<TimelineEvent>('events');
      // Ordena por data (mais recente primeiro ou cronológica)
      // Aqui estou assumindo string ISO, se for texto livre a ordenação pode variar
      const sorted = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setEvents(sorted);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={events}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TimelineItem 
            event={item} 
            // Agora abre a tela de detalhes genérica para eventos
            onPress={() => navigation.navigate('EntityDetail', { entityType: 'event', data: item })}
          />
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={!loading && <EmptyState title="Nenhum evento na linha do tempo" />}
      />

      {/* BOTÃO FLUTUANTE (FAB) */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: ACCENT_COLOR }]}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('EntityForm', { entityType: 'event' })}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.lg,
    elevation: 8,
    zIndex: 999,
  },
});