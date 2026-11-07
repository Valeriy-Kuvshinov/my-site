import { NestFactory } from "@nestjs/core"
import { ValidationPipe } from "@nestjs/common"
import helmet from "helmet"
import { Logger } from "nestjs-pino"

import { AppModule } from "./app.module.js"
import { getCorsConfig } from "./config/cors.config.js"

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { bufferLogs: true })

	app.useLogger(app.get(Logger))

	app.use(helmet())

	app.enableCors(getCorsConfig())

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		})
	)
	await app.listen(process.env.PORT ?? 3000)

	app.get(Logger).log(`Server running on port ${process.env.PORT ?? 3000}`)
}
bootstrap()
