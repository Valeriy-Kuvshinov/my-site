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
		title: $localize`:@@home.portfolio.noffty.title:Noffty Productions Gaming Hub`,
		description: $localize`:@@home.portfolio.noffty.desc:Built an HTML5 game hosting platform using Cloudflare R2, eliminating third-party iframe dependencies and strengthening site Content Security Policy.`,
		imgDesktopSrc:
			"https://res.cloudinary.com/oee6altn/image/upload/v1792668926/noffty-desktop.avif",
		imgMobileSrc:
			"https://res.cloudinary.com/oee6altn/image/upload/v1792668926/noffty-mobile.avif",
		imgAlt: $localize`:@@home.portfolio.noffty.alt:Screenshot of the Noffty Productions gaming hub`,
	},
	{
		title: $localize`:@@home.portfolio.micro.title:Micro Mineral Accessibility`,
		description: $localize`:@@home.portfolio.micro.desc:Retrofitting an entire Wordpress E-commerce platform to natively meet strict AA Israeli accessibility standards while restoring payment gateway stability.`,
		imgDesktopSrc:
			"https://res.cloudinary.com/oee6altn/image/upload/v1792668924/micro-mineral-desktop.avif",
		imgMobileSrc:
			"https://res.cloudinary.com/oee6altn/image/upload/v1792668925/micro-mineral-mobile.avif",
		imgAlt: $localize`:@@home.portfolio.micro.alt:Screenshot of the Micro Mineral accessible home page`,
	},
	{
		title: $localize`:@@home.portfolio.ori.title:Ori Carlin Art Site`,
		description: $localize`:@@home.portfolio.ori.desc:Developed a crafts showcase with local US E-commerce platform for an American artist.`,
		imgDesktopSrc:
			"https://res.cloudinary.com/oee6altn/image/upload/v1792668927/oricarlin-desktop.avif",
		imgMobileSrc:
			"https://res.cloudinary.com/oee6altn/image/upload/v1792668927/oricarlin-mobile.avif",
		imgAlt: $localize`:@@home.portfolio.ori.alt:Screenshot of the Ori Carlin pottery home page`,
	},
	{
		title: $localize`:@@home.portfolio.giggler.title:Giggler Freelance Platform`,
		description: $localize`:@@home.portfolio.giggler.desc:Created a Fiverr-like E-commerce platform as a final project during my Full-Stack bootcamp, source code publicly available.`,
		imgDesktopSrc:
			"https://res.cloudinary.com/oee6altn/image/upload/v1792668924/giggler-desktop.avif",
		imgMobileSrc:
			"https://res.cloudinary.com/oee6altn/image/upload/v1792668924/giggler-mobile.avif",
		imgAlt: $localize`:@@home.portfolio.giggler.alt:Screenshot of the Giggler submission home page`,
	},
	{
		title: $localize`:@@home.portfolio.vision.title:The Vision Telecom Platform`,
		description: $localize`:@@home.portfolio.vision.desc:Architected a fault-tolerant session orchestration and state recovery system across multiple remote Linux environments.`,
		imgDesktopSrc: "https://res.cloudinary.com/oee6altn/image/upload/v1792668925/mycell.avif",
		imgAlt: $localize`:@@home.portfolio.vision.alt:Screenshot of the Vision Telecom device selection interface`,
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

	private readonly isRtl = computed(() => this.store.currentLanguage() === "he")

	protected readonly iconSize = computed(() => (!this.isMobile() ? 48 : 32))

	protected readonly slides = PORTFOLIO_SLIDES

	protected readonly currentIdx = signal(0)

	protected readonly transformStyle = computed(() => {
		const dirMultiplier = this.isRtl() ? 1 : -1
		return `translateX(${this.currentIdx() * 100 * dirMultiplier}%)`
	})

	protected readonly isFirstSlide = computed(() => this.currentIdx() === 0)
	protected readonly isLastSlide = computed(() => this.currentIdx() === this.slides.length - 1)

	nextSlide() {
		if (!this.isLastSlide()) this.currentIdx.update((i) => i + 1)
	}

	prevSlide() {
		if (!this.isFirstSlide()) this.currentIdx.update((i) => i - 1)
	}

	getImageAriaLabel(slide: PortfolioSlide): string {
		return $localize`:@@home.portfolio.img_click.aria:View full size image of ${slide.title}`
	}

	getImageSrc(slide: PortfolioSlide): string {
		if (this.isMobile() && slide.imgMobileSrc) return slide.imgMobileSrc

		return slide.imgDesktopSrc
	}

	openImage(src: string) {
		this.store.openModal("image-modal", src)
	}
}
