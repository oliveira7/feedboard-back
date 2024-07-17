import * as Joi from 'joi'

export const environmentSchema = Joi.object({
	NODE_ENV: Joi.string()
		.valid('local', 'debug', 'test', 'staging', 'development', 'production')
		.default('local'),

	MONGO_URI: Joi.string().required(),
	MONGO_RETRY_ATTEMPTS: Joi.number().required(),
	MONGO_RETRY_DELAY: Joi.number().required(),
	MONGO_CONNECTION_NAME: Joi.string().required(),

	// KEYVAULT_URL: Joi.string().required(),
	// JWT_PRIVATE_KEYVAULT_NAME: Joi.string().required(),
	// JWT_PUBLIC_KEYVAULT_NAME: Joi.string().required(),

	// JWT_ACCESS_TOKEN_EXPIRATION_TIME_LONG: Joi.string().required(),
	// JWT_ACCESS_TOKEN_EXPIRATION_TIME_SHORT: Joi.string().required(),
	// JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
})