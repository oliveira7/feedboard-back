import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Invitation, InvitationSchema } from 'src/schemas/invitation.schema';
import { AuthModule } from '../auth/auth.module';
import { InvitationsController } from './invitations.controller';
import { InvitationsService } from './invitations.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: Invitation.name, schema: InvitationSchema }]),
    MailerModule.forRoot({
      // transport: {
      //   host: process.env.SMTP_HOST === 'sandbox.smtp.mailtrap.io',
      //   port: process.env.SMTP_PORT === '2525',
      //   secure: process.env.SMTP_SECURE === 'true',
      //   auth: {
      //     user: process.env.SMTP_USER === '6e103951a7e76f',
      //     pass: process.env.SMTP_PASS === '58e89f4bdeab38',
      //   },
      // },
      transport: {
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        secure: false,
        auth: {
          user: '6e103951a7e76f',
          pass: '58e89f4bdeab38',
        },
      },
      defaults: {
        from: '"No Reply" <noreply@feedboard.com.br>',
      },
    }),
  ],
  providers: [InvitationsService],
  controllers: [InvitationsController],
})
export class InvitationsModule {}
