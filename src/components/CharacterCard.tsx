import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Character } from '../types/character';
import { useTheme } from '../utils/ThemeContext';
import { Colors, Spacing, BorderRadius, Shadows } from '../utils/theme';

interface CharacterCardProps {
  character: Character;
  onPress?: () => void;
  onLongPress?: () => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  onPress,
  onLongPress,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.card, 
        { 
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderLeftColor: Colors.primary,
        }
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.9}
    >
      <View style={styles.contentRow}>
        <View style={styles.imageContainer}>
          {character.imageUri ? (
            <Image source={{ uri: character.imageUri }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: Colors.primary + '20' }]}>
              <Ionicons name="person" size={28} color={Colors.primary} />
            </View>
          )}
        </View>

        <View style={styles.infoColumn}>
          <View style={styles.headerRow}>
            <Text style={[styles.name, { color: colors.text }]}>
              {character.name}
            </Text>
            {character.age && (
              <View style={[styles.ageBadge, { backgroundColor: colors.surfaceVariant }]}>
                <Text style={[styles.ageText, { color: colors.textSecondary }]}>
                  {character.age} anos
                </Text>
              </View>
            )}
          </View>

          {character.appearance && (
            <Text
              style={[styles.description, { color: colors.textSecondary }]}
              numberOfLines={2}
            >
              {character.appearance}
            </Text>
          )}

          {character.powers && character.powers.length > 0 && (
            <View style={styles.tagsContainer}>
              {character.powers.slice(0, 3).map((power, index) => (
                <View 
                  key={`power-${index}`}
                  style={[styles.tag, { backgroundColor: Colors.secondary + '20' }]}
                >
                  <Text style={[styles.tagText, { color: Colors.secondary }]}>
                    {power}
                  </Text>
                </View>
              ))}
              {character.powers.length > 3 && (
                <Text style={[styles.moreText, { color: colors.textSecondary }]}>
                  +{character.powers.length - 3}
                </Text>
              )}
            </View>
          )}
        </View>

        <Ionicons 
          name="chevron-forward" 
          size={20} 
          color={colors.textSecondary} 
          style={{ opacity: 0.5 }}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: Spacing.md,
    marginVertical: 6,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    marginRight: Spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoColumn: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  ageBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ageText: {
    fontSize: 11,
    fontWeight: '600',
  },
  description: {
    fontSize: 13,
    marginBottom: 8,
    lineHeight: 18,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  moreText: {
    fontSize: 11,
    fontWeight: '500',
  },
});