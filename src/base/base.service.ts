import { Model, Document } from 'mongoose';

export abstract class BaseService<T extends Document> {
  constructor(private readonly model: Model<T>) {}

  async create(createDto: any): Promise<T> {
    const createdItem = new this.model(createDto);
    return await createdItem.save();
  }

  async findAll(): Promise<T[]> {
    return await this.model.find().exec();
  }

  async findOne(id: string): Promise<T> {
    return await this.model.findById(id).exec();
  }

  async update(id: string, updateDto: any): Promise<T> {
    return await this.model
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<{ deleted: boolean }> {
    const result = await this.model.deleteOne({ _id: id }).exec();
    return { deleted: result.deletedCount > 0 };
  }
}
