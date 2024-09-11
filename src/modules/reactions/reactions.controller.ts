import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { CreateReactionsDto } from './dto/create-reactions.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Post()
  async createReaction(@Body() createReactionDto: CreateReactionsDto) {
    return this.reactionsService.createReaction(createReactionDto);
  }

  @Delete(':id')
  async deleteReaction(@Param('id') id: string) {
    return this.reactionsService.deleteReaction(id);
  }
}
