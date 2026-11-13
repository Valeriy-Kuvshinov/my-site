import { Injectable, Inject, UnauthorizedException } from "@nestjs/common"
import { SupabaseClient } from "@supabase/supabase-js"

import { LoginDto } from "./dto/auth.dto.js"

import { TurnstileService } from "../../infrastructure/cloudflare/turnstile.service.js"
import { SUPABASE_CLIENT } from "../../infrastructure/supabase/supabase.provider.js"

@Injectable()
export class AuthService {
	constructor(
		@Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
		private readonly turnstileService: TurnstileService
	) {}

	async login(dto: LoginDto, ip?: string) {
		await this.turnstileService.verify(dto.turnstileToken, ip)

		const { data, error } = await this.supabase.auth.signInWithPassword({
			email: dto.email,
			password: dto.password,
		})

		if (error || !data.session) throw new UnauthorizedException("Invalid credentials")

		return {
			user: {
				id: data.session.user.id,
				email: data.session.user.email,
			},
			accessToken: data.session.access_token,
		}
	}

	async validateSession(token: string) {
		const { data, error } = await this.supabase.auth.getUser(token)

		if (error || !data?.user) return null

		return {
			id: data.user.id,
			email: data.user.email,
		}
	}
}
