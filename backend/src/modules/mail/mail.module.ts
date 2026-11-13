import { Module } from "@nestjs/common"

import { TurnstileModule } from "../../infrastructure/cloudflare/turnstile.module.js"

import { MailService } from "./mail.service.js"

import { MailController } from "./mail.controller.js"

@Module({
	imports: [TurnstileModule],
	controllers: [MailController],
	providers: [MailService],
})
export class MailModule {}
