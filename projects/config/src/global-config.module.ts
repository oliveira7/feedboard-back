import { Module, DynamicModule } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config'
import { environmentSchema } from './env/environmentSchema'
import environment from './env/environment.config'

const { NODE_ENV } = process.env
const prod = !NODE_ENV || NODE_ENV === 'production'

@Module({})
export class GlobalConfigModule {
	static forRoot(): DynamicModule {
		return {
			module: GlobalConfigModule,
			global: true,
			imports: [
				ConfigModule.forRoot({
					envFilePath: !prod ? `./environment/${process.env.NODE_ENV}.env` : '',
					isGlobal: false,
					load: [environment],
					validationSchema: environmentSchema,
				}),
				
				MongooseModule.forRoot(`${process.env.MONGO_URI}${process.env.MONGO_CONNECTION_NAME}`, {
					retryAttempts: Number(process.env.MONGO_RETRY_ATTEMPTS),
					retryDelay: Number(process.env.MONGO_RETRY_DELAY),
				}),
			],

			providers: [],

			exports: [
				ConfigModule
			],
		}
	}
}