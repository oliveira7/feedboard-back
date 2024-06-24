import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, model } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

@Schema()
export class Post {
  @Prop({ required: true })
  author: {
    userId: MongooseSchema.Types.ObjectId;
    name: string;
    avatar_url: string;
  };

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Post', default: null })
  parent_id: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user_id: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Group', default: null })
  group_id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop([
    {
      type: {
        type: String,
        enum: ['image', 'video'],
        required: true,
      },
      url: { type: String, required: true },
      metadata: {
        width: { type: Number, required: true },
        height: { type: Number, required: true },
        size: { type: Number, required: true },
        format: { type: String, required: true },
      },
    },
  ])
  files: Array<{
    type: 'image' | 'video';
    url: string;
    metadata: {
      width: number;
      height: number;
      size: number;
      format: string;
    };
  }>;

  @Prop({ default: false })
  pinned: boolean;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;

  @Prop({ default: Date.now })
  deleted_at: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
export const PostModel = model<Post>('Post', PostSchema);