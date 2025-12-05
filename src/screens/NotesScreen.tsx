import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../utils/ThemeContext';
import { Note } from '../types/note';
import { databaseService } from '../database/migrations';
import { generateId, parseList } from '../utils/helpers';
import { Colors, Spacing, Shadows } from '../utils/theme';
import { EntityCard } from '../components/EntityCard';
import { EmptyState } from '../components/EmptyState';

export default function NotesScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickNote, setQuickNote] = useState('');

  // Cor temática (Notas/Místico)
  const ACCENT_COLOR = '#8b5cf6';

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [])
  );

  const loadNotes = async () => {
    try {
      const data = await databaseService.getAll<Note>('notes');
      const sorted = data.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      const formatted = sorted.map(note => ({
        ...note,
        tags: parseList(note.tags)
      }));
      
      setNotes(formatted);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuickNote = async () => {
    if (!quickNote.trim()) return;

    try {
      const newNote: Note = {
        id: generateId('note'),
        title: 'Nota Rápida',
        content: quickNote.trim(),
        category: 'Rápida',
        priority: 'medium',
        tags: ['Rápida'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await databaseService.insert('notes', newNote);
      setNotes([newNote, ...notes]);
      setQuickNote('');
    } catch (error) {
      console.error('Erro ao salvar nota rápida:', error);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        data={notes}
        keyExtractor={item => item.id}
        // Invertido (inverted) para comportamento de chat é opcional, 
        // aqui mantive padrão com recentes no topo
        contentContainerStyle={{ padding: Spacing.md, paddingBottom: 20 }}
        renderItem={({ item }) => (
          <EntityCard
            title={item.title === 'Nota Rápida' ? (item.content.length > 30 ? item.content.substring(0, 30) + '...' : item.content) : item.title}
            description={item.title === 'Nota Rápida' ? item.content : item.content}
            icon="document-text"
            tags={item.tags}
            accentColor={ACCENT_COLOR} // Cor personalizada para notas
            onPress={() => navigation.navigate('EntityForm', { entityType: 'note', editData: item })}
            onLongPress={() => navigation.navigate('EntityForm', { entityType: 'note', editData: item })}
          />
        )}
        ListEmptyComponent={!loading && <EmptyState title="Nenhuma nota" />}
      />

      {/* BARRA DE ENTRADA RÁPIDA ESTILO CHAT */}
      <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TextInput
          style={[
            styles.input, 
            { 
              backgroundColor: colors.background, 
              color: colors.text,
              borderColor: colors.border
            }
          ]}
          placeholder="Escreva uma nota rápida..."
          placeholderTextColor={colors.textSecondary}
          value={quickNote}
          onChangeText={setQuickNote}
          multiline
          maxLength={500}
        />
        <TouchableOpacity 
          style={[
            styles.sendButton, 
            { backgroundColor: quickNote.trim() ? ACCENT_COLOR : colors.border }
          ]}
          onPress={handleAddQuickNote}
          disabled={!quickNote.trim()}
        >
          <Ionicons name="arrow-up" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: Spacing.md,
    borderTopWidth: 1,
    ...Shadows.lg,
  },
  input: {
    flex: 1,
    minHeight: 45,
    maxHeight: 120,
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 16,
    marginRight: Spacing.sm,
  },
  sendButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});