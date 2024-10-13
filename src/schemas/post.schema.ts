import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, ObjectId } from 'mongoose';

@Schema({
  collection: 'Post',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Post extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  user_id: ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Post', default: null })
  parent_id?: ObjectId | null;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Group', default: null })
  group_id?: ObjectId | null;

  @Prop({ type: String, required: true, default: null })
  content: string | null;

  @Prop({ 
    type: [{ 
      base64: { type: String, required: true }, 
      type: { type: String, enum: ['image', 'video'], required: true } 
    }], 
    default: [] 
  })
  media: Array<{
    base64: string;
    type: 'image' | 'video';
  }>;

  @Prop({ type: Boolean, required: true, default: false })
  pinned: boolean;
}

export type PostLeanDocument = {
  _id: string;
  user_id: string;
  parent_id?: string | null;
  group_id?: string | null;
  content: string | null;
  media:
    | {
        base64: string;
        type: 'image' | 'video';
      }[]
    | [];
  pinned: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

export type PostDocument = Post & Document;

export const PostSchema = SchemaFactory.createForClass(Post);
