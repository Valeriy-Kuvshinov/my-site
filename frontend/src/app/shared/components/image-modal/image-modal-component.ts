import {
	Component,
	ChangeDetectionStrategy,
	inject,
	ViewChild,
	ElementRef,
	effect,
	HostListener,
	computed,
	OnDestroy,
	signal,
} from "@angular/core"

import { SystemStore } from "@/core/stores/system.store"

import { ClickOutsideDirective } from "@/shared/directives/click-outside.directive"
import { FocusTrapDirective } from "@/shared/directives/focus-trap.directive"

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
export class ImageModalComponent implements OnDestroy {
	private readonly store = inject(SystemStore)

	@ViewChild("modalRef") modalRef?: ElementRef<HTMLDivElement>
	@ViewChild("closeBtn") closeBtnRef?: ElementRef<HTMLButtonElement>

	private readonly isMobile = computed(() => this.store.deviceType() !== "desktop")
	private readonly isOpen = computed(() => this.store.activeModals().includes("image-modal"))
	protected readonly modalValue = computed(() => this.store.modalValues()["image-modal"] || null)

	protected readonly objectFit = computed(() => (this.isMobile() ? "contain" : "cover"))

	readonly hasScrollbar = signal(false)

	private resizeObserver?: ResizeObserver

	constructor() {
		effect((onCleanup) => {
			if (this.isOpen()) {
				setTimeout(() => {
					this.closeBtnRef?.nativeElement?.focus()
					this.checkScrollbar()

					if (this.modalRef?.nativeElement) {
						this.resizeObserver = new ResizeObserver(() => this.checkScrollbar())
						this.resizeObserver.observe(this.modalRef.nativeElement)
					}
				}, 10)
			}
			onCleanup(() => this.cleanupObserver())
		})
	}

	private checkScrollbar() {
		const el = this.modalRef?.nativeElement
		if (el) {
			this.hasScrollbar.set(el.scrollHeight > el.clientHeight)
		}
	}

	private cleanupObserver() {
		if (this.resizeObserver) {
			this.resizeObserver.disconnect()
			this.resizeObserver = undefined
		}
	}

	getImageRatio(): string {
		if (this.isMobile()) return "9 / 16" // Portrait

		return "16 / 9" // Landscape
	}

	closeImageModal() {
		this.store.closeModal("image-modal")
	}

	@HostListener("window:keydown.escape")
	onEscape() {
		if (this.isOpen()) this.closeImageModal()
	}

	ngOnDestroy() {
		this.cleanupObserver()
	}
}
