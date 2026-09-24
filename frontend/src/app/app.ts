import { Component, signal } from "@angular/core"
import { RouterOutlet } from "@angular/router"

import { HeaderComponent } from "./shared/header/header.component"
import { FooterComponent } from "./shared/footer/footer.component"

@Component({
	imports: [RouterOutlet, HeaderComponent, FooterComponent],
	selector: "app-root",
	templateUrl: "./app.html",
})
export class App {}
