import { Component, inject } from "@angular/core"

import { SystemStore } from "../../../core/stores/system.store"

import { ImageContainerComponent } from "../general/image-container.component"
import { NavLinkComponent } from "../general/nav-link.component"
import { SvgIconComponent } from "../icon/icon.component"

@Component({
	selector: "header[app-header]",
	standalone: true,
	imports: [ImageContainerComponent, NavLinkComponent, SvgIconComponent],
	templateUrl: "./header.html",
	styleUrl: "./header.css",
	host: {
		class: "w-full sticky z-2",
	},
})
export class HeaderComponent {
	protected readonly store = inject(SystemStore)
	protected readonly LOGO_IMG = "/images/logo.avif"

	openMenu() {
		console.log("Menu opened")
	}
}
