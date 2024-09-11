import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { GroupsModule } from './modules/groups/groups.module';
import { UsersModule } from './modules/users/users.module';
import { PostsModule } from './modules/posts/posts.module';
import { ReactionsModule } from './modules/reactions/reactions.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { InvitationsModule } from './modules/invitations/invitations.module';

@Module({
  imports: [
    InvitationsModule,
    AuthModule,
    GroupsModule,
    UsersModule,
    PostsModule,
    ReactionsModule,
    NotificationsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
  ],
})
export class AppModule {}
