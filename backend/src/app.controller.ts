import { Controller, Get } from "@nestjs/common"

@Controller("api")
export class AppController {
	@Get("health")
	getHealthCheck() {
		return {
			status: "ok",
			timestamp: new Date().toISOString(),
		}
	}
}
