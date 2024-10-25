import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUsersDto, UpdateUsersDto } from './dto';
import { User, UserLeanDocument } from 'src/schemas';
import { UsersServiceInterface } from './users.interface';
import { InvitationsServiceInterface } from '../invitations/invitations.interface';
import { InvitationsService } from '../invitations';
import sharp from 'sharp';
import { put } from '@vercel/blob';

@Injectable()
export class UsersService implements UsersServiceInterface {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(forwardRef(() => InvitationsService))
    private invitationsService: InvitationsServiceInterface,
  ) {}

  async getAll(
    page: number,
    limit: number,
    queries: any,
  ): Promise<UserLeanDocument[]> {
    page = Math.max(1, page);
    limit = Math.max(1, limit);
    const skip = (page - 1) * limit;

    const query: any = { deleted_at: null };

    if (queries.name) query.name = { $regex: new RegExp(queries.name, 'i') };
    if (queries.email) query.email = { $regex: new RegExp(queries.email, 'i') };
    if (queries.description)
      query.description = { $regex: new RegExp(queries.description, 'i') };
    if (queries.course)
      query.course = { $regex: new RegExp(queries.course, 'i') };

    return this.userModel
      .find(query)
      .select('-password_hash')
      .skip(skip)
      .limit(limit)
      .lean<UserLeanDocument[]>()
      .exec();
  }

  async getOne(id: string): Promise<UserLeanDocument> {
    const user = await this.userModel
      .findById(id)
      .select('-password_hash')
      .lean<UserLeanDocument | null>()
      .exec();

    if (!user) {
      throw new NotFoundException(`Usuário com ID "${id}" não foi encontrado`);
    }

    return user;
  }

  async create(createUserDto: CreateUsersDto): Promise<UserLeanDocument> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password_hash, salt);

    const validate = this.invitationsService.validateToken(createUserDto.token);

    if (!validate) {
      throw new UnauthorizedException('Token inválido');
    }

    let savedUser: User;
    if (validate) {
      const email = await this.invitationsService.decodeInvitationToken(
        createUserDto.token,
      );

      const newUser = new this.userModel({
        ...createUserDto,
        role: 'student',
        email,
        password_hash: hashedPassword,
      });

      savedUser = await newUser.save();
    }

    return savedUser.toObject() as unknown as UserLeanDocument;
  }

  async update(
    id: string,
    updateUserDto: UpdateUsersDto,
    avatar: Express.Multer.File,
  ): Promise<UserLeanDocument> {
    let updateData = { ...updateUserDto };

    if (avatar) {
      const webpBuffer = await sharp(avatar.buffer).webp().toBuffer();

      const { url } = await put(`${id}.webp`, webpBuffer, {
        contentType: 'image/webp',
        access: 'public',
      });

      updateData = {
        ...updateData,
        avatar: url,
      };
    }

    // if (updateUserDto.password_hash) {
    //   const salt = await bcrypt.genSalt(10);
    //   updateData = {
    //     ...updateData,
    //     password_hash: await bcrypt.hash(updateUserDto.password_hash, salt),
    //   };
    // }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .lean<UserLeanDocument | null>()
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`Usuário com ID "${id}" não foi encontrado`);
    }

    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    const result = await this.userModel
      .findByIdAndUpdate(id, { deleted_at: new Date() }, { new: true })
      .exec();

    if (!result) {
      throw new NotFoundException(
        `Usuário com o ID "${id}" não foi encontrado`,
      );
    }

    return;
  }

  async getAllStudents(): Promise<UserLeanDocument[]> {
    return this.userModel
      .find({ role: 'student' })
      .lean<UserLeanDocument[]>()
      .exec();
  }

  async getUserByEmail(email: string): Promise<UserLeanDocument> {
    const user = await this.userModel
      .findOne({ email: email, deleted_at: null })
      .lean<UserLeanDocument | null>()
      .exec();

    if (!user) {
      throw new NotFoundException(
        `Usuário com o EMAIL "${email}" não foi encontrado`,
      );
    }

    return user;
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserLeanDocument> {
    const user = await this.getUserByEmail(email);

    if (user && (await bcrypt.compare(password, user.password_hash))) {
      const { password_hash, ...result } = user;

      return result as UserLeanDocument;
    }

    throw new UnauthorizedException('Credenciais inválidas');
  }
}
