import { BaseEntity } from './character';

/**
 * Evento da linha do tempo
 */
export interface TimelineEvent extends BaseEntity {
  title: string;
  date: string; // ISO date string
  description: string;
  links?: {
    characters?: string[];
    locations?: string[];
    factions?: string[];
  };
  category?: string;
  importance?: 'low' | 'medium' | 'high';
}

/**
 * Dados para criar/editar evento
 */
export type TimelineEventInput = Omit<
  TimelineEvent,
  'id' | 'createdAt' | 'updatedAt'
>;
