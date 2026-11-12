import { Component, signal } from "@angular/core"

import { IconName } from "@/shared/components/icon/icon.map"

import { SvgIconComponent } from "@/shared/components/icon/icon.component"

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
		title: $localize`:@@about.timeline.step1.title:Tech Advisor & Risk Analyst (IDF)`,
		description: $localize`:@@about.timeline.step1.desc:Served in IDF Military Intelligence as a tech advisor and risk analyst: network traffic and telemetry audits, endpoint hardening, and OPSEC and network-isolation reviews. This high-stakes environment shaped my risk-aware approach to system security and data integrity.`,
		icon: "shield",
	},
	{
		id: "bootcamp",
		years: "2023",
		title: $localize`:@@about.timeline.step2.title:MisterBit Coding Academy`,
		description: $localize`:@@about.timeline.step2.desc:Completed an intensive full-stack development bootcamp, applying my analytical background to modern web technologies, including React, Angular, Node.js, and REST API design.`,
		icon: "education",
	},
	{
		id: "work",
		years: "2024 - Present",
		title: $localize`:@@about.timeline.step3.title:Full Stack Engineer (Kuvshinov Software)`,
		description: $localize`:@@about.timeline.step3.desc:Building web, desktop, and backend systems for clients, deploying cost-efficient cloud infrastructure, and engineering interfaces built to WCAG 2.1 AA accessibility standards.`,
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
