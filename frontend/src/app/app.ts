import { Component, DestroyRef, inject, OnInit, PLATFORM_ID, signal } from "@angular/core"
import { RouterOutlet } from "@angular/router"
import { isPlatformBrowser } from "@angular/common"

import { HeaderComponent } from "./shared/components/header/header.component"
import { FooterComponent } from "./shared/components/footer/footer.component"
import { SvgIconComponent } from "./shared/components/icon/icon.component"
import { A11yMenuComponent } from "./features/a11y-menu/a11y-menu.component"

const SCROLL_THRESHOLD_PIXELS = 300

@Component({
	selector: "app-root",
	standalone: true,
	imports: [RouterOutlet, HeaderComponent, FooterComponent, A11yMenuComponent, SvgIconComponent],
	templateUrl: "./app.html",
	styleUrl: "./app.css",
})
export class App implements OnInit {
	private readonly platformId = inject(PLATFORM_ID)

	private readonly destroyRef = inject(DestroyRef)

	readonly showBackToTop = signal(false)

	ngOnInit() {
		if (isPlatformBrowser(this.platformId)) {
			const handleScroll = () => {
				const shouldBeVisible = window.scrollY > SCROLL_THRESHOLD_PIXELS

				if (this.showBackToTop() !== shouldBeVisible) {
					this.showBackToTop.set(shouldBeVisible)
				}
			}
			window.addEventListener("scroll", handleScroll, { passive: true })

			handleScroll()

			this.destroyRef.onDestroy(() => {
				window.removeEventListener("scroll", handleScroll)
			})
		}
	}
}
