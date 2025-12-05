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
  Image,
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Button } from '../components/Button';
import { useTheme } from '../utils/ThemeContext';
import { Spacing, BorderRadius, Colors, Shadows } from '../utils/theme';
import { databaseService } from '../database/migrations';
import { generateId } from '../utils/helpers';

const ENTITY_CONFIG: any = {
  character: {
    label: 'Personagem',
    table: 'characters',
    hasImage: true,
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
    hasImage: true,
    fields: [
      { key: 'name', label: 'Nome do Local', type: 'text', required: true },
      { key: 'description', label: 'Descrição', type: 'multiline', required: true },
      { key: 'tags', label: 'Tags', type: 'list' },
    ],
  },
  spell: {
    label: 'Magia',
    table: 'spells',
    hasImage: true,
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
    hasImage: true,
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
    hasImage: true,
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
    hasImage: true,
    fields: [
      { key: 'name', label: 'Nome da Facção', type: 'text', required: true },
      { key: 'description', label: 'Descrição', type: 'multiline', required: true },
      { key: 'goals', label: 'Objetivos', type: 'multiline' },
      { key: 'alignment', label: 'Alinhamento', type: 'text' },
    ],
  },
  event: {
    label: 'Evento',
    table: 'events',
    hasImage: false,
    fields: [
      { key: 'title', label: 'Título do Evento', type: 'text', required: true },
      { key: 'date', label: 'Data', type: 'text', required: true },
      { key: 'description', label: 'Descrição do Evento', type: 'multiline', required: true },
      { key: 'category', label: 'Categoria', type: 'text' },
      { 
        key: 'importance', 
        label: 'Importância', 
        type: 'select',
        options: [
          { label: 'Baixa', value: 'low', color: '#10b981' },
          { label: 'Média', value: 'medium', color: '#f59e0b' },
          { label: 'Alta', value: 'high', color: '#ef4444' }
        ]
      },
    ],
  },
  curiosity: {
    label: 'Curiosidade',
    table: 'curiosities',
    hasImage: true,
    fields: [
      { key: 'title', label: 'Título', type: 'text', required: true },
      { key: 'content', label: 'Conteúdo/Detalhe', type: 'multiline', required: true },
      { key: 'tags', label: 'Tags/Categorias', type: 'list' },
    ],
  },
  note: {
    label: 'Nota',
    table: 'notes',
    hasImage: false,
    fields: [
      { key: 'title', label: 'Título', type: 'text', required: true },
      { key: 'content', label: 'Conteúdo', type: 'multiline', required: true },
      { 
        key: 'priority', 
        label: 'Prioridade', 
        type: 'select',
        options: [
          { label: 'Baixa', value: 'low', color: '#10b981' },
          { label: 'Média', value: 'medium', color: '#f59e0b' },
          { label: 'Alta', value: 'high', color: '#ef4444' }
        ]
      },
      { key: 'tags', label: 'Tags', type: 'list' },
    ],
  },
};

export default function UniversalFormScreen({ route, navigation }: any) {
  const { colors } = useTheme();
  
  let headerHeight = 0;
  try { headerHeight = useHeaderHeight(); } catch (e) {}

  const params = route.params || {};
  const { entityType, editData } = params;
  
  if (!entityType || !ENTITY_CONFIG[entityType]) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.text }}>Erro: Tipo de entidade inválido.</Text>
        <Button title="Voltar" onPress={() => navigation.goBack()} />
      </View>
    );
  }

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
        // Define média como padrão para prioridade
        if (field.type === 'select' && field.options.length > 0) {
           initialData[field.key] = field.options[1].value;
        }
      });
      setFormData(initialData);
      navigation.setOptions({ title: `Novo ${config.label}` });
    }
  }, [editData, config, navigation]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], 
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setFormData({ ...formData, imageUri: result.assets[0].uri });
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, imageUri: null });
  };

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

  const handleSave = async () => {
    for (const field of config.fields) {
      if (field.required && (!formData[field.key] || (Array.isArray(formData[field.key]) && formData[field.key].length === 0))) {
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
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={{ flex: 1 }}
      keyboardVerticalOffset={headerHeight + 50}
    >
      <ScrollView 
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={{ paddingBottom: 100 }} 
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          
          {config.hasImage && (
            <View style={styles.imageSection}>
              <TouchableOpacity 
                style={[
                  styles.imagePicker, 
                  { 
                    backgroundColor: colors.surface, 
                    borderColor: colors.border,
                    borderWidth: formData.imageUri ? 0 : 2,
                    borderStyle: formData.imageUri ? 'solid' : 'dashed'
                  }
                ]} 
                onPress={pickImage}
              >
                {formData.imageUri ? (
                  <Image source={{ uri: formData.imageUri }} style={styles.imagePreview} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Ionicons name="image-outline" size={40} color={colors.textSecondary} />
                    <Text style={[styles.imagePlaceholderText, { color: colors.textSecondary }]}>
                      Adicionar Imagem
                    </Text>
                  </View>
                )}

                <View style={[styles.editBadge, { backgroundColor: Colors.primary }]}>
                  <Ionicons name={formData.imageUri ? "pencil" : "add"} size={16} color="#fff" />
                </View>
              </TouchableOpacity>

              {formData.imageUri && (
                <TouchableOpacity onPress={removeImage} style={styles.removeImageButton}>
                  <Text style={{ color: colors.error, fontSize: 12 }}>Remover imagem</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {config.fields.map((field: any) => (
            <View key={field.key} style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                {field.label} {field.required && '*'}
              </Text>

              {field.type === 'select' ? (
                <View style={styles.selectContainer}>
                  {field.options.map((option: any) => {
                    const isSelected = formData[field.key] === option.value;
                    return (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.selectButton,
                          { 
                            borderColor: isSelected ? (option.color || Colors.primary) : colors.border,
                            backgroundColor: isSelected ? (option.color || Colors.primary) : colors.surface,
                          }
                        ]}
                        onPress={() => setFormData({ ...formData, [field.key]: option.value })}
                      >
                        <Text style={[
                          styles.selectText,
                          { color: isSelected ? '#fff' : colors.text }
                        ]}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : field.type === 'list' ? (
                <View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <TextInput
                      style={[
                        styles.input, 
                        { flex: 1, backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }
                      ]}
                      placeholder={`Adicionar...`}
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

        </View>
      </ScrollView>
      
      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <View style={styles.footerButtons}>
          <TouchableOpacity
            style={[styles.cancelButton, { borderColor: colors.border }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancelar</Text>
          </TouchableOpacity>
          <View style={styles.saveButton}>
            <Button 
              title={editData ? "Salvar" : "Criar"} 
              onPress={handleSave} 
              loading={loading}
              fullWidth
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  form: { padding: Spacing.lg },
  imageSection: { alignItems: 'center', marginBottom: Spacing.xl },
  imagePicker: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    ...Shadows.md,
  },
  imagePreview: { width: '100%', height: '100%', resizeMode: 'cover' },
  imagePlaceholder: { alignItems: 'center', justifyContent: 'center' },
  imagePlaceholderText: { fontSize: 12, marginTop: 8, fontWeight: '500' },
  editBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  removeImageButton: { marginTop: 8, padding: 4 },
  inputGroup: { marginBottom: Spacing.lg },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, marginLeft: 4 },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  selectContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  selectButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectText: { fontWeight: '600', fontSize: 14 },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  listContainer: { marginTop: 4 },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    marginBottom: 8,
  },
  listText: { flex: 1, fontSize: 14, marginRight: 10 },
  removeButton: { padding: 4 },
  footer: { 
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    ...Shadows.md,
  },
  footerButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
  },
});