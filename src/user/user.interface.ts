import { Document } from 'mongoose';

export interface IUser extends Document {
  first_name?: string;
  last_name?: string;
  email: string;
  password: string;
  master_pin?: number;
  provider?: string;
  isEmailVerified?: boolean;
  comparePasswords?: (password: string) => boolean;
}
