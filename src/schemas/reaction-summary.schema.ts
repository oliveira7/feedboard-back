import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class ReactionSummary {
  @Prop({ default: 0 })
  like: number;

  @Prop({ default: 0 })
  clap: number;

  @Prop({ default: 0 })
  idea: number;

  @Prop({ default: 0 })
  laugh: number;

  @Prop({ default: Date.now })
  deleted_at: Date;
}

export const ReactionSummarySchema =
  SchemaFactory.createForClass(ReactionSummary);
