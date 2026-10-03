import { Component, inject, OnInit } from "@angular/core"
import { Title, Meta } from "@angular/platform-browser"

const PAGE_TITLE = "Portfolio | VK Freelance Software"
const PAGE_URL = "/portfolio/"
const PAGE_DESC = "Browse through the projects, clients and more that have been impacted by us."

@Component({
	selector: "main[app-portfolio-page]",
	standalone: true,
	imports: [],
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
