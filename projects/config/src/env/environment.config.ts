export default () => ({
	port: process.env.PORT,
	database: {
		uri: process.env.MONGO_URI,
		connectionName: process.env.MONGO_CONNECTION_NAME,
		retryAttempts: process.env.MONGO_RETRY_ATTEMPTS,
		retryDelay: process.env.MONGO_RETRY_DELAY,
	},
	cache: {},
	auth: {},
	defaultTz: 'America/Sao_Paulo',
})