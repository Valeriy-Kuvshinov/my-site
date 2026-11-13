import { Component, inject } from "@angular/core"

import { SystemStore } from "@/core/stores/system.store"

@Component({
	selector: "main[app-admin-page]",
	standalone: true,
	imports: [],
	templateUrl: "./page.html",
	styleUrl: "./page.css",
	host: {
		id: "main-content",
		class: "w-h-full block",
	},
})
export default class PageComponent {
	protected readonly store = inject(SystemStore)
}
