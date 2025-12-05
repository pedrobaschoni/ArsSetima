import React, { useState, useCallback, useLayoutEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Button } from '../components/Button';
import { useTheme } from '../utils/ThemeContext';
import { Spacing, Colors } from '../utils/theme';
import { pdfService } from '../services/pdfService';
import { databaseService } from '../database/migrations';
import { parseList } from '../utils/helpers';

const VIEW_CONFIG: any = {
  spell: {
    label: 'Magia',
    table: 'spells',
    fields: [
      { key: 'description', label: 'Descrição' },
      { key: 'type', label: 'Tipo' },
      { key: 'level', label: 'Nível/Círculo' },
      { key: 'requirements', label: 'Requisitos' },
      { key: 'effects', label: 'Efeitos', type: 'list' },
    ]
  },
  item: {
    label: 'Item',
    table: 'items',
    fields: [
      { key: 'description', label: 'Descrição' },
      { key: 'type', label: 'Tipo' },
      { key: 'rarity', label: 'Raridade' },
      { key: 'powers', label: 'Poderes', type: 'list' },
    ]
  },
  creature: {
    label: 'Criatura',
    table: 'creatures',
    fields: [
      { key: 'species', label: 'Espécie' },
      { key: 'description', label: 'Descrição' },
      { key: 'habitat', label: 'Habitat' },
      { key: 'dangerLevel', label: 'Nível de Perigo' },
      { key: 'abilities', label: 'Habilidades', type: 'list' },
    ]
  },
  faction: {
    label: 'Facção',
    table: 'factions',
    fields: [
      { key: 'description', label: 'Descrição' },
      { key: 'alignment', label: 'Alinhamento' },
      { key: 'goals', label: 'Objetivos' },
    ]
  }
};

export default function EntityDetailScreen({ route, navigation }: any) {
  const { colors } = useTheme();
  const { entityType, data: initialData } = route.params;
  const config = VIEW_CONFIG[entityType];
  
  const [data, setData] = useState(initialData);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: config.label,
      headerRight: () => (
        <TouchableOpacity 
          onPress={() => navigation.navigate('EntityForm', { 
            entityType: entityType, 
            editData: data 
          })} 
          style={{ marginRight: 15 }}
        >
          <Text style={{ color: Colors.primary, fontWeight: '600', fontSize: 16 }}>Editar</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, data, entityType]);

  useFocusEffect(
    useCallback(() => {
      const loadFreshData = async () => {
        const freshData = await databaseService.getById<any>(config.table, initialData.id);
        if (freshData) {
          const formatted = { ...freshData };
          config.fields.forEach((field: any) => {
            if (field.type === 'list') {
              formatted[field.key] = parseList(freshData[field.key]);
            }
          });
          setData(formatted);
        }
      };
      loadFreshData();
    }, [initialData.id])
  );

  const handleExportPDF = async () => {
    let content = '';
    config.fields.forEach((field: any) => {
      const val = data[field.key];
      if (val) {
        const displayVal = Array.isArray(val) ? val.join(', ') : val;
        content += `<b>${field.label}:</b> ${displayVal}<br/><br/>`;
      }
    });
    
    await pdfService.generateCustomPDF(data.name, content, `${data.name}.pdf`);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {data.imageUri ? (
        <Image source={{ uri: data.imageUri }} style={styles.image} />
      ) : null}
      
      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.text }]}>{data.name}</Text>
        
        {config.fields.map((field: any) => {
          const value = data[field.key];
          if (!value || (Array.isArray(value) && value.length === 0)) return null;

          return (
            <View key={field.key} style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{field.label}</Text>
              
              {field.type === 'list' && Array.isArray(value) ? (
                <View style={styles.tagsContainer}>
                  {value.map((item: string, idx: number) => (
                    <View key={idx} style={[styles.tag, { backgroundColor: Colors.primary + '20' }]}>
                      <Text style={{ color: Colors.primary }}>{item}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
                  {value}
                </Text>
              )}
            </View>
          );
        })}

        <View style={{ marginTop: 20 }}>
          <Button
            title="Exportar PDF"
            icon="document"
            onPress={handleExportPDF}
            fullWidth
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  image: { width: '100%', height: 200, backgroundColor: '#eee' },
  content: { padding: Spacing.lg },
  name: { fontSize: 32, fontWeight: 'bold', marginBottom: Spacing.lg },
  section: { marginBottom: Spacing.lg },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  sectionText: { fontSize: 16, lineHeight: 24 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
});