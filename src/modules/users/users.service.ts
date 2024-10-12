import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserLeanDocument } from '../../schemas/user.schema';
import { CreateUsersDto } from './dto/create-users.dto';
import { UpdateUsersDto } from './dto/update-users.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUsersDto): Promise<User> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password_hash, salt);

    const newUser = new this.userModel({
      ...createUserDto,
      password_hash: hashedPassword,
    });

    return newUser.save();
  }

  async getAllUsers(): Promise<UserLeanDocument[]> {
    return this.userModel
      .find({ deleted_at: null })
      .lean<UserLeanDocument[] | null>()
      .exec();
  }

  async getAllStudents(): Promise<User[]> {
    return this.userModel.find({ role: 'student' }).exec();
  }

  async getUserById(id: string): Promise<UserLeanDocument> {
    const user = await this.userModel
      .findById(id)
      .lean<UserLeanDocument | null>()
      .exec();
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<UserLeanDocument> {
    const user = await this.userModel
      .findOne({ email: email, deleted_at: null })
      .lean<UserLeanDocument | null>()
      .exec();

    if (!user) {
      throw new NotFoundException(`User with email "${email}" not found`);
    }
    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUsersDto,
  ): Promise<User | null> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    const result = await this.userModel
      .findByIdAndUpdate(id, { deleted_at: new Date() }, { new: true })
      .exec();
    if (!result) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
  }
}
