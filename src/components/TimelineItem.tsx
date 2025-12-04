import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TimelineEvent } from '../types/event';
import { useTheme } from '../utils/ThemeContext';
import { Colors, Spacing, BorderRadius, Shadows } from '../utils/theme';
import { formatDate } from '../utils/helpers';

interface TimelineItemProps {
  event: TimelineEvent;
  onPress?: () => void;
}

/**
 * Item de evento para a linha do tempo
 */
export const TimelineItem: React.FC<TimelineItemProps> = ({
  event,
  onPress,
}) => {
  const { colors } = useTheme();

  const getImportanceColor = () => {
    switch (event.importance) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return Colors.accent;
      case 'low':
        return colors.textSecondary;
      default:
        return Colors.secondary;
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Linha da timeline */}
      <View style={styles.timelineColumn}>
        <View
          style={[
            styles.dot,
            { backgroundColor: getImportanceColor() },
          ]}
        />
        <View style={[styles.line, { backgroundColor: colors.border }]} />
      </View>

      {/* Card do evento */}
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        {/* Data */}
        <View style={styles.dateContainer}>
          <Ionicons
            name="calendar-outline"
            size={16}
            color={Colors.accent}
          />
          <Text style={[styles.date, { color: Colors.accent }]}>
            {formatDate(event.date)}
          </Text>
        </View>

        {/* Título */}
        <Text style={[styles.title, { color: colors.text }]}>
          {event.title}
        </Text>

        {/* Descrição */}
        <Text
          style={[styles.description, { color: colors.textSecondary }]}
          numberOfLines={3}
        >
          {event.description}
        </Text>

        {/* Categoria */}
        {event.category && (
          <View style={styles.categoryContainer}>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryText}>{event.category}</Text>
            </View>
          </View>
        )}

        {/* Links */}
        {(event.links?.characters?.length || event.links?.locations?.length) && (
          <View style={styles.linksContainer}>
            {event.links.characters && event.links.characters.length > 0 && (
              <View style={styles.linkBadge}>
                <Ionicons name="person" size={14} color={Colors.secondary} />
                <Text style={[styles.linkText, { color: Colors.secondary }]}>
                  {event.links.characters.length}
                </Text>
              </View>
            )}
            {event.links.locations && event.links.locations.length > 0 && (
              <View style={styles.linkBadge}>
                <Ionicons name="location" size={14} color={Colors.secondary} />
                <Text style={[styles.linkText, { color: Colors.secondary }]}>
                  {event.links.locations.length}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
  },
  timelineColumn: {
    width: 40,
    alignItems: 'center',
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: BorderRadius.full,
    marginTop: 8,
  },
  line: {
    width: 2,
    flex: 1,
    marginTop: 4,
  },
  card: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginLeft: Spacing.sm,
    ...Shadows.md,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  date: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  categoryContainer: {
    marginBottom: Spacing.sm,
  },
  categoryTag: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  linksContainer: {
    flexDirection: 'row',
    marginTop: Spacing.xs,
  },
  linkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  linkText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
});
