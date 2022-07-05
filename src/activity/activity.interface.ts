import { Document } from 'mongoose';

export interface IActivity extends Document {
  action: string;
  createdAt: string;
}
