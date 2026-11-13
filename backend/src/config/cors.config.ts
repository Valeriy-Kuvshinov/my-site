import { CorsOptions } from "@nestjs/common/internal"

import { IS_PRODUCTION } from "../common/constants/config.js"

export function getCorsConfig(): CorsOptions {
	const allowedOrigins = IS_PRODUCTION
		? ["https://kuvware.com", "https://www.kuvware.com"]
		: ["http://127.0.0.1:4200", "http://localhost:4200"]

	return {
		origin: allowedOrigins,
		credentials: true,
	}
}
