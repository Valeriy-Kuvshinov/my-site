import { Module } from "@nestjs/common"
import { CacheModule } from "@nestjs/cache-manager"

import { SupabaseProvider } from "../../infrastructure/supabase/supabase.provider.js"

import { PortfolioService } from "./portfolio.service.js"

import { PortfolioController } from "./portfolio.controller.js"

const CACHE_TTL_MILLIS = 1000 * 60 * 15

@Module({
	imports: [
		CacheModule.register({
			ttl: CACHE_TTL_MILLIS,
			max: 100,
		}),
	],
	controllers: [PortfolioController],
	providers: [SupabaseProvider, PortfolioService],
})
export class PortfolioModule {}
