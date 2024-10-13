import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto } from './dto';

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Get()
  async getPosts(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('group_id') group_id: string,
  ) {
    return this.postService.getAll(group_id, page, limit);
  }

  @Get(':id')
  async getPost(@Param('id') id: string) {
    return this.postService.getOne(id);
  }

  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    console.log(createPostDto);
    return this.postService.create(createPostDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.postService.delete(id);
  }
}
