import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';

@Schema({
  collection: 'Notification',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Notification extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: ObjectId;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: Boolean, default: false })
  read: boolean;

  @Prop({ type: Date, default: null })
  deleted_at: Date | null;
}

export type NotificationLeanDocument = {
  _id: string;
  user_id: string;
  content: string;
  read: boolean;
  created_at: Date;
  updated_at: Date;
};

export type NotificationDocument = Notification & Document;

export const NotificationSchema = SchemaFactory.createForClass(Notification);
