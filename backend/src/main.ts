import { NestFactory } from "@nestjs/core"
import { ValidationPipe } from "@nestjs/common"
import helmet from "helmet"
import { Logger } from "nestjs-pino"
import cookieParser from "cookie-parser"
import { ConfigService } from "@nestjs/config"

import { getCorsConfig } from "./config/cors.config.js"

import { AppModule } from "./app.module.js"

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { bufferLogs: true })

	const configService = app.get(ConfigService)

	app.useLogger(app.get(Logger))

	app.use(helmet())

	app.use(cookieParser())

	app.enableCors(getCorsConfig())

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		})
	)
	const port = configService.get<number>("PORT") || 3030

	await app.listen(port)

	app.get(Logger).log(`Server running on port ${port}`)
}
bootstrap()
