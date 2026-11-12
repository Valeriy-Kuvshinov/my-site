import { Component, DOCUMENT, inject, OnInit } from "@angular/core"
import { Title, Meta } from "@angular/platform-browser"
import { RouterLink } from "@angular/router"

import { IconName } from "@/shared/components/icon/icon.map"
import { SITE_URL } from "@/shared/constants/util"

import { SvgIconComponent } from "@/shared/components/icon/icon.component"

interface ServiceSkill {
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
		title: $localize`:@@services.card1.title:Custom Software Development`,
		price: $localize`:@@services.card1.price:From $1000`,
		description: $localize`:@@services.card1.desc:From highly optimized static landing pages to secure full-stack applications. By deploying your system on independent cloud infrastructure, I can often eliminate your monthly hosting subscriptions entirely.`,
		skills: [
			{ text: $localize`:@@services.card1.skill1:Web, Desktop & Backend Systems` },
			{ text: $localize`:@@services.card1.skill2:Secure Backend, WCAG AA Frontend` },
			{ text: $localize`:@@services.card1.skill3:Multi-language & RTL-LTR Support` },
			{ text: $localize`:@@services.card1.skill4:E-Commerce Integrations` },
		],
	},
	{
		icon: "wheelchair",
		title: $localize`:@@services.card2.title:A11y Audits & ARIA Fixes`,
		price: $localize`:@@services.card2.price:$100 per page`,
		description: $localize`:@@services.card2.desc:Automated accessibility widgets alone do not make a site compliant or protect you from lawsuits. Real accessibility means fixing the underlying code so keyboards and screen readers can actually navigate it.`,
		skills: [
			{ text: $localize`:@@services.card2.skill1:Manual Page Elements Rewrites` },
			{ text: $localize`:@@services.card2.skill2:WCAG AA Violation Reports` },
			{ text: $localize`:@@services.card2.skill3:Color Contrast Optimization` },
			{ text: $localize`:@@services.card2.skill4:Screen Reader Support` },
		],
	},
	{
		icon: "fix",
		title: $localize`:@@services.card3.title:System Rescue & Maintenance`,
		price: $localize`:@@services.card3.price:$80 per hour`,
		description: $localize`:@@services.card3.desc:Got a website that is crashing, running slow, or full of bugs? Relying on AI-generated code that suddenly broke? I can jump in, clean up the technical debt, and get your system stable and secure.`,
		skills: [
			{ text: $localize`:@@services.card3.skill1:Legacy Code Maintenance & Updating` },
			{ text: $localize`:@@services.card3.skill2:Performance Speed Boosts` },
			{ text: $localize`:@@services.card3.skill3:Security Hardening` },
			{ text: $localize`:@@services.card3.skill4:Spam & Bot Mitigation` },
		],
	},
	{
		icon: "support",
		title: $localize`:@@services.card4.title:Screen Reader Navigation Tutoring`,
		price: $localize`:@@services.card4.price:$20 per hour`,
		description: $localize`:@@services.card4.desc:Patient, live one-on-one tutoring for people who rely on screen readers or keyboard navigation. I describe what is on screen, coach you through unlabeled or broken elements, and map the site so you can repeat the steps on your own. Verbal guidance only: you stay in full control. For regular clients: 17$ per hour.`,
		skills: [
			{ text: $localize`:@@services.card4.skill1:Live Description of On-Screen Layouts` },
			{ text: $localize`:@@services.card4.skill2:Screen Reader & Keyboard Coaching` },
			{ text: $localize`:@@services.card4.skill3:Site Mapping & Written Recaps` },
		],
	},
]

const PROCESS_STEPS: ProcessStep[] = [
	{
		title: $localize`:@@services.step1.title:Infrastructure & Complete Ownership`,
		description: $localize`:@@services.step1.desc:I guide you through setting up your own independent cloud hosting. You keep full control of passwords and billing, avoiding vendor lock-in. I act strictly as your dedicated engineer.`,
	},
	{
		title: $localize`:@@services.step2.title:Custom System Engineering`,
		description: $localize`:@@services.step2.desc:Your system is engineered from scratch. By skipping bloated templates and expensive CMS platforms, I aim for a final product that is fast, secure, and built to WCAG 2.1 AA from the start.`,
	},
	{
		title: $localize`:@@services.step3.title:Deployment & Lifecycle Support`,
		description: $localize`:@@services.step3.desc:After launch, you own an independent, low-overhead system. I provide 12 months of structural bug fixes free of charge. After that, a standard retainer covers security patching only, and new features are billed separately.`,
	},
]

const PAGE_TITLE = $localize`:@@services.meta.title:Services | Kuvshinov Software`
const PAGE_URL = "/services/"
const PAGE_DESC = $localize`:@@services.meta.desc:Browse my transparent services and pricing to decide what fits your project.`

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
