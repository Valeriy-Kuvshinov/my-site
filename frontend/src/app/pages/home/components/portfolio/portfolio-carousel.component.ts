import { Component, ChangeDetectionStrategy, signal, computed } from "@angular/core"

import { ImageContainerComponent } from "../../../../shared/components/general/image-container.component"
import { SvgIconComponent } from "../../../../shared/components/icon/icon.component"

interface PortfolioSlide {
	title: string
	description: string
	imgSrc: string
	imgAlt: string
}

@Component({
	selector: "app-portfolio-carousel",
	standalone: true,
	imports: [SvgIconComponent, ImageContainerComponent],
	templateUrl: "./portfolio-carousel.html",
	styleUrl: "./portfolio-carousel.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: "flex flex-row items-center justify-between w-full gap-4 relative layout-row",
	},
})
export class PortfolioCarouselComponent {
	readonly slides: PortfolioSlide[] = [
		{
			title: "The Vision Telecom Platform",
			description:
				"Architected a fault-tolerant session orchestration and state recovery system using SSH, WebSockets, and Tailscale VPN across remote Linux environments.",
			imgSrc: "/images/portfolio/mycell.avif",
			imgAlt: "Screenshot of the Vision Telecom device selection interface",
		},
		{
			title: "Noffty Productions Gaming Hub",
			description:
				"Built an HTML5 game hosting platform using Cloudflare R2, eliminating third-party iframe dependencies and strengthening site Content Security Policy (CSP).",
			imgSrc: "/images/portfolio/noffty.avif",
			imgAlt: "Screenshot of the Noffty Productions gaming hub",
		},
		{
			title: "Micro Mineral Accessibility",
			description:
				"Retrofitting an entire e-commerce platform to natively meet strict AA Israeli accessibility standards while restoring payment gateway stability.",
			imgSrc: "/images/portfolio/micro-mineral.avif",
			imgAlt: "Screenshot of the Micro Mineral accessible home page",
		},
		{
			title: "CModem Terminal Open Source",
			description:
				"Created a CLI project to handle modem interactions remotely more fluently, actively used in production (MyCell), publicly available.",
			imgSrc: "/images/portfolio/cmodem-terminal.avif",
			imgAlt: "Screenshot of CModem Terminal in use",
		},
	]
	readonly currentIndex = signal(0)

	readonly transformStyle = computed(() => `translateX(-${this.currentIndex() * 100}%)`)

	readonly isFirstSlide = computed(() => this.currentIndex() === 0)

	readonly isLastSlide = computed(() => this.currentIndex() === this.slides.length - 1)

	nextSlide() {
		if (!this.isLastSlide()) this.currentIndex.update((i) => i + 1)
	}

	prevSlide() {
		if (!this.isFirstSlide()) this.currentIndex.update((i) => i - 1)
	}
}
