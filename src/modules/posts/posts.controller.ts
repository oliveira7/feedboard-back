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
  async getPosts(@Query('group_id') group_id: string) {
    return this.postService.getPosts(group_id);
  }

  @Get(':id')
  async getPost(@Param('id') id: string) {
    return this.postService.getPost(id);
  }

  @Post()
  async createPost(@Body() createPostDto: CreatePostDto) {
    console.log(createPostDto);
    return this.postService.createPost(createPostDto);
  }

  @Put(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.updatePost(id, updatePostDto);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    return this.postService.deletePost(id);
  }
}
