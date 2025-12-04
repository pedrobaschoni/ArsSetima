import { BaseEntity } from './character';

/**
 * Item ou artefato do universo
 */
export interface Item extends BaseEntity {
  name: string;
  description: string;
  type?: string; // ex: "Artefato", "Arma", "Reliquia"
  rarity?: 'common' | 'uncommon' | 'rare' | 'legendary';
  ownedBy?: string; // ID do personagem
  powers?: string[];
  imageUri?: string;
}

/**
 * Dados para criar/editar item
 */
export type ItemInput = Omit<Item, 'id' | 'createdAt' | 'updatedAt'>;
