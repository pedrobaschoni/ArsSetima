import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Button } from '../components/Button';
import { useTheme } from '../utils/ThemeContext';
import { Spacing } from '../utils/theme';
import { pdfService } from '../services/pdfService';

export default function LocationDetailScreen({ route }: any) {
  const { colors } = useTheme();
  const { location } = route.params;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.text }]}>{location.name}</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {location.description}
        </Text>
        <Button
          title="Exportar PDF"
          icon="document"
          onPress={() => pdfService.generateLocationPDF(location)}
          fullWidth
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.lg },
  name: { fontSize: 28, fontWeight: 'bold', marginBottom: Spacing.md },
  description: { fontSize: 16, lineHeight: 24, marginBottom: Spacing.lg },
});
