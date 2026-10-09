import { Component, inject, OnInit, signal } from "@angular/core"
import { Title, Meta } from "@angular/platform-browser"
import { RouterLink } from "@angular/router"

import { ImageContainerComponent } from "../../shared/components/general/image-container.component"
import { TimelineComponent } from "./components/timeline.component"
import { SvgIconComponent } from "../../shared/components/icon/icon.component"

const PAGE_TITLE = "About | Kuvshinov Software"
const PAGE_URL = "/about/"
const PAGE_DESC = "Find out more about the man behind the business."

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

	ngOnInit() {
		this.title.setTitle(PAGE_TITLE)
		this.meta.updateTag({ name: "description", content: PAGE_DESC })
		this.meta.updateTag({ property: "og:title", content: PAGE_TITLE })
		this.meta.updateTag({ property: "og:description", content: PAGE_DESC })
		this.meta.updateTag({ property: "og:url", content: PAGE_URL })
	}
}
