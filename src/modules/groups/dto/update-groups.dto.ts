import { IsArray, IsOptional } from 'class-validator';

export class UpdateGroupDto {
  @IsOptional()
  readonly name?: string;

  @IsOptional()
  @IsArray()
  readonly members?: string[];
}
