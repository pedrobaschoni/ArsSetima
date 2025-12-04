import { BaseEntity } from './character';

/**
 * Facção ou organização do universo
 */
export interface Faction extends BaseEntity {
  name: string;
  description: string;
  leader?: string; // ID do personagem
  members?: string[]; // IDs de personagens
  goals?: string;
  headquarters?: string; // ID do local
  alignment?: 'good' | 'neutral' | 'evil';
  imageUri?: string;
}

/**
 * Dados para criar/editar facção
 */
export type FactionInput = Omit<Faction, 'id' | 'createdAt' | 'updatedAt'>;
