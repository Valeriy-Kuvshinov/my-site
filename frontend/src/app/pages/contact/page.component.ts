import { Component, inject } from "@angular/core"
import { Title, Meta } from "@angular/platform-browser"

import { ContactFormComponent } from "./components/form.component"

const PAGE_TITLE = "Contact | VK Freelance Software"
const PAGE_URL = "/contact/"
const PAGE_DESC = "Get in Touch with VK Freelance Software."

@Component({
	selector: "main[app-contact-page]",
	standalone: true,
	imports: [ContactFormComponent],
	templateUrl: "./page.html",
	styleUrl: "./page.css",
	host: {
		id: "main-content",
		class: "w-h-full block",
	},
})
export default class PageComponent {
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
