import { Injectable, Inject, InternalServerErrorException } from "@nestjs/common"
import { SupabaseClient } from "@supabase/supabase-js"
import { PinoLogger } from "nestjs-pino"
import type { Cache } from "cache-manager"
import { CACHE_MANAGER } from "@nestjs/cache-manager"

import { PortfolioEntity } from "../../common/interfaces/portfolio.js"
import { mapDbToEntity, mapEntityToDb } from "./dto/portfolio.dto.js"

import { SUPABASE_CLIENT } from "../../infrastructure/supabase/supabase.provider.js"

@Injectable()
export class PortfolioService {
	private readonly TABLE_NAME = "portfolio_items"

	private readonly CACHE_ALL_KEY = "portfolio:all"

	private readonly getCacheIdKey = (id: number) => `portfolio:id:${id}`

	constructor(
		@Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
		@Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
		private readonly logger: PinoLogger
	) {
		this.logger.setContext(PortfolioService.name)
	}

	async getAll(): Promise<PortfolioEntity[]> {
		const cached = await this.cacheManager.get<PortfolioEntity[]>(this.CACHE_ALL_KEY)

		if (cached) return cached

		this.logger.debug("Fetching all portfolio items from Supabase")

		const { data, error } = await this.supabase
			.from(this.TABLE_NAME)
			.select("*")
			.order("id", { ascending: true })

		if (error) {
			this.logger.error({ err: error }, "Failed to fetch portfolio items from Supabase")
			throw new InternalServerErrorException("Database fetch error")
		}
		const mappedData = data.map(mapDbToEntity)

		await this.cacheManager.set(this.CACHE_ALL_KEY, mappedData)

		return mappedData
	}

	async getById(id: number): Promise<PortfolioEntity | null> {
		const cacheKey = this.getCacheIdKey(id)

		const cached = await this.cacheManager.get<PortfolioEntity>(cacheKey)

		if (cached) return cached

		this.logger.debug({ id }, "Fetching portfolio item by ID from Supabase")

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
		const mappedData = mapDbToEntity(data)

		await this.cacheManager.set(cacheKey, mappedData)

		return mappedData
	}

	async save(item: Partial<PortfolioEntity>): Promise<PortfolioEntity> {
		this.logger.debug({ id: item.id }, "Saving portfolio item")

		const dbPayload = mapEntityToDb(item)

		let savedData: any

		if (item.id) {
			const { data, error } = await this.supabase
				.from(this.TABLE_NAME)
				.update(dbPayload)
				.eq("id", item.id)
				.select()
				.single()

			if (error) {
				this.logger.error({ err: error, id: item.id }, "Failed to update portfolio item")
				throw new InternalServerErrorException("Database update error")
			}
			savedData = data
		} else {
			const { data, error } = await this.supabase
				.from(this.TABLE_NAME)
				.insert(dbPayload)
				.select()
				.single()

			if (error) {
				this.logger.error({ err: error }, "Failed to insert new portfolio item")
				throw new InternalServerErrorException("Database insert error")
			}
			savedData = data
		}
		const entity = mapDbToEntity(savedData)

		await this.cacheManager.del(this.CACHE_ALL_KEY)

		if (entity.id) await this.cacheManager.del(this.getCacheIdKey(entity.id))

		this.logger.info({ id: entity.id }, "LRU Cache cleared due to game save operation")

		return entity
	}

	async remove(id: number): Promise<boolean> {
		this.logger.debug({ id }, "Deleting portfolio item")

		const { error } = await this.supabase.from(this.TABLE_NAME).delete().eq("id", id)

		if (error) {
			this.logger.error({ err: error, id }, "Failed to delete portfolio item")
			throw new InternalServerErrorException("Database delete error")
		}
		await this.cacheManager.del(this.CACHE_ALL_KEY)
		await this.cacheManager.del(this.getCacheIdKey(id))

		this.logger.info({ id }, "LRU Cache cleared due to game delete operation")

		return true
	}
}
