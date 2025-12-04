// Tela de locais - similar a CharacterScreen
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { EntityCard } from '../components/EntityCard';
import { EmptyState } from '../components/EmptyState';
import { useTheme } from '../utils/ThemeContext';
import { Location } from '../types/location';
import { databaseService } from '../database/migrations';

export default function LocationScreen() {
  const { colors } = useTheme();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      const data = await databaseService.getAll<Location>('locations');
      setLocations(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <EmptyState title="" loading />;

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
          />
        )}
        ListEmptyComponent={<EmptyState title="Nenhum local cadastrado" />}
      />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1 } });
