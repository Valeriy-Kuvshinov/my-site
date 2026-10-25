import { Component, computed, DOCUMENT, inject, OnInit } from "@angular/core"
import { Title, Meta } from "@angular/platform-browser"
import { RouterLink } from "@angular/router"

import { SITE_URL } from "@/shared/constants/util"

import { SystemStore } from "@/core/stores/system.store"

import { ImageContainerComponent } from "@/shared/components/general/image-container.component"
import { SvgIconComponent } from "@/shared/components/icon/icon.component"
import { TimelineComponent } from "./components/timeline.component"

const PAGE_TITLE = $localize`:@@about.meta.title:About | Kuvshinov Software`
const PAGE_URL = "/about/"
const PAGE_DESC = $localize`:@@about.meta.desc:Find out more about the man behind the business.`

@Component({
	selector: "main[app-about-page]",
	standalone: true,
	imports: [RouterLink, ImageContainerComponent, TimelineComponent, SvgIconComponent],
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

	protected readonly store = inject(SystemStore)

	protected readonly resumeUrl = computed(() =>
		this.store.currentLang() === "he"
			? "/cv/Valeriy-Kuvshinov-Full-Stack-Engineer-HE.pdf"
			: "/cv/Valeriy-Kuvshinov-Full-Stack-Engineer.pdf"
	)

	protected readonly resumeName = computed(() =>
		this.store.currentLang() === "he"
			? "Valeriy-Kuvshinov-Full-Stack-Engineer-HE.pdf"
			: "Valeriy-Kuvshinov-Full-Stack-Engineer.pdf"
	)

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
}
