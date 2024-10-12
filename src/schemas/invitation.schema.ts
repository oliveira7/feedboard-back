import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'Invitation',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Invitation extends Document {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true, unique: true })
  token: string;

  @Prop({ default: false })
  used: boolean;

  @Prop({ required: true })
  expires_at: Date;
}

export type InvitationLeanDocument = {
  _id: string;
  email: string;
  token: string;
  used: boolean;
  expires_at: Date;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

export type InvitationDocument = Invitation & Document;

export const InvitationSchema = SchemaFactory.createForClass(Invitation);
