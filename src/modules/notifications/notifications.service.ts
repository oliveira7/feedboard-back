import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Notification, NotificationLeanDocument } from 'src/schemas';
import { CreateNotificationsDto, UpdateNotificationsDto } from './dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
  ) {}

  async getAllByUser(userId: string): Promise<NotificationLeanDocument[]> {
    return this.notificationModel
      .find({ user_id: userId })
      .lean<NotificationLeanDocument[]>()
      .exec();
  }

  async create(
    createNotificationDto: CreateNotificationsDto,
  ): Promise<NotificationLeanDocument> {
    const newNotification = new this.notificationModel(createNotificationDto);
    const savedNotification = await newNotification.save();

    return savedNotification.toObject() as unknown as NotificationLeanDocument;
  }

  async updateStatus(
    id: string,
    updateNotificationDto: UpdateNotificationsDto,
  ): Promise<NotificationLeanDocument> {
    const updatedNotification = await this.notificationModel
      .findByIdAndUpdate(id, updateNotificationDto, { new: true })
      .lean<NotificationLeanDocument>()
      .exec();

    if (!updatedNotification) {
      throw new NotFoundException(
        `Notificação com o ID "${id}" não foi encontrado`,
      );
    }

    return updatedNotification;
  }

  async delete(id: string): Promise<void> {
    const result = await this.notificationModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(
        `Notificação com o ID "${id}" não foi encontrado`,
      );
    }

    return;
  }
}
