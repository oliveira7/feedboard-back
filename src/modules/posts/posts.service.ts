import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '../../schemas/post.schema';
import { CreatePostDto } from './dto/create-posts.dto';
import { UpdatePostDto } from './dto/update-posts.dto';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async createPost(createPostDto: CreatePostDto): Promise<Post> {
    const newPost = new this.postModel(createPostDto);
    return newPost.save();
  }

  async getPosts(group_id: string): Promise<Post[]> {
    //todo: implement pagination
    //todo: implement reactions counts
    //todo: implement comments counts
    return await this.postModel.aggregate([
      {
        $match: { 
          parent_id: null,
          // group_id: group_id,
        }
      },
      {
        $lookup: {
          from: 'Post',
          localField: '_id',
          foreignField: 'parent_id',
          as: 'comments'
        }
      },
      {
        $unwind: {
          path: '$comments',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'Post',
          localField: 'comments._id',
          foreignField: 'parent_id',
          as: 'comments.replies'
        }
      },
      {
        $group: {
          _id: '$_id',
          content: { $first: '$content' },
          created_at: { $first: '$created_at' },
          comments: { $push: '$comments' },
        }
      },
      {
        $sort: { created_at: -1 }
      }
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
