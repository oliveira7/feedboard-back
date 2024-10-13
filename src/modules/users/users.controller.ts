import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersDto, UpdateUsersDto } from './dto';
import { JwtAuthGuard } from '../auth';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return this.usersService.getAllUsers(page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Post()
  async create(@Body() createUserDto: CreateUsersDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUsersDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
