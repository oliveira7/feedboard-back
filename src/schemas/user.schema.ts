import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

enum Role {
  STUDENT = 'student',
  TEACHER = 'teacher',
  COORDINATOR = 'coordinator',
}

@Schema({
  collection: 'User',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class User extends Document {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, enum: Role, required: true })
  role: Role;

  @Prop({ type: String, required: true })
  avatar_url: string;

  @Prop({ type: String, required: true })
  password_hash: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Notification' }] })
  notifications: Types.ObjectId[];

  @Prop({ type: Date, default: null })
  deleted_at: Date;
}

export type UserLeanDocument = {
  _id: string;
  name: string;
  email: string;
  password_hash: string;
  avatar_url?: string;
  notifications: any[];
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
