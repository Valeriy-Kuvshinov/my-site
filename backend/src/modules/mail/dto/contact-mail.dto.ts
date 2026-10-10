import {
	IsString,
	MinLength,
	MaxLength,
	Matches,
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsBoolean,
	Equals,
} from "class-validator"

export class ContactMailDto {
	@IsString()
	@MinLength(3)
	@MaxLength(30)
	@Matches(/^[a-zA-Z\s'.-]+$/, { message: "Name contains invalid characters" })
	name: string

	@IsEmail()
	@MinLength(5)
	@MaxLength(50)
	email: string

	@IsString()
	@MinLength(3)
	@MaxLength(50)
	@Matches(/^[a-zA-Z0-9\s.\-!?']+$/, { message: "Title contains invalid characters" })
	title: string

	@IsString()
	@IsNotEmpty()
	requestType: string

	@IsString()
	@MinLength(15)
	@MaxLength(600)
	@Matches(/^[a-zA-Z0-9\s.\-!?@#$',*;:]+$/, { message: "Message contains invalid characters" })
	message: string

	@IsBoolean()
	@Equals(true, { message: "Explicit privacy policy consent is legally required." })
	consent: boolean

	@IsString()
	@IsOptional()
	turnstileToken?: string
}
