import { Type } from "class-transformer"
import {
	IsString,
	IsNotEmpty,
	ValidateNested,
	IsUrl,
	IsOptional,
	IsBoolean,
	MaxLength,
	IsArray,
} from "class-validator"

import { LocalizedString } from "../../../common/interfaces/locale.js"
import { PortfolioEntity } from "../../../common/interfaces/portfolio.js"
import { LocalizedStringDto } from "../../../common/dto/locale.dto.js"

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

	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	technologies?: string[]
}

export class PortfolioQueryDto {
	@IsString()
	@IsOptional()
	@MaxLength(80, { message: "Search query is too long" })
	search?: string

	@IsString()
	@IsOptional()
	technologies?: string
}

// Data Mappers (Snake Case <-> Camel Case)
// ===============================
interface dbRow {
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
	technologies: string[]
}

export function mapDbToEntity(row: dbRow): PortfolioEntity {
	const {
		id,
		title,
		description,
		img_desktop_src,
		img_mobile_src,
		img_alt,
		link_url,
		github_url,
		note,
		is_open_source,
		technologies,
	} = row

	return {
		id: id,
		title: title,
		description: description,
		imgDesktopSrc: img_desktop_src,
		imgMobileSrc: img_mobile_src,
		imgAlt: img_alt,
		linkUrl: link_url,
		githubUrl: github_url,
		note: note,
		isOpenSource: is_open_source,
		technologies: technologies,
	}
}

export function mapEntityToDb(entity: Partial<PortfolioEntity>): Partial<dbRow> {
	const {
		title,
		description,
		imgDesktopSrc,
		imgMobileSrc,
		imgAlt,
		linkUrl,
		githubUrl,
		note,
		isOpenSource,
		technologies,
	} = entity

	return {
		title: title,
		description: description,
		img_desktop_src: imgDesktopSrc,
		img_mobile_src: imgMobileSrc,
		img_alt: imgAlt,
		link_url: linkUrl,
		github_url: githubUrl,
		note: note,
		is_open_source: isOpenSource,
		technologies: technologies,
	}
}
