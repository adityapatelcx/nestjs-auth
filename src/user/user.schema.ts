import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';
import * as bcryptjs from 'bcryptjs';

@Schema()
export class User {
  @Prop()
  provider: string;

  @Prop()
  first_name?: string;

  @Prop()
  last_name?: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  master_pin?: number;

  @Prop({ default: false })
  isEmailVerified: boolean;

  comparePasswords;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.comparePasswords = async function (
  submittedPassword: string,
) {
  return bcryptjs.compareSync(submittedPassword, this.password);
};
