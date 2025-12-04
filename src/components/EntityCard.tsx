import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/ThemeContext';
import { Colors, Spacing, BorderRadius, Shadows } from '../utils/theme';
import { truncateText } from '../utils/helpers';

interface EntityCardProps {
  title: string;
  description?: string;
  imageUri?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  tags?: string[];
  onPress?: () => void;
  onLongPress?: () => void;
}

/**
 * Card genérico para entidades (locais, itens, magias, etc)
 */
export const EntityCard: React.FC<EntityCardProps> = ({
  title,
  description,
  imageUri,
  icon = 'document-text',
  tags,
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
      {/* Imagem ou ícone */}
      <View style={styles.mediaContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={[styles.iconPlaceholder, { backgroundColor: Colors.primary }]}>
            <Ionicons name={icon} size={28} color="#fff" />
          </View>
        )}
      </View>

      {/* Informações */}
      <View style={styles.infoContainer}>
        <Text style={[styles.title, { color: colors.text }]}>
          {title}
        </Text>
        
        {description && (
          <Text
            style={[styles.description, { color: colors.textSecondary }]}
            numberOfLines={2}
          >
            {description}
          </Text>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {tags.slice(0, 3).map((tag, index) => (
              <View style={styles.tag}>
                <Text style={styles.tagText}>{truncateText(tag, 15)}</Text>
              </View>
            ))}
            {tags.length > 3 && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>+{tags.length - 3}</Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Seta */}
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
  mediaContainer: {
    marginRight: Spacing.md,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.md,
  },
  iconPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
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
