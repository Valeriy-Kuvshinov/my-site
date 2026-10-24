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
		title: $localize`:@@services.card1.title:Custom Web Development`,
		price: $localize`:@@services.card1.price:From $999`,
		description: $localize`:@@services.card1.desc:Starting at $999 for highly optimized static landing pages, scaling up to secure full-stack applications. By deploying your system on independent cloud infrastructure, I can often eliminate your monthly hosting subscriptions entirely.`,
		skills: [
			{
				icon: "check",
				text: $localize`:@@services.card1.skill1:Secure Backend, WCAG AA Frontend`,
			},
			{
				icon: "cloud",
				text: $localize`:@@services.card1.skill2:Cost-Efficient Cloud Hosting`,
			},
			{
				icon: "language",
				text: $localize`:@@services.card1.skill3:Multi-language & RTL-LTR Support`,
			},
			{ icon: "cart", text: $localize`:@@services.card1.skill4:E-Commerce Integrations` },
		],
	},
	{
		icon: "magGlass",
		title: $localize`:@@services.card2.title:A11y Audits & ARIA Fixes`,
		price: $localize`:@@services.card2.price:$100/page`,
		description: $localize`:@@services.card2.desc:Automated accessibility widgets do not protect you from lawsuits. True accessibility requires fixing the underlying code so keyboards and screen readers can actually navigate it.`,
		skills: [
			{ icon: "fix", text: $localize`:@@services.card2.skill1:Manual HTML Rewrites` },
			{
				icon: "wheelchair",
				text: $localize`:@@services.card2.skill2:WCAG AA Violation Reports`,
			},
			{
				icon: "highContrast",
				text: $localize`:@@services.card2.skill3:Color Contrast Optimization`,
			},
			{
				icon: "accessibility",
				text: $localize`:@@services.card2.skill4:Screen Reader Support`,
			},
		],
	},
	{
		icon: "fix",
		title: $localize`:@@services.card3.title:System Rescue & Bug Fixing`,
		price: $localize`:@@services.card3.price:$80/hr`,
		description: $localize`:@@services.card3.desc:Got a website that is crashing, running slow, or full of bugs? I can jump in, clean up the technical debt, and make your system stable and secure.`,
		skills: [
			{ icon: "fix", text: $localize`:@@services.card3.skill1:Legacy Code Refactoring` },
			{ icon: "run", text: $localize`:@@services.card3.skill2:Performance Speed Boosts` },
			{ icon: "shield", text: $localize`:@@services.card3.skill3:Security Hardening` },
			{ icon: "person", text: $localize`:@@services.card3.skill4:Spam & Bot Mitigation` },
		],
	},
	{
		icon: "support",
		title: $localize`:@@services.card4.title:Remote Digital Assistance`,
		price: $localize`:@@services.card4.price:$20/hr`,
		description: $localize`:@@services.card4.desc:Dedicated help for individuals who get blocked by annoying captchas, confusing government portals, or inaccessible web forms.`,
		skills: [
			{ icon: "fix", text: $localize`:@@services.card4.skill1:Bypassing Visual Barriers` },
			{ icon: "mail", text: $localize`:@@services.card4.skill2:Form & Document Completion` },
			{ icon: "person", text: $localize`:@@services.card4.skill3:Patient 1-on-1 Support` },
		],
	},
]

const PROCESS_STEPS: ProcessStep[] = [
	{
		title: $localize`:@@services.step1.title:Infrastructure & Complete Ownership`,
		description: $localize`:@@services.step1.desc:I guide you through establishing your own independent cloud hosting. You retain absolute control over passwords and billing, eliminating vendor lock-in. I act strictly as your dedicated engineer.`,
	},
	{
		title: $localize`:@@services.step2.title:Custom System Engineering`,
		description: $localize`:@@services.step2.desc:Your digital infrastructure is engineered from scratch. By bypassing bloated templates and expensive CMS platforms, I ensure the final product is lightning-fast, highly secure, and legally accessible by design.`,
	},
	{
		title: $localize`:@@services.step3.title:Deployment & Lifecycle Support`,
		description: $localize`:@@services.step3.desc:Upon launch, you own an independent, low-overhead system. I provide 12 months of structural bug fixes free of charge. Subsequent years transition to a standard retainer strictly for security patching, with new features billed separately.`,
	},
]

const PAGE_TITLE = $localize`:@@services.meta.title:Services | Kuvshinov Software`
const PAGE_URL = "/services/"
const PAGE_DESC = $localize`:@@services.meta.desc:Browse through our transparent services and pricing to decide what fits your project.`

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
