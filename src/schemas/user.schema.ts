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

  @Prop({ type: String, default: 'Física' })
  course?: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: String, enum: Role, required: false, default: Role.STUDENT })
  role: Role;

  @Prop({ type: String })
  avatar: string;

  @Prop({ type: String, required: true })
  password_hash: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Notification' }], default: [] })
  notifications?: Types.ObjectId[];

  @Prop({ type: Date, default: null })
  deleted_at: Date | null;
}

export type UserLeanDocument = {
  _id: string;
  name: string;
  email: string;
  course?: string;
  description?: string;
  password_hash: string;
  avatar?: string;
  notifications?: any[];
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
