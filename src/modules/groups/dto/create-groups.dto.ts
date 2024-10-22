import { IsString } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  readonly name: string;
}
