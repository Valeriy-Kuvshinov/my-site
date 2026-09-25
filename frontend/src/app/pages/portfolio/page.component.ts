import { Component } from "@angular/core"

@Component({
	selector: "main[app-portfolio-page]",
	standalone: true,
	imports: [],
	templateUrl: "./page.html",
	styleUrl: "./page.css",
	host: {
		id: "main-content",
		class: "w-h-full block",
	},
})
export default class PageComponent {}
