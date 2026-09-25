import { Component } from "@angular/core"

import { NavLinkComponent } from "../general/nav-link.component"

@Component({
	selector: "footer[app-footer]",
	standalone: true,
	imports: [NavLinkComponent],
	templateUrl: "./footer.html",
	host: {
		id: "site-footer",
		class: "w-full bg-slate-900 text-slate-400 py-6 mt-auto block",
	},
})
export class FooterComponent {}
