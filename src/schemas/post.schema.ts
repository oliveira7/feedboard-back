import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, ObjectId } from 'mongoose';

@Schema({
  collection: 'Post',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Post extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user_id: ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Group', required: false })
  group_id: ObjectId;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: [{ url: String, type: String }], default: [] })
  media_urls: {
    url: string;
    type: 'image' | 'video';
  }[];

  @Prop({ type: Boolean, default: false, required: true })
  pinned: boolean;
}

export const PostSchema = SchemaFactory.createForClass(Post);
