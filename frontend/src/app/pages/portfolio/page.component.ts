import { Component, DOCUMENT, inject, OnInit } from "@angular/core"
import { Title, Meta } from "@angular/platform-browser"
import { RouterLink } from "@angular/router"

import { SITE_URL } from "@/shared/constants/util"

import { SystemStore } from "@/core/stores/system.store"

import { ImageContainerComponent } from "@/shared/components/general/image-container.component"
import { SvgIconComponent } from "@/shared/components/icon/icon.component"

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
		title: $localize`:@@portfolio_page.dngi.title:Did Not Get It Extension`,
		description: $localize`:@@portfolio_page.dngi.desc:Created to soften the blow of living through this job market in a comedic way, source code publicly available.`,
		imgSrc: "https://res.cloudinary.com/oee6altn/image/upload/v1792668923/did-not-get-it-end.avif",
		imgAlt: $localize`:@@portfolio_page.dngi.alt:Screenshot of the extension showing emails automatically labeled and marked as read`,
		githubUrl: "https://github.com/Valeriy-Kuvshinov/did-not-get-it-extension",
	},
	{
		title: $localize`:@@portfolio_page.noffty.title:Noffty Productions Gaming Hub`,
		description: $localize`:@@portfolio_page.noffty.desc:Built an HTML5 game hosting platform using Cloudflare R2, eliminating third-party iframe dependencies and strengthening site Content Security Policy.`,
		imgSrc: "https://res.cloudinary.com/oee6altn/image/upload/v1792668926/noffty-desktop.avif",
		imgAlt: $localize`:@@portfolio_page.noffty.alt:Screenshot of the Noffty Productions gaming hub`,
		linkUrl: "https://noffty.com",
	},
	{
		title: $localize`:@@portfolio_page.micro.title:Micro Mineral Accessibility`,
		description: $localize`:@@portfolio_page.micro.desc:Retrofitting an entire Wordpress E-commerce platform to natively meet strict AA Israeli accessibility standards while restoring payment gateway stability.`,
		imgSrc: "https://res.cloudinary.com/oee6altn/image/upload/v1792668924/micro-mineral-desktop.avif",
		imgAlt: $localize`:@@portfolio_page.micro.alt:Screenshot of the Micro Mineral accessible home page`,
		linkUrl: "https://mmil.co.il/",
	},
	{
		title: $localize`:@@portfolio_page.ori.title:Ori Carlin Art Site`,
		description: $localize`:@@portfolio_page.ori.desc:Developed a crafts showcase with local US E-commerce platform for an American artist.`,
		imgSrc: "https://res.cloudinary.com/oee6altn/image/upload/v1792668927/oricarlin-desktop.avif",
		imgAlt: $localize`:@@portfolio_page.ori.alt:Screenshot of the Ori Carlin pottery home page`,
		githubUrl: "https://github.com/TAC42/art-store",
		note: $localize`:@@portfolio_page.ori.note:Currently the site is offline, thus source code is publically available.`,
	},
	{
		title: $localize`:@@portfolio_page.vision.title:The Vision Telecom Platform`,
		description: $localize`:@@portfolio_page.vision.desc:Architected a fault-tolerant session orchestration and state recovery system across multiple remote Linux environments.`,
		imgSrc: "https://res.cloudinary.com/oee6altn/image/upload/v1792668925/mycell.avif",
		imgAlt: $localize`:@@portfolio_page.vision.alt:Screenshot of the Vision Telecom device selection interface`,
		note: $localize`:@@portfolio_page.vision.note:Source code available per recruiter's request...`,
	},
	{
		title: $localize`:@@portfolio_page.cmodem.title:CModem Terminal CLI Tool`,
		description: $localize`:@@portfolio_page.cmodem.desc:Created to handle modem interactions remotely more fluently, already used in some of my production (MyCell), source code publicly available.`,
		imgSrc: "https://res.cloudinary.com/oee6altn/image/upload/v1792668923/cmodem-terminal.avif",
		imgAlt: $localize`:@@portfolio_page.cmodem.alt:Screenshot of CModem Terminal in use`,
		githubUrl: "https://github.com/Valeriy-Kuvshinov/cmodem-terminal",
	},
	{
		title: $localize`:@@portfolio_page.giggler.title:Giggler Freelance Platform`,
		description: $localize`:@@portfolio_page.giggler.desc:Created a Fiverr-like E-commerce platform as a final project during my Full-Stack bootcamp, source code publicly available.`,
		imgSrc: "https://res.cloudinary.com/oee6altn/image/upload/v1792668924/giggler-desktop.avif",
		imgAlt: $localize`:@@portfolio_page.giggler.alt:Screenshot of the Giggler submission home page`,
		linkUrl: "https://giggler.onrender.com/",
		githubUrl: "https://github.com/Valeriy-Kuvshinov/Giggler",
	},
]

const PAGE_TITLE = $localize`:@@portfolio_page.meta.title:Portfolio | Kuvshinov Software`
const PAGE_URL = "/portfolio/"
const PAGE_DESC = $localize`:@@portfolio_page.meta.desc:Browse through the projects, clients and more that have been impacted by us.`

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
	private readonly document = inject(DOCUMENT)

	private readonly store = inject(SystemStore)

	protected readonly items = PORTFOLIO_ITEMS

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

	getImageAriaLabel(item: PortfolioItem): string {
		return $localize`:@@portfolio_page.img_click.aria:View full size image of ${item.title}`
	}

	openImage(src: string) {
		this.store.openModal("image-modal", src)
	}
}
