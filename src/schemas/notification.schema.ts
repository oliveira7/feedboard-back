import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';

enum NotificationType {
  NEW_POST = 'NEW_POST',
}
@Schema({
  collection: 'Notification',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Notification extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Post', required: true })
  post_id: ObjectId;

  @Prop({ type: String, required: true })
  message: string;

  @Prop({ type: String, required: true })
  type: NotificationType;

  @Prop({ type: Boolean, default: false })
  read: boolean;
}

export type NotificationLeanDocument = {
  _id: string;
  user_id: string;
  post_id: string;
  message: string;
  type: string;
  read: boolean;
  created_at: Date;
  updated_at: Date;
};

export type NotificationDocument = Notification & Document;

export const NotificationSchema = SchemaFactory.createForClass(Notification);
