import { BaseEntity } from './character';

/**
 * Local do universo literário
 */
export interface Location extends BaseEntity {
  name: string;
  description: string;
  imageUri?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  relatedCharacters?: string[]; // IDs de personagens
  tags?: string[];
}

/**
 * Dados para criar/editar local
 */
export type LocationInput = Omit<Location, 'id' | 'createdAt' | 'updatedAt'>;
