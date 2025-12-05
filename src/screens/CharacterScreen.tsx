import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { CharacterCard } from '../components/CharacterCard';
import { EmptyState } from '../components/EmptyState';
import { useTheme } from '../utils/ThemeContext';
import { Character } from '../types/character';
import { databaseService } from '../database/migrations';
import { parseList } from '../utils/helpers';
import { Colors, Shadows, Spacing } from '../utils/theme';

export default function CharacterScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadCharacters();
    }, [])
  );

  const loadCharacters = async () => {
    try {
      const data = await databaseService.getAll<Character>('characters');
      const formattedData = data.map(char => ({
        ...char,
        powers: parseList(char.powers),
        tags: parseList(char.tags),
        relations: parseList(char.relations),
      }));
      setCharacters(formattedData.reverse());
    } catch (error) {
      console.error('Error loading characters:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={characters}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <CharacterCard
            character={item}
            onPress={() => navigation.navigate('CharacterDetail', { character: item })}
            onLongPress={() => navigation.navigate('EntityForm', { entityType: 'character', editData: item })}
          />
        )}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
        ListEmptyComponent={!loading && (
          <EmptyState 
            title="Nenhum personagem" 
            message="Toque no botão + para criar o primeiro." 
          />
        )}
      />

      {/* BOTÃO FLUTUANTE (FAB) */}
      <TouchableOpacity
        style={[styles.fab, { shadowColor: Colors.primary }]}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('EntityForm', { entityType: 'character' })}
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