import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard, ReqUserDto } from '../auth';
import { CreateReactionsDto } from './dto';
import { ReactionsService } from './reactions.service';

@UseGuards(JwtAuthGuard)
@Controller('reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Post()
  async create(
    @Req() req: ReqUserDto,
    @Body() createReactionDto: CreateReactionsDto,
  ) {
    const { _id } = req.user;
    return this.reactionsService.create(_id, createReactionDto);
  }

  @Delete('/posts/:postId')
  async delete(@Req() req: ReqUserDto, @Param('postId') postId: string) {
    const { _id } = req.user;
    return this.reactionsService.delete(_id, postId);
  }
}
