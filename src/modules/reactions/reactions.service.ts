import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Reaction, ReactionLeanDocument } from 'src/schemas';
import { CreateReactionsDto } from './dto/create-reactions.dto';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectModel(Reaction.name) private reactionModel: Model<Reaction>,
  ) {}

  async create(
    createReactionDto: CreateReactionsDto,
  ): Promise<ReactionLeanDocument> {
    const newReaction = new this.reactionModel(createReactionDto);
    const savedReaction = await newReaction.save();

    return savedReaction.toObject() as unknown as ReactionLeanDocument;
  }

  async delete(id: string): Promise<void> {
    const result = await this.reactionModel
      .findByIdAndDelete(new Types.ObjectId(id))
      .exec();

    if (!result) {
      throw new NotFoundException(`Reaction with ID "${id}" not found`);
    }

    return;
  }
}
