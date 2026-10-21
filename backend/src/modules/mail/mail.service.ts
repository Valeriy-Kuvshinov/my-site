import { Injectable, InternalServerErrorException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { PinoLogger } from "nestjs-pino"
import { createTransport, type Transporter } from "nodemailer"

import { ContactMailPayload } from "./dto/contact-mail.dto.js"

import { getAdminContactTemplate, getUserContactTemplate } from "./templates/contact.template.js"

interface MailOptions {
	from: string
	to: string
	replyTo?: string
	subject: string
	text: string
	html: string
}

@Injectable()
export class MailService {
	private readonly transporter: Transporter

	constructor(
		private readonly configService: ConfigService,
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

	async processContactRequest(data: ContactMailPayload): Promise<void> {
		this.logger.debug(`Sending contact emails for: ${data.email}`)
		await Promise.all([this.notifyAdmin(data), this.notifyUser(data)])
	}

	private async notifyAdmin(data: ContactMailPayload): Promise<void> {
		const { name, email, title, requestType, message } = data

		const senderMail = this.configService.getOrThrow<string>("SENDER_MAIL_ADDRESS")
		const receiverMail = this.configService.getOrThrow<string>("RECEIVER_EMAIL_ADDRESS")

		const adminMailOptions: MailOptions = {
			from: `Contact System <${senderMail}>`,
			to: receiverMail,
			replyTo: email,
			subject: `New Contact Request: "${title}"`,
			text: `New message from ${name} (${email}). Type: ${requestType}. Message: ${message}`,
			html: getAdminContactTemplate(data),
		}
		return this.sendEmail(adminMailOptions)
	}

	private async notifyUser(data: ContactMailPayload): Promise<void> {
		const { name, email, title } = data

		const noReplyMail = this.configService.getOrThrow<string>("NOREPLY_MAIL_ADDRESS")

		const userMailOptions: MailOptions = {
			from: `Kuvshinov Software <${noReplyMail}>`,
			to: email,
			subject: `We received your message: "${title}"`,
			text: `Hi ${name}, we received your message regarding ${title}. We will review it shortly.`,
			html: getUserContactTemplate(data),
		}
		return this.sendEmail(userMailOptions)
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
