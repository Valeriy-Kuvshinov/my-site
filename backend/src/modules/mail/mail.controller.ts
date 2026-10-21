import { Body, Controller, HttpCode, HttpStatus, Ip, Post } from "@nestjs/common"
import { Throttle } from "@nestjs/throttler"

import { ContactFormDto } from "./dto/contact-mail.dto.js"

import { TurnstileService } from "../../infrastructure/cloudflare/turnstile.service.js"

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
	async sendContactUsMail(@Body() contactData: ContactFormDto, @Ip() ip: string) {
		const { turnstileToken, consent, ...mailPayload } = contactData

		await this.turnstileService.verify(turnstileToken, ip)

		await this.mailService.processContactRequest(mailPayload)

		return { message: "Mail successfully sent" }
	}
}
