import { Component, computed, inject, OnInit } from "@angular/core"
import { Title, Meta } from "@angular/platform-browser"
import { RouterLink } from "@angular/router"

import { SystemStore } from "../../core/stores/system.store"

import { IconName } from "../../shared/components/icon/icon.map"

import { SvgIconComponent } from "../../shared/components/icon/icon.component"

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
		title: "A11y Audits & Code Fixes",
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
		price: "$20 / hr",
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
		price: "$10 / hr",
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
		title: "Account Setup & Ownership",
		description:
			"First, I help you create your own independent cloud hosting and media accounts. You hold the passwords and the billing. I simply join as the developer. No middleman, no vendor lock-in.",
	},
	{
		title: "Writing the Code",
		description:
			"I build your website or system entirely from scratch. Because there are no bloated templates, everything is blazing fast, secure, and strictly WCAG AA accessible right out of the box.",
	},
	{
		title: "Handover & Support",
		description:
			"Once we launch, you possess an independent system that costs very little to run and maintain. I provide ongoing support for updates, security, and any architectural changes whenever you need me. First year post launch is free.",
	},
]

const PAGE_TITLE = "Services | VK Freelance Software"
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

	private readonly store = inject(SystemStore)

	protected readonly iconSize = computed(() => (this.store.deviceType() === "desktop" ? 64 : 48))

	protected readonly services = SERVICES
	protected readonly processSteps = PROCESS_STEPS

	ngOnInit() {
		this.title.setTitle(PAGE_TITLE)
		this.meta.updateTag({ name: "description", content: PAGE_DESC })
		this.meta.updateTag({ property: "og:title", content: PAGE_TITLE })
		this.meta.updateTag({ property: "og:description", content: PAGE_DESC })
		this.meta.updateTag({ property: "og:url", content: PAGE_URL })
	}
}
