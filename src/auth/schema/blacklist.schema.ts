import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Blacklist {
  @Prop()
  token: string;
}

export type BlacklistDocument = Blacklist & Document;

export const BlacklistSchema = SchemaFactory.createForClass(Blacklist);
