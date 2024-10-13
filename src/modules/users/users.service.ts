import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUsersDto, UpdateUsersDto } from './dto';
import { User, UserLeanDocument } from 'src/schemas';


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
  //https://feedboard-api.vercel.app
  // async getAllUsers(page: number, limit: number): Promise<UserLeanDocument[]> {
  async getAllUsers(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const users = await this.userModel
      .find({ deleted_at: null })
      .skip(skip)
      .limit(limit)
      .lean<UserLeanDocument[] | null>()
      .exec();

    const total = await this.userModel.countDocuments();

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: users,
    };
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
    
    let updateData = { ...updateUserDto };
    if (updateUserDto.password_hash) {
      const salt = await bcrypt.genSalt(10);
      updateData = {
        ...updateData,
        password_hash: await bcrypt.hash(updateUserDto.password_hash, salt),
      };
    }
    console.log(updateData);
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
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

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.getUserByEmail(email);
    if (user && (await bcrypt.compare(password, user.password_hash))) {
      const { password_hash, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }
}
