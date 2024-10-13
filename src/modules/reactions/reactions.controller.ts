import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth';
import { CreateReactionsDto } from './dto';
import { ReactionsService } from './reactions.service';

@UseGuards(JwtAuthGuard)
@Controller('reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Post()
  async create(@Body() createReactionDto: CreateReactionsDto) {
    return this.reactionsService.create(createReactionDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.reactionsService.delete(id);
  }
}
