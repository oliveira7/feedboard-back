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
import { NotificationLeanDocument } from 'src/schemas';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get(':userId')
  async getAllByUser(
    @Param('userId') userId: string,
  ): Promise<NotificationLeanDocument[]> {
    return this.notificationsService.getAllByUser(userId);
  }

  @Post()
  async create(
    @Body() createNotificationDto: CreateNotificationsDto,
  ): Promise<NotificationLeanDocument> {
    return this.notificationsService.create(createNotificationDto);
  }

  @Put(':id')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationsDto,
  ): Promise<NotificationLeanDocument> {
    return this.notificationsService.updateStatus(id, updateNotificationDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    this.notificationsService.delete(id);

    return;
  }
}
