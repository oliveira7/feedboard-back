import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserRequest, CreateUserResponse, GetUserByIdResponse } from '../dtos/user.dto';
import { UserService } from '../services/user.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<GetUserByIdResponse> {
    return await this.userService.getUserById(id);
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserRequest): Promise<CreateUserResponse> {
    return await this.userService.createUser(createUserDto);
  }
}
