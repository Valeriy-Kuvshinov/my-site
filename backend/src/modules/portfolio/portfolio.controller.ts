import {
	Controller,
	Get,
	InternalServerErrorException,
	Param,
	ParseIntPipe,
	NotFoundException,
	Post,
	Body,
	Put,
	Delete,
	Query,
} from "@nestjs/common"
import { PinoLogger } from "nestjs-pino"

import { PortfolioItemDto, PortfolioQueryDto } from "./dto/portfolio.dto.js"

import { PortfolioService } from "./portfolio.service.js"

@Controller("api/portfolio")
export class PortfolioController {
	constructor(
		private readonly portfolioService: PortfolioService,
		private readonly logger: PinoLogger
	) {
		this.logger.setContext(PortfolioController.name)
	}

	@Get()
	async getAll(@Query() query: PortfolioQueryDto) {
		this.logger.info({ search: query.search }, "Fetching portfolio items")
		try {
			const items = await this.portfolioService.getAll(query.search)
			return { data: items, message: "Portfolio items fetched successfully" }
		} catch (err) {
			this.logger.error({ err }, "Failed to get portfolio items")
			throw new InternalServerErrorException("Failed to fetch portfolio items")
		}
	}

	@Get(":id")
	async getById(@Param("id", ParseIntPipe) id: number) {
		this.logger.info({ id }, "Fetching portfolio item by id")
		try {
			const item = await this.portfolioService.getById(id)

			if (!item) throw new NotFoundException(`Portfolio item ${id} not found`)

			return { data: item, message: "Item fetched successfully" }
		} catch (err) {
			if (err instanceof NotFoundException) throw err

			this.logger.error({ err, id }, "Failed to get portfolio item")
			throw new InternalServerErrorException("Failed to fetch portfolio item")
		}
	}

	// NOTE: You will likely want to add @UseGuards(AdminGuard) to these modification routes later
	@Post("add")
	async add(@Body() dto: PortfolioItemDto) {
		this.logger.info({ title: dto.title.en }, "Creating new portfolio item")
		try {
			const savedItem = await this.portfolioService.save(dto)
			return { data: savedItem, message: "Portfolio item created successfully" }
		} catch (err) {
			this.logger.error({ err, title: dto.title.en }, "Failed to add portfolio item")
			throw new InternalServerErrorException("Failed to add portfolio item")
		}
	}

	@Put("update/:id")
	async update(@Param("id", ParseIntPipe) id: number, @Body() dto: PortfolioItemDto) {
		this.logger.info({ id }, "Updating portfolio item")
		try {
			const existingItem = await this.portfolioService.getById(id)

			if (!existingItem) throw new NotFoundException(`Portfolio item ${id} not found`)

			const updatedItem = await this.portfolioService.save({ ...dto, id })

			return { data: updatedItem, message: "Portfolio item updated successfully" }
		} catch (err) {
			if (err instanceof NotFoundException) throw err

			this.logger.error({ err, id }, "Failed to update portfolio item")
			throw new InternalServerErrorException("Failed to update portfolio item")
		}
	}

	@Delete("delete/:id")
	async remove(@Param("id", ParseIntPipe) id: number) {
		this.logger.info({ id }, "Removing portfolio item")
		try {
			const existingItem = await this.portfolioService.getById(id)

			if (!existingItem) throw new NotFoundException(`Portfolio item ${id} not found`)

			await this.portfolioService.remove(id)

			return { message: "Portfolio item successfully removed" }
		} catch (err) {
			if (err instanceof NotFoundException) throw err

			this.logger.error({ err, id }, "Failed to remove portfolio item")
			throw new InternalServerErrorException("Failed to remove portfolio item")
		}
	}
}
