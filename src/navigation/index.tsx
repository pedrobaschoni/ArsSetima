import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/ThemeContext';
import { Colors } from '../utils/theme';

// Importar screens (serão criadas depois)
import HomeScreen from '../screens/HomeScreen';
import EncyclopediaScreen from '../screens/EncyclopediaScreen';
import CharacterScreen from '../screens/CharacterScreen';
import CharacterDetailScreen from '../screens/CharacterDetailScreen';
import LocationScreen from '../screens/LocationScreen';
import LocationDetailScreen from '../screens/LocationDetailScreen';
import TimelineScreen from '../screens/TimelineScreen';
import NotesScreen from '../screens/NotesScreen';
import WritingScreen from '../screens/WritingScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SpellScreen from '../screens/SpellScreen';
import ItemScreen from '../screens/ItemScreen';
import CreatureScreen from '../screens/CreatureScreen';
import FactionScreen from '../screens/FactionScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

/**
 * Navigator de Personagens
 */
const CharacterStack = () => {
  const { colors } = useTheme();
  
  return (
    // @ts-ignore
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen
        name="CharacterList"
        component={CharacterScreen}
        options={{ title: 'Personagens' }}
      />
      <Stack.Screen
        name="CharacterDetail"
        component={CharacterDetailScreen}
        options={{ title: 'Detalhes do Personagem' }}
      />
    </Stack.Navigator>
  );
};

/**
 * Navigator de Locais
 */
const LocationStack = () => {
  const { colors } = useTheme();
  
  return (
    // @ts-ignore
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen
        name="LocationList"
        component={LocationScreen}
        options={{ title: 'Locais' }}
      />
      <Stack.Screen
        name="LocationDetail"
        component={LocationDetailScreen}
        options={{ title: 'Detalhes do Local' }}
      />
    </Stack.Navigator>
  );
};

/**
 * Navigator de Enciclopédia (Drawer para categorias)
 */
const EncyclopediaDrawer = () => {
  const { colors } = useTheme();
  
  return (
    // @ts-ignore
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        drawerStyle: { backgroundColor: colors.surface },
        drawerActiveTintColor: Colors.primary,
        drawerInactiveTintColor: colors.textSecondary,
      }}
    >
      <Drawer.Screen
        name="EncyclopediaHome"
        component={EncyclopediaScreen}
        options={{ title: 'Enciclopédia' }}
      />
      <Drawer.Screen
        name="Characters"
        component={CharacterStack}
        options={{ title: 'Personagens' }}
      />
      <Drawer.Screen
        name="Locations"
        component={LocationStack}
        options={{ title: 'Locais' }}
      />
      <Drawer.Screen
        name="Spells"
        component={SpellScreen}
        options={{ title: 'Magias' }}
      />
      <Drawer.Screen
        name="Items"
        component={ItemScreen}
        options={{ title: 'Itens' }}
      />
      <Drawer.Screen
        name="Creatures"
        component={CreatureScreen}
        options={{ title: 'Criaturas' }}
      />
      <Drawer.Screen
        name="Factions"
        component={FactionScreen}
        options={{ title: 'Facções' }}
      />
    </Drawer.Navigator>
  );
};

/**
 * Bottom Tab Navigator (navegação principal)
 */
const MainTabs = () => {
  const { colors } = useTheme();
  
  return (
    // @ts-ignore
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Encyclopedia':
              iconName = focused ? 'book' : 'book-outline';
              break;
            case 'Timeline':
              iconName = focused ? 'time' : 'time-outline';
              break;
            case 'Writing':
              iconName = focused ? 'create' : 'create-outline';
              break;
            case 'Notes':
              iconName = focused ? 'document-text' : 'document-text-outline';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Início' }}
      />
      <Tab.Screen
        name="Encyclopedia"
        component={EncyclopediaDrawer}
        options={{ title: 'Enciclopédia', headerShown: false }}
      />
      <Tab.Screen
        name="Timeline"
        component={TimelineScreen}
        options={{ title: 'Linha do Tempo' }}
      />
      <Tab.Screen
        name="Writing"
        component={WritingScreen}
        options={{ title: 'Escrever' }}
      />
      <Tab.Screen
        name="Notes"
        component={NotesScreen}
        options={{ title: 'Notas' }}
      />
    </Tab.Navigator>
  );
};

/**
 * Root Navigator
 */
const RootStack = () => {
  const { colors } = useTheme();
  
  return (
    // @ts-ignore
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Configurações' }}
      />
    </Stack.Navigator>
  );
};

/**
 * Navigation Container principal
 */
export default function Navigation() {
  const { colors, theme } = useTheme();
  
  return (
    // @ts-ignore
    <NavigationContainer
      theme={{
        dark: theme === 'dark',
        colors: {
          primary: Colors.primary,
          background: colors.background,
          card: colors.surface,
          text: colors.text,
          border: colors.border,
          notification: Colors.accent,
        },
      }}
    >
      <RootStack />
    </NavigationContainer>
  );
}
