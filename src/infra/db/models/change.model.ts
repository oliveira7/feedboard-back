import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, model } from 'mongoose';

export type ChangeDocument = HydratedDocument<Change>;

@Schema()
export class Change {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'User' })
  changed_by: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  previous_content: string;

  @Prop({ required: true })
  new_content: string;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;

  @Prop({ default: Date.now })
  deleted_at: Date;
}

export const ChangeSchema = SchemaFactory.createForClass(Change);
export const ChangeModel = model<Change>('Change', ChangeSchema);