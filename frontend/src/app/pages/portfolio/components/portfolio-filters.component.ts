import { Component, ChangeDetectionStrategy, Input, output, signal, computed } from "@angular/core"
import { ReactiveFormsModule, FormControl } from "@angular/forms"

import { SvgIconComponent } from "@/shared/components/icon/icon.component"

const TECH_FILTERS = [
	"Angular",
	"C",
	"CSS",
	"Electron",
	"Elementor",
	"Express",
	"HTML",
	"Java",
	"JavaScript",
	"Linux",
	"MongoDB (NoSQL)",
	"Next.js",
	"NgRx",
	"Node.js",
	"Python",
	"React",
	"Redux",
	"Sass",
	"Spring Boot",
	"Supabase",
	"Svelte",
	"Tailwind CSS",
	"TypeScript",
	"WooCommerce",
	"WordPress",
	"Zustand",
].sort()

@Component({
	selector: "app-portfolio-filters",
	standalone: true,
	imports: [ReactiveFormsModule, SvgIconComponent],
	templateUrl: "./portfolio-filters.html",
	styleUrl: "./portfolio-filters.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: "flex flex-col items-center gap-6 w-full",
	},
})
export class PortfolioFiltersComponent {
	@Input({ required: true }) searchControl!: FormControl
	@Input({ required: true }) selectedTechs: string[] = []

	techToggled = output<string | null>()

	protected readonly techFilters = TECH_FILTERS

	protected readonly isFiltersExpanded = signal(false)

	protected readonly visibleTechFilters = computed(() => {
		if (this.isFiltersExpanded()) return this.techFilters

		return this.techFilters.slice(0, 9)
	})

	toggleFiltersExpand() {
		this.isFiltersExpanded.update((v) => !v)
	}

	onTechClick(tech: string | null) {
		this.techToggled.emit(tech)
	}
}
