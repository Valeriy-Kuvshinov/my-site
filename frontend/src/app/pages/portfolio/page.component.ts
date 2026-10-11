import { Component, inject, OnInit } from "@angular/core"
import { Title, Meta } from "@angular/platform-browser"
import { RouterLink } from "@angular/router"

import { SystemStore } from "../../core/stores/system.store"

import { ImageContainerComponent } from "../../shared/components/general/image-container.component"
import { SvgIconComponent } from "../../shared/components/icon/icon.component"

interface PortfolioItem {
	title: string
	description: string
	imgSrc: string
	imgAlt: string
	linkUrl?: string
	githubUrl?: string
	note?: string
}

const PORTFOLIO_ITEMS: PortfolioItem[] = [
	{
		title: "Did Not Get It Extension",
		description:
			"Created to soften the blow of living through this job market in a comedic way, source code publicly available.",
		imgSrc: "/images/portfolio/extension-after.avif",
		imgAlt: "Screenshot of the extension showing emails automatically labeled and marked as read",
		githubUrl: "https://github.com/Valeriy-Kuvshinov/did-not-get-it-extension",
	},
	{
		title: "Noffty Productions Gaming Hub",
		description:
			"Built an HTML5 game hosting platform using Cloudflare R2, eliminating third-party iframe dependencies and strengthening site Content Security Policy.",
		imgSrc: "/images/portfolio/noffty-desktop.avif",
		imgAlt: "Screenshot of the Noffty Productions gaming hub",
		linkUrl: "https://noffty.com",
	},
	{
		title: "Micro Mineral Accessibility",
		description:
			"Retrofitting an entire Wordpress e-commerce platform to natively meet strict AA Israeli accessibility standards while restoring payment gateway stability.",
		imgSrc: "/images/portfolio/micro-mineral-desktop.avif",
		imgAlt: "Screenshot of the Micro Mineral accessible home page",
		linkUrl: "https://mmil.co.il/",
	},
	{
		title: "Ori Carlin Art Site",
		description:
			"Developed a crafts showcase with local US e-commerce platform for an American artist.",
		imgSrc: "/images/portfolio/oricarlin-desktop.avif",
		imgAlt: "Screenshot of the Ori Carlin pottery home page",
		githubUrl: "https://github.com/TAC42/art-store",
		note: "Currently the site is offline, thus source code is publically available.",
	},
	{
		title: "The Vision Telecom Platform",
		description:
			"Architected a fault-tolerant session orchestration and state recovery system across multiple remote Linux environments.",
		imgSrc: "/images/portfolio/mycell.avif",
		imgAlt: "Screenshot of the Vision Telecom device selection interface",
		note: "Source code available per recruiter's request...",
	},
	{
		title: "CModem Terminal CLI Tool",
		description:
			"Created to handle modem interactions remotely more fluently, already used in some of my production (MyCell), source code publicly available.",
		imgSrc: "/images/portfolio/cmodem-terminal.avif",
		imgAlt: "Screenshot of CModem Terminal in use",
		githubUrl: "https://github.com/Valeriy-Kuvshinov/cmodem-terminal",
	},
	{
		title: "Giggler Freelance Platform",
		description:
			"Created a Fiverr-like platform as a final project during my Full-Stack bootcamp, source code publicly available.",
		imgSrc: "/images/portfolio/giggler-desktop.avif",
		imgAlt: "Screenshot of the Giggler submission home page",
		linkUrl: "https://giggler.onrender.com/",
		githubUrl: "https://github.com/Valeriy-Kuvshinov/Giggler",
	},
]

const PAGE_TITLE = "Portfolio | Kuvshinov Software"
const PAGE_URL = "/portfolio/"
const PAGE_DESC = "Browse through the projects, clients and more that have been impacted by us."

@Component({
	selector: "main[app-portfolio-page]",
	standalone: true,
	imports: [ImageContainerComponent, SvgIconComponent, RouterLink],
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

	private readonly store = inject(SystemStore)

	protected readonly items = PORTFOLIO_ITEMS

	ngOnInit() {
		this.title.setTitle(PAGE_TITLE)
		this.meta.updateTag({ name: "description", content: PAGE_DESC })
		this.meta.updateTag({ property: "og:title", content: PAGE_TITLE })
		this.meta.updateTag({ property: "og:description", content: PAGE_DESC })
		this.meta.updateTag({ property: "og:url", content: PAGE_URL })
	}

	openImage(src: string) {
		this.store.openModal("image-modal", src)
	}
}
