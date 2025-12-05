import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/Button';
import { useTheme } from '../utils/ThemeContext';
import { Spacing, BorderRadius, Colors } from '../utils/theme';
import { databaseService } from '../database/migrations';
import { generateId } from '../utils/helpers';

const ENTITY_CONFIG: any = {
  character: {
    label: 'Personagem',
    table: 'characters',
    fields: [
      { key: 'name', label: 'Nome', type: 'text', required: true },
      { key: 'age', label: 'Idade', type: 'number' },
      { key: 'appearance', label: 'Aparência', type: 'multiline' },
      { key: 'powers', label: 'Poderes', type: 'list' },
      { key: 'goals', label: 'Objetivos', type: 'multiline' },
      { key: 'secrets', label: 'Segredos', type: 'multiline' },
      { key: 'notes', label: 'Notas', type: 'list' },
    ],
  },
  location: {
    label: 'Local',
    table: 'locations',
    fields: [
      { key: 'name', label: 'Nome do Local', type: 'text', required: true },
      { key: 'description', label: 'Descrição', type: 'multiline', required: true },
      { key: 'tags', label: 'Tags', type: 'list' },
    ],
  },
  spell: {
    label: 'Magia',
    table: 'spells',
    fields: [
      { key: 'name', label: 'Nome da Magia', type: 'text', required: true },
      { key: 'description', label: 'Descrição/Efeito', type: 'multiline', required: true },
      { key: 'type', label: 'Tipo', type: 'text' },
      { key: 'level', label: 'Nível', type: 'number' },
      { key: 'requirements', label: 'Requisitos', type: 'text' },
    ],
  },
  item: {
    label: 'Item',
    table: 'items',
    fields: [
      { key: 'name', label: 'Nome do Item', type: 'text', required: true },
      { key: 'description', label: 'Descrição', type: 'multiline', required: true },
      { key: 'type', label: 'Tipo', type: 'text' },
      { key: 'rarity', label: 'Raridade', type: 'text' },
      { key: 'powers', label: 'Poderes/Efeitos', type: 'list' },
    ],
  },
  creature: {
    label: 'Criatura',
    table: 'creatures',
    fields: [
      { key: 'name', label: 'Nome', type: 'text', required: true },
      { key: 'species', label: 'Espécie', type: 'text' },
      { key: 'description', label: 'Descrição', type: 'multiline', required: true },
      { key: 'abilities', label: 'Habilidades', type: 'list' },
      { key: 'habitat', label: 'Habitat', type: 'text' },
      { key: 'dangerLevel', label: 'Nível de Perigo', type: 'text' },
    ],
  },
  faction: {
    label: 'Facção',
    table: 'factions',
    fields: [
      { key: 'name', label: 'Nome da Facção', type: 'text', required: true },
      { key: 'description', label: 'Descrição', type: 'multiline', required: true },
      { key: 'goals', label: 'Objetivos', type: 'multiline' },
      { key: 'alignment', label: 'Alinhamento', type: 'text' },
    ],
  },
};

