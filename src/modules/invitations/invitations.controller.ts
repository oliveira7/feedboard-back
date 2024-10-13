import { Controller, Post, Body, Put, Delete, Param } from '@nestjs/common';
import { InvitationsService } from './invitations.service';

@Controller('invitations')
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Post('sends')
  async sendInvitations(@Body('emails') emails: string[]): Promise<any> {
    return await this.invitationsService.sendInvitations(emails);
  }

  @Post('informations')
  async sendInformations(@Body('message') message: string): Promise<any> {
    return this.invitationsService.sendInformations(message);
  }

  // @Put('groups/:groupId')
  // async addToGroup(
  //   @Param('groupId') groupId: string,
  //   @Body('userId') userId: string
  // ): Promise<any> {
  //   return await this.invitationsService.addToGroup(groupId, userId);
  // }

  // @Delete('groups/:groupId')
  // async deleteFromGroup(    
  //   @Param('groupId') groupId: string,
  //   @Body('userId') userId: string
  // ): Promise<any> {
  //   return await this.invitationsService.deleteFromGroup(groupId, userId);
  // }
}
