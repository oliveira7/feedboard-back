import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Reaction } from 'src/schemas';
import { CreateReactionsDto } from './dto/create-reactions.dto';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectModel(Reaction.name) private reactionModel: Model<Reaction>,
  ) {}

  async createReaction(
    createReactionDto: CreateReactionsDto,
  ): Promise<Reaction> {
    const newReaction = new this.reactionModel(createReactionDto);
    return newReaction.save();
  }

  async deleteReaction(id: string): Promise<void> {
    const result = await this.reactionModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Reaction with ID "${id}" not found`);
    }
  }
}
