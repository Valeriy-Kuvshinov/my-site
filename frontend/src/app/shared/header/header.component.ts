import { Component, inject } from "@angular/core"
import { RouterLink, RouterLinkActive } from "@angular/router"

import { SystemStore } from "../../core/stores/system.store"

import { ImageContainerComponent } from "../general/image-container.component"

@Component({
	selector: "header[app-header]",
	standalone: true,
	imports: [RouterLink, RouterLinkActive, ImageContainerComponent],
	templateUrl: "./header.html",
	host: {
		class: "w-full bg-slate-800 text-white shadow-md sticky top-0 z-50 block",
	},
})
export class HeaderComponent {
	protected readonly store = inject(SystemStore)

	protected readonly LOGO_IMG = "/images/logo.avif"

	openMenu() {
		console.log("Menu opened")
	}
}
