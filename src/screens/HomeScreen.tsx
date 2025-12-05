import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Dimensions,
  Alert,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { useTheme } from '../utils/ThemeContext';
import { Colors, Spacing, BorderRadius, Shadows } from '../utils/theme';
import { databaseService } from '../database/migrations';

const { width } = Dimensions.get('window');

// --- Interfaces ---
interface DashboardStats {
  characters: number;
  locations: number;
  timeline: number;
  notes: number;
}

interface BookProgress {
  chaptersCompleted: number;
  totalWords: number;
  targetWords: number;
}

type SearchType = 'character' | 'location' | 'note' | 'event';

interface SearchEntry {
  id: string;
  title: string;
  subtitle?: string;
  type: SearchType;
  content?: string;
  payload: any;
}

const PROGRESS_STORAGE_KEY = '@arssetima:bookProgress';

// --- Componentes Auxiliares ---

// 1. Header Imersivo COM Busca Integrada
const HeaderWithSearch = ({ onSettingsPress, colors, searchQuery, onSearchChange }: any) => (
  <View style={styles.headerContainer}>
    <LinearGradient
      colors={[Colors.primary, '#4c1d95']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.headerGradient}
    >
      {/* Conteúdo do Topo (Título e Config) */}
      <View style={styles.headerContent}>
        <View>
          <Text style={styles.headerTitle}>ArsSétima</Text>
          <Text style={styles.headerSubtitle}>O Preço do Sétimo Poder</Text>
        </View>
        <TouchableOpacity 
          style={styles.settingsButton} 
          onPress={onSettingsPress}
          activeOpacity={0.8}
        >
          <Ionicons name="settings-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Barra de Busca (DENTRO do gradiente) */}
      <View style={styles.searchBarHeaderWrapper}>
        <View style={[styles.searchBar, { backgroundColor: colors.surface, shadowColor: colors.text }]}> 
          <Ionicons name="search" size={20} color={colors.textSecondary} style={{ marginRight: 10 }} />
          <TextInput
            style={[styles.searchTextInput, { color: colors.text }]}
            placeholder="Buscar personagens, locais, notas..."
            placeholderTextColor={colors.textSecondary + '99'}
            value={searchQuery}
            onChangeText={onSearchChange}
            returnKeyType="search"
          />
        </View>
      </View>
      
      {/* Ilustração de fundo */}
      <Ionicons 
        name="book" 
        size={180} 
        color="rgba(255,255,255,0.05)" 
        style={styles.headerBgIcon} 
      />
    </LinearGradient>
  </View>
);

const DashboardCard = ({ title, count, icon, color, onPress, colors }: any) => (
  <TouchableOpacity
    style={[styles.dashCard, { backgroundColor: colors.surface }]}
    onPress={onPress}
    activeOpacity={0.9}
  >
    <View style={[styles.dashIconBubble, { backgroundColor: color + '15' }]}>
      <Ionicons name={icon} size={28} color={color} />
    </View>
    <View style={styles.dashContent}>
      <Text style={[styles.dashCount, { color: colors.text }]}>{count}</Text>
      <Text style={[styles.dashTitle, { color: colors.textSecondary }]}>{title}</Text>
    </View>
    <Ionicons name={icon} size={80} color={color + '08'} style={styles.dashBgIcon} />
  </TouchableOpacity>
);

