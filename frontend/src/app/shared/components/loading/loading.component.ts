import { Component, OnInit, signal } from "@angular/core"
import { ImageContainerComponent } from "../general/image-container.component"

const LOADING_PHRASES = [
	"Getting back to you...",
	"Almost there...",
	"Loading...",
	"Be right back!",
	"Just a moment...",
]

@Component({
	selector: "app-loading",
	standalone: true,
	imports: [ImageContainerComponent],
	template: `
		<span
			class="text-center"
			aria-hidden="true">
			{{ currentPhrase() }}
		</span>

		<app-image-container
			[src]="LOADING_IMG_SRC"
			alt=""
			[width]="192"
			[height]="192"
			[priority]="true"
			[disableFade]="true">
		</app-image-container>
	`,
	styleUrl: "./loading.css",
	host: {
		class: "loader-container flex flex-col full-center w-full gap-4",
		role: "progressbar",
		"[attr.aria-valuetext]": "currentPhrase()",
	},
})
export class LoadingComponent implements OnInit {
	readonly currentPhrase = signal("Loading...")

	readonly LOADING_IMG_SRC = "/images/hero_walk.avif"

	ngOnInit() {
		const randomPhrase = LOADING_PHRASES[Math.floor(Math.random() * LOADING_PHRASES.length)]

		this.currentPhrase.set(randomPhrase)
	}
}
