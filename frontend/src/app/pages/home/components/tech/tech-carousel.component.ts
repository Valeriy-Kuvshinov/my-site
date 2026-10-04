import { Component, ChangeDetectionStrategy } from "@angular/core"

import { IconName } from "../../../../shared/components/icon/icon.map"

import { SvgIconComponent } from "../../../../shared/components/icon/icon.component"

@Component({
	selector: "app-tech-carousel",
	standalone: true,
	imports: [SvgIconComponent],
	templateUrl: "./tech-carousel.html",
	styleUrl: "./tech-carousel.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		style: "display: contents",
	},
})
export class TechCarouselComponent {
	readonly techIcons: Array<{ name: IconName; width: number; height: number }> = [
		{ name: "react", width: 64, height: 64 },
		{ name: "angular", width: 64, height: 64 },
		{ name: "nodejs", width: 64, height: 64 },
		{ name: "nextjs", width: 64, height: 64 },
		{ name: "nestjs", width: 64, height: 64 },
		{ name: "spring", width: 64, height: 64 },
		{ name: "docker", width: 64, height: 64 },
		{ name: "cloudflare", width: 64, height: 64 },
		{ name: "oracle", width: 64, height: 64 },
		{ name: "aws", width: 64, height: 64 },
		{ name: "mongo", width: 64, height: 64 },
		{ name: "postgresql", width: 64, height: 64 },
	]
}
