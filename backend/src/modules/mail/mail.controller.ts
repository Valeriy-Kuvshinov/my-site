import { Body, Controller, HttpCode, HttpStatus, Ip, Post } from "@nestjs/common"
import { Throttle } from "@nestjs/throttler"

import { ContactMailDto } from "./dto/contact-mail.dto.js"

import { TurnstileService } from "../../infrastructure/turnstile/turnstile.service.js"

import { MailService } from "./mail.service.js"

const MAIL_TTL_MILLIS = 1000 * 60 * 60

@Controller("api/mail")
export class MailController {
	constructor(
		private readonly mailService: MailService,
		private readonly turnstileService: TurnstileService
	) {}

	@Post("contact")
	@HttpCode(HttpStatus.OK)
	@Throttle({ default: { limit: 3, ttl: MAIL_TTL_MILLIS } })
	async sendContactUsMail(@Body() contactData: ContactMailDto, @Ip() ip: string) {
		await this.turnstileService.verify(contactData.turnstileToken, ip)

		await this.mailService.processContactRequest(contactData)

		return { message: "Mail successfully sent" }
	}
}
