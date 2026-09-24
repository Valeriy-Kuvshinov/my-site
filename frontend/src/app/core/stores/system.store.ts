import { isPlatformBrowser } from "@angular/common"
import { inject, Injectable, PLATFORM_ID, signal } from "@angular/core"

export type DeviceType = "mobile" | "tablet" | "desktop"

@Injectable({
	providedIn: "root",
})
export class SystemStore {
	private readonly platformId = inject(PLATFORM_ID)

	readonly deviceType = signal<DeviceType>("desktop")

	constructor() {
		this.initDeviceTypeSync()
	}

	private initDeviceTypeSync() {
		if (isPlatformBrowser(this.platformId)) {
			const handleResize = () => {
				const width = window.innerWidth

				if (width <= 480) this.deviceType.set("mobile")
				else if (width <= 900) this.deviceType.set("tablet")
				else this.deviceType.set("desktop")
			}
			handleResize()

			window.addEventListener("resize", handleResize)
		}
	}

	// Example of how you will add your modal logic later:
	// readonly activeModals = signal<string[]>([]);
	// openModal(modalId: string) { ... }
}
