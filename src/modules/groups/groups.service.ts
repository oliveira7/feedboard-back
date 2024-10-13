import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Group, GroupLeanDocument } from 'src/schemas';
import { CreateGroupDto, UpdateGroupDto } from './dto';

@Injectable()
export class GroupsService {
  constructor(@InjectModel(Group.name) private groupModel: Model<Group>) {}

  async getAll(): Promise<GroupLeanDocument[]> {
    return await this.groupModel
      .find()
      .lean<GroupLeanDocument[] | null>()
      .exec();
  }

  async getOne(id: string): Promise<GroupLeanDocument> {
    const group = await this.groupModel
      .findById(id)
      .lean<GroupLeanDocument | null>()
      .exec();

    if (!group) {
      throw new NotFoundException(`Group with ID "${id}" not found`);
    }

    return group;
  }

  async create(createGroupDto: CreateGroupDto): Promise<GroupLeanDocument> {
    const newGroup = new this.groupModel(createGroupDto);
    const savedGroup = await newGroup.save();

    return savedGroup.toObject() as unknown as GroupLeanDocument;
  }

  async update(id: string, updateGroupDto: UpdateGroupDto): Promise<Group> {
    const updatedGroup = await this.groupModel
      .findByIdAndUpdate(id, updateGroupDto, { new: true })
      .exec();
    if (!updatedGroup) {
      throw new NotFoundException(`Group with ID "${id}" not found`);
    }
    return updatedGroup;
  }

  async delete(id: string): Promise<void> {
    const result = await this.groupModel
      .findByIdAndUpdate(id, { deleted_at: new Date() }, { new: true })
      .exec();
    if (!result) {
      throw new NotFoundException(`Group with ID "${id}" not found`);
    }
  }
  
  async addToGroup(groupId: string, userId: string): Promise<void> {
    await this.groupModel.findByIdAndUpdate(groupId, { group: true }).exec();
  }

  async deleteFromGroup(groupId: string, userId: string): Promise<void> {
    await this.groupModel.findByIdAndUpdate(groupId, { group: false }).exec();
  }
}
