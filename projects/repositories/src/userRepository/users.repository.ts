
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '@app/core'
import { UsersDocument } from '@app/infrastructure/models';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class MongoUsersRepository implements UsersRepository {

  constructor(@InjectModel('Users') private readonly UsersModel: Model<UsersDocument>) {}

  async findUserById(id: string): Promise<UsersDocument> {
    return await this.UsersModel.findById(id);
  }

  async createUser(createUserDto: any): Promise<UsersDocument> {
    return await this.UsersModel.create(createUserDto);
  }
}