import { Component, computed, DOCUMENT, inject } from "@angular/core"
import { Title, Meta } from "@angular/platform-browser"

import { ContactFormData } from "../../shared/interfaces/form"
import { SITE_URL } from "../../shared/constants/util"
import { SOCIAL_LINKS } from "../../shared/constants/socials"

import { SystemStore } from "../../core/stores/system.store"

import { SvgIconComponent } from "../../shared/components/icon/icon.component"
import { ContactFormComponent } from "./components/form.component"

const PAGE_TITLE = $localize`:@@contact.meta.title:Contact | Kuvshinov Software`
const PAGE_URL = "/contact/"
const PAGE_DESC = $localize`:@@contact.meta.desc:Get in Touch with Kuvshinov Software.`

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
	private readonly document = inject(DOCUMENT)

	private readonly store = inject(SystemStore)

	protected readonly socials = SOCIAL_LINKS

	protected readonly defaultValues: ContactFormData = {
		name: "",
		email: "",
		title: "",
		requestType: "Q&A",
		message: "",
		consent: false,
		turnstileToken: "",
	}

	protected readonly socialIconSize = computed(() =>
		this.store.deviceType() === "desktop" ? 48 : 32
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
