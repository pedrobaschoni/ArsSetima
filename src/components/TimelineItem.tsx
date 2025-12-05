import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/ThemeContext';
import { TimelineEvent } from '../types/event';
import { Spacing, BorderRadius, Colors, Shadows } from '../utils/theme';

interface TimelineItemProps {
  event: TimelineEvent;
  onPress?: () => void;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({ event, onPress }) => {
  const { colors } = useTheme();

  const getImportanceColor = (importance?: string) => {
    const level = importance?.toLowerCase().trim();
    switch (level) {
      case 'high': 
      case 'alta': return '#ef4444';
      case 'medium': 
      case 'media': 
      case 'média': return '#f59e0b';
      case 'low': 
      case 'baixa': return '#10b981';
      default: return colors.textSecondary;
    }
  };

  const accentColor = getImportanceColor(event.importance);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
          .toUpperCase()
          .replace('.', '');
      }
      return dateString;
    } catch {
      return dateString;
    }
  };

  return (
    <View style={styles.timelineContainer}>
      <View style={styles.timelineColumn}>
        <View style={[styles.dot, { backgroundColor: accentColor }]} />
        <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />
      </View>

      <TouchableOpacity
        style={[
          styles.card, 
          { 
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }
        ]}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <View style={[styles.accentBar, { backgroundColor: accentColor }]} />

        <View style={styles.contentContainer}>
          <View style={styles.headerColumn}>
            
            <View style={styles.dateContainer}>
              <Ionicons name="calendar-clear-outline" size={12} color={colors.textSecondary} style={{ marginRight: 6 }} />
              <Text style={[styles.dateText, { color: colors.textSecondary }]}>
                {formatDate(event.date)}
              </Text>
            </View>

            {event.category && (
              <View style={[styles.categoryBadge, { backgroundColor: accentColor + '15', borderColor: accentColor + '30' }]}>
                <Text style={[styles.categoryText, { color: accentColor }]}>
                  {event.category.toUpperCase()}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.body}>
            <Text style={[styles.title, { color: colors.text }]}>
              {event.title}
            </Text>
            
            {event.description && (
              <Text 
                style={[styles.description, { color: colors.textSecondary }]} 
                numberOfLines={2}
              >
                {event.description}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.iconContainer}>
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary + '60'} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  timelineContainer: {
    flexDirection: 'row',
    marginHorizontal: Spacing.md,
    marginVertical: 8,
  },
  timelineColumn: {
    width: 40,
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#fff',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: 4,
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    minHeight: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  accentBar: {
    width: 5,
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: 'center',
  },
  headerColumn: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  body: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  description: {
    fontSize: 13,
    lineHeight: 19,
    opacity: 0.8,
  },
  iconContainer: {
    justifyContent: 'center',
    paddingRight: Spacing.md,
    paddingLeft: Spacing.xs,
  },
});