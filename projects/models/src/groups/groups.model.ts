import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type GroupsDocument = HydratedDocument<Groups>;

@Schema({
  collection: 'groups',
})
export class Groups {
  @Prop({ type: Types.ObjectId })
  _id?: Types.ObjectId

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'Users' })
  created_by: MongooseSchema.Types.ObjectId;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Users' })
  members: MongooseSchema.Types.ObjectId[];

  @Prop({ default: Date.now })
  created_at?: Date;

  @Prop({ default: Date.now })
  updated_at?: Date;

  @Prop({ default: Date.now })
  deleted_at?: Date;
}

export const GroupsSchema = SchemaFactory.createForClass(Groups);