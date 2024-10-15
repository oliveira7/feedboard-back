import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Post, PostLeanDocument } from 'src/schemas';
import { CreatePostDto, UpdatePostDto } from './dto';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async getAll(
    group_id: string,
    page: number,
    limit: number,
  ): Promise<PostLeanDocument[]> {
    const matchStage: any = { parent_id: null, deleted_at: null };
    if (group_id) {
      matchStage.group_id = new Types.ObjectId(group_id);
    }

    const skip = (page - 1) * limit;
    return this.postModel.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: 'User',
          localField: 'user_id',
          foreignField: '_id',
          as: 'author',
        },
      },
      {
        $unwind: '$author',
      },
      {
        $sort: { created_at: -1 },
      },
      {
        $skip: skip,
      },
      // {
      //   $limit: limit
      // },
      {
        $project: {
          _id: 1,
          parent_id: 1,
          pinned: 1,
          content: 1,
          media: 1,
          created_at: 1,
          updated_at: 1,
          author: {
            _id: 1,
            name: 1,
            avatar_base64: 1,
          },
        },
      },
    ]);
  }

  async getOne(id: string): Promise<PostLeanDocument> {
    const post = await this.postModel
      .findById(id)
      .lean<PostLeanDocument | null>()
      .exec();

    if (!post) {
      throw new NotFoundException(`Postagem com ID "${id}" não foi encontrado`);
    }

    return post;
  }

  async create(createPostDto: CreatePostDto): Promise<PostLeanDocument> {
    const newPost = new this.postModel(createPostDto);
    const savedPost = await newPost.save();

    return savedPost.toObject() as unknown as PostLeanDocument;
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
  ): Promise<PostLeanDocument> {
    const updatedPost = await this.postModel
      .findByIdAndUpdate(id, updatePostDto)
      .lean<PostLeanDocument>()
      .exec();

    if (!updatedPost) {
      throw new NotFoundException(`Postagem com ID "${id}" não foi encontrado`);
    }

    return updatedPost;
  }

  async delete(id: string): Promise<void> {
    const result = await this.postModel
      .findByIdAndUpdate(id, { deleted_at: new Date() })
      .exec();

    if (!result) {
      throw new NotFoundException(`Postagem com ID "${id}" não foi encontrado`);
    }

    return;
  }
}
