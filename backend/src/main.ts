import { NestFactory } from "@nestjs/core"
import { ValidationPipe } from "@nestjs/common"
import helmet from "helmet"
import { Logger } from "nestjs-pino"
import cookieParser from "cookie-parser"
import { ConfigService } from "@nestjs/config"
import type { NestExpressApplication } from "@nestjs/platform-express"

import { getCorsConfig } from "./config/cors.config.js"

import { AppModule } from "./app.module.js"

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, { bufferLogs: true })

	const configService = app.get(ConfigService)

	app.useLogger(app.get(Logger))

	app.set("trust proxy", 1) // Trust NGINX

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
