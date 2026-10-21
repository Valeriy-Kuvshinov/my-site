import { Component, DOCUMENT, inject, OnInit } from "@angular/core"
import { Meta, Title } from "@angular/platform-browser"
import { RouterLink } from "@angular/router"

import { SITE_URL } from "../../shared/constants/util"

const PAGE_TITLE = "Privacy Policy | Did Not Get It"
const PAGE_URL = "/privacy-policy/"
const PAGE_DESC =
	"Official statutory privacy disclosure and data processing protocol for the Did Not Get It browser extension."

@Component({
	selector: "main[app-privacy-policy-page]",
	standalone: true,
	imports: [RouterLink],
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
