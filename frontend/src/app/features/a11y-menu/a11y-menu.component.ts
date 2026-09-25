import {
	Component,
	inject,
	ElementRef,
	ViewChild,
	computed,
	signal,
	effect,
	HostListener,
} from "@angular/core"
import { RouterLink } from "@angular/router"

import { SystemStore } from "../../core/stores/system.store"

import { SvgIconComponent } from "../../shared/components/icon/icon.component"
import { ScaleOptionComponent, ScaleLevel } from "./subcomponents/scale-option/scale-option.component"
import { ToggleOptionComponent } from "./subcomponents/toggle-option/toggle-option.component"

@Component({
	selector: "app-a11y-menu",
	standalone: true,
	imports: [RouterLink, ToggleOptionComponent, ScaleOptionComponent, SvgIconComponent],
	templateUrl: "./a11y-menu.html",
	styleUrl: "./a11y-menu.css",
})
export class A11yMenuComponent {
	protected readonly store = inject(SystemStore)

	private readonly elementRef = inject(ElementRef)

	@ViewChild("asideRef") asideRef?: ElementRef<HTMLElement>

	readonly isOpen = computed(() => this.store.activeModals().includes("a11y-menu"))

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

	openA11yMenu() {
		this.store.openModal("a11y-menu")
	}

	closeA11yMenu() {
		this.showMenu.set(false)
		setTimeout(() => this.store.closeModal("a11y-menu"), 300)
	}

	@HostListener("window:keydown.escape")
	onEscape() {
		if (this.isOpen()) this.closeA11yMenu()
	}

	@HostListener("document:click", ["$event"])
	onClickOutside(event: MouseEvent) {
		if (!this.isOpen()) return

		const clickedInside = this.elementRef.nativeElement.contains(event.target)

		if (!clickedInside) this.closeA11yMenu()
	}

	updateScale(key: any, level: ScaleLevel) {
		this.store.updateA11yPreference(key, level)
	}

	updateToggle(key: any, currentValue: boolean) {
		this.store.updateA11yPreference(key, !currentValue)
	}

	toggleColorMode(mode: "highContrast" | "grayscaleView") {
		this.store.toggleColorMode(mode)
	}
}
