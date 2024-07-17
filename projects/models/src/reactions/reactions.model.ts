import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type ReactionsDocument = HydratedDocument<Reactions>;

@Schema({
  collection: 'reactions',
})
export class Reactions {
  @Prop({ type: Types.ObjectId })
  _id?: Types.ObjectId

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'Users' })
  user_id: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  post_id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, enum: ['like', 'clap', 'idea', 'laugh'] })
  reaction_type: string;

  @Prop({ default: Date.now })
  created_at?: Date;

  @Prop({ default: Date.now })
  updated_at?: Date;

  @Prop({ default: Date.now })
  deleted_at?: Date;
}

export const ReactionsSchema = SchemaFactory.createForClass(Reactions);
