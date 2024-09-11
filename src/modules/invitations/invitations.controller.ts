import { Controller, Post, Body } from '@nestjs/common';
import { InvitationsService } from './invitations.service';

@Controller('invitations')
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Post('send')
  async sendInvitations(@Body('emails') emails: string[]): Promise<any> {
    return await this.invitationsService.sendInvitations(emails);
  }
}
