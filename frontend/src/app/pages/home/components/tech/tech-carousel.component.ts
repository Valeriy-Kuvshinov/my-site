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

	protected readonly ariaLabel = $localize`:@@tech_carousel.region.aria:Technologies Used`

	protected readonly techIcons: Array<{ name: IconName; label: string }> = [
		{ name: "html", label: $localize`:@@tech.html:HTML` },
		{ name: "css", label: $localize`:@@tech.css:CSS` },
		{ name: "javascript", label: $localize`:@@tech.javascript:JavaScript` },
		{ name: "typescript", label: $localize`:@@tech.typescript:TypeScript` },
		{ name: "java", label: $localize`:@@tech.java:Java` },
		{ name: "c", label: $localize`:@@tech.c:C language` },
		{ name: "python", label: $localize`:@@tech.python:Python` },
		{ name: "react", label: $localize`:@@tech.react:React` },
		{ name: "angular", label: $localize`:@@tech.angular:Angular` },
		{ name: "svelte", label: $localize`:@@tech.svelte:Svelte` },
		{ name: "tailwind", label: $localize`:@@tech.tailwind:TailwindCSS` },
		{ name: "nodejs", label: $localize`:@@tech.nodejs:Node.js` },
		{ name: "nextjs", label: $localize`:@@tech.nextjs:Next.js` },
		{ name: "nestjs", label: $localize`:@@tech.nestjs:NestJS` },
		{ name: "spring", label: $localize`:@@tech.spring:Spring Boot` },
		{ name: "docker", label: $localize`:@@tech.docker:Docker` },
		{ name: "cloudflare", label: $localize`:@@tech.cloudflare:Cloudflare` },
		{ name: "oracle", label: $localize`:@@tech.oracle:Oracle Cloud` },
		{ name: "aws", label: $localize`:@@tech.aws:Amazon Web Services` },
		{ name: "mongo", label: $localize`:@@tech.mongo:MongoDB` },
		{ name: "postgresql", label: $localize`:@@tech.postgresql:PostgreSQL` },
		{ name: "rasberry", label: $localize`:@@tech.rasberry:Raspberry Pi` },
		{ name: "claude", label: $localize`:@@tech.claude:Claude Code` },
		{ name: "chatgpt", label: $localize`:@@tech.chatgpt:ChatGPT` },
	]
}
