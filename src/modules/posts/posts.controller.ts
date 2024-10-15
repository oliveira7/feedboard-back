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
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto } from './dto';
import { PostLeanDocument } from 'src/schemas';

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Get()
  async getPosts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
    @Query('group_id') group_id?: string,
  ): Promise<PostLeanDocument[]> {
    return this.postService.getAll(group_id, page, limit);
  }

  @Get(':id')
  async getPost(@Param('id') id: string): Promise<PostLeanDocument> {
    return this.postService.getOne(id);
  }

  @Post()
  async create(
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostLeanDocument> {
    return this.postService.create(createPostDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostLeanDocument> {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    this.postService.delete(id);

    return;
  }
}
