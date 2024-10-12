import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Invitation, InvitationSchema } from 'src/schemas/invitation.schema';
import { UsersModule } from '../users';
import { AuthModule } from '../auth';
import { InvitationsService } from './invitations.service';
import { InvitationsController } from './invitations.controller';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    MongooseModule.forFeature([
      { name: Invitation.name, schema: InvitationSchema },
    ]),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST || 'smtp.mailtrap.io',
        port: process.env.MAIL_PORT || 2525,
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
      defaults: {
        from: process.env.MAIL_FROM || '"No Reply" <noreply@feedboard.com.br>'
      },
    }),
  ],
  providers: [InvitationsService],
  controllers: [InvitationsController],
})
export class InvitationsModule {}
