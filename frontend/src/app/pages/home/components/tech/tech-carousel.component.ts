import { Component, ChangeDetectionStrategy, computed, inject } from "@angular/core"

import { IconName } from "../../../../shared/components/icon/icon.map"

import { SystemStore } from "../../../../core/stores/system.store"

import { SvgIconComponent } from "../../../../shared/components/icon/icon.component"

@Component({
	selector: "app-tech-carousel",
	standalone: true,
	imports: [SvgIconComponent],
	templateUrl: "./tech-carousel.html",
	styleUrl: "./tech-carousel.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: "flex flex-col w-full",
		role: "region",
		"[attr.aria-label]": "ariaLabel",
	},
})
export class TechCarouselComponent {
	private readonly store = inject(SystemStore)

	protected readonly iconSize = computed(() => (this.store.deviceType() === "desktop" ? 64 : 48))

	protected readonly ariaLabel = $localize`:@@home.tech_carousel.region.aria:Technologies Used`

	protected readonly techIcons: Array<{ name: IconName; label: string }> = [
		{ name: "html", label: "HTML" },
		{ name: "css", label: "CSS" },
		{ name: "javascript", label: "JavaScript" },
		{ name: "typescript", label: "TypeScript" },
		{ name: "java", label: "Java" },
		{ name: "c", label: "C" },
		{ name: "python", label: "Python" },
		{ name: "react", label: "React" },
		{ name: "angular", label: "Angular" },
		{ name: "svelte", label: "Svelte" },
		{ name: "tailwind", label: "TailwindCSS" },
		{ name: "nodejs", label: "Node.js" },
		{ name: "nextjs", label: "Next.js" },
		{ name: "nestjs", label: "Nest.js" },
		{ name: "spring", label: "Spring Boot" },
		{ name: "docker", label: "Docker" },
		{ name: "cloudflare", label: "Cloudflare" },
		{ name: "oracle", label: "Oracle Cloud" },
		{ name: "aws", label: "AWS" },
		{ name: "mongo", label: "MongoDB" },
		{ name: "postgresql", label: "PostgreSQL" },
		{ name: "rasberry", label: "Raspberry Pi" },
		{ name: "claude", label: "Claude Code" },
		{ name: "chatgpt", label: "ChatGPT" },
	]
}
