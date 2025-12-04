/**
 * Tipo base para todas as entidades do sistema
 */
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Personagem do universo literário
 */
export interface Character extends BaseEntity {
  name: string;
  age?: number;
  appearance?: string;
  powers?: string[];
  goals?: string;
  secrets?: string;
  relations?: string[]; // IDs de outros personagens
  notes?: string;
  imageUri?: string;
  tags?: string[];
}

/**
 * Dados para criar/editar personagem
 */
export type CharacterInput = Omit<Character, 'id' | 'createdAt' | 'updatedAt'>;
