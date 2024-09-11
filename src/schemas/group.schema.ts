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

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'User' })
  members: ObjectId[];
}

export const GroupSchema = SchemaFactory.createForClass(Group);
