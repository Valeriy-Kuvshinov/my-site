import { Module } from "@nestjs/common"

import { SupabaseProvider } from "../supabase/supabase.provider.js"

import { CronService } from "./cron.service.js"

@Module({
	providers: [SupabaseProvider, CronService],
})
export class CronModule {}
