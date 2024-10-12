import { Controller, Post, Body } from '@nestjs/common';
import { InvitationsService } from './invitations.service';

//TODO: Posso dividir responsabilidades ou torna essa controller de envios de e-mails mais genérica
@Controller('invitations')
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Post('send')
  async sendInvitations(@Body('emails') emails: string[]): Promise<any> {
    return await this.invitationsService.sendInvitations(emails);
  }

  @Post('informations')
  async sendInformations(@Body('message') message: string): Promise<any> {
    return this.invitationsService.sendInformations(message);
  }
}
