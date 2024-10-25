import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { Post, PostLeanDocument } from 'src/schemas';
import { CreatePostDto, UpdatePostDto } from './dto';
import { PostType } from './posts.controller';
import { FeedGateway } from 'src/gateway';
import { GroupsService } from '../groups';
import { NotificationsService } from '../notifications';
import sharp from 'sharp';
import { put } from '@vercel/blob';

@Injectable()
export class PostsService implements OnModuleInit {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @Inject(GroupsService) private readonly groupsService: GroupsService,
    @Inject(NotificationsService) private readonly notificationsService: any,
    private readonly feedGateway: FeedGateway,
  ) {}

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
        $lookup: {
          from: 'Reaction',
          localField: '_id',
          foreignField: 'post_id',
          as: 'reaction',
        },
      },
      {
        $lookup: {
          from: 'User',
          localField: 'reaction.user_id',
          foreignField: '_id',
          as: 'reactedUsers',
        },
      },
      {
        $addFields: {
          peoplesReacted: {
            $map: {
              input: '$reactedUsers',
              as: 'user',
              in: {
                user_id: '$$user._id',
                name: '$$user.name',
              },
            },
          },
          totalReaction: { $size: '$reaction' },
        },
      },
      {
        $project: {
          reaction: 0,
          reactedUsers: 0,
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
          totalReaction: 1,
          peoplesReacted: 1,
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

  async create(
    userId: string,
    createPostDto: CreatePostDto,
    files: Array<Express.Multer.File>,
  ): Promise<PostLeanDocument> {
    let media = [];

    if (files) {
      media = await Promise.all(
        files.map(async (file) => {
          const buffer = await sharp(file.buffer).webp().toBuffer();
          const { url } = await put(
            `${new Date().toISOString()}.webp`,
            buffer,
            {
              contentType: 'image/webp',
              access: 'public',
            },
          );

          return {
            url,
            type: 'image',
          };
        }),
      );
    }
    console.log('parou aqui?');
    const newPost = new this.postModel({
      ...createPostDto,
      media,
      user_id: userId,
    });
    const savedPost = await newPost.save();

    let usersToNotify: string[] = [];
    if (savedPost.group_id) {
      const group = await this.groupsService.getAllUsersFromGroup(
        savedPost.group_id,
      );
      const { members } = group;
      usersToNotify = members.map((userId) => userId.toString());
    }

    usersToNotify = usersToNotify.filter(
      (userId) => userId !== savedPost.user_id.toString(),
    );

    const notifications = usersToNotify.map((userId) => ({
      user_id: new Types.ObjectId(userId),
      post_id: savedPost._id,
      type: 'NEW_POST',
      message: 'Um nova postagem foi feita pelo seu grupo.',
    }));

    await Promise.all(
      notifications.map((notification) =>
        this.notificationsService.create(notification),
      ),
    );

    return savedPost.toObject() as unknown as PostLeanDocument;
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    files: Array<Express.Multer.File>,
  ): Promise<PostLeanDocument> {
    let media = [];

    if (files && files.length) {
      media = await Promise.all(
        files.map(async (file) => {
          const buffer = await sharp(file.buffer).webp().toBuffer();
          const { url } = await put(
            `${new Date().toISOString()}.webp`,
            buffer,
            {
              contentType: 'image/webp',
              access: 'public',
            },
          );

          return {
            url,
            type: 'image',
          };
        }),
      );
      updatePostDto = { ...updatePostDto, media };
    }

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

  async onModuleInit() {
    const changeStream = this.postModel.watch();

    changeStream.on('change', (change) => {
      this.feedGateway.handleNewPost(change.fullDocument);
    });
  }
}
