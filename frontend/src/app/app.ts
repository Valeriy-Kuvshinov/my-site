import { Component, DestroyRef, inject, OnInit, PLATFORM_ID, signal } from "@angular/core"
import { RouterOutlet } from "@angular/router"
import { isPlatformBrowser } from "@angular/common"

import { HeaderComponent } from "./shared/components/header/header.component"
import { FooterComponent } from "./shared/components/footer/footer.component"
import { SvgIconComponent } from "./shared/components/icon/icon.component"
import { AsideMenuComponent } from "./shared/components/aside-menu/aside-menu.component"
import { CookieBannerComponent } from "./shared/components/cookie-banner/cookie-banner.component"
import { ImageModalComponent } from "./shared/components/image-modal/image-modal-component"
import { A11yMenuComponent } from "./features/a11y-menu/a11y-menu.component"
import { SystemMessageComponent } from "./features/system-message/system-message.component"
import { ScreenReaderAnnouncerComponent } from "./features/screen-reader-announcer/screen-reader-announcer.component"

const SCROLL_THRESHOLD_PIXELS = 300

@Component({
	selector: "app-root",
	standalone: true,
	imports: [
		RouterOutlet,
		ScreenReaderAnnouncerComponent,
		HeaderComponent,
		FooterComponent,
		A11yMenuComponent,
		SystemMessageComponent,
		SvgIconComponent,
		AsideMenuComponent,
		CookieBannerComponent,
		ImageModalComponent,
	],
	templateUrl: "./app.html",
	styleUrl: "./app.css",
	host: {
		style: "display: contents",
	},
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

	scrollToTarget(targetId: string, event: Event) {
		event.preventDefault()

		if (isPlatformBrowser(this.platformId)) {
			const element = document.getElementById(targetId)

			if (element) {
				element.scrollIntoView({ behavior: "smooth" })
				element.focus({ preventScroll: true })
			}
		}
	}
}
