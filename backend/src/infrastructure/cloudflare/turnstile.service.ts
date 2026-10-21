import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PinoLogger } from "nestjs-pino"

import { ConfigService } from "@nestjs/config"

interface TurnstileResponse {
	success: boolean
	"error-codes"?: string[]
	challenge_ts?: string
	hostname?: string
}

const TURNSTILE_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

@Injectable()
export class TurnstileService {
	constructor(
		private readonly configService: ConfigService,
		private readonly logger: PinoLogger
	) {
		this.logger.setContext(TurnstileService.name)
	}

	async verify(token?: string, ip?: string): Promise<void> {
		if (!token) throw new UnauthorizedException("Turnstile token is missing")

		const secretKey = this.configService.getOrThrow<string>("TURNSTILE_SECRET_KEY")

		const response = await fetch(TURNSTILE_URL, {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: `secret=${secretKey}&response=${token}${ip ? `&remoteip=${ip}` : ""}`,
		})
		const data = (await response.json()) as TurnstileResponse

		this.logger.debug({ data }, "Turnstile API response")

		if (!data.success) {
			this.logger.error({ errorCodes: data["error-codes"] }, "Turnstile verification failed")
			throw new UnauthorizedException("Invalid Turnstile token")
		}
	}
}
