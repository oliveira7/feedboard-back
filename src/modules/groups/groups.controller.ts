import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard, ReqUserDto } from '../auth';
import { GroupsService } from './groups.service';
import { CreateGroupDto, UpdateGroupDto } from './dto';
import { GroupLeanDocument } from 'src/schemas';

@UseGuards(JwtAuthGuard)
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  async getAllByUser(@Req() req: ReqUserDto): Promise<GroupLeanDocument[]> {
    const { _id } = req.user;
    return this.groupsService.getAllByUser(_id);
  }

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<GroupLeanDocument> {
    return this.groupsService.getOne(id);
  }

  @Post()
  async create(
    @Req() req: ReqUserDto,
    @Body() createGroupDto: CreateGroupDto,
  ): Promise<GroupLeanDocument> {
    const { _id } = req.user;
    return this.groupsService.create(_id, createGroupDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ): Promise<GroupLeanDocument> {
    return this.groupsService.update(id, updateGroupDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    this.groupsService.delete(id);

    return;
  }
}
