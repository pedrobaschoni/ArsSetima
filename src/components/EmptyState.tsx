import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../utils/ThemeContext';
import { Colors, Spacing } from '../utils/theme';

interface EmptyStateProps {
  title: string;
  message?: string;
  loading?: boolean;
}

/**
 * Componente de estado vazio/carregamento
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  loading = false,
}) => {
  const { colors } = useTheme();

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={[styles.title, { color: colors.text }]}>
          Carregando...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {message && (
        <Text style={[styles.message, { color: colors.textSecondary }]}>
          {message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: Spacing.md,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: Spacing.sm,
    lineHeight: 24,
  },
});
