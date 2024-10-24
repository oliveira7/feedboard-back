import { PartialType } from '@nestjs/mapped-types';
import { CreateUsersDto } from './create-users.dto';
import {
  IsBase64,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class UpdateUsersDto extends PartialType(CreateUsersDto) {
  @IsOptional()
  readonly description?: string;

  // @IsNotEmpty()
  // @IsEmail()
  // readonly email: string;

  @IsOptional()
  @IsBase64()
  readonly avatar_base64?: string;

  @IsOptional()
  readonly password_hash?: string;
}
