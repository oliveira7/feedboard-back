import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth';
import { GroupsService } from './groups.service';
import { CreateGroupDto, UpdateGroupDto } from './dto';

@UseGuards(JwtAuthGuard)
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  async getAll(): Promise<any> {
    return this.groupsService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<any> {
    return this.groupsService.getOne(id);
  }

  @Post()
  async create(@Body() createGroupDto: CreateGroupDto): Promise<any> {
    return this.groupsService.create(createGroupDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ): Promise<any> {
    return this.groupsService.update(id, updateGroupDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<any> {
    return this.groupsService.delete(id);
  }
}
