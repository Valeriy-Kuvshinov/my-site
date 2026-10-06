import { NestFactory } from "@nestjs/core"
import { ValidationPipe } from "@nestjs/common"
import helmet from "helmet"
import { Logger } from "nestjs-pino"

import { AppModule } from "./app.module.js"

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { bufferLogs: true })

	app.useLogger(app.get(Logger))
	app.use(helmet())

	const isProduction = process.env.NODE_ENV === "production"

	app.enableCors({
		origin: isProduction
			? ["https://kuvware.com", "https://www.kuvware.com"]
			: ["http://127.0.0.1:4200", "http://localhost:4200"],
		credentials: true,
	})
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		})
	)
	await app.listen(process.env.PORT ?? 3000)

	app.get(Logger).log(`NestJS server is running on port ${process.env.PORT ?? 3000}`)
}
bootstrap()
