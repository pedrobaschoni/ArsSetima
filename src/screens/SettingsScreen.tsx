import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { Button } from '../components/Button';
import { useTheme } from '../utils/ThemeContext';
import { Colors, Spacing, BorderRadius } from '../utils/theme';
import { storageService } from '../services/storageService';

export default function SettingsScreen() {
  const { colors, theme, toggleTheme, settings, updateSettings } = useTheme();

  const handleExport = async () => {
    try {
      const filePath = await storageService.exportData();
      await storageService.shareBackup(filePath);
    } catch (error) {
      console.error('Error exporting:', error);
    }
  };

  const handleImport = async () => {
    try {
      await storageService.importData();
    } catch (error) {
      console.error('Error importing:', error);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Aparência</Text>
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text }]}>Tema Escuro</Text>
          <Switch value={theme === 'dark'} onValueChange={toggleTheme} />
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Dados</Text>
        <Button title="Exportar Backup" icon="download" onPress={handleExport} fullWidth />
        <View style={{ height: Spacing.sm }} />
        <Button title="Importar Backup" icon="cloud-upload" onPress={handleImport} fullWidth />
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Sobre</Text>
        <Text style={[styles.text, { color: colors.textSecondary }]}>
          ArsSétima v1.0.0{'\n'}
          O Preço do Sétimo Poder{'\n'}
          © 2025
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  section: {
    margin: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  sectionTitle: { fontSize: 20, fontWeight: '600', marginBottom: Spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: Spacing.sm },
  label: { fontSize: 16 },
  text: { fontSize: 14, lineHeight: 22 },
});
