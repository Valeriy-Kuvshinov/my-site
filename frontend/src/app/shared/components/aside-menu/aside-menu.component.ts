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
import { Router, RouterLink, RouterLinkActive } from "@angular/router"

import { SystemStore } from "@/core/stores/system.store"

import { AuthService } from "@/core/services/auth/auth.service"

import { ClickOutsideDirective } from "@/shared/directives/click-outside.directive"
import { FocusTrapDirective } from "@/shared/directives/focus-trap.directive"

import { SvgIconComponent } from "../icon/icon.component"
import { ImageContainerComponent } from "../general/image-container.component"
import { LanguageSelectComponent } from "../language-select/language-select-component"

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
		LanguageSelectComponent,
	],
	templateUrl: "./aside-menu.html",
	styleUrl: "./aside-menu.css",
})
export class AsideMenuComponent {
	protected readonly store = inject(SystemStore)

	protected readonly authService = inject(AuthService)

	private readonly router = inject(Router)

	protected readonly LOGO_IMG = "/images/logo.avif"

	@ViewChild("asideRef") asideRef?: ElementRef<HTMLElement>

	readonly isOpen = computed(() => this.store.activeModals().includes("aside-menu"))

	readonly showMenu = signal(false)

	protected readonly logoutMutation = this.authService.logout()

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

	async handleLogout() {
		try {
			await this.logoutMutation.mutateAsync()
			this.closeAsideMenu()
			this.router.navigate(["/"])
		} catch (err) {
			console.error("Logout failed in UI", err)
		}
	}

	@HostListener("window:keydown.escape")
	onEscape() {
		if (this.isOpen()) this.closeAsideMenu()
	}
}
