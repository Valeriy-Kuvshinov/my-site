import { Component, computed, inject } from "@angular/core"
import { RouterLink } from "@angular/router"

import { SystemStore } from "@/core/stores/system.store"

import { SvgIconComponent } from "@/shared/components/icon/icon.component"
import { ImageContainerComponent } from "@/shared/components/general/image-container.component"

@Component({
	selector: "app-hero",
	standalone: true,
	imports: [RouterLink, ImageContainerComponent, SvgIconComponent],
	templateUrl: "./hero.html",
	styleUrl: "./hero.css",
	host: {
		class: "flex flex-col justify-center w-full min-h-screen relative",
	},
})
export class HeroComponent {
	protected readonly store = inject(SystemStore)

	protected readonly resumeUrl = computed(() =>
		this.store.currentLanguage() === "he"
			? "/cv/Valeriy-Kuvshinov-Full-Stack-Engineer-hebrew.pdf"
			: "/cv/Valeriy-Kuvshinov-Full-Stack-Engineer.pdf"
	)

	protected readonly resumeName = computed(() =>
		this.store.currentLanguage() === "he"
			? "Valeriy-Kuvshinov-Full-Stack-Engineer-hebrew.pdf"
			: "Valeriy-Kuvshinov-Full-Stack-Engineer.pdf"
	)
}
