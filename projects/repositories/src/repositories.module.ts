import { DynamicModule, Module } from '@nestjs/common'
import { MongoUsersRepository, UsersRepositoryProvider } from './userRepository'
import { MongooseModule } from '@nestjs/mongoose'
import { ChangesSchema, GroupsSchema, NotificationsSchema, PostsSchema, ReactionsSchema, UsersSchema } from '@app/infrastructure/models'

@Module({})
export class RepositoriesModule {
	static forRoot(): DynamicModule {
		return {
			module: RepositoriesModule,
			global: true,
			imports: [
				MongooseModule.forFeature([
					{ name: 'Changes', schema: ChangesSchema },
					{ name: 'Groups', schema: GroupsSchema },
					{ name: 'Notifications', schema: NotificationsSchema },
					{ name: 'Posts', schema: PostsSchema },
					{ name: 'Reactions', schema: ReactionsSchema },
					{ name: 'Users', schema: UsersSchema },
				]),
			],
			providers: [
				MongoUsersRepository,
				UsersRepositoryProvider,
			],
			exports: [
				MongoUsersRepository,
				UsersRepositoryProvider,
			],
		}
	}
}