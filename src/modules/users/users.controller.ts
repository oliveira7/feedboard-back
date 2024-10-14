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
import { UserLeanDocument } from 'src/schemas';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(
    @Query('limit') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query() queries: any,
  ): Promise<UserLeanDocument[]> {
    return this.usersService.getAll(page, limit, queries);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string): Promise<UserLeanDocument> {
    return this.usersService.getOne(id);
  }

  //TODO: Precisa estar online ou deixo aberto?
  //acho que já posso criar no db com email e ao chegar com token já loga o cara e ele termina o cadastro
  @Post()
  async create(
    @Body() createUserDto: CreateUsersDto,
  ): Promise<UserLeanDocument> {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUsersDto,
  ): Promise<UserLeanDocument> {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    this.usersService.delete(id);

    return;
  }
}
