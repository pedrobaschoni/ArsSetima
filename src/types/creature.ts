import { BaseEntity } from './character';

/**
 * Criatura do universo
 */
export interface Creature extends BaseEntity {
  name: string;
  species: string;
  description: string;
  abilities?: string[];
  habitat?: string;
  dangerLevel?: 'low' | 'medium' | 'high' | 'extreme';
  imageUri?: string;
}

/**
 * Dados para criar/editar criatura
 */
export type CreatureInput = Omit<Creature, 'id' | 'createdAt' | 'updatedAt'>;
