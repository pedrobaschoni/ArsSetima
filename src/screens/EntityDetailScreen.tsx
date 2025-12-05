import React, { useState, useCallback, useLayoutEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Dimensions,
  Alert,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Button } from '../components/Button';
import { useTheme } from '../utils/ThemeContext';
import { Spacing, Colors, BorderRadius, Shadows } from '../utils/theme';
import { pdfService } from '../services/pdfService';
import { databaseService } from '../database/migrations';
import { parseList } from '../utils/helpers';

const { width } = Dimensions.get('window');

// Configuração de Cores e Ícones
const ENTITY_THEME: any = {
  spell: { color: '#ef4444', icon: 'flame', label: 'Magia' },
  item: { color: '#3b82f6', icon: 'cube', label: 'Item' },
  creature: { color: '#10b981', icon: 'paw', label: 'Criatura' },
  faction: { color: '#f59e0b', icon: 'flag', label: 'Facção' },
  location: { color: Colors.secondary, icon: 'location', label: 'Local' },
  // ADICIONADO: Tema para Eventos
  event: { color: Colors.accent, icon: 'time', label: 'Evento' },
};

const VIEW_CONFIG: any = {
  spell: {
    table: 'spells',
    stats: [
      { key: 'type', label: 'Tipo', icon: 'prism' },
      { key: 'level', label: 'Nível', icon: 'layers' },
    ],
    sections: [
      { key: 'requirements', label: 'Requisitos', icon: 'hand-left' },
      { key: 'effects', label: 'Efeitos', type: 'list', icon: 'flash' },
    ]
  },
  item: {
    table: 'items',
    stats: [
      { key: 'type', label: 'Tipo', icon: 'construct' },
      { key: 'rarity', label: 'Raridade', icon: 'diamond' },
    ],
    sections: [
      { key: 'powers', label: 'Poderes & Efeitos', type: 'list', icon: 'star' },
    ]
  },
  creature: {
    table: 'creatures',
    stats: [
      { key: 'species', label: 'Espécie', icon: 'dna' },
      { key: 'dangerLevel', label: 'Perigo', icon: 'warning' },
    ],
    sections: [
      { key: 'habitat', label: 'Habitat', icon: 'leaf' },
      { key: 'abilities', label: 'Habilidades', type: 'list', icon: 'flash' },
    ]
  },
  faction: {
    table: 'factions',
    stats: [
      { key: 'alignment', label: 'Alinhamento', icon: 'compass' },
    ],
    sections: [
      { key: 'goals', label: 'Objetivos', icon: 'telescope' },
    ]
  },
  // ADICIONADO: Configuração para Eventos
  event: {
    table: 'events',
    stats: [
      { key: 'date', label: 'Data', icon: 'calendar' },
      { key: 'importance', label: 'Importância', icon: 'alert-circle' },
    ],
    sections: [
      { key: 'category', label: 'Categoria', icon: 'pricetag' },
      { key: 'description', label: 'Descrição', icon: 'document-text' },
    ]
  }
};

