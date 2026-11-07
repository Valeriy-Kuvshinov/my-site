import { Component, computed, DOCUMENT, inject, OnInit } from "@angular/core"
import { Title, Meta } from "@angular/platform-browser"
import { RouterLink } from "@angular/router"

import { SITE_URL } from "@/shared/constants/util"
import { PortfolioItem } from "@/shared/interfaces/portfolio"

import { SystemStore } from "@/core/stores/system.store"

import { PortfolioService } from "@/core/services/api/portfolio/portfolio.service"

import { ImageContainerComponent } from "@/shared/components/general/image-container.component"
import { SvgIconComponent } from "@/shared/components/icon/icon.component"
import { LoadingComponent } from "@/shared/components/loading/loading.component"
import { ErrorBannerComponent } from "@/shared/components/error-banner/error-banner.component"

const PAGE_TITLE = $localize`:@@portfolio_page.meta.title:Portfolio | Kuvshinov Software`
const PAGE_URL = "/portfolio/"
const PAGE_DESC = $localize`:@@portfolio_page.meta.desc:Browse through the projects, clients and more that have been impacted by us.`

@Component({
	selector: "main[app-portfolio-page]",
	standalone: true,
	imports: [
		ImageContainerComponent,
		SvgIconComponent,
		RouterLink,
		LoadingComponent,
		ErrorBannerComponent,
	],
	templateUrl: "./page.html",
	styleUrl: "./page.css",
	host: {
		id: "main-content",
		class: "w-h-full block",
	},
})
export default class PageComponent implements OnInit {
	private readonly title = inject(Title)
	private readonly meta = inject(Meta)
	private readonly document = inject(DOCUMENT)

	private readonly store = inject(SystemStore)

	private readonly portfolioService = inject(PortfolioService)

	private readonly portfolioQuery = this.portfolioService.getPortfolioItems()

	private readonly isMobile = computed(() => this.store.deviceType() === "mobile")

	protected readonly items = computed<PortfolioItem[]>(() => this.portfolioQuery.data() || [])

	ngOnInit() {
		this.title.setTitle(PAGE_TITLE)
		this.meta.updateTag({ name: "description", content: PAGE_DESC })
		this.meta.updateTag({ property: "og:title", content: PAGE_TITLE })
		this.meta.updateTag({ property: "og:description", content: PAGE_DESC })

		const absoluteUrl = `${SITE_URL}${PAGE_URL}`
		this.meta.updateTag({ property: "og:url", content: absoluteUrl })

		this.setCanonicalUrl(absoluteUrl)
	}

	private setCanonicalUrl(url: string) {
		let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]')

		if (!link) {
			link = this.document.createElement("link")
			link.setAttribute("rel", "canonical")
			this.document.head.appendChild(link)
		}
		link.setAttribute("href", url)
	}

	getImageAriaLabel(item: PortfolioItem): string {
		return $localize`:@@portfolio_page.img_click.aria:View full size image of ${item.title}`
	}

	getImageSrc(item: PortfolioItem): string {
		if (this.isMobile() && item.imgMobileSrc) return item.imgMobileSrc

		return item.imgDesktopSrc
	}

	getImageRatio(item: PortfolioItem): string {
		if (this.isMobile() && item.imgMobileSrc) return "9 / 16" // Portrait

		return "16 / 9" // Landscape
	}

	openImage(src: string) {
		this.store.openModal("image-modal", src)
	}
}
