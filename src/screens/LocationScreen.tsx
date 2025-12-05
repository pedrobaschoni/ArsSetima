import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { EntityCard } from '../components/EntityCard';
import { EmptyState } from '../components/EmptyState';
import { useTheme } from '../utils/ThemeContext';
import { Location } from '../types/location';
import { databaseService } from '../database/migrations';
import { parseList } from '../utils/helpers';
import { Colors, Shadows, Spacing } from '../utils/theme';

export default function LocationScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  const ACCENT_COLOR = Colors.secondary;

  useFocusEffect(
    useCallback(() => {
      loadLocations();
    }, [])
  );

  const loadLocations = async () => {
    try {
      const data = await databaseService.getAll<Location>('locations');
      const formattedData = data.map(item => ({
        ...item,
        tags: parseList(item.tags),
        relatedCharacters: parseList(item.relatedCharacters),
      }));
      setLocations(formattedData.reverse());
    } catch (error) {
      console.error('Error loading locations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={locations}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <EntityCard
            title={item.name}
            description={item.description}
            imageUri={item.imageUri}
            icon="location"
            tags={item.tags}
            accentColor={ACCENT_COLOR}
            onPress={() => navigation.navigate('LocationDetail', { location: item })}
            onLongPress={() => navigation.navigate('EntityForm', { entityType: 'location', editData: item })}
          />
        )}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
        ListEmptyComponent={!loading && <EmptyState title="Nenhum local cadastrado" />}
      />

      <TouchableOpacity
        style={[styles.fab, { shadowColor: ACCENT_COLOR }]}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('EntityForm', { entityType: 'location' })}
      >
        <LinearGradient
          colors={[ACCENT_COLOR, '#c4b5fd'] as [string, string]}
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