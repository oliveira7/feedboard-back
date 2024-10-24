import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users';
import { InvitationsService } from '../invitations';
import { GroupsModule } from '../groups';
import { InvitationsController } from './invitations.controller';
import { Invitation, InvitationSchema } from 'src/schemas/invitation.schema';

@Module({
  imports: [
    UsersModule,
    GroupsModule,
    InvitationsModule,
    MongooseModule.forFeature([
      { name: Invitation.name, schema: InvitationSchema },
    ]),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST') || 'smtp.mailtrap.io',
          port: configService.get<number>('MAIL_PORT') || 2525,
          secure: false,
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASS'),
          },
        },
        defaults: {
          from:
            configService.get<string>('MAIL_FROM') ||
            '"No Reply" <noreply@feedboard.com.br>',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [InvitationsService],
  controllers: [InvitationsController],
})
export class InvitationsModule {}
