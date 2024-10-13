import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from 'src/schemas';
import { CreatePostDto, UpdatePostDto } from './dto';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async getAll(group_id: string, page: number, limit: number): Promise<Post[]> {
    const matchStage: any = { parent_id: null };
    if (group_id) {
      matchStage.group_id = new Types.ObjectId(group_id);
    }

    page = Math.max(1, page);
    limit = Math.max(1, limit);
    const skip = (page - 1) * limit;

    return await this.postModel.aggregate([
      { $match: matchStage },
      {
        $sort: { created_at: -1 },
      },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'Post',
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
              $limit: limit,
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
                    $limit: limit,
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

  async getOne(id: string): Promise<Post> {
    const post = await this.postModel.findById(id).exec();
    if (!post) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }
    return post;
  }

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const newPost = new this.postModel(createPostDto);
    return newPost.save();
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const updatedPost = await this.postModel
      .findByIdAndUpdate(id, updatePostDto, { new: true })
      .exec();
    if (!updatedPost) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }
    return updatedPost;
  }

  async delete(id: string): Promise<void> {
    const result = await this.postModel
      .findByIdAndUpdate(id, { deleted_at: new Date() }, { new: true })
      .exec();
    if (!result) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }
  }
}
