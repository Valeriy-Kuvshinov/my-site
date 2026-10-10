import { Component, OnInit, inject } from "@angular/core"
import { Title, Meta } from "@angular/platform-browser"
import { RouterLink } from "@angular/router"

const PAGE_TITLE = "Terms of Service | Kuvshinov Software"
const PAGE_URL = "/terms/"
const PAGE_DESC =
	"Official statutory privacy disclosure and data processing protocol for the Did Not Get It browser extension."

@Component({
	selector: "main[app-terms-page]",
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

	ngOnInit() {
		this.title.setTitle(PAGE_TITLE)
		this.meta.updateTag({ name: "description", content: PAGE_DESC })
		this.meta.updateTag({ property: "og:title", content: PAGE_TITLE })
		this.meta.updateTag({ property: "og:description", content: PAGE_DESC })
		this.meta.updateTag({ property: "og:url", content: PAGE_URL })
	}
}
