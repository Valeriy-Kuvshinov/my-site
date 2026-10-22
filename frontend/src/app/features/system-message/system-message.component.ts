import { Component, inject } from "@angular/core"

import { SystemStore } from "@/core/stores/system.store"

import { SvgIconComponent } from "@/shared/components/icon/icon.component"

@Component({
	selector: "app-system-message",
	standalone: true,
	imports: [SvgIconComponent],
	templateUrl: "./system-message.html",
	styleUrl: "./system-message.css",
	host: {
		style: "display: contents",
	},
})
export class SystemMessageComponent {
	protected readonly store = inject(SystemStore)
}
