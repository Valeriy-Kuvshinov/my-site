import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { PinoLogger } from "nestjs-pino"

const GITHUB_REPO = "Valeriy-Kuvshinov/my-site"

@Injectable()
export class GithubService {
	constructor(
		private readonly configService: ConfigService,
		private readonly logger: PinoLogger
	) {
		this.logger.setContext(GithubService.name)
	}

	async runStaticRebuild(): Promise<void> {
		const token = this.configService.getOrThrow<string>("GITHUB_ACTIONS_TOKEN")

		try {
			await fetch(`https://api.github.com/repos/${GITHUB_REPO}/dispatches`, {
				method: "POST",
				headers: {
					Accept: "application/vnd.github.v3+json",
					Authorization: `token ${token}`,
				},
				body: JSON.stringify({
					event_type: "rebuild-static-assets",
				}),
			})
			this.logger.info("GitHub Action rebuild triggered successfully")
		} catch (err) {
			this.logger.error({ err }, "Failed to trigger GitHub Action rebuild")
		}
	}
}
