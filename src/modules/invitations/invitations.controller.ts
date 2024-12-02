import {
  Controller,
  Post,
  Body,
  Put,
  Delete,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { GroupLeanDocument } from 'src/schemas';
import { JwtAuthGuard, ReqUserDto } from '../auth';
import { EmailDto, EmailsDto } from './dto';

@UseGuards(JwtAuthGuard)
@Controller('invitations')
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Post('sends')
  async sendInvitations(@Body() emailsDto: EmailsDto): Promise<void> {
    const { emails } = emailsDto;
    await this.invitationsService.sendInvitations(emails);

    return;
  }

  @Post('informations')
  async sendInformations(
    @Req() req: ReqUserDto,
    @Body() body: { subject: string; message: string }
  ): Promise<void> {
    const { subject, message } = body;
    const { _id } = req.user;

    await this.invitationsService.sendInformations(subject, message, _id);

    return;
  }

  @Put('groups/:groupId')
  async addToGroup(
    @Param('groupId') groupId: string,
    @Body() emailDto: EmailDto,
  ): Promise<GroupLeanDocument> {
    const { email } = emailDto;
    return await this.invitationsService.addToGroup(groupId, email);
  }

  @Delete('groups/:groupId')
  async deleteFromGroup(
    @Param('groupId') groupId: string,
    @Body() emailDto: EmailDto,
  ): Promise<void> {
    const { email } = emailDto;
    await this.invitationsService.deleteFromGroup(groupId, email);
  }
}
