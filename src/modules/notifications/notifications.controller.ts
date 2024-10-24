import { Controller, Get, Param, Put, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard, ReqUserDto } from '../auth';
import { NotificationsService } from './notifications.service';
import { NotificationLeanDocument } from 'src/schemas';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getAllByUser(
    @Req() req: ReqUserDto,
  ): Promise<NotificationLeanDocument[]> {
    const { _id } = req.user;
    return this.notificationsService.getAllByUser(_id);
  }

  @Put(':id/read')
  async markNotificationAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }
}
