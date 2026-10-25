import { Component, inject } from "@angular/core"

import { SystemStore } from "@/core/stores/system.store"

import { ImageContainerComponent } from "@/shared/components/general/image-container.component"
import { SvgIconComponent } from "@/shared/components/icon/icon.component"

@Component({
	selector: "app-extension",
	standalone: true,
	imports: [ImageContainerComponent, SvgIconComponent],
	templateUrl: "./extension.html",
	styleUrl: "./extension.css",
	host: {
		class: "flex flex-col items-center min-h-screen w-full",
	},
})
export class ExtensionComponent {
	private readonly store = inject(SystemStore)

	openImage(src: string) {
		this.store.openModal("image-modal", src)
	}
}
