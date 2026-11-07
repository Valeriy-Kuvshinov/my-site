import { Component, ChangeDetectionStrategy, Input, output, computed } from "@angular/core"
import { RouterLink } from "@angular/router"

import { SvgIconComponent } from "../icon/icon.component"
import { ImageContainerComponent } from "../general/image-container.component"

type ErrorBannerType = "general" | "search"

@Component({
	selector: "app-error-banner",
	standalone: true,
	imports: [ImageContainerComponent, RouterLink, SvgIconComponent],
	templateUrl: "./error-banner.html",
	styleUrl: "./error-banner.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: "flex flex-col items-center gap-8 w-full",
	},
})
export class ErrorBannerComponent {
	@Input({ required: true }) message!: string
	@Input() type: ErrorBannerType = "general"
	@Input() showReturn = true

	onRetry = output<void>()

	protected readonly imgSrc = computed(() => {
		return this.type === "search" ? "/images/missing.avif" : "/images/error.avif"
	})
}
