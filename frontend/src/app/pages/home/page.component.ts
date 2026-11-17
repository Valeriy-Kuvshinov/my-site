import { Component, DOCUMENT, inject, OnInit } from "@angular/core"
import { Title, Meta } from "@angular/platform-browser"
import { RouterLink } from "@angular/router"

import { IconName } from "@/shared/components/icon/icon.map"
import { SITE_URL } from "@/shared/constants/util"

import { SvgIconComponent } from "@/shared/components/icon/icon.component"
import { ImageContainerComponent } from "@/shared/components/general/image-container.component"
import { TechCarouselComponent } from "./components/tech/tech-carousel.component"
import { PortfolioCarouselComponent } from "./components/portfolio/portfolio-carousel.component"
import { ExtensionComponent } from "./components/extension/extension.component"
import { HeroComponent } from "./components/hero/hero.component"
import { ReviewsComponent } from "./components/reviews/reviews.component"

interface Highlight {
	icon: IconName
	value: string
	label: string
}

interface Specialty {
	title: string
	description: string
}

const HIGHLIGHTS: Highlight[] = [
	{
		icon: "professional",
		value: "3+",
		label: $localize`:@@home.highlight.experience:Years of Experience`,
	},
	{
		icon: "production",
		value: "5+",
		label: $localize`:@@home.highlight.production:Live Production Systems`,
	},
	{ icon: "source", value: "4+", label: $localize`:@@home.highlight.oss:Open Source Projects` },
	{
		icon: "magGlass",
		value: "3+",
		label: $localize`:@@home.highlight.a11y:Accessibility Audits`,
	},
	{ icon: "github", value: "20+", label: $localize`:@@home.highlight.repos:GitHub Repositories` },
	{
		icon: "commits",
		value: "3000+",
		label: $localize`:@@home.highlight.commits:GitHub Commits`,
	},
]

const SPECIALTIES: Specialty[] = [
	{
		title: $localize`:@@home.specialty1.title:Native Full-Stack Engineering`,
		description: $localize`:@@home.specialty1.desc:Escaping the limitations of templated platforms. I build custom, semantic web applications with automated cloud deployments using modern stacks.`,
	},
	{
		title: $localize`:@@home.specialty2.title:Accessibility Compliance & Risk Reduction`,
		description: $localize`:@@home.specialty2.desc:Auditing and refactoring digital infrastructure to natively meet WCAG 2.1 AA/AAA and Israeli standards, reducing legal risk in a way accessibility overlays alone cannot.`,
	},
	{
		title: $localize`:@@home.specialty3.title:System Architecture & Optimization`,
		description: $localize`:@@home.specialty3.desc:Serving as a technical consultant to resolve critical bottlenecks, secure legacy e-commerce platforms, and orchestrate highly scalable, independent digital assets.`,
	},
	{
		title: $localize`:@@home.specialty4.title:Screen Reader Navigation Tutoring`,
		description: $localize`:@@home.specialty4.desc:Patient one-on-one tutoring for people facing digital barriers: live descriptions of on-screen layouts and coaching through inaccessible sites, forms, and checkout flows, with you in full control.`,
	},
]

const PAGE_TITLE = $localize`:"@@home.meta.title:Kuvshinov Software | Custom Apps, Digital Accessibility Services"`
const PAGE_URL = "/"
const PAGE_DESC = $localize`:@@home.meta.desc:Kuvshinov Software: custom websites and backend systems, accessibility help, and open source projects, built with care.`

@Component({
	selector: "main[app-home-page]",
	standalone: true,
	imports: [
		SvgIconComponent,
		ImageContainerComponent,
		RouterLink,
		TechCarouselComponent,
		PortfolioCarouselComponent,
		ExtensionComponent,
		HeroComponent,
		ReviewsComponent,
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
}
