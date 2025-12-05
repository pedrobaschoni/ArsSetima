import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/ThemeContext';
import { Spacing, BorderRadius, Colors } from '../utils/theme';

export default function EncyclopediaScreen({ navigation }: any) {
  const { colors } = useTheme();

  const CategoryItem = ({ title, icon, route, color }: any) => (
    <TouchableOpacity
      style={[styles.item, { backgroundColor: colors.surface }]}
      onPress={() => navigation.navigate(route)}
    >
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={[styles.itemText, { color: colors.text }]}>{title}</Text>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.header, { color: colors.textSecondary }]}>
          Categorias
        </Text>

        <CategoryItem 
          title="Personagens" 
          icon="people" 
          route="Characters" 
          color={Colors.primary} 
        />
        <CategoryItem 
          title="Locais" 
          icon="location" 
          route="Locations" 
          color={Colors.secondary} 
        />
        <CategoryItem 
          title="Magias" 
          icon="flame" 
          route="Spells" 
          color="#ef4444" 
        />
        <CategoryItem 
          title="Itens" 
          icon="cube" 
          route="Items" 
          color="#3b82f6" 
        />
        <CategoryItem 
          title="Criaturas" 
          icon="paw" 
          route="Creatures" 
          color="#10b981" 
        />
        <CategoryItem 
          title="Facções" 
          icon="flag" 
          route="Factions" 
          color="#f59e0b" 
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.md },
  header: {
    fontSize: 14,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: Spacing.sm,
    marginLeft: Spacing.sm,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
});