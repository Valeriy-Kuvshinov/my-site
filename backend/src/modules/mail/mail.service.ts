import { Injectable, InternalServerErrorException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { PinoLogger } from "nestjs-pino"
import { createTransport, type Transporter } from "nodemailer"

import { ContactMailDto } from "./dto/contact-mail.dto.js"

import { getAdminContactTemplate, getUserContactTemplate } from "./templates/contact.template.js"

import { RecaptchaService } from "../../infrastructure/recaptcha/recaptcha.service.js"

interface MailOptions {
	from: string
	to: string
	replyTo?: string
	subject: string
	text: string
	html: string
}

const SITE_LOGO =
	"https://res.cloudinary.com/djzid7ags/image/upload/v1719919435/ydjn6p0djqwbkko4zqts.png"

@Injectable()
export class MailService {
	private readonly transporter: Transporter

	constructor(
		private readonly configService: ConfigService,
		private readonly recaptchaService: RecaptchaService,
		private readonly logger: PinoLogger
	) {
		this.logger.setContext(MailService.name)

		this.transporter = createTransport({
			host: "smtp.resend.com",
			port: 465,
			secure: true,
			auth: {
				user: "resend",
				pass: this.configService.getOrThrow<string>("RESEND_API_KEY"),
			},
		})
	}

	async processContactRequest(data: ContactMailDto): Promise<void> {
		await this.recaptchaService.verify(data.recaptchaToken)

		this.logger.debug(`Sending contact emails for: ${data.email}`)

		await Promise.all([this.notifyAdmin(data), this.notifyUser(data)])
	}

	private async notifyAdmin(data: ContactMailDto): Promise<void> {
		const { name, email, title, requestType, message } = data

		const senderMail = this.configService.getOrThrow<string>("SENDER_MAIL_ADDRESS")
		const receiverMail = this.configService.getOrThrow<string>("RECEIVER_EMAIL_ADDRESS")

		return this.sendEmail({
			from: `System <${senderMail}>`,
			to: receiverMail,
			replyTo: email,
			subject: `New Contact Request: "${title}"`,
			text: `New message from ${name} (${email}). Type: ${requestType}. Message: ${message}`,
			html: getAdminContactTemplate(name, email, requestType, message, SITE_LOGO),
		})
	}

	private async notifyUser(data: ContactMailDto): Promise<void> {
		const { name, email, title, message } = data

		const noReplyMail = this.configService.getOrThrow<string>("NOREPLY_MAIL_ADDRESS")

		return this.sendEmail({
			from: `VK Freelance Software <${noReplyMail}>`,
			to: email,
			subject: `We received your message: "${title}"`,
			text: `Hi ${name}, we received your message regarding ${title}. We will review it shortly.`,
			html: getUserContactTemplate(name, title, message, SITE_LOGO),
		})
	}

	private async sendEmail(mailOptions: MailOptions): Promise<void> {
		try {
			await this.transporter.sendMail(mailOptions)
			this.logger.info(`Email successfully transmitted to ${mailOptions.to} via Resend.`)
		} catch (err) {
			this.logger.error({ err, to: mailOptions.to }, "Error sending mail via Resend")
			throw new InternalServerErrorException("Failed to send email")
		}
	}
}
