import { BaseEntity } from './character';

/**
 * Magia ou poder do universo
 */
export interface Spell extends BaseEntity {
  name: string;
  description: string;
  type?: string; // ex: "Sétimo Poder", "Elemental", etc
  level?: number;
  requirements?: string;
  effects?: string;
  knownBy?: string[]; // IDs de personagens
  imageUri?: string;
}

/**
 * Dados para criar/editar magia
 */
export type SpellInput = Omit<Spell, 'id' | 'createdAt' | 'updatedAt'>;
