import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Group, GroupLeanDocument } from 'src/schemas';
import { CreateGroupDto, UpdateGroupDto } from './dto';

@Injectable()
export class GroupsService {
  constructor(@InjectModel(Group.name) private groupModel: Model<Group>) {}

  async getAllByUser(userId: string): Promise<GroupLeanDocument[] | []> {
    return await this.groupModel
      .find({
        created_by: new Types.ObjectId(userId),
        deleted_at: null,
      })
      .lean<GroupLeanDocument[] | []>()
      .exec();
  }

  async getOne(id: string): Promise<GroupLeanDocument> {
    const group = await this.groupModel
      .findById(id)
      .lean<GroupLeanDocument | null>()
      .exec();

    if (!group) {
      throw new NotFoundException(`Grupo com ID "${id}" não foi encontrado`);
    }

    return group;
  }

  async create(createGroupDto: CreateGroupDto): Promise<GroupLeanDocument> {
    const newGroup = new this.groupModel(createGroupDto);
    const savedGroup = await newGroup.save();

    return savedGroup.toObject() as unknown as GroupLeanDocument;
  }

  async update(
    id: string,
    updateGroupDto: UpdateGroupDto,
  ): Promise<GroupLeanDocument> {
    const updatedGroup = await this.groupModel
      .findByIdAndUpdate(id, updateGroupDto, { new: true })
      .lean<GroupLeanDocument>()
      .exec();

    if (!updatedGroup) {
      throw new NotFoundException(`Grupo com ID "${id}" não foi encontrado`);
    }

    return updatedGroup;
  }

  async delete(id: string): Promise<void> {
    const result = await this.groupModel
      .findByIdAndUpdate(id, { deleted_at: new Date() })
      .exec();

    if (!result) {
      throw new NotFoundException(`Grupo com ID "${id}" não foi encontrado`);
    }
  }

  async addUserToGroup(
    groupId: string,
    userId: string,
  ): Promise<GroupLeanDocument | null> {
    return await this.groupModel
      .findByIdAndUpdate(
        { _id: new Types.ObjectId(groupId) },
        { $addToSet: { members: new Types.ObjectId(userId) } },
        { new: true },
      )
      .lean<GroupLeanDocument | null>()
      .exec();
  }

  async deleteUserFromGroup(groupId: string, userId: string): Promise<void> {
    await this.groupModel
      .findByIdAndUpdate(
        { _id: new Types.ObjectId(groupId) },
        { $pull: { members: new Types.ObjectId(userId) } },
        { new: true },
      )
      .lean<GroupLeanDocument | null>()
      .exec();

    return;
  }
}
