import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Notification, NotificationLeanDocument } from 'src/schemas';
import { CreateNotificationsDto } from './dto';

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

  async markAsRead(notificationId: string): Promise<NotificationLeanDocument> {
    const notification = await this.notificationModel.findById(notificationId);

    if (!notification) {
      throw new NotFoundException('Notificação não encontrada');
    }

    notification.read = true;
    await notification.save();

    return notification.toObject() as unknown as NotificationLeanDocument;
  }
}
