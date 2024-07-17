import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type NotificationsDocument = HydratedDocument<Notifications>;

@Schema({
  collection: 'notifications',
})
export class Notifications {
  @Prop({ type: Types.ObjectId })
  _id?: Types.ObjectId

  @Prop({ required: true })
  content: string;

  @Prop({ default: false })
  read: boolean;

  @Prop({ default: Date.now })
  created_at?: Date;

  @Prop({ default: Date.now })
  updated_at?: Date;

  @Prop({ default: Date.now })
  deleted_at?: Date;
}

export const NotificationsSchema = SchemaFactory.createForClass(Notifications);
