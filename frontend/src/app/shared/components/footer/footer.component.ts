import { Component } from "@angular/core"
import { RouterLink, RouterLinkActive } from "@angular/router"

@Component({
	selector: "footer[app-footer]",
	standalone: true,
	imports: [RouterLink, RouterLinkActive],
	templateUrl: "./footer.html",
	styleUrl: "./footer.css",
	host: {
		id: "site-footer",
		class: "w-full",
	},
})
export class FooterComponent {}
