import {
  IsOptional,
} from 'class-validator';

export class UpdateUsersDto {
  @IsOptional()
  readonly name?: string;

  @IsOptional()
  readonly course?: string;

  // @IsNotEmpty()
  // readonly password_hash: string;

  // @IsOptional()
  // @IsIn([Role.STUDENT, Role.TEACHER, Role.COORDINATOR])
  // readonly role?: Role;

  @IsOptional()
  readonly description?: string;

  // @IsNotEmpty()
  // @IsEmail()
  // readonly email: string;

  @IsOptional()
  readonly avatar_base64?: string;
}
