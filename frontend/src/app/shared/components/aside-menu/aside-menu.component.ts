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

import { SystemStore } from "../../../core/stores/system.store"

import { SvgIconComponent } from "../icon/icon.component"

@Component({
	selector: "app-aside-menu",
	standalone: true,
	imports: [RouterLink, RouterLinkActive, SvgIconComponent],
	templateUrl: "./aside-menu.html",
	styleUrl: "./aside-menu.css",
})
export class AsideMenuComponent {
	protected readonly store = inject(SystemStore)

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

	@HostListener("document:click", ["$event"])
	onClickOutside(event: MouseEvent) {
		if (!this.isOpen() || !this.asideRef) return

		const clickedInsideAside = this.asideRef.nativeElement.contains(event.target as Node)

		if (!clickedInsideAside) this.closeAsideMenu()
	}
}
