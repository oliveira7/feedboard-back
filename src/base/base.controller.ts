import {
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Controller,
} from '@nestjs/common';
import { BaseService } from './base.service';
import { Document } from 'mongoose';

@Controller()
export abstract class BaseController<T extends Document> {
  constructor(private readonly baseService: BaseService<T>) {}

  @Post()
  async create(@Body() createDto: any): Promise<T> {
    return await this.baseService.create(createDto);
  }

  @Get()
  async findAll(): Promise<T[]> {
    return await this.baseService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<T> {
    return await this.baseService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any): Promise<T> {
    return await this.baseService.update(id, updateDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ deleted: boolean }> {
    return await this.baseService.delete(id);
  }
}
