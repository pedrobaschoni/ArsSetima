import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
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

  // Carrega os dados toda vez que a tela ganha foco (ao voltar de outra tela)
  useFocusEffect(
    useCallback(() => {
      loadCharacters();
    }, [])
  );

  const loadCharacters = async () => {
    try {
      // Não ativamos o loading visual aqui para não piscar a tela na atualização silenciosa
      const data = await databaseService.getAll<Character>('characters');
      
      // Corrige os dados que vêm como string do banco
      const formattedData = data.map(char => ({
        ...char,
        powers: parseList(char.powers),
        tags: parseList(char.tags),
        relations: parseList(char.relations),
      }));

      // Inverte a ordem para o mais recente aparecer primeiro
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
        // Espaço extra no final para o botão flutuante não tapar o último card
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
        style={[styles.fab, { backgroundColor: Colors.primary }]}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('EntityForm', { entityType: 'character' })}
      >
        <Ionicons name="add" size={32} color="#fff" />
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
    bottom: 30, // Distância do fundo
    width: 60,
    height: 60,
    borderRadius: 30, // Totalmente redondo
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.lg, // Sombra do arquivo de tema
    elevation: 8, // Sombra forte para Android
    zIndex: 999, // Garante que fique por cima de tudo
  },
});