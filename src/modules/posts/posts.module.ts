import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Post, PostSchema } from 'src/schemas';
import { FeedGateway } from 'src/gateway';
import { GroupsModule } from '../groups';
import { NotificationsModule } from '../notifications';

@Module({
  imports: [
    GroupsModule,
    NotificationsModule,
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  controllers: [PostsController],
  providers: [PostsService, FeedGateway],
  exports: [PostsService],
})
export class PostsModule {}
