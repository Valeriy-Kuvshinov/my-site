import { Module } from "@nestjs/common"

import { SupabaseProvider, SUPABASE_CLIENT } from "./supabase.provider.js"

@Module({
	providers: [SupabaseProvider],
	exports: [SUPABASE_CLIENT],
})
export class SupabaseModule {}
