import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { Notifications, NotificationsSchema } from '../notifications/notifications.model';

export type UsersDocument = HydratedDocument<Users>;

@Schema({
  collection: 'users',
})
export class Users {
  @Prop({ type: Types.ObjectId })
  _id?: Types.ObjectId

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, enum: ['student', 'teacher', 'coordinator'] })
  role: string;

  @Prop()
  avatar_url: string;

  @Prop({ required: true })
  password_hash: string;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Groups' })
  groups: MongooseSchema.Types.ObjectId[];

  @Prop({ type: [NotificationsSchema], default: [] })
  notifications: Notifications[];

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;

  @Prop({ default: Date.now })
  deleted_at: Date;
}

export const UsersSchema = SchemaFactory.createForClass(Users)