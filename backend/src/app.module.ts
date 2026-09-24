import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"

import { validateEnv } from "./config/env.validation.js"

import { AppController } from "./app.controller.js"
import { AppService } from "./app.service.js"

@Module({
	imports: [
		ConfigModule.forRoot({
			validate: validateEnv,
			isGlobal: true,
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
