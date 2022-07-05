import { Document } from 'mongoose';

export interface INft extends Document {
  name: string;
  description: string;
  id: string;
  rarity: string;
  collectionName: string;
  schemaName: string;
  templateId: string;
  tradeId: string;
  attributes: string[];
}
