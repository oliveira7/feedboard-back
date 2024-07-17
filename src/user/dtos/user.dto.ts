import { IsEmail, IsEnum, IsString, IsOptional, Length } from 'class-validator';

export class GetUserByIdResponse {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(['student', 'teacher', 'coordinator'])
  role: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}

export class GetUsersResponse {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(['student', 'teacher', 'coordinator'])
  role: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}

export class CreateUserRequest {
  @IsString()
  @Length(2, 100)
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(['student', 'teacher', 'coordinator'])
  role: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsString()
  password: string;
}

export class CreateUserResponse {

}

export class UpdateUserByIdRequest {
  @IsString()
  @Length(2, 100)
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(['student', 'teacher', 'coordinator'])
  role: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}

export class UpdateUserByIdResponse {

}
