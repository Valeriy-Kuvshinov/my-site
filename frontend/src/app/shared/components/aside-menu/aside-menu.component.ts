import {
	Component,
	inject,
	ViewChild,
	ElementRef,
	computed,
	signal,
	effect,
	HostListener,
} from "@angular/core"
import { RouterLink, RouterLinkActive } from "@angular/router"

import { SystemStore } from "@/core/stores/system.store"

import { ClickOutsideDirective } from "@/shared/directives/click-outside.directive"
import { FocusTrapDirective } from "@/shared/directives/focus-trap.directive"

import { SvgIconComponent } from "../icon/icon.component"
import { ImageContainerComponent } from "../general/image-container.component"

@Component({
	selector: "app-aside-menu",
	standalone: true,
	imports: [
		RouterLink,
		RouterLinkActive,
		SvgIconComponent,
		ClickOutsideDirective,
		FocusTrapDirective,
		ImageContainerComponent,
	],
	templateUrl: "./aside-menu.html",
	styleUrl: "./aside-menu.css",
})
export class AsideMenuComponent {
	protected readonly store = inject(SystemStore)

	protected readonly LOGO_IMG = "/images/logo.avif"

	@ViewChild("asideRef") asideRef?: ElementRef<HTMLElement>

	readonly isOpen = computed(() => this.store.activeModals().includes("aside-menu"))

	readonly showMenu = signal(false)

	constructor() {
		effect((onCleanup) => {
			const open = this.isOpen()

			let timer: ReturnType<typeof setTimeout>

			if (open) {
				timer = setTimeout(() => {
					this.showMenu.set(true)
					this.asideRef?.nativeElement.focus()
				}, 50)
			} else {
				this.showMenu.set(false)
			}
			onCleanup(() => clearTimeout(timer))
		})
	}

	closeAsideMenu() {
		this.showMenu.set(false)
		setTimeout(() => this.store.closeModal("aside-menu"), 300)
	}

	@HostListener("window:keydown.escape")
	onEscape() {
		if (this.isOpen()) this.closeAsideMenu()
	}
}
