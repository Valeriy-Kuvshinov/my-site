import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { LoggerModule } from "nestjs-pino"
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler"
import { APP_GUARD } from "@nestjs/core"
import { ScheduleModule } from "@nestjs/schedule"

import { validateEnv } from "./config/env.validation.js"

import { CronModule } from "./infrastructure/cron/cron.module.js"

import { MailModule } from "./modules/mail/mail.module.js"
import { PortfolioModule } from "./modules/portfolio/portfolio.module.js"

const GLOBAL_TTL_MILLIS = 15 * 60 * 1000

@Module({
	imports: [
		ConfigModule.forRoot({
			validate: validateEnv,
			isGlobal: true,
		}),
		LoggerModule.forRoot({
			pinoHttp: {
				level: process.env.NODE_ENV === "production" ? "info" : "debug",
				transport:
					process.env.NODE_ENV !== "production"
						? {
								target: "pino-pretty",
								options: {
									colorize: true,
									translateTime: "SYS:standard",
									ignore: "pid,hostname",
								},
							}
						: undefined,
			},
		}),
		ThrottlerModule.forRoot([
			{
				name: "default",
				ttl: GLOBAL_TTL_MILLIS,
				limit: 300,
			},
		]),
		ScheduleModule.forRoot(),
		CronModule,
		MailModule,
		PortfolioModule,
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
})
export class AppModule {}
