import { Component, ChangeDetectionStrategy, inject } from "@angular/core"

import { SystemStore } from "@/core/stores/system.store"

// Display either Polite/passive announcements or Assertive/critical announcements
@Component({
	selector: "app-screen-reader-announcer",
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div
			role="status"
			aria-live="polite"
			aria-atomic="true">
			@if (store.a11yUrgency() === "polite") {
				{{ store.a11yAnnouncement() }}
			}
		</div>

		<div
			role="alert"
			aria-live="assertive"
			aria-atomic="true">
			@if (store.a11yUrgency() === "assertive") {
				{{ store.a11yAnnouncement() }}
			}
		</div>
	`,
	styles: [
		`
			:host {
				clip: rect(0, 0, 0, 0);
				overflow: hidden;
				white-space: nowrap;
			}
		`,
	],
	host: {
		class: "flex flex-col absolute w-0 h-0",
	},
})
export class ScreenReaderAnnouncerComponent {
	protected readonly store = inject(SystemStore)
}
