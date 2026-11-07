import { Component, OnInit, inject } from "@angular/core"
import { Title, Meta } from "@angular/platform-browser"

import { ErrorBannerComponent } from "@/shared/components/error-banner/error-banner.component"

const PAGE_TITLE = $localize`:@@not_found.meta.title:Page Not Found | Kuvshinov Software`

@Component({
	selector: "main[app-not-found-page]",
	standalone: true,
	imports: [ErrorBannerComponent],
	templateUrl: "./page.html",
	styleUrl: "./page.css",
	host: {
		id: "main-content",
		class: "w-h-full block",
	},
})
export default class NotFoundPageComponent implements OnInit {
	private readonly title = inject(Title)
	private readonly meta = inject(Meta)

	ngOnInit() {
		this.title.setTitle(PAGE_TITLE)
		this.meta.updateTag({ name: "robots", content: "noindex, follow" })
	}
}
