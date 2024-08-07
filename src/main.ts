import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {

	const app = await NestFactory.create(AppModule);

	const configService = app.get(ConfigService)
	const port = configService.get('PORT')

	const options = new DocumentBuilder()
		.setTitle('Feedboard API')
		.setDescription('System for managing feeds and posts')
		.setVersion('0.0.1')
		.build()
	const document = SwaggerModule.createDocument(app, options)

	SwaggerModule.setup('api', app, document)

	app.enableCors({
		origin: '*',
	})

	await app.listen(port)
}
bootstrap()