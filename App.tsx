import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { ThemeProvider } from './src/utils/ThemeContext';
import Navigation from './src/navigation';
import { databaseService } from './src/database/migrations';
import { storageService } from './src/services/storageService';
import seedData from './seed/seed-data.json';

/**
 * App principal do ArsSétima
 */
export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  /**
   * Inicializa o banco de dados e carrega dados seed se necessário
   */
  const initializeApp = async () => {
    try {
      // Inicializa o banco de dados
      await databaseService.init();
      
      // Verifica se é a primeira vez (sem dados)
      const characters = await databaseService.getAll('characters');
      
      // Se não houver dados, carrega os dados seed
      if (characters.length === 0) {
        console.log('Loading seed data...');
        await storageService.loadSeedData(seedData);
      }
      
      setIsReady(true);
    } catch (error) {
      console.error('Error initializing app:', error);
      setIsReady(true); // Continua mesmo com erro
    }
  };

  if (!isReady) {
    return null; // Ou uma splash screen customizada
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        {/* @ts-ignore */}
        <ThemeProvider>
          <Navigation />
          <StatusBar style="auto" />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
