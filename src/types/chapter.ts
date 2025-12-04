import { BaseEntity } from './character';

/**
 * Capítulo ou seção de escrita
 */
export interface Chapter extends BaseEntity {
  number: number;
  title: string;
  content: string;
  wordCount: number;
  status?: 'draft' | 'review' | 'complete';
  notes?: string;
  targetWordCount?: number;
}

/**
 * Dados para criar/editar capítulo
 */
export type ChapterInput = Omit<Chapter, 'id' | 'createdAt' | 'updatedAt'>;
