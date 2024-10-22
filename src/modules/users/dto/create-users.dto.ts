import {
  IsBase64,
  IsEmail,
  IsHash,
  IsIn,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

enum Role {
  STUDENT = 'student',
  TEACHER = 'teacher',
  COORDINATOR = 'coordinator',
}

export class CreateUsersDto {
  @IsNotEmpty()
  readonly name: string;

  @IsOptional()
  readonly course?: string;

  @IsOptional()
  readonly description?: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsHash('sha256')
  readonly password_hash: string;

  @IsOptional()
  @IsBase64()
  readonly avatar_base64?: string;

  @IsNotEmpty()
  @IsIn([Role.STUDENT, Role.TEACHER, Role.COORDINATOR])
  readonly role: Role;
}
