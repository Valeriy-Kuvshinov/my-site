import { plainToInstance, Type } from "class-transformer"
import {
	IsEnum,
	IsNumber,
	IsString,
	IsUrl,
	IsEmail,
	IsNotEmpty,
	validateSync,
} from "class-validator"

enum Environment {
	Development = "development",
	Production = "production",
	Test = "test",
}

class EnvironmentVariables {
	@IsEnum(Environment)
	NODE_ENV: Environment = Environment.Development

	@Type(() => Number)
	@IsNumber()
	PORT: number = 3030

	@IsString()
	@IsNotEmpty({ message: "JWT_SECRET key is missing" })
	JWT_SECRET: string

	@IsString()
	@IsNotEmpty({ message: "RESEND_API_KEY is missing" })
	RESEND_API_KEY: string

	@IsEmail({}, { message: "SENDER_MAIL_ADDRESS must be a valid email string" })
	SENDER_MAIL_ADDRESS: string

	@IsEmail({}, { message: "NOREPLY_MAIL_ADDRESS must be a valid email string" })
	NOREPLY_MAIL_ADDRESS: string

	@IsEmail({}, { message: "RECEIVER_EMAIL_ADDRESS must be a valid email string" })
	RECEIVER_EMAIL_ADDRESS: string

	@IsUrl({}, { message: "R2_ENDPOINT must be a valid connection string" })
	R2_ENDPOINT: string

	@IsString()
	@IsNotEmpty({ message: "R2_ACCESS_KEY_ID is missing" })
	R2_ACCESS_KEY_ID: string

	@IsString()
	@IsNotEmpty({ message: "R2_SECRET_ACCESS_KEY is missing" })
	R2_SECRET_ACCESS_KEY: string

	@IsUrl({}, { message: "R2_PUBLIC_URL must be a valid connection string" })
	R2_PUBLIC_URL: string

	@IsString()
	@IsNotEmpty({ message: "CLOUDINARY_CLOUD_NAME is missing" })
	CLOUDINARY_CLOUD_NAME: string

	@IsString()
	@IsNotEmpty({ message: "CLOUDINARY_API_KEY is missing" })
	CLOUDINARY_API_KEY: string

	@IsString()
	@IsNotEmpty({ message: "CLOUDINARY_API_SECRET is missing" })
	CLOUDINARY_API_SECRET: string

	@IsString()
	@IsNotEmpty({ message: "RECAPTCHA_SECRET_KEY is missing" })
	RECAPTCHA_SECRET_KEY: string

	@IsString()
	@IsNotEmpty({ message: "GitHub Actions token is missing" })
	GITHUB_ACTIONS_TOKEN: string
}

export function validateEnv(config: Record<string, unknown>) {
	const validatedConfig = plainToInstance(EnvironmentVariables, config, {
		enableImplicitConversion: true,
	})

	const errors = validateSync(validatedConfig, { skipMissingProperties: false })

	if (errors.length > 0) throw new Error(errors.toString())

	return validatedConfig
}
