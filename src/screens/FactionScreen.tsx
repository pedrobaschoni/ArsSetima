import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { EntityCard } from '../components/EntityCard';
import { EmptyState } from '../components/EmptyState';
import { useTheme } from '../utils/ThemeContext';
import { Faction } from '../types/faction';
import { databaseService } from '../database/migrations';
import { parseList } from '../utils/helpers';
import { Colors, Shadows, Spacing } from '../utils/theme';

export default function FactionScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [factions, setFactions] = useState<Faction[]>([]);
  const [loading, setLoading] = useState(true);

  const ACCENT_COLOR = '#eab308';

  useFocusEffect(
    useCallback(() => {
      loadFactions();
    }, [])
  );

  const loadFactions = async () => {
    try {
      const data = await databaseService.getAll<Faction>('factions');
      const formattedData = data.map(item => ({
        ...item,
        members: parseList(item.members),
      }));
      setFactions(formattedData.reverse());
    } catch (error) {
      console.error('Error loading factions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={factions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <EntityCard
            title={item.name}
            description={item.description}
            imageUri={item.imageUri}
            icon="flag"
            tags={[item.alignment].filter(Boolean) as string[]}
            accentColor={ACCENT_COLOR}
            onPress={() => navigation.navigate('EntityDetail', { entityType: 'faction', data: item })}
            onLongPress={() => navigation.navigate('EntityForm', { entityType: 'faction', editData: item })}
          />
        )}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
        ListEmptyComponent={!loading && <EmptyState title="Nenhuma facção cadastrada" />}
      />

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: ACCENT_COLOR }]}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('EntityForm', { entityType: 'faction' })}
      >
        <Ionicons name="add" size={32} color="#fff" />
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