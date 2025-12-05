import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, TextInput } from 'react-native';
import { useTheme } from '../utils/ThemeContext';
import { Colors, Spacing, BorderRadius } from '../utils/theme';

export default function SettingsScreen() {
  const { colors, theme, toggleTheme, settings, updateSettings } = useTheme();

  const [wordGoalInput, setWordGoalInput] = useState(settings.dailyWordGoal.toString());

  useEffect(() => {
    setWordGoalInput(settings.dailyWordGoal.toString());
  }, [settings.dailyWordGoal]);

  const handleFontSize = (size: 'small' | 'medium' | 'large') => {
    updateSettings({ fontSize: size });
  };

  const handleWordGoalBlur = () => {
    const parsed = parseInt(wordGoalInput, 10);
    if (isNaN(parsed) || parsed <= 0) {
      setWordGoalInput(settings.dailyWordGoal.toString());
      return;
    }
    updateSettings({ dailyWordGoal: parsed });
  };

  const handleNotifications = (value: boolean) => {
    updateSettings({ notifications: value });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Aparência</Text>
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text }]}>Tema Escuro</Text>
          <Switch value={theme === 'dark'} onValueChange={toggleTheme} />
        </View>

        <Text style={[styles.subLabel, { color: colors.textSecondary }]}>Tamanho da fonte</Text>
        <View style={styles.chipRow}>
          {(['small','medium','large'] as const).map(size => (
            <TouchableOpacity
              key={size}
              style={[
                styles.chip,
                { 
                  borderColor: colors.border,
                  backgroundColor: settings.fontSize === size ? Colors.primary + '20' : colors.surface,
                }
              ]}
              onPress={() => handleFontSize(size)}
              activeOpacity={0.8}
            >
              <Text style={{ color: settings.fontSize === size ? Colors.primary : colors.text }}>
                {size === 'small' ? 'Pequena' : size === 'medium' ? 'Média' : 'Grande'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Produtividade</Text>
        <Text style={[styles.subLabel, { color: colors.textSecondary }]}>Meta diária de palavras</Text>
        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
          keyboardType="numeric"
          value={wordGoalInput}
          onChangeText={setWordGoalInput}
          onBlur={handleWordGoalBlur}
          placeholder="1000"
          placeholderTextColor={colors.textSecondary + '99'}
        />

        <View style={[styles.row, { marginTop: Spacing.md }]}>
          <Text style={[styles.label, { color: colors.text }]}>Notificações</Text>
          <Switch value={settings.notifications} onValueChange={handleNotifications} />
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Sobre</Text>
        <Text style={[styles.text, { color: colors.textSecondary }]}>
          ArsSétima v1.0.0{'\n'}
          O Preço do Sétimo Poder{'\n'}
          Desenvolvido por Pedro Baschoni{'\n'}
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
  subLabel: { fontSize: 14, marginBottom: Spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: Spacing.sm },
  chipRow: { flexDirection: 'row', gap: Spacing.sm },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  label: { fontSize: 16 },
  text: { fontSize: 14, lineHeight: 22 },
});
