import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type ChangeDocument = HydratedDocument<Changes>;

@Schema({
  collection: 'changes',
})
export class Changes {
  @Prop({ type: Types.ObjectId })
  _id?: Types.ObjectId

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'Users' })
  changed_by: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  previous_content: string;

  @Prop({ required: true })
  new_content: string;

  @Prop({ default: Date.now })
  created_at?: Date;

  @Prop({ default: Date.now })
  updated_at?: Date;

  @Prop({ default: Date.now })
  deleted_at?: Date;
}

export const ChangesSchema = SchemaFactory.createForClass(Changes);