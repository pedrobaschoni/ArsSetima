import React, { useState, useCallback, useLayoutEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Button } from '../components/Button';
import { useTheme } from '../utils/ThemeContext';
import { Spacing, BorderRadius, Colors, Shadows } from '../utils/theme';
import { pdfService } from '../services/pdfService';
import { databaseService } from '../database/migrations';
import { parseList } from '../utils/helpers';

export default function CharacterDetailScreen({ route, navigation }: any) {
  const { colors } = useTheme();
  const { character: initialCharacter } = route.params;
  
  const [character, setCharacter] = useState(initialCharacter);
  const [loading, setLoading] = useState(false);

  const THEME_COLOR = Colors.primary;
  const THEME_ICON = 'person';

  const handleDelete = async () => {
    Alert.alert(
      'Excluir Personagem',
      `Tem certeza que deseja excluir "${character.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await databaseService.delete('characters', character.id);
              navigation.goBack();
            } catch (error) {
              console.error(error);
              Alert.alert('Erro', 'Não foi possível excluir o item.');
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerTransparent: true,
      headerTintColor: '#fff',
      headerRight: () => (
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            onPress={handleDelete} 
            style={[styles.iconButton, { backgroundColor: 'rgba(239, 68, 68, 0.8)' }]}
          >
            <Ionicons name="trash-outline" size={20} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => navigation.navigate('EntityForm', { 
              entityType: 'character', 
              editData: character 
            })} 
            style={[styles.iconButton, { backgroundColor: 'rgba(0,0,0,0.3)' }]}
          >
            <Ionicons name="create-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, character]);

  useFocusEffect(
    useCallback(() => {
      const loadFreshData = async () => {
        const freshData = await databaseService.getById<any>('characters', initialCharacter.id);
        if (freshData) {
          let parsedNotes = freshData.notes;
          try {
             const json = JSON.parse(freshData.notes);
             if (Array.isArray(json)) parsedNotes = json;
          } catch {}

          const formatted = {
            ...freshData,
            powers: parseList(freshData.powers),
            tags: parseList(freshData.tags),
            relations: parseList(freshData.relations),
            notes: parsedNotes,
          };
          setCharacter(formatted);
        }
      };
      loadFreshData();
    }, [initialCharacter.id])
  );

  const handleExportPDF = async () => {
    try {
      await pdfService.generateCharacterPDF(character);
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  };

  const StatBadge = ({ icon, label, value }: any) => (
    <View style={[styles.statBadge, { backgroundColor: THEME_COLOR + '15', borderColor: THEME_COLOR + '30' }]}>
      <Ionicons name={icon} size={16} color={THEME_COLOR} style={{ marginRight: 6 }} />
      <View>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
        <Text style={[styles.statValue, { color: THEME_COLOR }]}>{value}</Text>
      </View>
    </View>
  );

  const powersList = Array.isArray(character.powers) ? character.powers : parseList(character.powers || '');
  const notesList = Array.isArray(character.notes) ? character.notes : parseList(character.notes || '');

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={THEME_COLOR} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        <View style={styles.headerContainer}>
          {character.imageUri ? (
            <Image source={{ uri: character.imageUri }} style={styles.headerImage} />
          ) : (
            <View style={[styles.headerPlaceholder, { backgroundColor: THEME_COLOR }]}>
              <Ionicons name={THEME_ICON} size={80} color="rgba(255,255,255,0.3)" />
            </View>
          )}
          
          <LinearGradient
            colors={['transparent', colors.background]}
            style={styles.gradientOverlay}
          />

          <View style={styles.titleContainer}>
            <View style={[styles.iconBubble, { backgroundColor: THEME_COLOR }]}>
              <Ionicons name={THEME_ICON} size={32} color="#fff" />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>{character.name}</Text>
            <Text style={[styles.subtitle, { color: THEME_COLOR }]}>Personagem</Text>
          </View>
        </View>

        <View style={styles.content}>
          
          <View style={styles.statsGrid}>
            {character.age && (
              <StatBadge icon="calendar" label="Idade" value={`${character.age} anos`} />
            )}
            {powersList && powersList.length > 0 && (
              <StatBadge icon="flash" label="Poderes" value={powersList.length} />
            )}
          </View>

          {character.appearance && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="eye" size={20} color={THEME_COLOR} style={{ marginRight: 8 }} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Aparência</Text>
              </View>
              <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>
                {character.appearance}
              </Text>
            </View>
          )}

          {powersList && powersList.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="flash" size={20} color={THEME_COLOR} style={{ marginRight: 8 }} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Poderes & Habilidades</Text>
              </View>
              <View style={styles.tagsContainer}>
                {powersList.map((power: string, index: number) => (
                  <View 
                    key={index} 
                    style={[styles.tag, { backgroundColor: colors.surface, borderColor: THEME_COLOR + '40' }]}
                  >
                    <Text style={[styles.tagText, { color: colors.text }]}>{power}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {character.goals && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="trophy" size={20} color={THEME_COLOR} style={{ marginRight: 8 }} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Objetivos</Text>
              </View>
              <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>
                {character.goals}
              </Text>
            </View>
          )}

          {notesList && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="document-text" size={20} color={THEME_COLOR} style={{ marginRight: 8 }} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Notas</Text>
              </View>
              
              {Array.isArray(notesList) && notesList.length > 0 ? (
                <View style={{ gap: 8 }}>
                  {notesList.map((note: string, index: number) => (
                    <View key={index} style={[styles.noteBox, { backgroundColor: colors.surface, borderColor: THEME_COLOR + '30' }]}>
                      <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>{note}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>
                  {typeof character.notes === 'string' ? character.notes : 'Nenhuma nota adicionada.'}
                </Text>
              )}
            </View>
          )}

          <View style={styles.footer}>
            <Button
              title="Exportar PDF"
              icon="document"
              onPress={handleExportPDF}
              variant="outline"
              fullWidth
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerButtons: {
    flexDirection: 'row',
    marginRight: 10,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    marginLeft: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    height: 300,
    width: '100%',
    position: 'relative',
    justifyContent: 'flex-end',
  },
  headerImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  headerPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 150,
  },
  titleContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    alignItems: 'center',
  },
  iconBubble: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    ...Shadows.md,
    borderWidth: 4,
    borderColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  content: {
    padding: Spacing.lg,
    marginTop: -20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: Spacing.xl,
    justifyContent: 'center',
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: '40%',
  },
  statLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 0,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 26,
    letterSpacing: 0.3,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  tagText: {
    fontWeight: '600',
    fontSize: 14,
  },
  noteBox: {
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
  },
  footer: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xxl,
  },
});