import { Module } from "@nestjs/common"

import { MailService } from "./mail.service.js"
import { RecaptchaService } from "../../infrastructure/recaptcha/recaptcha.service.js"
import { MailController } from "./mail.controller.js"

@Module({
	controllers: [MailController],
	providers: [MailService, RecaptchaService],
})
export class MailModule {}
