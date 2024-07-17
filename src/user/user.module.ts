import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { UserController } from './controllers/user.controller'
import { UserService } from './services/user.service'

@Module({
	imports: [HttpModule, UserModule],
	controllers: [UserController],
	providers: [UserService],
})
export class UserModule { }