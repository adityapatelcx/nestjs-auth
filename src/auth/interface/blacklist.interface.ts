import { Document } from 'mongoose';

export interface IBlacklist extends Document {
  token: string;
}
