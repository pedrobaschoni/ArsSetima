import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Dimensions,
  Pressable,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/ThemeContext';
import { Colors, Spacing, BorderRadius, Shadows } from '../utils/theme';
import { databaseService } from '../database/migrations';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - Spacing.xl * 2 - Spacing.md) / 2;

// --- Componentes ---

const ModernHeader = ({
  title,
  subtitle,
  onSettingsPress,
  colors,
  searchQuery,
  setSearchQuery,
}: {
  title: string;
  subtitle: string;
  onSettingsPress: () => void;
  colors: any;
  searchQuery: string;
  setSearchQuery: (text: string) => void;
}) => (
  <View style={[styles.header, { backgroundColor: colors.surface }]}>
    <View style={styles.headerTopRow}>
      <View>
        <Text style={[styles.appName, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.greeting, { color: colors.textSecondary }]}>{subtitle}</Text>
      </View>
      <TouchableOpacity
        style={[styles.settingsButton, { backgroundColor: colors.surfaceVariant }]}
        onPress={onSettingsPress}
        activeOpacity={0.8}
      >
        <Ionicons name="settings-outline" size={24} color={colors.text} />
      </TouchableOpacity>
    </View>

    <View style={[styles.searchContainer, { backgroundColor: colors.background }]}>
      <Ionicons
        name="search"
        size={20}
        color={colors.textSecondary}
        style={{ marginLeft: 10 }}
      />
      <TextInput
        placeholder="Buscar no universo..."
        placeholderTextColor={colors.textSecondary}
        style={[styles.searchInput, { color: colors.text }]}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity onPress={() => setSearchQuery('')}>
          <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

const StatCard = ({ title, count, icon, onPress, color, colors }: any) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.cardHeader}>
        <View
          style={[styles.iconContainer, { backgroundColor: color + '15' }]}
        >
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <Ionicons
          name="arrow-forward"
          size={16}
          color={colors.textSecondary}
          style={{ opacity: 0.5 }}
        />
      </View>

      <View style={styles.cardContent}>
        <Text style={[styles.cardCount, { color: colors.text }]}>
          {count !== null ? count : '-'}
        </Text>
        <Text style={[styles.cardTitle, { color: colors.textSecondary }]}>
          {title}
        </Text>
      </View>
    </Pressable>
  );
};

// --- Tela Principal ---

export default function HomeScreen({ navigation }: any) {
  const { colors, theme } = useTheme();
  const [stats, setStats] = useState({
    characters: 0,
    locations: 0,
    events: 0,
    notes: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [])
  );

  const loadStats = async () => {
    try {
      const [characters, locations, events, notes] = await Promise.all([
        databaseService.getAll('characters'),
        databaseService.getAll('locations'),
        databaseService.getAll('events'),
        databaseService.getAll('notes'),
      ]);

      setStats({
        characters: characters.length,
        locations: locations.length,
        events: events.length,
        notes: notes.length,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.surface} 
      />

      <ModernHeader
        title="ArsSétima"
        subtitle="O Preço do Sétimo Poder"
        onSettingsPress={() => navigation.navigate('Settings')}
        colors={colors}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
      >
        <View style={styles.sectionLabel}>
          <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
            DASHBOARD
          </Text>
        </View>

        <View style={styles.grid}>
          <StatCard
            title="Personagens"
            count={stats.characters}
            icon="people"
            color={Colors.primary}
            colors={colors}
            // CORREÇÃO AQUI: Mudado de 'Encyclopedia' para 'EncyclopediaTab'
            onPress={() =>
              navigation.navigate('EncyclopediaTab', { screen: 'Characters' })
            }
          />
          <StatCard
            title="Locais"
            count={stats.locations}
            icon="map"
            color={Colors.secondary}
            colors={colors}
            // CORREÇÃO AQUI: Mudado de 'Encyclopedia' para 'EncyclopediaTab'
            onPress={() =>
              navigation.navigate('EncyclopediaTab', { screen: 'Locations' })
            }
          />
          <StatCard
            title="Linha do Tempo"
            count={stats.events}
            icon="hourglass"
            color={Colors.accent}
            colors={colors}
            onPress={() => navigation.navigate('Timeline')}
          />
          <StatCard
            title="Notas Rápidas"
            count={stats.notes}
            icon="document-text"
            color="#10b981"
            colors={colors}
            onPress={() => navigation.navigate('Notes')}
          />
        </View>

        <View style={styles.marginTop}>
          <Pressable
            style={({ pressed }) => [
              styles.actionBanner,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
            ]}
            onPress={() => navigation.navigate('Writing')}
          >
            <View
              style={[
                styles.actionIconParams,
                { backgroundColor: Colors.primary + '15' },
              ]}
            >
              <Ionicons name="create" size={28} color={Colors.primary} />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={[styles.actionTitle, { color: colors.text }]}>
                Continuar Escrevendo
              </Text>
              <Text
                style={[styles.actionSubtitle, { color: colors.textSecondary }]}
              >
                Acesse o editor de capítulos
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textSecondary}
            />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    zIndex: 1,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  greeting: {
    fontSize: 14,
    marginTop: 2,
    fontWeight: '500',
  },
  settingsButton: {
    padding: 8,
    borderRadius: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    alignItems: 'center',
    height: 50,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    marginLeft: 10,
    fontSize: 16,
  },
  scrollContent: {
    padding: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  sectionLabel: {
    marginBottom: Spacing.md,
    marginTop: Spacing.xs,
  },
  sectionText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    justifyContent: 'space-between',
  },
  card: {
    width: CARD_WIDTH,
    height: 150,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    marginTop: Spacing.sm,
  },
  cardCount: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '500',
    marginTop: 2,
  },
  marginTop: {
    marginTop: Spacing.lg,
  },
  actionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    ...Shadows.sm,
  },
  actionIconParams: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 14,
  },
});