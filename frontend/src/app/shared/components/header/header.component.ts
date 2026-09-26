import { Component, HostListener, inject, PLATFORM_ID, signal } from "@angular/core"
import { isPlatformBrowser } from "@angular/common"
import { RouterLink, RouterLinkActive } from "@angular/router"

import { SystemStore } from "../../../core/stores/system.store"

import { ImageContainerComponent } from "../general/image-container.component"
import { SvgIconComponent } from "../icon/icon.component"

const SCROLL_THRESHOLD_PIXELS = 20

@Component({
	selector: "header[app-header]",
	standalone: true,
	imports: [ImageContainerComponent, SvgIconComponent, RouterLink, RouterLinkActive],
	templateUrl: "./header.html",
	styleUrl: "./header.css",
	host: {
		class: "w-full sticky z-2 fast-trans",
		"[class.is-scrolled]": "isScrolled()",
	},
})
export class HeaderComponent {
	protected readonly store = inject(SystemStore)

	private readonly platformId = inject(PLATFORM_ID)

	protected readonly LOGO_IMG = "/images/logo.avif"

	readonly isScrolled = signal(false)

	@HostListener("window:scroll")
	onWindowScroll() {
		if (isPlatformBrowser(this.platformId)) {
			this.isScrolled.set(window.scrollY > SCROLL_THRESHOLD_PIXELS)
		}
	}

	openMenu() {
		this.store.openModal("aside-menu")
	}
}
