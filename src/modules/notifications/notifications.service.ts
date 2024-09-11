import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from '../../schemas/notification.schema';
import { CreateNotificationsDto } from './dto/create-notifications.dto';
import { UpdateNotificationsDto } from './dto/update-notifications.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
  ) {}

  async createNotification(
    createNotificationDto: CreateNotificationsDto,
  ): Promise<Notification> {
    const newNotification = new this.notificationModel(createNotificationDto);
    return newNotification.save();
  }

  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    return this.notificationModel.find({ user_id: userId }).exec();
  }

  async updateNotificationStatus(
    id: string,
    updateNotificationDto: UpdateNotificationsDto,
  ): Promise<Notification> {
    const updatedNotification = await this.notificationModel
      .findByIdAndUpdate(id, updateNotificationDto, { new: true })
      .exec();
    if (!updatedNotification) {
      throw new NotFoundException(`Notification with ID "${id}" not found`);
    }
    return updatedNotification;
  }

  async deleteNotification(id: string): Promise<void> {
    const result = await this.notificationModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Notification with ID "${id}" not found`);
    }
  }
}
