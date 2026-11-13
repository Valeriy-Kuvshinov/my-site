import { Controller, Post, Body, Req, Res, Get, UseGuards } from "@nestjs/common"
import { PinoLogger } from "nestjs-pino"
import type { CookieOptions, Request, Response } from "express"

import { LoginDto } from "./dto/auth.dto.js"

import { IS_PRODUCTION } from "../../common/constants/config.js"

import { JwtAuthGuard } from "./jwt-auth.guard.js"

import { AuthService } from "./auth.service.js"

const COOKIE_MAX_AGE_MILLIS = 1000 * 60 * 60 * 24 * 7

const COOKIE_OPTIONS: CookieOptions = {
	httpOnly: true,
	sameSite: IS_PRODUCTION ? "strict" : "lax",
	secure: IS_PRODUCTION,
	maxAge: COOKIE_MAX_AGE_MILLIS,
}

@Controller("api/auth")
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly logger: PinoLogger
	) {
		this.logger.setContext(AuthController.name)
	}

	@Post("login")
	async login(
		@Body() dto: LoginDto,
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response
	) {
		this.logger.info({ email: dto.email }, "auth - user login attempt")

		const ip = req.ip || req.socket.remoteAddress
		const result = await this.authService.login(dto, ip)

		res.cookie("loginToken", result.accessToken, COOKIE_OPTIONS)

		return { data: result.user, message: "Login successful" }
	}

	@Post("logout")
	async logout(@Res({ passthrough: true }) res: Response) {
		this.logger.info("auth - user logout")

		res.clearCookie("loginToken")
		return { message: "Logged out successfully" }
	}

	@Get("me")
	async getMe(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		const token = req.cookies?.["loginToken"]

		if (!token) {
			this.logger.info("auth - user cookie check: guest (no token)")
			return { data: null, message: "Guest user" }
		}
		try {
			const user = await this.authService.validateSession(token)

			if (!user) {
				this.logger.info("auth - user cookie check: invalid / expired token")

				res.clearCookie("loginToken")
				return { data: null, message: "Session expired" }
			}
			this.logger.info({ userId: user.id }, "auth - user cookie check: valid User")

			return { data: user, message: "User restored" }
		} catch (err) {
			this.logger.error({ err }, "Failed to restore user session")
			res.clearCookie("loginToken")
			return { data: null, message: "Session invalid" }
		}
	}
}