const ProgressSection = ({ 
  progress, 
  colors,
  isEditing,
  form,
  onChangeField,
  onSave,
  onCancel,
  onToggleEdit,
}: { 
  progress: BookProgress, 
  colors: any,
  isEditing: boolean,
  form: { chaptersCompleted: string; totalWords: string; targetWords: string; },
  onChangeField: (key: keyof BookProgress, value: string) => void,
  onSave: () => void,
  onCancel: () => void,
  onToggleEdit: () => void,
}) => {
  const percentage = Math.min((progress.totalWords / progress.targetWords) * 100, 100);
  
  return (
    <View style={[styles.sectionContainer, { backgroundColor: colors.surface }]}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Progresso do Livro</Text>
        <TouchableOpacity onPress={onToggleEdit} activeOpacity={0.8}>
          <Ionicons name={isEditing ? 'close' : 'create-outline'} size={20} color={Colors.accent} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.progressRow}>
        <View style={styles.progressItem}>
          <Text style={[styles.progressValue, { color: colors.text }]}>{progress.chaptersCompleted}</Text>
          <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>Capítulos</Text>
        </View>
        <View style={styles.progressDivider} />
        <View style={styles.progressItem}>
          <Text style={[styles.progressValue, { color: colors.text }]}>{progress.totalWords}</Text>
          <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>Palavras</Text>
        </View>
      </View>

      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
      </View>
      <Text style={[styles.progressMeta, { color: colors.textSecondary }]}>
        {percentage.toFixed(1)}% da meta de {progress.targetWords.toLocaleString()} palavras
      </Text>

      {isEditing && (
        <View style={styles.progressEditBox}>
          <View style={styles.progressInputRow}>
            <View style={styles.progressInputGroup}>
              <Text style={[styles.progressInputLabel, { color: colors.textSecondary }]}>Capítulos</Text>
              <TextInput
                style={[styles.progressInput, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
                keyboardType="numeric"
                value={form.chaptersCompleted}
                onChangeText={(t) => onChangeField('chaptersCompleted', t)}
              />
            </View>
            <View style={styles.progressInputGroup}>
              <Text style={[styles.progressInputLabel, { color: colors.textSecondary }]}>Palavras</Text>
              <TextInput
                style={[styles.progressInput, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
                keyboardType="numeric"
                value={form.totalWords}
                onChangeText={(t) => onChangeField('totalWords', t)}
              />
            </View>
          </View>
          <View style={styles.progressInputRow}>
            <View style={[styles.progressInputGroup, { flex: 1 }]}> 
              <Text style={[styles.progressInputLabel, { color: colors.textSecondary }]}>Meta de Palavras</Text>
              <TextInput
                style={[styles.progressInput, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
                keyboardType="numeric"
                value={form.targetWords}
                onChangeText={(t) => onChangeField('targetWords', t)}
              />
            </View>
          </View>
          <View style={styles.progressActions}>
            <TouchableOpacity style={[styles.progressButton, { borderColor: colors.border }]} onPress={onCancel}>
              <Text style={[styles.progressButtonText, { color: colors.textSecondary }]}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.progressButtonPrimary, { backgroundColor: Colors.primary }]} onPress={onSave}>
              <Text style={styles.progressButtonPrimaryText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

// --- TELA PRINCIPAL ---

export default function HomeScreen({ navigation }: any) {
  const { colors, theme, fontMultiplier } = useTheme();
  const [stats, setStats] = useState<DashboardStats>({ characters: 0, locations: 0, timeline: 0, notes: 0 });
  const [progress, setProgress] = useState<BookProgress>({ chaptersCompleted: 0, totalWords: 0, targetWords: 60000 });
  const [isEditingProgress, setIsEditingProgress] = useState(false);
  const [progressForm, setProgressForm] = useState({
    chaptersCompleted: '0',
    totalWords: '0',
    targetWords: '60000',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchEntry[]>([]);
  const [searchIndex, setSearchIndex] = useState<SearchEntry[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [recents, setRecents] = useState<any[]>([]);

  const handleChangeProgressField = (key: keyof BookProgress, value: string) => {
    setProgressForm(prev => ({ ...prev, [key]: value }));
  };

  const handleToggleEdit = () => {
    if (isEditingProgress) {
      // Cancelar: voltar para os valores atuais
      setProgressForm({
        chaptersCompleted: progress.chaptersCompleted.toString(),
        totalWords: progress.totalWords.toString(),
        targetWords: progress.targetWords.toString(),
      });
      setIsEditingProgress(false);
    } else {
      setIsEditingProgress(true);
    }
  };

  const handleSaveProgress = () => {
    const chapters = parseInt(progressForm.chaptersCompleted || '0', 10) || 0;
    const words = parseInt(progressForm.totalWords || '0', 10) || 0;
    const target = parseInt(progressForm.targetWords || '0', 10) || 1;

    const normalized: BookProgress = {
      chaptersCompleted: Math.max(chapters, 0),
      totalWords: Math.max(words, 0),
      targetWords: Math.max(target, 1),
    };

    setProgress(normalized);
    setProgressForm({
      chaptersCompleted: normalized.chaptersCompleted.toString(),
      totalWords: normalized.totalWords.toString(),
      targetWords: normalized.targetWords.toString(),
    });

    AsyncStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(normalized)).catch((e) => {
      console.warn('Falha ao salvar progresso:', e);
    });

    setIsEditingProgress(false);
  };

  const handleSearch = (query: string) => {
    const value = query.trim();
    setSearchQuery(query);

    if (!value) {
      setSearchResults([]);
      return;
    }

    const normalized = value.toLowerCase();
    const filtered = searchIndex.filter((entry) => {
      const inTitle = entry.title?.toLowerCase().includes(normalized);
      const inContent = entry.content?.toLowerCase().includes(normalized);
      return inTitle || inContent;
    }).slice(0, 12);

    setSearchResults(filtered);
  };

  const handleSelectResult = (entry: SearchEntry) => {
    setSearchResults([]);
    setSearchQuery(entry.title);

    switch (entry.type) {
      case 'character':
        navigation.navigate('EncyclopediaTab', {
          screen: 'Characters',
          params: {
            screen: 'CharacterDetail',
            params: { character: entry.payload },
          },
        });
        break;
      case 'location':
        navigation.navigate('EncyclopediaTab', {
          screen: 'Locations',
          params: {
            screen: 'LocationDetail',
            params: { location: entry.payload },
          },
        });
        break;
      case 'note':
        navigation.navigate('EntityDetail', { entityType: 'note', data: entry.payload });
        break;
      case 'event':
        navigation.navigate('EntityDetail', { entityType: 'event', data: entry.payload });
        break;
      default:
        break;
    }
  };

  const loadData = async () => {
    try {
      const [chars, locs, events, notes, chapters, spells, items, creatures, factions, curiosities] = await Promise.all([
        databaseService.getAll('characters'),
        databaseService.getAll('locations'),
        databaseService.getAll('events'),
        databaseService.getAll('notes'),
        databaseService.getAll('chapters'),
        databaseService.getAll('spells'),
        databaseService.getAll('items'),
        databaseService.getAll('creatures'),
        databaseService.getAll('factions'),
        databaseService.getAll('curiosities'),
      ]);

      setStats({
        characters: chars.length,
        locations: locs.length,
        timeline: events.length,
        notes: notes.length,
      });

      // Coleta todos os itens com data de criação
      const allItems = [
        ...chars.map((c: any) => ({ ...c, type: 'character', typeName: 'Personagem' })),
        ...locs.map((l: any) => ({ ...l, type: 'location', typeName: 'Local' })),
        ...events.map((e: any) => ({ ...e, type: 'event', typeName: 'Evento' })),
        ...notes.map((n: any) => ({ ...n, type: 'note', typeName: 'Nota' })),
        ...spells.map((s: any) => ({ ...s, type: 'spell', typeName: 'Magia' })),
        ...items.map((i: any) => ({ ...i, type: 'item', typeName: 'Item' })),
        ...creatures.map((c: any) => ({ ...c, type: 'creature', typeName: 'Criatura' })),
        ...factions.map((f: any) => ({ ...f, type: 'faction', typeName: 'Facção' })),
        ...curiosities.map((c: any) => ({ ...c, type: 'curiosity', typeName: 'Curiosidade' })),
      ];

      // Ordena por data de criação (mais recentes primeiro)
      const sorted = allItems.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      });

      // Pega os 2 últimos
      setRecents(sorted.slice(0, 2));

      const totalWords = (chapters as any[]).reduce((acc, curr) => acc + (curr.wordCount || 0), 0);
      const computedProgress: BookProgress = {
        chaptersCompleted: chapters.length,
        totalWords: totalWords > 0 ? totalWords : 12500,
        targetWords: 80000,
      };

      // Tenta carregar progresso salvo; se não houver, usa o calculado
      let stored: BookProgress | null = null;
      try {
        const saved = await AsyncStorage.getItem(PROGRESS_STORAGE_KEY);
        if (saved) stored = JSON.parse(saved);
      } catch (e) {
        console.warn('Não foi possível ler progresso salvo:', e);
      }

      const finalProgress = stored || computedProgress;

      setProgress(finalProgress);
      setProgressForm({
        chaptersCompleted: finalProgress.chaptersCompleted.toString(),
        totalWords: finalProgress.totalWords.toString(),
        targetWords: finalProgress.targetWords.toString(),
      });

      // Monta índice de busca (título + descrição/conteúdo quando existir)
      const builtIndex: SearchEntry[] = [
        ...chars.map((c: any) => ({ id: c.id, title: c.name, subtitle: 'Personagem', type: 'character' as const, payload: c })),
        ...locs.map((l: any) => ({ id: l.id, title: l.name, subtitle: 'Local', type: 'location' as const, payload: l })),
        ...notes.map((n: any) => ({ id: n.id, title: n.title, subtitle: 'Nota', type: 'note' as const, payload: n, content: n.content })),
        ...events.map((e: any) => ({ id: e.id, title: e.title || 'Evento', subtitle: 'Evento', type: 'event' as const, payload: e, content: e.description })),
      ];
      setSearchIndex(builtIndex);

    } catch (error) {
      console.error('Erro ao carregar home:', error);
    }
  };

  const formatRecentDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Agora';
      if (diffMins < 60) return `${diffMins}min atrás`;
      if (diffHours < 24) return `${diffHours}h atrás`;
      if (diffDays < 7) return `${diffDays}d atrás`;
      
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return 'Recentemente';
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header agora contém a busca */}
        <HeaderWithSearch 
          onSettingsPress={() => navigation.navigate('Settings')} 
          colors={colors}
          searchQuery={searchQuery}
          onSearchChange={handleSearch}
        />

        <View style={styles.body}>

          {searchResults.length > 0 && (
            <View style={styles.searchResultsBox}>
              {searchResults.map((res) => (
                <TouchableOpacity
                  key={`${res.type}-${res.id}`}
                  style={[styles.searchResultItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  onPress={() => handleSelectResult(res)}
                >
                  <View style={[styles.searchResultIcon, { backgroundColor: colors.surfaceVariant }]}>
                    <Ionicons name="search" size={16} color={colors.textSecondary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.searchResultTitle, { color: colors.text }]} numberOfLines={1}>{res.title}</Text>
                    <Text style={[styles.searchResultSubtitle, { color: colors.textSecondary }]} numberOfLines={1}>{res.subtitle}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.sectionLabelContainer}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>DASHBOARD</Text>
          </View>
          
          <View style={styles.dashboardGrid}>
            <DashboardCard 
              title="Personagens" count={stats.characters} icon="people" color={Colors.primary} colors={colors} 
              onPress={() => {
                navigation.navigate('EncyclopediaTab', { 
                  screen: 'Characters',
                  initial: false 
                });
              }} 
            />
            <DashboardCard 
              title="Locais" count={stats.locations} icon="map" color={Colors.secondary} colors={colors} 
              onPress={() => {
                navigation.navigate('EncyclopediaTab', { 
                  screen: 'Locations',
                  initial: false 
                });
              }}
            />
            <DashboardCard 
              title="Timeline" count={stats.timeline} icon="hourglass" color={Colors.accent} colors={colors} 
              onPress={() => navigation.navigate('Timeline')}
            />
            <DashboardCard 
              title="Notas" count={stats.notes} icon="document-text" color="#10b981" colors={colors} 
              onPress={() => navigation.navigate('Notes')}
            />
          </View>

          <ProgressSection 
            progress={progress} 
            colors={colors}
            isEditing={isEditingProgress}
            form={progressForm}
            onChangeField={handleChangeProgressField}
            onSave={handleSaveProgress}
            onCancel={handleToggleEdit}
            onToggleEdit={handleToggleEdit}
          />

          <TouchableOpacity 
            style={[styles.writeCard, { backgroundColor: colors.surface }]}
            onPress={() => navigation.navigate('EntityForm', { entityType: 'note' })}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={[Colors.primary, '#8b5cf6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.writeIconBox}
            >
              <Ionicons name="pencil" size={24} color="#fff" />
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={[styles.writeTitle, { color: colors.text }]}>Escrever Nova Nota</Text>
              <Text style={[styles.writeSub, { color: colors.textSecondary }]}>Capture uma ideia rápida...</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          {recents.length > 0 && (
            <View style={styles.recentsSection}>
              <View style={styles.sectionLabelContainer}>
                <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>RECENTES</Text>
              </View>
              
              {recents.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.recentItem, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}
                  activeOpacity={0.7}
                  onPress={() => {
                    // Navigate based on type
                    const title = item.name || item.title;
                    switch (item.type) {
                      case 'character':
                        navigation.navigate('EncyclopediaTab', {
                          screen: 'Characters',
                          params: {
                            screen: 'CharacterDetail',
                            params: { character: item },
                          },
                        });
                        break;
                      case 'location':
                        navigation.navigate('EncyclopediaTab', {
                          screen: 'Locations',
                          params: {
                            screen: 'LocationDetail',
                            params: { location: item },
                          },
                        });
                        break;
                      default:
                        navigation.navigate('EntityDetail', { entityType: item.type, data: item });
                        break;
                    }
                  }}
                >
                  <View style={[styles.recentIcon, { backgroundColor: colors.surfaceVariant }]}>
                    <Ionicons name="time" size={16} color={colors.textSecondary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.recentTitle, { color: colors.text }]} numberOfLines={1}>
                      {item.name || item.title}
                    </Text>
                    <Text style={[styles.recentMeta, { color: colors.textSecondary }]} numberOfLines={1}>
                      {item.typeName} • {formatRecentDate(item.createdAt)}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              ))}
            </View>
          )}

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    paddingBottom: 40,
  },
  headerContainer: {
    height: 280, 
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
    marginBottom: 20,
  },
  headerGradient: {
    flex: 1,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 60,
    paddingHorizontal: Spacing.xl,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 2,
    marginBottom: 20,
  },
  searchBarHeaderWrapper: {
    zIndex: 10,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  settingsButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
  },
  headerBgIcon: {
    position: 'absolute',
    bottom: -20,
    right: -20,
    transform: [{ rotate: '-15deg' }],
    zIndex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderRadius: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  searchText: {
    fontSize: 15,
    fontWeight: '500',
  },
  searchTextInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  sectionLabelContainer: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  searchResultsBox: {
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
    borderRadius: 16,
    overflow: 'hidden',
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderWidth: 1,
    borderTopWidth: 0,
  },
  searchResultIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  searchResultTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  searchResultSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  dashboardScroll: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  dashboardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.xl,
    justifyContent: 'space-between',
    paddingBottom: Spacing.md,
  },
  dashCard: {
    width: '48%',
    height: 110,
    borderRadius: 24,
    padding: Spacing.md,
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  dashIconBubble: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dashContent: {
    zIndex: 2,
  },
  dashCount: {
    fontSize: 22,
    fontWeight: '800',
  },
  dashTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  dashBgIcon: {
    position: 'absolute',
    bottom: -15,
    right: -15,
    zIndex: 1,
  },
  sectionContainer: {
    marginHorizontal: Spacing.xl,
    padding: Spacing.lg,
    borderRadius: 24,
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  progressItem: {
    alignItems: 'center',
  },
  progressValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  progressDivider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(150,150,150,0.2)',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(150,150,150,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 4,
  },
  progressMeta: {
    fontSize: 11,
    textAlign: 'center',
  },
  progressEditBox: {
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  progressInputRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  progressInputGroup: {
    flex: 1,
  },
  progressInputLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  progressInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  progressActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  progressButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  progressButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressButtonPrimary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  progressButtonPrimaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  writeCard: {
    marginHorizontal: Spacing.xl,
    padding: Spacing.md,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(150,150,150,0.1)',
  },
  writeIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  writeTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  writeSub: {
    fontSize: 13,
  },
  recentsSection: {
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: 16,
    marginBottom: Spacing.sm,
    borderBottomWidth: 1,
  },
  recentIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  recentTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  recentMeta: {
    fontSize: 12,
    fontWeight: '400',
  },
});