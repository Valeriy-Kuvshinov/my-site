import {
	Component,
	computed,
	ElementRef,
	HostListener,
	inject,
	OnInit,
	PLATFORM_ID,
	signal,
} from "@angular/core"
import { isPlatformBrowser } from "@angular/common"
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from "@angular/router"

import { SystemStore } from "@/core/stores/system.store"

import { AuthService } from "@/core/services/auth/auth.service"

import { ImageContainerComponent } from "../general/image-container.component"
import { SvgIconComponent } from "../icon/icon.component"
import { LanguageSelectComponent } from "../language-select/language-select-component"
import { filter } from "rxjs"
import { takeUntilDestroyed } from "@angular/core/rxjs-interop"

const SCROLL_THRESHOLD_PIXELS = 10

@Component({
	selector: "header[app-header]",
	standalone: true,
	imports: [
		ImageContainerComponent,
		SvgIconComponent,
		RouterLink,
		RouterLinkActive,
		LanguageSelectComponent,
	],
	templateUrl: "./header.html",
	styleUrl: "./header.css",
	host: {
		class: "w-full fixed z-2 fast-trans",
		"[class.is-scrolled]": "isScrolled()",
	},
})
export class HeaderComponent implements OnInit {
	protected readonly store = inject(SystemStore)

	protected readonly authService = inject(AuthService)

	private readonly router = inject(Router)

	private readonly platformId = inject(PLATFORM_ID)

	private readonly elRef = inject(ElementRef)

	readonly isScrolled = signal(false)

	protected readonly isMobile = computed(() => this.store.deviceType() !== "desktop")

	constructor() {
		this.router.events
			.pipe(
				filter((event) => event instanceof NavigationEnd),
				takeUntilDestroyed()
			)
			.subscribe(() => {
				if (isPlatformBrowser(this.platformId)) {
					const activeElement = document.activeElement as HTMLElement

					if (activeElement && this.elRef.nativeElement.contains(activeElement)) {
						activeElement.blur()
					}
				}
			})
	}

	ngOnInit() {
		this.checkScrollPosition()
	}

	@HostListener("window:scroll")
	onWindowScroll() {
		this.checkScrollPosition()
	}

	private checkScrollPosition() {
		if (isPlatformBrowser(this.platformId)) {
			this.isScrolled.set(window.scrollY > SCROLL_THRESHOLD_PIXELS)
		}
	}

	openMenu() {
		this.store.openModal("aside-menu")
	}

	async handleLogout() {
		try {
			await this.authService.logout()
			this.router.navigate(["/"])
		} catch (err) {
			console.error("Logout failed in Header", err)
		}
	}
}
