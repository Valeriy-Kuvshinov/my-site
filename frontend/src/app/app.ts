import { Component } from "@angular/core"
import { RouterOutlet } from "@angular/router"

import { HeaderComponent } from "./shared/header/header.component"
import { FooterComponent } from "./shared/footer/footer.component"
import { A11yMenuComponent } from "./features/a11y-menu/a11y-menu.component"

@Component({
	imports: [RouterOutlet, HeaderComponent, FooterComponent, A11yMenuComponent],
	selector: "app-root",
	templateUrl: "./app.html",
})
export class App {}
