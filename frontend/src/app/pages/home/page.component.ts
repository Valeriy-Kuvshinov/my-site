import { Component, DOCUMENT, inject, OnInit } from "@angular/core"
import { Title, Meta } from "@angular/platform-browser"
import { RouterLink } from "@angular/router"

import { IconName } from "@/shared/components/icon/icon.map"
import { SITE_URL } from "@/shared/constants/util"

import { SystemStore } from "@/core/stores/system.store"

import { SvgIconComponent } from "@/shared/components/icon/icon.component"
import { ImageContainerComponent } from "@/shared/components/general/image-container.component"
import { TechCarouselComponent } from "./components/tech/tech-carousel.component"
import { PortfolioCarouselComponent } from "./components/portfolio/portfolio-carousel.component"

interface Highlight {
	icon: IconName
	value: string
	label: string
}

interface Specialty {
	title: string
	description: string
}

const PAGE_TITLE = "Kuvshinov Software"
const PAGE_URL = "/"
const PAGE_DESC =
	"Kuvshinov Software - Providing you websites, systems, open source and accessibility assistance with care."

const HIGHLIGHTS: Highlight[] = [
	{ icon: "professional", value: "2+", label: "Years of Experience" },
	{ icon: "production", value: "5+", label: "Launched Productions" },
	{ icon: "source", value: "2+", label: "Open Source Projects" },
	{ icon: "magGlass", value: "3+", label: "Accessibility Audits" },
	{ icon: "github", value: "20+", label: "GitHub Repositories" },
	{ icon: "commits", value: "3000+", label: "GitHub Contributions" },
]

const SPECIALTIES: Specialty[] = [
	{
		title: "Native Full-Stack Engineering",
		description:
			"Escaping the limitations of templated platforms. I build custom, semantic web applications with automated CI/CD cloud deployments using modern stacks (Angular, React, Next.js, Express, NestJS, Spring Boot).",
	},
	{
		title: "A11y Compliance & Legal Immunity",
		description:
			"Auditing and refactoring digital infrastructure to natively meet WCAG 2.1 AA/AAA and Israeli standards - providing true legal protection that accessibility overlays simply cannot offer.",
	},
	{
		title: "System Architecture & Optimization",
		description:
			"Serving as a technical consultant to resolve critical bottlenecks, secure legacy e-commerce platforms, and orchestrate highly scalable, independent digital assets.",
	},
	{
		title: "Remote Digital Assistance",
		description:
			"Dedicated one-on-one support for individuals facing severe digital barriers, providing secure navigation assistance for inaccessible sites and complex verification systems.",
	},
]

@Component({
	selector: "main[app-home-page]",
	standalone: true,
	imports: [
		SvgIconComponent,
		ImageContainerComponent,
		RouterLink,
		TechCarouselComponent,
		PortfolioCarouselComponent,
	],
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

	private readonly store = inject(SystemStore)

	protected readonly highlights = HIGHLIGHTS
	protected readonly specialties = SPECIALTIES

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

	openImage(src: string) {
		this.store.openModal("image-modal", src)
	}
}
