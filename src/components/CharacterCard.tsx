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

/**
 * Card de personagem para listas
 */
export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  onPress,
  onLongPress,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface }]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        {character.imageUri ? (
          <Image source={{ uri: character.imageUri }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor: Colors.primary }]}>
            <Ionicons name="person" size={32} color="#fff" />
          </View>
        )}
      </View>

      {/* Informações */}
      <View style={styles.infoContainer}>
        <Text style={[styles.name, { color: colors.text }]}>
          {character.name}
        </Text>
        
        {character.age && (
          <Text style={[styles.detail, { color: colors.textSecondary }]}>
            {character.age} anos
          </Text>
        )}
        
        {character.appearance && (
          <Text
            style={[styles.description, { color: colors.textSecondary }]}
            numberOfLines={2}
          >
            {character.appearance}
          </Text>
        )}

        {/* Tags de poderes */}
        {character.powers && character.powers.length > 0 && (
          <View style={styles.tagsContainer}>
            {character.powers.slice(0, 2).map((power, index) => (
              <View style={styles.tag}>
                <Text style={styles.tagText}>{power}</Text>
              </View>
            ))}
            {character.powers.length > 2 && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>
                  +{character.powers.length - 2}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Ícone de seta */}
      <Ionicons
        name="chevron-forward"
        size={24}
        color={colors.textSecondary}
        style={styles.chevron}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadows.md,
  },
  avatarContainer: {
    marginRight: Spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.xl,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  detail: {
    fontSize: 14,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.sm,
  },
  tag: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  chevron: {
    marginLeft: Spacing.sm,
  },
});
