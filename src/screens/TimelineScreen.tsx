import React, { useState, useCallback } from 'react';
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

  // Cor temática (Dourado/Tempo)
  const ACCENT_COLOR = Colors.accent;

  useFocusEffect(
    useCallback(() => {
      loadEvents();
    }, [])
  );

  const loadEvents = async () => {
    try {
      const data = await databaseService.getAll<TimelineEvent>('events');
      
      // Ordena por data
      // Tenta converter para data real, se não conseguir (ex: "Ano 1000 AC"), joga para o fim ou mantém ordem
      const sorted = data.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        
        // Se ambas forem datas válidas, ordena cronologicamente (mais recente no topo)
        if (!isNaN(dateA) && !isNaN(dateB)) {
          return dateB - dateA;
        }
        // Se não forem datas padrão JS, mantém a ordem de criação ou alfabética
        return 0;
      });
      
      setEvents(sorted);
    } catch (error) {
      console.error('Error loading events:', error);
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
            // Abre a tela de detalhes genérica configurada para eventos
            onPress={() => navigation.navigate('EntityDetail', { entityType: 'event', data: item })}
          />
        )}
        // Padding bottom garante que o último item não fique escondido atrás do botão +
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
        ListEmptyComponent={!loading && (
          <EmptyState 
            title="Nenhum evento na linha do tempo" 
            message="Adicione eventos históricos, batalhas ou marcos importantes."
          />
        )}
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
    zIndex: 999, // Garante que flutue sobre tudo
  },
});