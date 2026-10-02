import { Component, inject, OnInit } from "@angular/core"
import { Title, Meta } from "@angular/platform-browser"

import { SvgIconComponent } from "../../shared/components/icon/icon.component"

const PAGE_TITLE = "VK Freelance Software"
const PAGE_URL = "/"
const PAGE_DESC =
	"VK Freelance Software - Providing you websites, systems, open source and accessibility assistance with care."

@Component({
	selector: "main[app-home-page]",
	standalone: true,
	imports: [SvgIconComponent],
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
