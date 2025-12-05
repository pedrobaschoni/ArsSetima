import React, { useState, useCallback, useLayoutEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Button } from '../components/Button';
import { useTheme } from '../utils/ThemeContext';
import { Spacing, Colors } from '../utils/theme';
import { pdfService } from '../services/pdfService';
import { databaseService } from '../database/migrations';
import { parseList } from '../utils/helpers';

export default function CharacterDetailScreen({ route, navigation }: any) {
  const { colors } = useTheme();
  const { character: initialCharacter } = route.params;
  
  const [character, setCharacter] = useState(initialCharacter);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity 
          onPress={() => navigation.navigate('EntityForm', { 
            entityType: 'character', 
            editData: character 
          })} 
          style={{ marginRight: 15 }}
        >
          <Text style={{ color: Colors.primary, fontWeight: '600', fontSize: 16 }}>Editar</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, character]);

  useFocusEffect(
    useCallback(() => {
      const loadFreshData = async () => {
        const freshData = await databaseService.getById<any>('characters', initialCharacter.id);
        if (freshData) {
          // Tenta parsear 'notes' se for uma string JSON de array
          let parsedNotes = freshData.notes;
          try {
             const json = JSON.parse(freshData.notes);
             if (Array.isArray(json)) parsedNotes = json;
          } catch {}

          const formatted = {
            ...freshData,
            powers: parseList(freshData.powers),
            tags: parseList(freshData.tags),
            relations: parseList(freshData.relations),
            notes: parsedNotes, // Usa a versão processada
          };
          setCharacter(formatted);
        }
      };
      loadFreshData();
    }, [initialCharacter.id])
  );

  const handleExportPDF = async () => {
    try {
      await pdfService.generateCharacterPDF(character);
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {character.imageUri && (
        <Image source={{ uri: character.imageUri }} style={styles.image} />
      )}
      
      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.text }]}>{character.name}</Text>
        
        {character.age && (
          <Text style={[styles.info, { color: colors.textSecondary }]}>
            Idade: {character.age} anos
          </Text>
        )}

        {character.appearance && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Aparência</Text>
            <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
              {character.appearance}
            </Text>
          </View>
        )}

        {character.powers && character.powers.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Poderes</Text>
            {character.powers.map((power: string, index: number) => (
              <Text key={index} style={[styles.sectionText, { color: colors.textSecondary }]}>
                • {power}
              </Text>
            ))}
          </View>
        )}

        {character.goals && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Objetivos</Text>
            <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
              {character.goals}
            </Text>
          </View>
        )}

        {/* EXIBIÇÃO DE NOTAS (Lista ou Texto) */}
        {character.notes && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Notas</Text>
            {Array.isArray(character.notes) ? (
              character.notes.map((note: string, index: number) => (
                <View key={index} style={{ marginBottom: 8, paddingLeft: 8, borderLeftWidth: 2, borderLeftColor: Colors.primary }}>
                  <Text style={[styles.sectionText, { color: colors.textSecondary }]}>{note}</Text>
                </View>
              ))
            ) : (
              <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
                {character.notes}
              </Text>
            )}
          </View>
        )}

        <Button
          title="Exportar PDF"
          icon="document"
          onPress={handleExportPDF}
          fullWidth
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  image: { width: '100%', height: 250 },
  content: { padding: Spacing.lg },
  name: { fontSize: 28, fontWeight: 'bold', marginBottom: Spacing.sm },
  info: { fontSize: 16, marginBottom: Spacing.md },
  section: { marginBottom: Spacing.lg },
  sectionTitle: { fontSize: 20, fontWeight: '600', marginBottom: Spacing.sm },
  sectionText: { fontSize: 16, lineHeight: 24 },
});