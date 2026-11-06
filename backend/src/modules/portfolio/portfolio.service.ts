import { Injectable, Inject, InternalServerErrorException } from "@nestjs/common"
import { SupabaseClient } from "@supabase/supabase-js"
import { PinoLogger } from "nestjs-pino"

import { PortfolioEntity } from "../../common/interfaces/portfolio.js"

import { SUPABASE_CLIENT } from "../../infrastructure/supabase/supabase.provider.js"

@Injectable()
export class PortfolioService {
	private readonly TABLE_NAME = "portfolio_items"

	constructor(
		@Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
		private readonly logger: PinoLogger
	) {
		this.logger.setContext(PortfolioService.name)
	}

	async getAll(): Promise<PortfolioEntity[]> {
		this.logger.debug("Fetching all portfolio items")
		const { data, error } = await this.supabase
			.from(this.TABLE_NAME)
			.select("*")
			.order("id", { ascending: true })

		if (error) {
			this.logger.error({ err: error }, "Failed to fetch portfolio items from Supabase")
			throw new InternalServerErrorException("Database fetch error")
		}
		return data as PortfolioEntity[]
	}

	async getById(id: number): Promise<PortfolioEntity | null> {
		this.logger.debug({ id }, "Fetching portfolio item by ID")
		const { data, error } = await this.supabase
			.from(this.TABLE_NAME)
			.select("*")
			.eq("id", id)
			.single()

		if (error) {
			if (error.code === "PGRST116") return null

			this.logger.error({ err: error, id }, "Failed to fetch portfolio item by ID")
			throw new InternalServerErrorException("Database fetch error")
		}
		return data as PortfolioEntity
	}

	// NOTE: You will likely want to add @UseGuards(AdminGuard) to these modification routes later
	async save(item: Partial<PortfolioEntity>): Promise<PortfolioEntity> {
		this.logger.debug({ id: item.id }, "Saving portfolio item")
		if (item.id) {
			const { data, error } = await this.supabase
				.from(this.TABLE_NAME)
				.update(item)
				.eq("id", item.id)
				.select()
				.single()

			if (error) {
				this.logger.error({ err: error, id: item.id }, "Failed to update portfolio item")
				throw new InternalServerErrorException("Database update error")
			}
			return data as PortfolioEntity
		} else {
			const { data, error } = await this.supabase
				.from(this.TABLE_NAME)
				.insert(item)
				.select()
				.single()

			if (error) {
				this.logger.error({ err: error }, "Failed to insert new portfolio item")
				throw new InternalServerErrorException("Database insert error")
			}
			return data as PortfolioEntity
		}
	}

	async remove(id: number): Promise<boolean> {
		this.logger.debug({ id }, "Deleting portfolio item")
		const { error } = await this.supabase.from(this.TABLE_NAME).delete().eq("id", id)

		if (error) {
			this.logger.error({ err: error, id }, "Failed to delete portfolio item")
			throw new InternalServerErrorException("Database delete error")
		}
		return true
	}
}
