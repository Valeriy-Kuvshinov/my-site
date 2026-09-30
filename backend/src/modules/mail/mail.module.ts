import { Module } from "@nestjs/common"

import { TurnstileService } from "../../infrastructure/turnstile/turnstile.service.js"

import { MailService } from "./mail.service.js"

import { MailController } from "./mail.controller.js"

@Module({
	controllers: [MailController],
	providers: [MailService, TurnstileService],
})
export class MailModule {}
