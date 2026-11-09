import { Type } from "class-transformer"
import {
	IsString,
	IsNotEmpty,
	ValidateNested,
	IsUrl,
	IsOptional,
	IsBoolean,
	MaxLength,
} from "class-validator"

import { LocalizedString } from "../../../common/interfaces/locale.js"
import { PortfolioEntity } from "../../../common/interfaces/portfolio.js"

export class LocalizedStringDto implements LocalizedString {
	@IsString()
	@IsNotEmpty()
	en: string

	@IsString()
	@IsNotEmpty()
	ru: string

	@IsString()
	@IsNotEmpty()
	he: string
}

export class PortfolioItemDto {
	@ValidateNested()
	@Type(() => LocalizedStringDto)
	@IsNotEmpty()
	title: LocalizedStringDto

	@ValidateNested()
	@Type(() => LocalizedStringDto)
	@IsNotEmpty()
	description: LocalizedStringDto

	@IsUrl()
	@IsNotEmpty()
	imgDesktopSrc: string

	@IsUrl()
	@IsOptional()
	imgMobileSrc?: string

	@ValidateNested()
	@Type(() => LocalizedStringDto)
	@IsNotEmpty()
	imgAlt: LocalizedStringDto

	@IsUrl()
	@IsOptional()
	linkUrl?: string

	@IsUrl()
	@IsOptional()
	githubUrl?: string

	@ValidateNested()
	@Type(() => LocalizedStringDto)
	@IsOptional()
	note?: LocalizedStringDto

	@IsBoolean()
	@IsOptional()
	isOpenSource: boolean = false
}

export class PortfolioQueryDto {
	@IsString()
	@IsOptional()
	@MaxLength(80, { message: "Search query is too long" })
	search?: string
}

// Data Mappers (Snake Case <-> Camel Case)
// ===============================
interface PortfolioDbRow {
	id: number
	title: LocalizedString
	description: LocalizedString
	img_desktop_src: string
	img_mobile_src?: string
	img_alt: LocalizedString
	link_url?: string
	github_url?: string
	note?: LocalizedString
	is_open_source: boolean
}

export function mapDbToEntity(row: PortfolioDbRow): PortfolioEntity {
	return {
		id: row.id,
		title: row.title,
		description: row.description,
		imgDesktopSrc: row.img_desktop_src,
		imgMobileSrc: row.img_mobile_src,
		imgAlt: row.img_alt,
		linkUrl: row.link_url,
		githubUrl: row.github_url,
		note: row.note,
		isOpenSource: row.is_open_source,
	}
}

export function mapEntityToDb(entity: Partial<PortfolioEntity>): Partial<PortfolioDbRow> {
	return {
		title: entity.title,
		description: entity.description,
		img_desktop_src: entity.imgDesktopSrc,
		img_mobile_src: entity.imgMobileSrc,
		img_alt: entity.imgAlt,
		link_url: entity.linkUrl,
		github_url: entity.githubUrl,
		note: entity.note,
		is_open_source: entity.isOpenSource,
	}
}
