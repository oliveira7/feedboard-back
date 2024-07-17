import { Inject, Injectable } from '@nestjs/common';
import { USERS_REPOSITORY_PROVIDER, UsersRepository } from '@app/core';
import { CreateUserRequest, CreateUserResponse, GetUserByIdResponse } from '../dtos/user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject(USERS_REPOSITORY_PROVIDER) private readonly userRepository: UsersRepository
  ) {}

  async createUser(createUserDto: CreateUserRequest): Promise<CreateUserResponse> {
    return await this.userRepository.createUser(createUserDto);
  }

  async getUserById(id: string): Promise<GetUserByIdResponse> {
    return await this.userRepository.findUserById(id);
  }
}
