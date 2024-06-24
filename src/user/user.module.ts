import { Module } from '@nestjs/common';
import { UserController } from '../adapters/controllers/user.controller';
import { UserService } from '../use_cases/user.service';
import { UserRepository } from '../infra/db/repositories/user.repository';
import { USER_REPOSITORY_TOKEN } from '../domain/contants/user.constants';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: UserRepository
    }
  ],
})
export class UserModule {}
