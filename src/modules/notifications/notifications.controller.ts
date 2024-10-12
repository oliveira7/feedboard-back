import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth';
import { NotificationsService } from './notifications.service';
import { CreateNotificationsDto, UpdateNotificationsDto } from './dto';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  async createNotification(
    @Body() createNotificationDto: CreateNotificationsDto,
  ) {
    return this.notificationsService.createNotification(createNotificationDto);
  }

  @Get(':userId')
  async getNotificationsByUser(@Param('userId') userId: string) {
    return this.notificationsService.getNotificationsByUser(userId);
  }

  @Put(':id')
  async updateNotificationStatus(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationsDto,
  ) {
    return this.notificationsService.updateNotificationStatus(
      id,
      updateNotificationDto,
    );
  }

  @Delete(':id')
  async deleteNotification(@Param('id') id: string) {
    return this.notificationsService.deleteNotification(id);
  }
}
