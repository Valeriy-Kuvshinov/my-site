import { Provider } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { createClient, SupabaseClient } from "@supabase/supabase-js"

export const SUPABASE_CLIENT = "SUPABASE_CLIENT"

export const SupabaseProvider: Provider = {
	provide: SUPABASE_CLIENT,
	inject: [ConfigService],
	useFactory: (configService: ConfigService): SupabaseClient => {
		const supabaseUrl = configService.getOrThrow<string>("SUPABASE_URL")

		const supabaseKey = configService.getOrThrow<string>("SUPABASE_SECRET_KEY")

		return createClient(supabaseUrl, supabaseKey)
	},
}
