import { Type } from 'class-transformer';
import { IsEmail, IsMongoId, ValidateNested } from 'class-validator';

class User {
  @IsMongoId()
  readonly _id: string;

  @IsEmail()
  readonly email: string;
}

export class ReqUserDto {
  @ValidateNested()
  @Type(() => User)
  readonly user: User;
}
