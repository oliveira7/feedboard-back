import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type ReactionDocument = HydratedDocument<Reaction>;

@Schema()
export class Reaction {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'User' })
  user_id: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  post_id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, enum: ['like', 'clap', 'idea', 'laugh'] })
  reaction_type: string;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;

  @Prop({ default: Date.now })
  deleted_at: Date;
}

export const ReactionSchema = SchemaFactory.createForClass(Reaction);
