import { Component, ChangeDetectionStrategy, signal, computed, inject } from "@angular/core"

import { SystemStore } from "../../../../core/stores/system.store"

import { ImageContainerComponent } from "../../../../shared/components/general/image-container.component"
import { SvgIconComponent } from "../../../../shared/components/icon/icon.component"

interface PortfolioSlide {
	title: string
	description: string
	imgDesktopSrc: string
	imgMobileSrc?: string
	imgAlt: string
}

const PORTFOLIO_SLIDES: PortfolioSlide[] = [
	{
		title: "Noffty Productions Gaming Hub",
		description:
			"Built an HTML5 game hosting platform using Cloudflare R2, eliminating third-party iframe dependencies and strengthening site Content Security Policy.",
		imgDesktopSrc: "/images/portfolio/noffty-desktop.avif",
		imgMobileSrc: "/images/portfolio/noffty-mobile.avif",
		imgAlt: "Screenshot of the Noffty Productions gaming hub",
	},
	{
		title: "Micro Mineral Accessibility",
		description:
			"Retrofitting an entire e-commerce platform to natively meet strict AA Israeli accessibility standards while restoring payment gateway stability.",
		imgDesktopSrc: "/images/portfolio/micro-mineral-desktop.avif",
		imgMobileSrc: "/images/portfolio/micro-mineral-mobile.avif",
		imgAlt: "Screenshot of the Micro Mineral accessible home page",
	},
	{
		title: "The Vision Telecom Platform",
		description:
			"Architected a fault-tolerant session orchestration and state recovery system using SSH, WebSockets, and Tailscale VPN across remote Linux environments.",
		imgDesktopSrc: "/images/portfolio/mycell.avif",
		imgAlt: "Screenshot of the Vision Telecom device selection interface",
	},
	{
		title: "CModem Terminal Open Source",
		description:
			"Created a CLI project to handle modem interactions remotely more fluently, actively used in production (MyCell), publicly available.",
		imgDesktopSrc: "/images/portfolio/cmodem-terminal.avif",
		imgAlt: "Screenshot of CModem Terminal in use",
	},
]

@Component({
	selector: "app-portfolio-carousel",
	standalone: true,
	imports: [SvgIconComponent, ImageContainerComponent],
	templateUrl: "./portfolio-carousel.html",
	styleUrl: "./portfolio-carousel.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: "flex w-full relative",
	},
})
export class PortfolioCarouselComponent {
	private readonly store = inject(SystemStore)

	private readonly isDesktop = computed(() => this.store.deviceType() === "desktop")

	protected readonly iconSize = computed(() => (this.isDesktop() ? 48 : 32))

	protected readonly slides = PORTFOLIO_SLIDES

	protected readonly currentIndex = signal(0)

	protected readonly transformStyle = computed(() => `translateX(-${this.currentIndex() * 100}%)`)

	protected readonly isFirstSlide = computed(() => this.currentIndex() === 0)

	protected readonly isLastSlide = computed(() => this.currentIndex() === this.slides.length - 1)

	nextSlide() {
		if (!this.isLastSlide()) this.currentIndex.update((i) => i + 1)
	}

	prevSlide() {
		if (!this.isFirstSlide()) this.currentIndex.update((i) => i - 1)
	}

	getImageSrc(slide: PortfolioSlide): string {
		if (!this.isDesktop() && slide.imgMobileSrc) return slide.imgMobileSrc

		return slide.imgDesktopSrc
	}

	openImage(src: string) {
		this.store.openModal("image-modal", src)
	}
}
