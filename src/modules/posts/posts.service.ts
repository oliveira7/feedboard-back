import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Post, PostLeanDocument } from 'src/schemas';
import { CreatePostDto, UpdatePostDto } from './dto';
import { PostType } from './posts.controller';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async getAll(
    groupId: string,
    parentId: string,
    page: number = 1,
    limit: number = 5,
    type?: PostType,
    // ): Promise<PostLeanDocument[]> {
  ) {
    const matchStage: any = { parent_id: null, deleted_at: null };
    if (groupId) {
      matchStage.group_id = new Types.ObjectId(groupId);
    }

    if (parentId) {
      matchStage.parent_id = new Types.ObjectId(parentId);
    }

    let sort: any = { created_at: -1 };
    if (type === 'reply') {
      sort.created_at = 1;
    }

    const skip = (page - 1) * limit;
    const posts = await this.postModel.aggregate([
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
        $lookup: {
          from: 'Post',
          localField: '_id',
          foreignField: 'parent_id',
          as: 'children',
        },
      },
      {
        $addFields: {
          totalChildren: { $size: '$children' },
        },
      },
      {
        $project: {
          children: 0,
        },
      },
      {
        $sort: sort,
      },
      {
        $skip: skip,
      },
      {
        $limit: Number(limit),
      },
      {
        $project: {
          _id: 1,
          parent_id: 1,
          group_id: 1,
          totalChildren: 1,
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

    const total = await this.postModel
      .countDocuments({ ...matchStage, deleted_at: null })
      .exec();

    return {
      page,
      totalPages: Math.ceil(total / limit),
      limit,
      total,
      posts,
    };
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

  //TODO: validar criações de postagens(id do pai é do pai mesmo??)
  async create(
    userId: string,
    createPostDto: CreatePostDto,
  ): Promise<PostLeanDocument> {
    const newPost = new this.postModel({ ...createPostDto, user_id: userId });
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
