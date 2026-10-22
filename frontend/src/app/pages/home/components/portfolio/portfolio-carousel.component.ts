import { Component, ChangeDetectionStrategy, signal, computed, inject } from "@angular/core"

import { SystemStore } from "@/core/stores/system.store"

import { ImageContainerComponent } from "@/shared/components/general/image-container.component"
import { SvgIconComponent } from "@/shared/components/icon/icon.component"

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
		imgDesktopSrc:
			"https://res.cloudinary.com/oee6altn/image/upload/v1792668926/noffty-desktop.avif",
		imgMobileSrc:
			"https://res.cloudinary.com/oee6altn/image/upload/v1792668926/noffty-mobile.avif",
		imgAlt: "Screenshot of the Noffty Productions gaming hub",
	},
	{
		title: "Micro Mineral Accessibility",
		description:
			"Retrofitting an entire Wordpress E-commerce platform to natively meet strict AA Israeli accessibility standards while restoring payment gateway stability.",
		imgDesktopSrc:
			"https://res.cloudinary.com/oee6altn/image/upload/v1792668924/micro-mineral-desktop.avif",
		imgMobileSrc:
			"https://res.cloudinary.com/oee6altn/image/upload/v1792668925/micro-mineral-mobile.avif",
		imgAlt: "Screenshot of the Micro Mineral accessible home page",
	},
	{
		title: "Ori Carlin Art Site",
		description:
			"Developed a crafts showcase with local US E-commerce platform for an American artist.",
		imgDesktopSrc:
			"https://res.cloudinary.com/oee6altn/image/upload/v1792668927/oricarlin-desktop.avif",
		imgMobileSrc:
			"https://res.cloudinary.com/oee6altn/image/upload/v1792668927/oricarlin-mobile.avif",
		imgAlt: "Screenshot of the Ori Carlin pottery home page",
	},
	{
		title: "Giggler Freelance Platform",
		description:
			"Created a Fiverr-like E-commerce platform as a final project during my Full-Stack bootcamp, source code publicly available.",
		imgDesktopSrc:
			"https://res.cloudinary.com/oee6altn/image/upload/v1792668924/giggler-desktop.avif",
		imgMobileSrc:
			"https://res.cloudinary.com/oee6altn/image/upload/v1792668924/giggler-mobile.avif",
		imgAlt: "Screenshot of the Giggler submission home page",
	},
	{
		title: "The Vision Telecom Platform",
		description:
			"Architected a fault-tolerant session orchestration and state recovery system across multiple remote Linux environments.",
		imgDesktopSrc: "https://res.cloudinary.com/oee6altn/image/upload/v1792668925/mycell.avif",
		imgAlt: "Screenshot of the Vision Telecom device selection interface",
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

	private readonly isMobile = computed(() => this.store.deviceType() === "mobile")

	protected readonly iconSize = computed(() => (!this.isMobile() ? 48 : 32))

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
		if (this.isMobile() && slide.imgMobileSrc) return slide.imgMobileSrc

		return slide.imgDesktopSrc
	}

	openImage(src: string) {
		this.store.openModal("image-modal", src)
	}
}
