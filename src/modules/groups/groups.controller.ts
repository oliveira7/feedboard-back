import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-groups.dto';
import { UpdateGroupDto } from './dto/update-groups.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  async createGroup(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.createGroup(createGroupDto);
  }

  @Get()
  async getAllGroups() {
    return this.groupsService.getAllGroups();
  }

  @Get(':id')
  async getGroupById(@Param('id') id: string) {
    return this.groupsService.getGroupById(id);
  }

  @Patch(':id')
  async updateGroup(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    return this.groupsService.updateGroup(id, updateGroupDto);
  }

  @Delete(':id')
  async deleteGroup(@Param('id') id: string) {
    return this.groupsService.deleteGroup(id);
  }
}
