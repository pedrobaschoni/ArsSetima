import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { Button } from '../components/Button';
import { useTheme } from '../utils/ThemeContext';
import { Spacing, BorderRadius } from '../utils/theme';
import { pdfService } from '../services/pdfService';

export default function CharacterDetailScreen({ route }: any) {
  const { colors } = useTheme();
  const { character } = route.params;

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
            {character.powers.map((power, index) => (
              <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
                • {power}
              </Text>
            ))}
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
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: Spacing.lg,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
  },
  info: {
    fontSize: 16,
    marginBottom: Spacing.md,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
  },
});
