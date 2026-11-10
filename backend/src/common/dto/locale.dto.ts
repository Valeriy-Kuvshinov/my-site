import { IsString, IsNotEmpty } from "class-validator"

import { LocalizedString } from "../interfaces/locale.js"

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
