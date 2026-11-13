import { Injectable, UnauthorizedException } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { PinoLogger } from "nestjs-pino"

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
	constructor(private readonly logger: PinoLogger) {
		super()
		this.logger.setContext(JwtAuthGuard.name)
	}

	handleRequest(err: any, user: any, info: any) {
		if (err || !user) {
			this.logger.warn({ info }, "Unauthorized attempt blocked by JWT Guard")
			throw err || new UnauthorizedException("Invalid or missing authentication token")
		}
		return user
	}
}
