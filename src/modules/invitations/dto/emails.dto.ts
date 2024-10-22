import { IsArray, ValidateNested } from 'class-validator';

export class EmailsDto {
  @IsArray()
  readonly emails: string[];
}
