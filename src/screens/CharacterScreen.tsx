import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { CharacterCard } from '../components/CharacterCard';
import { EmptyState } from '../components/EmptyState';
import { useTheme } from '../utils/ThemeContext';
import { Character } from '../types/character';
import { databaseService } from '../database/migrations';

export default function CharacterScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    try {
      const data = await databaseService.getAll<Character>('characters');
      setCharacters(data);
    } catch (error) {
      console.error('Error loading characters:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <EmptyState title="" loading />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={characters}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <CharacterCard
            character={item}
            onPress={() => navigation.navigate('CharacterDetail', { character: item })}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="Nenhum personagem cadastrado"
            message="Comece criando seu primeiro personagem"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
