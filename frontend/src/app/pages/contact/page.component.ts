import { Component, computed, inject } from "@angular/core"
import { Title, Meta } from "@angular/platform-browser"

import { SystemStore } from "../../core/stores/system.store"

import { SOCIAL_LINKS } from "../../shared/constants/socials"

import { SvgIconComponent } from "../../shared/components/icon/icon.component"
import { ContactFormComponent } from "./components/form.component"

const PAGE_TITLE = "Contact | Kuvshinov Software"
const PAGE_URL = "/contact/"
const PAGE_DESC = "Get in Touch with Kuvshinov Software."

@Component({
	selector: "main[app-contact-page]",
	standalone: true,
	imports: [ContactFormComponent, SvgIconComponent],
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

	private readonly store = inject(SystemStore)

	protected readonly socials = SOCIAL_LINKS

	protected readonly defaultFormValues = {
		name: "",
		email: "",
		title: "",
		requestType: "Q&A",
		message: "",
		consent: false,
	}

	protected readonly socialIconSize = computed(() =>
		this.store.deviceType() === "desktop" ? 48 : 32
	)

	ngOnInit() {
		this.title.setTitle(PAGE_TITLE)
		this.meta.updateTag({ name: "description", content: PAGE_DESC })
		this.meta.updateTag({ property: "og:title", content: PAGE_TITLE })
		this.meta.updateTag({ property: "og:description", content: PAGE_DESC })
		this.meta.updateTag({ property: "og:url", content: PAGE_URL })
	}
}
