import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type EditHistoryDocument = HydratedDocument<EditHistory>;

@Schema()
export class EditHistory {
  @Prop({ default: Date.now })
  timestamp: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  changed_by: MongooseSchema.Types.ObjectId;

  @Prop()
  previous_content: string;

  @Prop()
  new_content: string;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;

  @Prop({ default: Date.now })
  deleted_at: Date;
}

export const EditHistorySchema = SchemaFactory.createForClass(EditHistory);
