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
    // ): Promise<PostLeanDocument[]> {
  ) {
    const matchStage: any = { parent_id: null, deleted_at: null };
    if (group_id) {
      matchStage.group_id = new Types.ObjectId(group_id);
    }

    return await this.getPostsWithComments(page || 1, limit || 10);
  }

  async getPostsWithComments(page = 1, pageSize = 10) {
    const posts = await this.postModel.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean();
  
    const postIds = posts.map((post) => post._id);
  
    const allComments = await this.postModel.find({
      parent_id: { $in: postIds },
      deleted_at: null,
    })
      .sort({ createdAt: -1 })
      .lean();
  
    const commentIds = allComments.map((comment) => comment._id);
    const allReplies = await this.postModel.find({
      parent_id: { $in: commentIds },
      deleted_at: null,
    })
      .sort({ createdAt: -1 })
      .lean();
  
    const buildTree = (parentId, allItems) => {
      return allItems
        .filter((item) => String(item.parent_id) === String(parentId))
        .slice(0, 5)
        .map((item) => ({
          ...item,
          replies: buildTree(item._id, allReplies).slice(0, 5),
        }));
    };
  

    const postsWithComments = posts.map((post) => ({
      ...post,
      comments: buildTree(post._id, allComments),
    }));
  
    return postsWithComments;
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
