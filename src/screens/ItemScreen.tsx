import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { EntityCard } from '../components/EntityCard';
import { EmptyState } from '../components/EmptyState';
import { useTheme } from '../utils/ThemeContext';
import { Item } from '../types/item';
import { databaseService } from '../database/migrations';
import { parseList } from '../utils/helpers';
import { Colors, Shadows, Spacing } from '../utils/theme';

export default function ItemScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const ACCENT_COLOR = '#06b6d4';

  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, [])
  );

  const loadItems = async () => {
    try {
      const data = await databaseService.getAll<Item>('items');
      const formattedData = data.map(item => ({
        ...item,
        powers: parseList(item.powers),
      }));
      setItems(formattedData.reverse());
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <EntityCard
            title={item.name}
            description={item.description}
            imageUri={item.imageUri}
            icon="cube"
            tags={[item.type, item.rarity, ...(item.powers || [])].filter(Boolean) as string[]}
            accentColor={ACCENT_COLOR}
            onPress={() => navigation.navigate('EntityDetail', { entityType: 'item', data: item })}
            onLongPress={() => navigation.navigate('EntityForm', { entityType: 'item', editData: item })}
          />
        )}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
        ListEmptyComponent={!loading && <EmptyState title="Nenhum item cadastrado" />}
      />

      <TouchableOpacity
        style={[styles.fab, { shadowColor: ACCENT_COLOR }]}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('EntityForm', { entityType: 'item' })}
      >
        <LinearGradient
          colors={[ACCENT_COLOR, '#60a5fa'] as [string, string]}
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