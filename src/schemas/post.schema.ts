import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { EditHistory, EditHistorySchema } from './edit-history.schema';
import {
  ReactionSummary,
  ReactionSummarySchema,
} from './reaction-summary.schema';

export type PostDocument = HydratedDocument<Post>;

@Schema()
export class Post {
  @Prop({ type: MongooseSchema.Types.ObjectId })
  parent_id: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'User' })
  user_id: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Group' })
  group_id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop([String])
  media_urls: string[];

  @Prop({ default: false })
  pinned: boolean;

  @Prop({ default: 0 })
  comment_count: number;

  @Prop({ type: ReactionSummarySchema })
  reaction_summary: ReactionSummary;

  @Prop({ type: [EditHistorySchema] })
  edit_history: EditHistory[];

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;

  @Prop({ default: Date.now })
  deleted_at: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
