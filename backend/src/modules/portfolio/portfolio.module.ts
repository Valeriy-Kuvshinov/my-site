import { Module } from "@nestjs/common"

import { SupabaseProvider } from "../../infrastructure/supabase/supabase.provider.js"

import { PortfolioService } from "./portfolio.service.js"

import { PortfolioController } from "./portfolio.controller.js"

@Module({
	controllers: [PortfolioController],
	providers: [SupabaseProvider, PortfolioService],
})
export class PortfolioModule {}
