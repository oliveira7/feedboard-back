import { IsEmail, IsEnum, IsString, IsOptional, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 100)
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(['aluno', 'professor', 'coordenador'])
  role: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsString()
  password: string;
}
