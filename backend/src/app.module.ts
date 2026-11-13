import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { LoggerModule } from "nestjs-pino"
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler"
import { APP_GUARD } from "@nestjs/core"
import { ScheduleModule } from "@nestjs/schedule"

import { IS_PRODUCTION } from "./common/constants/config.js"
import { validateEnv } from "./config/env.validation.js"

import { CronModule } from "./infrastructure/cron/cron.module.js"
import { SupabaseModule } from "./infrastructure/supabase/supabase.module.js"
import { TurnstileModule } from "./infrastructure/cloudflare/turnstile.module.js"
import { MailModule } from "./modules/mail/mail.module.js"
import { PortfolioModule } from "./modules/portfolio/portfolio.module.js"
import { AuthModule } from "./modules/auth/auth.module.js"

const GLOBAL_TTL_MILLIS = 15 * 60 * 1000

@Module({
	imports: [
		ConfigModule.forRoot({
			validate: validateEnv,
			isGlobal: true,
		}),
		LoggerModule.forRoot({
			pinoHttp: {
				level: IS_PRODUCTION ? "info" : "debug",
				serializers: {
					req: (req) => ({ method: req.method, url: req.url }),
					res: (res) => ({ statusCode: res.statusCode }),
				},
				transport: {
					target: "pino-pretty",
					options: {
						colorize: true,
						translateTime: "SYS:standard",
						ignore: "pid,hostname",
						singleLine: true,
					},
				},
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
		SupabaseModule,
		TurnstileModule,
		AuthModule,
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
})
export class AppModule {}
