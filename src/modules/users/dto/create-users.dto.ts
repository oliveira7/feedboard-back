import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';

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

  @IsNotEmpty()
  readonly password_hash: string;

  @IsOptional()
  @IsIn([Role.STUDENT, Role.TEACHER, Role.COORDINATOR])
  readonly role?: Role;

  @IsNotEmpty()
  readonly token: string;
}
