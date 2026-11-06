import { Type } from "class-transformer"
import { IsString, IsNotEmpty, ValidateNested, IsUrl, IsOptional, IsBoolean } from "class-validator"

import { LocalizedString } from "../../../common/interfaces/locale.js"

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
