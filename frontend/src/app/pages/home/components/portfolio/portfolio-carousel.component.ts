import { Component, ChangeDetectionStrategy, signal, computed, inject } from "@angular/core"

import { PortfolioItem } from "@/shared/interfaces/portfolio"
import { getPortfolioImageSrc, getPortfolioImageRatio } from "@/shared/utilities/portfolio.utils"

import { SystemStore } from "@/core/stores/system.store"

import { ImageContainerComponent } from "@/shared/components/general/image-container.component"
import { SvgIconComponent } from "@/shared/components/icon/icon.component"

const PORTFOLIO_SLIDES: PortfolioItem[] = [
	{
		title: $localize`:@@home.portfolio.noffty.title:Noffty Productions Gaming Hub`,
		description: $localize`:@@home.portfolio.noffty.desc:An HTML5 game hosting platform for an indie games company to showcase their portfolio.`,
		imgDesktopSrc:
			"https://res.cloudinary.com/oee6altn/image/upload/v1792668926/noffty-desktop.avif",
		imgMobileSrc:
			"https://res.cloudinary.com/oee6altn/image/upload/v1792668926/noffty-mobile.avif",
		imgAlt: $localize`:@@home.portfolio.noffty.alt:Screenshot of the Noffty Productions gaming hub`,
		isOpenSource: false,
		technologies: [
			"Next.js",
			"React",
			"Zustand",
			"Node.js",
			"Express",
			"MongoDB (NoSQL)",
			"JavaScript",
			"TypeScript",
			"HTML",
			"CSS",
		],
	},
	{
		title: $localize`:@@home.portfolio.micro.title:Micro Mineral Accessibility`,
		description: $localize`:@@home.portfolio.micro.desc:Retrofitting an entire Wordpress E-commerce platform to natively meet strict AA Israeli accessibility standards while restoring payment gateway stability.`,
		imgDesktopSrc:
			"https://res.cloudinary.com/oee6altn/image/upload/v1792668924/micro-mineral-desktop.avif",
		imgMobileSrc:
			"https://res.cloudinary.com/oee6altn/image/upload/v1792668925/micro-mineral-mobile.avif",
		imgAlt: $localize`:@@home.portfolio.micro.alt:Screenshot of the Micro Mineral accessible home page`,
		isOpenSource: false,
		technologies: ["WordPress", "WooCommerce", "Elementor", "JavaScript", "HTML", "CSS"],
	},
	{
		title: $localize`:@@home.portfolio.ori.title:Ori Carlin Art Site`,
		description: $localize`:@@home.portfolio.ori.desc:Developed a crafts showcase with local US E-commerce platform for an American artist.`,
		imgDesktopSrc:
			"https://res.cloudinary.com/oee6altn/image/upload/v1792668927/oricarlin-desktop.avif",
		imgMobileSrc:
			"https://res.cloudinary.com/oee6altn/image/upload/v1792668927/oricarlin-mobile.avif",
		imgAlt: $localize`:@@home.portfolio.ori.alt:Screenshot of the Ori Carlin pottery home page`,
		isOpenSource: false,
		technologies: [
			"Angular",
			"NgRx",
			"Node.js",
			"Express",
			"MongoDB (NoSQL)",
			"TypeScript",
			"JavaScript",
			"HTML",
			"CSS",
			"Sass",
		],
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

	private readonly isRtl = computed(() => this.store.currentLanguage() === "he")

	protected readonly isMobile = computed(() => this.store.deviceType() === "mobile")

	protected readonly iconSize = computed(() => (!this.isMobile() ? 48 : 32))

	protected readonly slides = PORTFOLIO_SLIDES

	protected readonly currentIdx = signal(0)

	protected readonly isFirstSlide = computed(() => this.currentIdx() === 0)
	protected readonly isLastSlide = computed(() => this.currentIdx() === this.slides.length - 1)

	protected readonly transformStyle = computed(() => {
		const dirMultiplier = this.isRtl() ? 1 : -1
		return `translateX(${this.currentIdx() * 100 * dirMultiplier}%)`
	})

	protected readonly getPortfolioImageSrc = getPortfolioImageSrc
	protected readonly getPortfolioImageRatio = getPortfolioImageRatio

	nextSlide() {
		if (!this.isLastSlide()) this.currentIdx.update((i) => i + 1)
	}

	prevSlide() {
		if (!this.isFirstSlide()) this.currentIdx.update((i) => i - 1)
	}

	getImageAriaLabel(slide: PortfolioItem): string {
		return $localize`:@@home.portfolio.img_click.aria:View full size image of ${slide.title}`
	}

	openImage(src: string) {
		this.store.openModal("image-modal", {
			src,
			isMobile: this.isMobile(),
		})
	}
}
