import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, ObjectId } from 'mongoose';

enum ReactionType {
  LIKE = 'like',
  LOVE = 'love',
  HAHA = 'haha',
  WOW = 'wow',
  SAD = 'sad',
  ANGRY = 'angry',
}

@Schema({
  collection: 'Reaction',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Reaction extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user_id: ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Post', required: true })
  post_id: ObjectId;

  @Prop({ type: String, enum: ReactionType, required: true })
  reaction_type: ReactionType;

  @Prop({ type: Date, default: null })
  deleted_at: Date | null;
}

export type ReactionLeanDocument = {
  _id: string;
  user_id: string;
  post_id: string;
  reaction_type: ReactionType;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

export type ReactionDocument = Reaction & Document;

export const ReactionSchema = SchemaFactory.createForClass(Reaction);
