import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { GroupsModule } from './modules/groups/groups.module';
import { UsersModule } from './modules/users/users.module';
import { PostsModule } from './modules/posts/posts.module';
import { ReactionsModule } from './modules/reactions/reactions.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { InvitationsModule } from './modules/invitations/invitations.module';
import { Gateway } from './gateway/gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    InvitationsModule,
    AuthModule,
    GroupsModule,
    UsersModule,
    PostsModule,
    ReactionsModule,
    NotificationsModule,
    Gateway,
  ],
})
export class AppModule {}
