import { Component, computed, DOCUMENT, effect, inject, OnInit } from "@angular/core"
import { Title, Meta } from "@angular/platform-browser"
import { ActivatedRoute, Router, RouterLink } from "@angular/router"
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms"
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop"
import { debounceTime, distinctUntilChanged } from "rxjs"

import { SITE_URL } from "@/shared/constants/util"
import { PortfolioItem } from "@/shared/interfaces/portfolio"
import { getPortfolioImageRatio, getPortfolioImageSrc } from "@/shared/utilities/portfolio.utils"

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
		ReactiveFormsModule,
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

	private readonly route = inject(ActivatedRoute)
	private readonly router = inject(Router)

	private readonly routeQueryMap = toSignal(this.route.queryParamMap)

	protected readonly isMobile = computed(() => this.store.deviceType() === "mobile")

	protected readonly searchTerm = computed(() => this.routeQueryMap()?.get("title") || "")

	protected readonly searchControl = new FormControl(this.searchTerm(), {
		nonNullable: true,
		validators: [Validators.maxLength(80)],
	})

	readonly portfolioQuery = this.portfolioService.getPortfolioItems(this.searchTerm)

	protected readonly items = computed<PortfolioItem[]>(() => this.portfolioQuery.data() || [])

	protected readonly getPortfolioImageSrc = getPortfolioImageSrc
	protected readonly getPortfolioImageRatio = getPortfolioImageRatio

	constructor() {
		this.searchControl.valueChanges
			.pipe(debounceTime(500), distinctUntilChanged(), takeUntilDestroyed())
			.subscribe((term) => {
				if (this.searchControl.valid) {
					this.router.navigate([], {
						relativeTo: this.route,
						queryParams: { title: term || null },
						queryParamsHandling: "merge",
						replaceUrl: true,
					})
				}
			})
		effect(() => {
			const urlTerm = this.searchTerm()

			if (this.searchControl.value !== urlTerm) {
				this.searchControl.setValue(urlTerm, { emitEvent: false })
			}
		})
	}

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

	openImage(src: string) {
		this.store.openModal("image-modal", {
			src,
			isMobile: this.isMobile(),
		})
	}
}
