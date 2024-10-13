import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from 'src/schemas';
import { CreatePostDto, UpdatePostDto } from './dto';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async createPost(createPostDto: CreatePostDto): Promise<Post> {
    const newPost = new this.postModel(createPostDto);
    return newPost.save();
  }

  async getPosts(group_id: string, page: number = 1, limit: number = 10): Promise<Post[]> {
    const skip = (page - 1) * limit;
  
    return await this.postModel.aggregate([
      {
        $match: {
          parent_id: null,
          // Descomente e ajuste se precisar filtrar por group_id
          // group_id: group_id ? new Types.ObjectId(group_id) : null,
        },
      },
      {
        $sort: { created_at: -1 },
      },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'Post', // Certifique-se de que este é o nome correto da coleção
          let: { postId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$parent_id', '$$postId'] },
              },
            },
            {
              $sort: { created_at: -1 },
            },
            {
              $limit: 5, // Limite de comentários por post
            },
            {
              $lookup: {
                from: 'Post',
                let: { commentId: '$_id' },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ['$parent_id', '$$commentId'] },
                    },
                  },
                  {
                    $sort: { created_at: -1 },
                  },
                  {
                    $limit: 5, // Limite de respostas por comentário
                  },
                ],
                as: 'replies',
              },
            },
          ],
          as: 'comments',
        },
      },
    ]);
  }
  

  async getPost(id: string): Promise<Post> {
    const post = await this.postModel.findById(id).exec();
    if (!post) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }
    return post;
  }

  async updatePost(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const updatedPost = await this.postModel
      .findByIdAndUpdate(id, updatePostDto, { new: true })
      .exec();
    if (!updatedPost) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }
    return updatedPost;
  }

  async deletePost(id: string): Promise<void> {
    const result = await this.postModel
      .findByIdAndUpdate(id, { deleted_at: new Date() }, { new: true })
      .exec();
    if (!result) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }
  }
}
