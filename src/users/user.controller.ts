import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDocument } from '../schemas/user.schema';
import { BaseController } from '../base/base.controller';

@Controller('users')
export class UserController extends BaseController<UserDocument> {
  constructor(private readonly userService: UserService) {
    super(userService);
  }
}
