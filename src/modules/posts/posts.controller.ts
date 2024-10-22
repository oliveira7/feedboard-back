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
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard, ReqUserDto } from '../auth';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto } from './dto';
import { PostLeanDocument } from 'src/schemas';

export enum PostType {
  POST = 'post',
  COMMENT = 'comment',
  REPLY = 'reply',
}

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Get()
  async getPosts(
    @Query('groupId') groupId?: string,
    @Query('parentId') parentId?: string,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 5,
    @Query('type') type?: PostType,
  // ): Promise<PostLeanDocument[]> {
  ) {
    return this.postService.getAll(groupId, parentId, page, limit, type);
  }

  @Get(':id')
  async getPost(@Param('id') id: string): Promise<PostLeanDocument> {
    return this.postService.getOne(id);
  }

  @Post()
  async create(
    @Req() req: ReqUserDto,
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostLeanDocument> {
    const { _id } = req.user;
    return this.postService.create(_id, createPostDto);
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
