import { Component, inject, OnInit } from "@angular/core"
import { Meta, Title } from "@angular/platform-browser"

import { ExternalLinkComponent } from "../../shared/components/general/external-link.component"
import { RouterLink } from "@angular/router"

const PAGE_TITLE = "Privacy Policy | Did Not Get It"
const PAGE_URL = "/privacy-policy/"
const PAGE_DESC =
	"Official statutory privacy disclosure and data processing protocol for the Did Not Get It browser extension."

@Component({
	selector: "main[app-privacy-policy-page]",
	standalone: true,
	imports: [ExternalLinkComponent, RouterLink],
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

	ngOnInit() {
		this.title.setTitle(PAGE_TITLE)
		this.meta.updateTag({ name: "description", content: PAGE_DESC })
		this.meta.updateTag({ property: "og:title", content: PAGE_TITLE })
		this.meta.updateTag({ property: "og:description", content: PAGE_DESC })
		this.meta.updateTag({ property: "og:url", content: PAGE_URL })
	}
}
