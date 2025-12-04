import { BaseEntity } from './character';

/**
 * Nota ou ideia para o livro
 */
export interface Note extends BaseEntity {
  title: string;
  content: string;
  category?: string; // ex: "Capítulo 5", "Personagem", "Plot twist"
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  relatedTo?: {
    characters?: string[];
    locations?: string[];
    chapters?: string[];
  };
}

/**
 * Dados para criar/editar nota
 */
export type NoteInput = Omit<Note, 'id' | 'createdAt' | 'updatedAt'>;
