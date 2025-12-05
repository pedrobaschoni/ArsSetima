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
  accentColor?: string;
  onPress?: () => void;
  onLongPress?: () => void;
}

export const EntityCard: React.FC<EntityCardProps> = ({
  title,
  description,
  imageUri,
  icon = 'document-text',
  tags,
  accentColor = Colors.primary,
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
          borderLeftColor: accentColor,
        }
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.9}
    >
      <View style={styles.container}>
        {/* Ícone ou Imagem */}
        <View style={styles.mediaContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <View style={[styles.iconBox, { backgroundColor: accentColor + '15' }]}>
              <Ionicons name={icon} size={26} color={accentColor} />
            </View>
          )}
        </View>

        {/* Conteúdo de Texto */}
        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
              {title}
            </Text>
            {/* Seta discreta */}
            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} style={{ opacity: 0.5 }} />
          </View>
          
          {description ? (
            <Text 
              style={[styles.description, { color: colors.textSecondary }]}
              numberOfLines={2}
            >
              {description}
            </Text>
          ) : null}

          {/* Tags Coloridas */}
          {tags && tags.length > 0 && (
            <View style={styles.tagsRow}>
              {tags.slice(0, 3).map((tag, index) => (
                <View 
                  key={`tag-${index}`}
                  style={[styles.tagBadge, { backgroundColor: accentColor + '10', borderColor: accentColor + '30' }]}
                >
                  <Text style={[styles.tagText, { color: accentColor }]}>
                    {truncateText(tag, 15)}
                  </Text>
                </View>
              ))}
              {tags.length > 3 && (
                <Text style={[styles.moreTags, { color: colors.textSecondary }]}>
                  +{tags.length - 3}
                </Text>
              )}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: Spacing.md,
    marginVertical: 6,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderLeftWidth: 4,
    ...Shadows.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  container: {
    flexDirection: 'row',
    padding: Spacing.md,
    alignItems: 'flex-start',
  },
  mediaContainer: {
    marginRight: Spacing.md,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#eee',
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    minHeight: 50,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
    letterSpacing: 0.2,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  tagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  moreTags: {
    fontSize: 11,
    marginLeft: 2,
  },
});