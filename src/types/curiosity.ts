import { BaseEntity } from './character';

export interface Curiosity extends BaseEntity {
  title: string;
  content: string;
  imageUri?: string;
  tags?: string[]; // Ex: "História", "Lenda", "Ciência"
}