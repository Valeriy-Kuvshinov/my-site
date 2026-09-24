import { Component } from "@angular/core"
import { RouterLink } from "@angular/router"

@Component({
    selector: 'main[app-home-page]',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './page.html',
    styleUrl: './page.css',
    host: {
        id: 'main-content',
        class: 'home-page w-full h-full block'
    }
})
export default class HomeComponent {}