import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { Button } from '../components/Button';
import { useTheme } from '../utils/ThemeContext';
import { Spacing, BorderRadius } from '../utils/theme';
import { countWords } from '../utils/helpers';

export default function WritingScreen() {
  const { colors, settings, fontMultiplier } = useTheme();
  const [content, setContent] = useState('');
  const wordCount = countWords(content);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.wordCount, { color: colors.text, fontSize: 18 * fontMultiplier }]}>
          {wordCount} / {settings.dailyWordGoal} palavras
        </Text>
      </View>
      
      <TextInput
        style={[
          styles.textInput, 
          { 
            backgroundColor: colors.surface, 
            color: colors.text,
            fontSize: 16 * fontMultiplier,
            lineHeight: 24 * fontMultiplier,
          }
        ]}
        multiline
        placeholder="Escreva seu capítulo aqui..."
        placeholderTextColor={colors.textSecondary}
        value={content}
        onChangeText={setContent}
        textAlignVertical="top"
      />
      
      <View style={styles.actions}>
        <Button title="Salvar" icon="save" onPress={() => {}} fullWidth />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: Spacing.md, alignItems: 'center' },
  wordCount: { fontWeight: '600' },
  textInput: {
    margin: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    minHeight: 400,
  },
  actions: { padding: Spacing.md },
});
