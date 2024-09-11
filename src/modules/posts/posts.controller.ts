import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-posts.dto';
import { UpdatePostDto } from './dto/update-posts.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('post')
export class PostsController {
  constructor(private readonly PostService: PostsService) {}

  @Post()
  async createPost(@Body() createPostDto: CreatePostDto) {
    return this.PostService.createPost(createPostDto);
  }

  @Get()
  async getPost(@Query('group_id') group_id: string) {
    return this.PostService.getPostsByGroup(group_id);
  }

  @Get(':id')
  async getPostById(@Param('id') id: string) {
    return this.PostService.getPostById(id);
  }

  @Patch(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.PostService.updatePost(id, updatePostDto);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    return this.PostService.deletePost(id);
  }
}
