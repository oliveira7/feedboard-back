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
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { CreateUsersDto, UpdateUsersDto } from './dto';
import { JwtAuthGuard } from '../auth';
import { UserLeanDocument } from 'src/schemas';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query() queries: any,
  ): Promise<UserLeanDocument[]> {
    return this.usersService.getAll(page, limit, queries);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string): Promise<UserLeanDocument> {
    return this.usersService.getOne(id);
  }

  @Post()
  async create(
    @Body() createUserDto: CreateUsersDto,
  ): Promise<UserLeanDocument> {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UseInterceptors(FileInterceptor('avatar'))
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUsersDto,
    @UploadedFile() avatar: Express.Multer.File,
  ): Promise<UserLeanDocument> {
    return this.usersService.update(id, updateUserDto, avatar);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    this.usersService.delete(id);

    return;
  }
}
