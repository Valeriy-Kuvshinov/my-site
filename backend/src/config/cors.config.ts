import { CorsOptions } from "@nestjs/common/internal"

export function getCorsConfig(): CorsOptions {
	const isProduction = process.env.NODE_ENV === "production"

	const allowedOrigins = isProduction
		? ["https://kuvware.com", "https://www.kuvware.com"]
		: ["http://127.0.0.1:4200", "http://localhost:4200"]

	return {
		origin: allowedOrigins,
		credentials: true,
	}
}
