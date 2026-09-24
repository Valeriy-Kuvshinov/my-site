import { Component } from "@angular/core"

@Component({
	selector: "footer[app-footer]",
	standalone: true,
	templateUrl: "./footer.html",
	styleUrl: "./footer.css",
	host: {
		id: "site-footer",
		// 'block' is added to ensure proper rendering behavior
		class: "w-full bg-slate-900 text-slate-400 py-6 mt-auto block",
	},
})
export class FooterComponent {}
