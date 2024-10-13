import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Group } from 'src/schemas';
import { CreateGroupDto, UpdateGroupDto } from './dto';

@Injectable()
export class GroupsService {
  constructor(@InjectModel(Group.name) private groupModel: Model<Group>) {}

  async createGroup(createGroupDto: CreateGroupDto): Promise<Group> {
    const newGroup = new this.groupModel(createGroupDto);
    return newGroup.save();
  }

  async getAllGroups(): Promise<Group[]> {
    return this.groupModel.find().exec();
  }

  async getGroupById(id: string): Promise<Group> {
    const group = await this.groupModel.findById(id).exec();
    if (!group) {
      throw new NotFoundException(`Group with ID "${id}" not found`);
    }
    return group;
  }

  async updateGroup(
    id: string,
    updateGroupDto: UpdateGroupDto,
  ): Promise<Group> {
    const updatedGroup = await this.groupModel
      .findByIdAndUpdate(id, updateGroupDto, { new: true })
      .exec();
    if (!updatedGroup) {
      throw new NotFoundException(`Group with ID "${id}" not found`);
    }
    return updatedGroup;
  }

  async deleteGroup(id: string): Promise<void> {
    const result = await this.groupModel
      .findByIdAndUpdate(id, { deleted_at: new Date() }, { new: true })
      .exec();
    if (!result) {
      throw new NotFoundException(`Group with ID "${id}" not found`);
    }
  }
}
