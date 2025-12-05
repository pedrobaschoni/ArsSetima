import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../utils/ThemeContext';
import { Note } from '../types/note';
import { databaseService } from '../database/migrations';
import { parseList, truncateText } from '../utils/helpers';
import { Colors, Spacing, BorderRadius, Shadows } from '../utils/theme';
import { EmptyState } from '../components/EmptyState';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - Spacing.lg * 3) / 2;

export default function NotesScreen({ navigation }: any) {
  const { colors, theme, fontMultiplier } = useTheme();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [])
  );

  const loadNotes = async () => {
    try {
      const data = await databaseService.getAll<Note>('notes');
      const sorted = data.sort((a, b) => {
        const priorityScore = (p: string) => {
          if (p === 'high' || p === 'Alta') return 3;
          if (p === 'medium' || p === 'Média') return 2;
          return 1;
        };
        const scoreA = priorityScore(a.priority);
        const scoreB = priorityScore(b.priority);
        
        if (scoreA !== scoreB) return scoreB - scoreA;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      
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

  const filteredNotes = notes.filter(note => {
    if (priorityFilter === 'all') return true;
    const priority = note.priority?.toLowerCase();
    if (priorityFilter === 'high') return priority === 'high' || priority === 'alta';
    if (priorityFilter === 'medium') return priority === 'medium' || priority === 'média';
    if (priorityFilter === 'low') return priority === 'low' || priority === 'baixa';
    return true;
  });

  const renderFilterButton = (filter: string, label: string) => {
    const isActive = priorityFilter === filter;
    return (
      <TouchableOpacity
        key={filter}
        style={[
          styles.filterButton,
          {
            backgroundColor: isActive ? colors.text : colors.surface,
            borderColor: colors.border,
          }
        ]}
        onPress={() => setPriorityFilter(filter)}
      >
        <Text style={[
          styles.filterButtonText,
          { color: isActive ? colors.background : colors.text }
        ]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderNoteCard = ({ item, index }: { item: Note, index: number }) => {
    const getNoteColor = (priority?: string): [string, string] => {
      switch (priority?.toLowerCase()) {
        case 'high': case 'alta': return ['#ef4444', '#b91c1c']; 
        case 'medium': case 'média': return ['#f59e0b', '#d97706']; 
        case 'low': case 'baixa': return ['#10b981', '#059669']; 
        default: return [colors.surfaceVariant, colors.surface]; 
      }
    };

    const gradientColors = getNoteColor(item.priority);
    const isDark = theme === 'dark';
    
    const getTagColor = (priority?: string) => {
      switch (priority?.toLowerCase()) {
        case 'high': case 'alta': return { bg: '#fecaca', text: '#991b1b' };
        case 'medium': case 'média': return { bg: '#fed7aa', text: '#9a3412' };
        case 'low': case 'baixa': return { bg: '#a7f3d0', text: '#065f46' };
        default: return { bg: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', text: colors.textSecondary };
      }
    };
    
    const tagColors = getTagColor(item.priority);

    return (
      <TouchableOpacity
        style={[
          styles.cardContainer,
          { 
            backgroundColor: colors.surface,
            borderColor: colors.border,
            marginRight: index % 2 === 0 ? Spacing.md : 0 
          }
        ]}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('EntityDetail', { entityType: 'note', data: item })}
        onLongPress={() => navigation.navigate('EntityForm', { entityType: 'note', editData: item })}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.accentBar}
        />

        <View style={styles.cardContent}>
          <View>
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.text, fontSize: 16 * fontMultiplier }]} numberOfLines={2}>
                {item.title}
              </Text>
              <Ionicons 
                name="document-text-outline" 
                size={14} 
                color={colors.textSecondary} 
                style={{ opacity: 0.5 }} 
              />
            </View>

            <Text style={[styles.preview, { color: colors.textSecondary, fontSize: 13 * fontMultiplier }]} numberOfLines={3}>
              {item.content}
            </Text>

            {item.tags && item.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {item.tags.slice(0, 2).map((tag, i) => (
                  <View 
                    key={i} 
                    style={[
                      styles.tagChip, 
                      { backgroundColor: tagColors.bg }
                    ]}
                  >
                    <Text style={[styles.tagText, { color: tagColors.text }]}>
                      #{truncateText(tag, 8)}
                    </Text>
                  </View>
                ))}
                {item.tags.length > 2 && (
                  <Text style={[styles.moreTags, { color: colors.textSecondary }]}>...</Text>
                )}
              </View>
            )}
          </View>

          <Text style={[styles.date, { color: colors.textSecondary }]}>
            {new Date(item.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      
      <View style={[styles.filterContainer, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        {renderFilterButton('all', 'Todas')}
        {renderFilterButton('high', 'Alta')}
        {renderFilterButton('medium', 'Média')}
        {renderFilterButton('low', 'Baixa')}
      </View>
      
      <FlatList
        data={filteredNotes}
        keyExtractor={item => item.id}
        renderItem={renderNoteCard}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={!loading && (
          <EmptyState 
            title="Sua mente está vazia..." 
            message="Toque no + para criar sua primeira nota brilhante." 
          />
        )}
      />

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.text, shadowColor: colors.text }]}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('EntityForm', { entityType: 'note' })}
      >
        <LinearGradient
          colors={[Colors.primary, '#8b5cf6'] as [string, string]}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={32} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    borderBottomWidth: 1,
  },
  filterButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  listContent: {
    padding: Spacing.lg,
    paddingBottom: 100,
  },
  columnWrapper: {
    justifyContent: 'flex-start',
  },
  cardContainer: {
    width: COLUMN_WIDTH,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...Shadows.sm,
    elevation: 2,
    height: 200,
  },
  accentBar: {
    height: 6,
    width: '100%',
  },
  cardContent: {
    padding: Spacing.md,
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontWeight: '700',
    flex: 1,
    marginRight: 4,
    letterSpacing: 0.3,
  },
  preview: {
    lineHeight: 18,
    opacity: 0.8,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
  },
  tagChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
  },
  moreTags: {
    fontSize: 10,
    alignSelf: 'center',
  },
  date: {
    fontSize: 10,
    textTransform: 'uppercase',
    fontWeight: '700',
    opacity: 0.5,
    marginTop: 4,
    textAlign: 'right',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 64,
    height: 64,
    borderRadius: 32,
    ...Shadows.lg,
    elevation: 8,
    zIndex: 999,
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});