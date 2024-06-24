import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, model } from 'mongoose';
import { Notification, NotificationSchema } from './notification.model';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, enum: ['aluno', 'professor', 'coordenador'] })
  role: string;

  @Prop()
  avatar_url: string;

  @Prop({ required: true })
  password_hash: string;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Group' })
  groups: MongooseSchema.Types.ObjectId[];

  @Prop({ type: [NotificationSchema], default: [] })
  notifications: Notification[];

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;

  @Prop({ default: Date.now })
  deleted_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
export const UserModel = model<User>('User', UserSchema);