import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { EntityCard } from '../components/EntityCard';
import { EmptyState } from '../components/EmptyState';
import { useTheme } from '../utils/ThemeContext';
import { Note } from '../types/note';
import { databaseService } from '../database/migrations';

export default function NotesScreen() {
  const { colors } = useTheme();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const data = await databaseService.getAll<Note>('notes');
      setNotes(data);
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
        data={notes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <EntityCard
            title={item.title}
            description={item.content}
            icon="document-text"
            tags={item.tags}
          />
        )}
        ListEmptyComponent={<EmptyState title="Nenhuma nota" />}
      />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1 } });
