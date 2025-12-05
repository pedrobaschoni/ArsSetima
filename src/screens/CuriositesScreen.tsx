import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { EntityCard } from '../components/EntityCard'; // Reusando seu card bonito
import { EmptyState } from '../components/EmptyState';
import { useTheme } from '../utils/ThemeContext';
import { Curiosity } from '../types/curiosity';
import { databaseService } from '../database/migrations';
import { parseList } from '../utils/helpers';
import { Colors, Shadows, Spacing } from '../utils/theme';

export default function CuriositiesScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [curiosities, setCuriosities] = useState<Curiosity[]>([]);
  const [loading, setLoading] = useState(true);

  // Cor temática (Ciano/Teal para diferenciar)
  const ACCENT_COLOR = '#0891b2';

  useFocusEffect(
    useCallback(() => {
      loadCuriosities();
    }, [])
  );

  const loadCuriosities = async () => {
    try {
      const data = await databaseService.getAll<Curiosity>('curiosities');
      const formattedData = data.map(item => ({
        ...item,
        tags: parseList(item.tags),
      }));
      setCuriosities(formattedData.reverse());
    } catch (error) {
      console.error('Error loading curiosities:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={curiosities}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <EntityCard
            title={item.title}
            description={item.content}
            imageUri={item.imageUri}
            icon="bulb" // Ícone de lâmpada/curiosidade
            tags={item.tags}
            accentColor={ACCENT_COLOR}
            onPress={() => navigation.navigate('EntityDetail', { entityType: 'curiosity', data: item })}
            onLongPress={() => navigation.navigate('EntityForm', { entityType: 'curiosity', editData: item })}
          />
        )}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
        ListEmptyComponent={!loading && (
          <EmptyState 
            title="Nenhuma curiosidade" 
            message="Toque no botão + para adicionar fatos, lendas ou mistérios." 
          />
        )}
      />
      {/* BOTÃO FLUTUANTE */}
      <TouchableOpacity
        style={[styles.fab, { shadowColor: ACCENT_COLOR }]}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('EntityForm', { entityType: 'curiosity' })}
      >
        <LinearGradient
          colors={[ACCENT_COLOR, '#06b6d4'] as [string, string]}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={32} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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