export default function EntityDetailScreen({ route, navigation }: any) {
  const { colors } = useTheme();
  
  const params = route.params || {};
  const { entityType, data: initialData } = params;

  if (!entityType || !initialData) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Erro ao carregar detalhes.</Text>
        <Button title="Voltar" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const config = VIEW_CONFIG[entityType];
  let initialTheme = ENTITY_THEME[entityType] || { color: Colors.primary, icon: 'document' };
  
  // Se for evento, ajusta a cor baseado na importância
  if (entityType === 'event' && initialData.importance) {
    switch (initialData.importance) {
      case 'high':
        initialTheme = { ...initialTheme, color: '#ef4444' }; // Vermelho
        break;
      case 'medium':
        initialTheme = { ...initialTheme, color: '#f59e0b' }; // Laranja/Âmbar
        break;
      case 'low':
        initialTheme = { ...initialTheme, color: '#10b981' }; // Verde
        break;
    }
  }
  
  const [data, setData] = useState(initialData);
  const [theme, setTheme] = useState(initialTheme);
  const [loading, setLoading] = useState(false);

  // --- LÓGICA DE EXCLUSÃO ---
  const handleDelete = async () => {
    Alert.alert(
      'Excluir Item',
      `Tem certeza que deseja excluir "${data.name || data.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await databaseService.delete(config.table, data.id);
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
            onPress={() => navigation.navigate('EntityForm', { entityType, editData: data })} 
            style={[styles.iconButton, { backgroundColor: 'rgba(0,0,0,0.3)' }]}
          >
            <Ionicons name="create-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, data, entityType]);

  useFocusEffect(
    useCallback(() => {
      const loadFreshData = async () => {
        if (!config) return;
        const freshData = await databaseService.getById<any>(config.table, initialData.id);
        if (freshData) {
          const formatted = { ...freshData };
          ['effects', 'powers', 'abilities'].forEach(key => {
             if (freshData[key]) formatted[key] = parseList(freshData[key]);
          });
          setData(formatted);
          
          // Atualiza o tema se for evento
          if (entityType === 'event' && freshData.importance) {
            let newTheme = ENTITY_THEME[entityType];
            switch (freshData.importance) {
              case 'high':
                newTheme = { ...newTheme, color: '#ef4444' }; // Vermelho
                break;
              case 'medium':
                newTheme = { ...newTheme, color: '#f59e0b' }; // Laranja/Âmbar
                break;
              case 'low':
                newTheme = { ...newTheme, color: '#10b981' }; // Verde
                break;
            }
            setTheme(newTheme);
          }
        }
      };
      loadFreshData();
    }, [initialData.id])
  );

  const handleExportPDF = async () => {
    let content = `<h1>${data.name || data.title}</h1><hr/>`;
    content += `<p><strong>Descrição:</strong> ${data.description}</p>`;
    await pdfService.generateCustomPDF(data.name || data.title, content, `${data.name || data.title}.pdf`);
  };

  const StatBadge = ({ icon, label, value }: any) => {
    if (!value) return null;
    return (
      <View style={[styles.statBadge, { backgroundColor: theme.color + '15', borderColor: theme.color + '30' }]}>
        <Ionicons name={icon} size={16} color={theme.color} style={{ marginRight: 6 }} />
        <View>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
          <Text style={[styles.statValue, { color: theme.color }]}>{value}</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={theme.color} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        <View style={styles.headerContainer}>
          {data.imageUri ? (
            <Image source={{ uri: data.imageUri }} style={styles.headerImage} />
          ) : (
            <View style={[styles.headerPlaceholder, { backgroundColor: theme.color }]}>
              <Ionicons name={theme.icon} size={80} color="rgba(255,255,255,0.3)" />
            </View>
          )}
          
          <LinearGradient
            colors={['transparent', colors.background]}
            style={styles.gradientOverlay}
          />

          <View style={styles.titleContainer}>
            <View style={[styles.iconBubble, { backgroundColor: theme.color }]}>
              <Ionicons name={theme.icon} size={32} color="#fff" />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>{data.name || data.title}</Text>
            <Text style={[styles.subtitle, { color: theme.color }]}>{theme.label}</Text>
          </View>
        </View>

        <View style={styles.content}>
          
          {config?.stats && (
            <View style={styles.statsGrid}>
              {config.stats.map((stat: any) => (
                <StatBadge 
                  key={stat.key} 
                  icon={stat.icon} 
                  label={stat.label} 
                  value={data[stat.key]} 
                />
              ))}
            </View>
          )}

          {data.description && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="document-text" size={20} color={theme.color} style={{ marginRight: 8 }} />
                <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>Descrição</Text>
              </View>
              <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>
                {data.description}
              </Text>
            </View>
          )}

          {config?.sections.map((section: any) => {
            const value = data[section.key];
            if (!value || (Array.isArray(value) && value.length === 0)) return null;
            if (section.key === 'description') return null; // Já exibido acima

            return (
              <View key={section.key} style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name={section.icon} size={20} color={theme.color} style={{ marginRight: 8 }} />
                  <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>
                    {section.label}
                  </Text>
                </View>

                {section.type === 'list' && Array.isArray(value) ? (
                  <View style={styles.tagsContainer}>
                    {value.map((item: string, idx: number) => (
                      <View 
                        key={idx} 
                        style={[
                          styles.tag, 
                          { backgroundColor: colors.surface, borderColor: theme.color + '40' }
                        ]}
                      >
                        <Text style={[styles.tagText, { color: colors.text }]}>{item}</Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>
                    {value}
                  </Text>
                )}
              </View>
            );
          })}

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
  footer: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xxl,
  },
});