export default function UniversalFormScreen({ route, navigation }: any) {
  const { colors } = useTheme();
  const headerHeight = useHeaderHeight();
  const { entityType, editData } = route.params;
  
  const config = ENTITY_CONFIG[entityType];
  
  const [formData, setFormData] = useState<any>({});
  const [tempInputs, setTempInputs] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      const preparedData = { ...editData };
      config.fields.forEach((field: any) => {
        if (field.type === 'list') {
          if (typeof preparedData[field.key] === 'string') {
             try {
               const parsed = JSON.parse(preparedData[field.key]);
               preparedData[field.key] = Array.isArray(parsed) ? parsed : [];
             } catch {
               preparedData[field.key] = preparedData[field.key].split(',').map((s: string) => s.trim()).filter(Boolean);
             }
          } else if (!Array.isArray(preparedData[field.key])) {
             preparedData[field.key] = [];
          }
        }
        
        if (typeof preparedData[field.key] === 'number') {
          preparedData[field.key] = preparedData[field.key].toString();
        }
      });
      setFormData(preparedData);
      navigation.setOptions({ title: `Editar ${config.label}` });
    } else {
      const initialData: any = {};
      config.fields.forEach((field: any) => {
        if (field.type === 'list') initialData[field.key] = [];
      });
      setFormData(initialData);
      navigation.setOptions({ title: `Novo ${config.label}` });
    }
  }, [editData, config, navigation]);

  const addItem = (key: string) => {
    const value = tempInputs[key];
    if (!value || !value.trim()) return;
    
    const currentList = formData[key] || [];
    setFormData({ ...formData, [key]: [...currentList, value.trim()] });
    setTempInputs({ ...tempInputs, [key]: '' });
  };

  const removeItem = (key: string, index: number) => {
    const currentList = [...(formData[key] || [])];
    currentList.splice(index, 1);
    setFormData({ ...formData, [key]: currentList });
  };

  const handleDelete = async () => {
    Alert.alert(
      'Excluir Item',
      `Tem certeza que deseja excluir "${formData.name || 'este item'}"? Essa ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await databaseService.delete(config.table, editData.id);
              if (navigation.canGoBack()) {
                navigation.goBack(); 
                navigation.navigate(
                  config.table === 'characters' ? 'CharacterList' : 
                  config.table === 'locations' ? 'LocationList' : 
                  'EncyclopediaHome' // Fallback
                );
              }
            } catch (error) {
              console.error(error);
              Alert.alert('Erro', 'Não foi possível excluir o item.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleSave = async () => {
    for (const field of config.fields) {
      if (field.required && (!formData[field.key] || formData[field.key].length === 0)) {
        Alert.alert('Erro', `O campo ${field.label} é obrigatório.`);
        return;
      }
    }

    setLoading(true);
    try {
      const dataToSave: any = { ...formData };
      
      config.fields.forEach((field: any) => {
        if (field.type === 'number' && dataToSave[field.key]) {
          dataToSave[field.key] = parseInt(dataToSave[field.key], 10);
        }
      });

      dataToSave.updatedAt = new Date().toISOString();

      if (editData) {
        await databaseService.update(config.table, editData.id, dataToSave);
      } else {
        dataToSave.id = generateId(entityType.substring(0, 3));
        dataToSave.createdAt = new Date().toISOString();
        await databaseService.insert(config.table, dataToSave);
      }

      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Falha ao salvar dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
      style={{ flex: 1 }}
      keyboardVerticalOffset={headerHeight}
    >
      <ScrollView 
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={{ paddingBottom: 150 }} 
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          {config.fields.map((field: any) => (
            <View key={field.key} style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                {field.label} {field.required && '*'}
              </Text>

              {field.type === 'list' ? (
                <View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <TextInput
                      style={[
                        styles.input, 
                        { flex: 1, backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }
                      ]}
                      placeholder={`Adicionar ${field.label.toLowerCase()}...`}
                      placeholderTextColor={colors.textSecondary + '80'}
                      value={tempInputs[field.key] || ''}
                      onChangeText={(text) => setTempInputs({ ...tempInputs, [field.key]: text })}
                      onSubmitEditing={() => addItem(field.key)}
                    />
                    <TouchableOpacity 
                      style={[styles.addButton, { backgroundColor: Colors.primary }]}
                      onPress={() => addItem(field.key)}
                    >
                      <Ionicons name="arrow-up" size={24} color="#fff" />
                    </TouchableOpacity>
                  </View>
                  
                  {formData[field.key] && formData[field.key].length > 0 ? (
                    <View style={styles.listContainer}>
                      {formData[field.key].map((item: string, index: number) => (
                        <View key={index} style={[styles.listItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                          <Text style={[styles.listText, { color: colors.text }]}>{item}</Text>
                          <TouchableOpacity onPress={() => removeItem(field.key, index)} style={styles.removeButton}>
                            <Ionicons name="close-circle" size={20} color={colors.error} />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <Text style={{ color: colors.textSecondary, fontStyle: 'italic', fontSize: 12, marginLeft: 4 }}>
                      Nenhum item adicionado.
                    </Text>
                  )}
                </View>
              ) : (
                <TextInput
                  style={[
                    styles.input, 
                    { 
                      backgroundColor: colors.surface, 
                      color: colors.text,
                      borderColor: colors.border,
                      minHeight: field.type === 'multiline' ? 100 : 50,
                      textAlignVertical: field.type === 'multiline' ? 'top' : 'center'
                    }
                  ]}
                  placeholder={field.label}
                  placeholderTextColor={colors.textSecondary + '80'}
                  value={formData[field.key] || ''}
                  onChangeText={(text) => setFormData({ ...formData, [field.key]: text })}
                  multiline={field.type === 'multiline'}
                  keyboardType={field.type === 'number' ? 'numeric' : 'default'}
                />
              )}
            </View>
          ))}

          <View style={styles.footer}>
            <Button 
              title={editData ? "Salvar Alterações" : "Criar"} 
              onPress={handleSave} 
              loading={loading}
              fullWidth 
            />
            
            {editData && (
              <View style={{ marginTop: 12 }}>
                <Button 
                  title="Excluir" 
                  onPress={handleDelete}
                  variant="danger" 
                  icon="trash"
                  fullWidth 
                />
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  form: { padding: Spacing.lg },
  inputGroup: { marginBottom: Spacing.lg },
  label: { 
    fontSize: 14, 
    fontWeight: '600', 
    marginBottom: 8,
    marginLeft: 4
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  listContainer: {
    marginTop: 4,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    marginBottom: 8,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    marginRight: 10,
  },
  removeButton: {
    padding: 4,
  },
  footer: {
    marginTop: Spacing.lg,
  }
});