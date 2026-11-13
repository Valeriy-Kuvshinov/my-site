import { Module } from "@nestjs/common"
import { PassportModule } from "@nestjs/passport"

import { JwtStrategy } from "./jwt.strategy.js"
import { JwtAuthGuard } from "./jwt-auth.guard.js"

import { TurnstileModule } from "../../infrastructure/cloudflare/turnstile.module.js"
import { SupabaseModule } from "../../infrastructure/supabase/supabase.module.js"

import { AuthService } from "./auth.service.js"

import { AuthController } from "./auth.controller.js"

@Module({
	imports: [PassportModule, SupabaseModule, TurnstileModule],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy, JwtAuthGuard],
	exports: [JwtAuthGuard],
})
export class AuthModule {}
