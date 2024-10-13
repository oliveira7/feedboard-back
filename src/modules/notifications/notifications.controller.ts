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
    return this.notificationsService.create(createNotificationDto);
  }

  @Get(':userId')
  async getAllByUser(@Param('userId') userId: string) {
    return this.notificationsService.getAllByUser(userId);
  }

  @Put(':id')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationsDto,
  ) {
    return this.notificationsService.updateStatus(id, updateNotificationDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.notificationsService.delete(id);
  }
}
