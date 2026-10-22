import { Component, computed, inject } from "@angular/core"
import { RouterLink, RouterLinkActive } from "@angular/router"

import { SOCIAL_LINKS } from "@/shared/constants/socials"

import { SystemStore } from "@/core/stores/system.store"

import { SvgIconComponent } from "../icon/icon.component"

@Component({
	selector: "footer[app-footer]",
	standalone: true,
	imports: [RouterLink, RouterLinkActive, SvgIconComponent],
	templateUrl: "./footer.html",
	styleUrl: "./footer.css",
	host: {
		id: "site-footer",
		class: "w-full",
	},
})
export class FooterComponent {
	private readonly store = inject(SystemStore)

	protected readonly socials = SOCIAL_LINKS

	protected readonly isDesktop = computed(() => this.store.deviceType() === "desktop")
}
