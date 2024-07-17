import { GlobalConfigModule } from '@app/infrastructure/config'
import { RepositoriesModule } from '@app/infrastructure/repositories'
import { Module } from '@nestjs/common'
import { UserModule } from './user/user.module'

@Module({
	imports: [
		GlobalConfigModule.forRoot(),
		RepositoriesModule.forRoot(),
		UserModule
	],
})
export class AppModule { }