import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../domain/interfaces/user.repo.interface';
import { User } from '../domain/entities/user.entity';
import { CreateUserDto } from '../adapters/dto/create-user.dto';
import { USER_REPOSITORY_TOKEN } from 'src/domain/contants/user.constants';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN) private userRepository: IUserRepository
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new User(
      null,
      createUserDto.name,
      createUserDto.email,
      createUserDto.role,
      createUserDto.avatarUrl,
      createUserDto.password,
      new Date(), // createdAt
      new Date(), // updatedAt
      null  // deletedAt
    );
    return await this.userRepository.save(newUser);
  }

  async getUserById(id: string): Promise<User> {
    return await this.userRepository.findById(id);
  }
}
