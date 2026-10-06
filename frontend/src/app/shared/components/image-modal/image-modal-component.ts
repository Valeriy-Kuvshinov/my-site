import {
	Component,
	ChangeDetectionStrategy,
	inject,
	ViewChild,
	ElementRef,
	effect,
	HostListener,
	computed,
} from "@angular/core"

import { SystemStore } from "../../../core/stores/system.store"

import { ClickOutsideDirective } from "../../directives/click-outside.directive"
import { FocusTrapDirective } from "../../directives/focus-trap.directive"

import { ImageContainerComponent } from "../general/image-container.component"
import { SvgIconComponent } from "../icon/icon.component"

@Component({
	selector: "app-image-modal",
	standalone: true,
	imports: [SvgIconComponent, ImageContainerComponent, ClickOutsideDirective, FocusTrapDirective],
	templateUrl: "./image-modal.html",
	styleUrl: "./image-modal.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		"[style.display]": 'isOpen() ? "contents" : "none"',
	},
})
export class ImageModalComponent {
	private readonly store = inject(SystemStore)

	@ViewChild("closeBtn") closeBtnRef!: ElementRef<HTMLButtonElement>

	readonly isOpen = computed(() => this.store.activeModals().includes("image-modal"))

	readonly modalValue = computed(() => this.store.modalValues()["image-modal"] || null)

	constructor() {
		effect(() => {
			if (this.isOpen()) {
				setTimeout(() => {
					this.closeBtnRef?.nativeElement?.focus()
				}, 10)
			}
		})
	}

	closeImageModal() {
		this.store.closeModal("image-modal")
	}

	@HostListener("window:keydown.escape")
	onEscape() {
		if (this.isOpen()) this.closeImageModal()
	}
}
