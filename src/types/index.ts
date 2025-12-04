/**
 * Tipo de entidade da enciclopédia
 */
export type EntityType =
  | 'character'
  | 'location'
  | 'faction'
  | 'spell'
  | 'item'
  | 'creature';

/**
 * Configurações do app
 */
export interface AppSettings {
  theme: 'light' | 'dark';
  fontSize: 'small' | 'medium' | 'large';
  dailyWordGoal: number;
  notifications: boolean;
}

/**
 * Dados completos para backup/import
 */
export interface BackupData {
  version: string;
  exportDate: string;
  characters: any[];
  locations: any[];
  events: any[];
  notes: any[];
  spells: any[];
  items: any[];
  creatures: any[];
  factions: any[];
  chapters: any[];
}

/**
 * Estatísticas do universo
 */
export interface Statistics {
  totalCharacters: number;
  totalLocations: number;
  totalEvents: number;
  totalNotes: number;
  totalSpells: number;
  totalItems: number;
  totalCreatures: number;
  totalFactions: number;
  totalWords: number;
  completedChapters: number;
}
