import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { TimelineItem } from '../components/TimelineItem';
import { EmptyState } from '../components/EmptyState';
import { useTheme } from '../utils/ThemeContext';
import { TimelineEvent } from '../types/event';
import { databaseService } from '../database/migrations';

export default function TimelineScreen() {
  const { colors } = useTheme();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await databaseService.getAll<TimelineEvent>('events');
      const sorted = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setEvents(sorted);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <EmptyState title="" loading />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={events}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <TimelineItem event={item} />}
        ListEmptyComponent={<EmptyState title="Nenhum evento na linha do tempo" />}
      />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1 } });
