import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, model } from 'mongoose';

export type GroupDocument = HydratedDocument<Group>;

@Schema()
export class Group {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'User' })
  created_by: MongooseSchema.Types.ObjectId;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'User' })
  members: MongooseSchema.Types.ObjectId[];

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;

  @Prop({ default: Date.now })
  deleted_at: Date;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
export const GroupModel = model<Group>('Group', GroupSchema);