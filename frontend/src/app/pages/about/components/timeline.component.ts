import { Component, Input, signal } from "@angular/core"

import { IconName } from "../../../shared/components/icon/icon.map"

import { SvgIconComponent } from "../../../shared/components/icon/icon.component"

interface TimelineStep {
	id: string
	years: string
	title: string
	description: string
	icon: IconName
}

const TIMELINE_STEPS: TimelineStep[] = [
	{
		id: "idf",
		years: "2020 - 2023",
		title: "Tech Advisor & Risk Analyst (IDF)",
		description:
			"Served in the Israeli Defense Forces (Aman), specializing in OSINT-based network analysis and technical intelligence. This high-stakes environment cemented my rigorous, risk-averse approach to system security and data integrity.",
		icon: "shield",
	},
	{
		id: "bootcamp",
		years: "2023",
		title: "MisterBit Coding Academy",
		description:
			"Completed an intensive, highly selective full-stack software engineering bootcamp. Transitioned my analytical military background directly into modern web technologies, mastering React, Angular, and Node.js architectures.",
		icon: "education",
	},
	{
		id: "freelance",
		years: "2024 - Present",
		title: "Freelance Systems Architect & A11y Specialist",
		description:
			"Operating independently to rescue legacy platforms, architect fault-tolerant cloud infrastructure, and retrofit monolithic e-commerce systems to natively meet strict WCAG 2.1 AA Israeli accessibility standards.",
		icon: "monitor",
	},
]

@Component({
	selector: "app-timeline",
	standalone: true,
	imports: [SvgIconComponent],
	templateUrl: "./timeline.html",
	styleUrl: "./timeline.css",
	host: {
		class: "timeline flex flex-col w-full gap-8",
	},
})
export class TimelineComponent {
	readonly activeTab = signal<number>(2) // default to latest

	protected readonly steps = TIMELINE_STEPS

	handleTabKeydown(event: KeyboardEvent, index: number) {
		const lastIndex = this.steps.length - 1

		switch (event.key) {
			case "ArrowRight":
			case "ArrowDown":
				event.preventDefault()
				this.activeTab.set(index === lastIndex ? 0 : index + 1)
				this.focusTab(this.activeTab())
				break

			case "ArrowLeft":
			case "ArrowUp":
				event.preventDefault()
				this.activeTab.set(index === 0 ? lastIndex : index - 1)
				this.focusTab(this.activeTab())
				break

			case "Home":
				event.preventDefault()
				this.activeTab.set(0)
				this.focusTab(0)
				break

			case "End":
				event.preventDefault()
				this.activeTab.set(lastIndex)
				this.focusTab(lastIndex)
				break
		}
	}

	private focusTab(index: number) {
		const tabElement = document.getElementById(`tab-${this.steps[index].id}`)

		if (tabElement) tabElement.focus()
	}
}
