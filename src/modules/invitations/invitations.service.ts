import { JwtService } from '@nestjs/jwt';
import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { UsersService } from '../users';
import { GroupsService } from '../groups';
import { GroupLeanDocument, Invitation } from 'src/schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InvitationsServiceInterface } from './invitations.interface';
import { UsersServiceInterface } from '../users/users.interface';

@Injectable()
export class InvitationsService implements InvitationsServiceInterface {
  constructor(
    @InjectModel(Invitation.name) private invitationModel: Model<Invitation>,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersServiceInterface,
    @Inject(GroupsService) private groupsService: GroupsService,
    @Inject(JwtService) private jwtService: JwtService,
    @Inject(MailerService) private mailerService: MailerService,
  ) {}

  async sendInvitations(emails: string[]): Promise<void> {
    const invitations = emails.map(async (email) => {
      const token = this.jwtService.sign({ email }, { expiresIn: '7d' });

      const newInvitation = new this.invitationModel({
        email,
        token,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      const savedInvitation = await newInvitation.save();

      const link = `http://feedboard.com/register?token=${token}`;

      return this.mailerService.sendMail({
        to: email,
        subject: 'Convite para se registrar',
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #4CAF50;">Você foi convidado para o FeedBoard!</h2>
          <p>Olá,</p>
          <p>Estamos felizes em convidá-lo para se registrar no <strong>FeedBoard</strong>, uma plataforma onde você pode interagir com seus colegas e compartilhar conhecimentos.</p>
          <p>Para criar sua conta, clique no botão abaixo:</p>
          <a href="${link}" style="display: inline-block; padding: 10px 20px; margin: 10px 0; font-size: 16px; color: white; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">Criar Conta</a>
          <p>Se o botão acima não funcionar, copie e cole o seguinte link no seu navegador:</p>
          <p><a href="${link}" style="color: #4CAF50;">${link}</a></p>
          <p style="font-size: 12px; color: gray;">Este convite expira em 7 dias.</p>
          <hr>
          <p style="font-size: 12px; color: gray;">Equipe FeedBoard</p>
        </div>
      `,
      });
    });

    await Promise.all(invitations);
  }

  async sendInformations(message: string): Promise<void> {
    const students = await this.usersService.getAllStudents();
    const emails = students.map((student) => student.email);

    const emailPromises = emails.map((email) => {
      return this.mailerService.sendMail({
        to: email,
        subject: 'Informativo importante',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color: #4CAF50;">Mensagem da Coordenadora</h2>
            <p>${message}</p>
            <p>Atenciosamente,</p>
            <p>Equipe de Coordenação</p>
          </div>
        `,
      });
    });

    await Promise.all(emailPromises);
  }

  async addToGroup(groupId: string, email: string): Promise<GroupLeanDocument> {
    const user = await this.usersService.getUserByEmail(email);

    return await this.groupsService.addUserToGroup(groupId, user._id);
  }

  async deleteFromGroup(groupId: string, email: string): Promise<void> {
    const user = await this.usersService.getUserByEmail(email);

    await this.groupsService.deleteUserFromGroup(groupId, user._id);
  }

  async validateToken(token: string): Promise<boolean> {
    const invitation = await this.invitationModel
      .findOne({
        token,
        used: false,
        expires_at: { $gte: new Date() },
      })
      .lean<Invitation | null>()
      .exec();

    if (!invitation) {
      return false;
    }

    return true;
  }

  async decodeInvitationToken(token: string): Promise<string> {
    const decoded = this.jwtService.verify(token);

    if (!decoded.email) {
      throw new UnauthorizedException('Token inválido');
    }

    return decoded.email;
  }
}
