import { Injectable, UnauthorizedException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { PinoLogger } from "nestjs-pino"

interface RecaptchaResponse {
	success: boolean
	"error-codes"?: string[]
}

@Injectable()
export class RecaptchaService {
	constructor(
		private readonly configService: ConfigService,
		private readonly logger: PinoLogger
	) {
		this.logger.setContext(RecaptchaService.name)
	}

	async verify(token?: string): Promise<void> {
		if (!token) throw new UnauthorizedException("reCAPTCHA token is missing")

		const secretKey = this.configService.get<string>("RECAPTCHA_SECRET_KEY")

		const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: `secret=${secretKey}&response=${token}`,
		})
		const data = (await response.json()) as RecaptchaResponse

		this.logger.debug({ data }, "reCAPTCHA API response")

		if (!data.success) {
			this.logger.error({ errorCodes: data["error-codes"] }, "reCAPTCHA verification failed")
			throw new UnauthorizedException("Invalid reCAPTCHA")
		}
	}
}
