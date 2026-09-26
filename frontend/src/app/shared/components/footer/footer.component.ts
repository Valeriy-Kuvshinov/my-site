import { Component } from "@angular/core"
import { RouterLink, RouterLinkActive } from "@angular/router"

@Component({
	selector: "footer[app-footer]",
	standalone: true,
	imports: [RouterLink, RouterLinkActive],
	templateUrl: "./footer.html",
	host: {
		id: "site-footer",
		class: "w-full bg-slate-900 text-slate-400 py-6 mt-auto block",
	},
})
export class FooterComponent {}
