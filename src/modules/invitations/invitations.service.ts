import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class InvitationsService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}
  
  async sendInvitations(emails: string[]): Promise<void> {
    const invitations = emails.map(email => {
      const token = this.jwtService.sign({ email }, { expiresIn: '7d' });
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
}
