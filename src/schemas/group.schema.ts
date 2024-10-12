import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, ObjectId } from 'mongoose';

@Schema({
  collection: 'Group',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Group extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  created_by: ObjectId;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'User', default: [] })
  members?: ObjectId[] | [];
}

export type GroupLeanDocument = {
  _id: string;
  name: string;
  created_by: string;
  members?: string[] | [];
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

export type GroupDocument = Group & Document;

export const GroupSchema = SchemaFactory.createForClass(Group);
