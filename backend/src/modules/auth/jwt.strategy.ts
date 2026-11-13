import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { ConfigService } from "@nestjs/config"
import type { Request } from "express"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request: Request) => {
					return request?.cookies?.["loginToken"] || null
				},
			]),
			ignoreExpiration: false,
			secretOrKey: configService.getOrThrow<string>("SUPABASE_JWT_KEY"),
		})
	}

	async validate(payload: any) {
		if (!payload || !payload.sub) throw new UnauthorizedException()

		return { userId: payload.sub, email: payload.email, role: payload.role }
	}
}
