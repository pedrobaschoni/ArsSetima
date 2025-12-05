import React, { useState, useCallback, useLayoutEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Button } from '../components/Button';
import { useTheme } from '../utils/ThemeContext';
import { Spacing, Colors } from '../utils/theme';
import { pdfService } from '../services/pdfService';
import { databaseService } from '../database/migrations';
import { parseList } from '../utils/helpers';

export default function LocationDetailScreen({ route, navigation }: any) {
  const { colors } = useTheme();
  const { location: initialLocation } = route.params;
  
  const [location, setLocation] = useState(initialLocation);

  // Botão Editar no Header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity 
          onPress={() => navigation.navigate('EntityForm', { 
            entityType: 'location', 
            editData: location 
          })} 
          style={{ marginRight: 15 }}
        >
          <Text style={{ color: Colors.primary, fontWeight: '600', fontSize: 16 }}>Editar</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, location]);

  // Recarregar dados
  useFocusEffect(
    useCallback(() => {
      const loadFreshData = async () => {
        // CORREÇÃO: Adicionado <any> aqui para corrigir o erro de tipo 'unknown'
        const freshData = await databaseService.getById<any>('locations', initialLocation.id);
        
        if (freshData) {
          const formatted = {
            ...freshData,
            tags: parseList(freshData.tags),
            relatedCharacters: parseList(freshData.relatedCharacters),
          };
          setLocation(formatted);
        }
      };
      loadFreshData();
    }, [initialLocation.id])
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.text }]}>{location.name}</Text>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Descrição</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {location.description}
          </Text>
        </View>

        {location.tags && location.tags.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Tags</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {location.tags.map((tag: string, index: number) => (
                <View key={index} style={{ backgroundColor: Colors.primary + '20', padding: 6, borderRadius: 4 }}>
                  <Text style={{ color: Colors.primary }}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={{ marginTop: 20 }}>
          <Button
            title="Exportar PDF"
            icon="document"
            onPress={() => pdfService.generateLocationPDF(location)}
            fullWidth
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.lg },
  name: { fontSize: 28, fontWeight: 'bold', marginBottom: Spacing.lg },
  section: { marginBottom: Spacing.lg },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: Spacing.sm },
  description: { fontSize: 16, lineHeight: 24 },
});