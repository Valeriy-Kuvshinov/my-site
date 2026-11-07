import { Injectable, Inject } from "@nestjs/common"
import { Cron, CronExpression } from "@nestjs/schedule"
import { SupabaseClient } from "@supabase/supabase-js"
import { PinoLogger } from "nestjs-pino"

import { SUPABASE_CLIENT } from "../supabase/supabase.provider.js"

@Injectable()
export class CronService {
	constructor(
		@Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
		private readonly logger: PinoLogger
	) {
		this.logger.setContext(CronService.name)
	}

	@Cron(CronExpression.EVERY_12_HOURS, { timeZone: "Asia/Jerusalem" })
	async keepSupabaseAlive() {
		this.logger.debug("Executing scheduled database keep-alive ping")

		try {
			const { error } = await this.supabase.from("portfolio_items").select("id").limit(1)

			if (error) throw error

			this.logger.info("Supabase database keep-alive ping successful")
		} catch (err) {
			this.logger.error({ err }, "Scheduled Database Keep-Alive Task failed")
		}
	}

	/**
	 * placeholder for future asset cleanup
	 */
	@Cron("0 3 * * *", { timeZone: "Asia/Jerusalem" }) // 03:00 every day
	async cleanupOrphanedAssets() {
		this.logger.debug("Scheduled Asset Cleanup Task starting")
		try {
			// await this.storageService.cleanup();
			this.logger.info("Asset cleanup completed successfully")
		} catch (err) {
			this.logger.error({ err }, "Scheduled Cleanup Task failed")
		}
	}
}
