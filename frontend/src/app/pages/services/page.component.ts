import { Component, computed, DOCUMENT, inject, OnInit } from "@angular/core"
import { Title, Meta } from "@angular/platform-browser"
import { RouterLink } from "@angular/router"

import { IconName } from "@/shared/components/icon/icon.map"
import { SITE_URL } from "@/shared/constants/util"

import { SystemStore } from "@/core/stores/system.store"

import { SvgIconComponent } from "@/shared/components/icon/icon.component"

interface ServiceSkill {
	icon: IconName
	text: string
}

interface ServiceCard {
	icon: IconName
	title: string
	price: string
	description: string
	skills: ServiceSkill[]
}

interface ProcessStep {
	title: string
	description: string
}

const SERVICES: ServiceCard[] = [
	{
		icon: "monitor",
		title: "Custom Web Development",
		price: "From $900",
		description:
			"Instead of renting a site on a managed platform forever, I build you a site you actually own. It runs faster, costs drastically less to host, and fits your exact needs without bloated templates.",
		skills: [
			{ icon: "check", text: "Secure Backend, A11y Complaint Frontend" },
			{ icon: "cloud", text: "Independent Cloud Hosting" },
			{ icon: "language", text: "Multi-language & RTL-LTR Support" },
			{ icon: "cart", text: "E-Commerce Integrations" },
		],
	},
	{
		icon: "magGlass",
		title: "A11y Audits & ARIA Fixes",
		price: "From $300",
		description:
			"Automated accessibility widgets do not protect you from lawsuits. True accessibility requires fixing the underlying code so keyboards and screen readers can actually navigate it.",
		skills: [
			{ icon: "fix", text: "Manual HTML Rewrites" },
			{ icon: "wheelchair", text: "WCAG AA Violation Reports" },
			{ icon: "highContrast", text: "Color Contrast Optimization" },
			{ icon: "accessibility", text: "Screen Reader Support" },
		],
	},
	{
		icon: "fix",
		title: "System Rescue & Bug Fixing",
		price: "$60/hr",
		description:
			"Got a website that is crashing, running slow, or full of bugs? I can jump in, clean up the technical debt, and make your system stable and secure.",
		skills: [
			{ icon: "fix", text: "Legacy Code Refactoring" },
			{ icon: "run", text: "Performance Speed Boosts" },
			{ icon: "shield", text: "Security Hardening" },
			{ icon: "person", text: "Spam & Bot Mitigation" },
		],
	},
	{
		icon: "support",
		title: "Remote Digital Assistance",
		price: "$20/hr",
		description:
			"Dedicated help for individuals who get blocked by annoying captchas, confusing government portals, or inaccessible web forms.",
		skills: [
			{ icon: "fix", text: "Bypassing Visual Barriers" },
			{ icon: "mail", text: "Form & Document Completion" },
			{ icon: "person", text: "Patient 1-on-1 Support" },
		],
	},
]

const PROCESS_STEPS: ProcessStep[] = [
	{
		title: "Infrastructure & Complete Ownership",
		description:
			"I guide you through establishing your own independent cloud hosting and media accounts. You retain absolute control over passwords and billing, eliminating vendor lock-in. I join strictly as the technical architect.",
	},
	{
		title: "Native System Architecture",
		description:
			"Your digital infrastructure is engineered entirely from scratch. By bypassing bloated templates and rigid CMS platforms, I ensure the final product is highly performant, fundamentally secure, and strictly WCAG AA compliant by design.",
	},
	{
		title: "Deployment & Lifecycle Support",
		description:
			"Upon launch, you possess an independent, low-overhead system. I provide 12 months of comprehensive architectural updates free of charge. Subsequent years transition to a standard retainer strictly for security maintenance, with feature upgrades billed separately.",
	},
]

const PAGE_TITLE = "Services | Kuvshinov Software"
const PAGE_URL = "/services/"
const PAGE_DESC =
	"Browse through our transparent services and pricing to decide what fits your project."

@Component({
	selector: "main[app-services-page]",
	standalone: true,
	imports: [SvgIconComponent, RouterLink],
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

	protected readonly iconSize = computed(() => (this.store.deviceType() === "desktop" ? 48 : 32))

	protected readonly services = SERVICES
	protected readonly processSteps = PROCESS_STEPS

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
