import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';
import { databaseService } from '../database/migrations';
import { BackupData, AppSettings } from '../types';

/**
 * Serviço de armazenamento e gerenciamento de dados
 * Responsável por backup, import/export e configurações
 */
class StorageService {
  private readonly SETTINGS_KEY = '@arssetima:settings';
  private readonly BACKUP_DIR = `${(((FileSystem as any).documentDirectory) || ((FileSystem as any).cacheDirectory) || '')}backups/`;

  /**
   * Salva as configurações do app
   */
  async saveSettings(settings: AppSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }

  /**
   * Carrega as configurações do app
   */
  async loadSettings(): Promise<AppSettings> {
    try {
      const data = await AsyncStorage.getItem(this.SETTINGS_KEY);
      if (data) {
        return JSON.parse(data);
      }
      // Configurações padrão
      return {
        theme: 'dark',
        fontSize: 'medium',
        dailyWordGoal: 1000,
        notifications: true,
      };
    } catch (error) {
      console.error('Error loading settings:', error);
      throw error;
    }
  }

  /**
   * Exporta todos os dados para um arquivo JSON
   */
  async exportData(): Promise<string> {
    try {
      // Coleta todos os dados do banco
      const characters = await databaseService.getAll('characters');
      const locations = await databaseService.getAll('locations');
      const events = await databaseService.getAll('events');
      const notes = await databaseService.getAll('notes');
      const spells = await databaseService.getAll('spells');
      const items = await databaseService.getAll('items');
      const creatures = await databaseService.getAll('creatures');
      const factions = await databaseService.getAll('factions');
      const chapters = await databaseService.getAll('chapters');

      const backupData: BackupData = {
        version: '1.0.0',
        exportDate: new Date().toISOString(),
        characters,
        locations,
        events,
        notes,
        spells,
        items,
        creatures,
        factions,
        chapters,
      };

      // Cria o diretório de backup se não existir
      const dirInfo = await FileSystem.getInfoAsync(this.BACKUP_DIR);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(this.BACKUP_DIR, {
          intermediates: true,
        });
      }

      // Salva o arquivo
      const fileName = `arssetima_backup_${Date.now()}.json`;
      const filePath = `${this.BACKUP_DIR}${fileName}`;
      await FileSystem.writeAsStringAsync(
        filePath,
        JSON.stringify(backupData, null, 2)
      );

      return filePath;
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }

  /**
   * Compartilha o arquivo de backup
   */
  async shareBackup(filePath: string): Promise<void> {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(filePath);
      } else {
        throw new Error('Sharing is not available on this device');
      }
    } catch (error) {
      console.error('Error sharing backup:', error);
      throw error;
    }
  }

  /**
   * Importa dados de um arquivo JSON
   */
  async importData(): Promise<void> {
    try {
      // Seleciona o arquivo
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
      });

      if (result.canceled) {
        return;
      }

      // Lê o conteúdo do arquivo
      const fileContent = await FileSystem.readAsStringAsync(result.assets[0].uri);
      const backupData: BackupData = JSON.parse(fileContent);

      // Valida a estrutura do backup
      if (!backupData.version || !backupData.exportDate) {
        throw new Error('Invalid backup file format');
      }

      // Importa os dados (sobrescreve os existentes)
      await this.importEntities('characters', backupData.characters);
      await this.importEntities('locations', backupData.locations);
      await this.importEntities('events', backupData.events);
      await this.importEntities('notes', backupData.notes);
      await this.importEntities('spells', backupData.spells);
      await this.importEntities('items', backupData.items);
      await this.importEntities('creatures', backupData.creatures);
      await this.importEntities('factions', backupData.factions);
      await this.importEntities('chapters', backupData.chapters);

      console.log('Data imported successfully');
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  }

  /**
   * Importa entidades para uma tabela específica
   */
  private async importEntities(
    table: string,
    entities: any[]
  ): Promise<void> {
    if (!entities || entities.length === 0) return;

    for (const entity of entities) {
      try {
        // Verifica se já existe
        const existing = await databaseService.getById(table, entity.id);
        
        if (existing) {
          // Atualiza
          await databaseService.update(table, entity.id, entity);
        } else {
          // Insere
          await databaseService.insert(table, entity);
        }
      } catch (error) {
        console.error(`Error importing entity to ${table}:`, error);
      }
    }
  }

  /**
   * Carrega dados seed (iniciais) no banco
   */
  async loadSeedData(seedData: BackupData): Promise<void> {
    try {
      await this.importEntities('characters', seedData.characters);
      await this.importEntities('locations', seedData.locations);
      await this.importEntities('events', seedData.events);
      await this.importEntities('notes', seedData.notes);
      await this.importEntities('spells', seedData.spells);
      await this.importEntities('items', seedData.items);
      await this.importEntities('creatures', seedData.creatures);
      await this.importEntities('factions', seedData.factions);
      
      console.log('Seed data loaded successfully');
    } catch (error) {
      console.error('Error loading seed data:', error);
      throw error;
    }
  }
}

export const storageService = new StorageService();
