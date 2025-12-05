import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { EntityCard } from '../components/EntityCard';
import { EmptyState } from '../components/EmptyState';
import { useTheme } from '../utils/ThemeContext';
import { Spell } from '../types/spell';
import { databaseService } from '../database/migrations';
import { parseList } from '../utils/helpers';
import { Colors, Shadows, Spacing } from '../utils/theme';

export default function SpellScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [spells, setSpells] = useState<Spell[]>([]);
  const [loading, setLoading] = useState(true);

  const ACCENT_COLOR = '#ef4444';

  useFocusEffect(
    useCallback(() => {
      loadSpells();
    }, [])
  );

  const loadSpells = async () => {
    try {
      const data = await databaseService.getAll<Spell>('spells');
      const formattedData = data.map(item => ({
        ...item,
        knownBy: parseList(item.knownBy),
      }));
      setSpells(formattedData.reverse());
    } catch (error) {
      console.error('Error loading spells:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={spells}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <EntityCard
            title={item.name}
            description={item.description}
            imageUri={item.imageUri}
            icon="flame"
            tags={[item.type || '', item.level ? `Nível ${item.level}` : ''].filter(Boolean)}
            accentColor={ACCENT_COLOR}
            onPress={() => navigation.navigate('EntityDetail', { entityType: 'spell', data: item })}
            onLongPress={() => navigation.navigate('EntityForm', { entityType: 'spell', editData: item })}
          />
        )}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
        ListEmptyComponent={!loading && <EmptyState title="Nenhuma magia cadastrada" />}
      />

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: ACCENT_COLOR }]}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('EntityForm', { entityType: 'spell' })}
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