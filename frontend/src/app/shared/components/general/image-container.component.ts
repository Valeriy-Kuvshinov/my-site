import { ImageLoaderConfig, IMAGE_LOADER, CommonModule, NgOptimizedImage } from "@angular/common"
import { Provider, Component, OnInit, Input, output, signal } from "@angular/core"

function cloudinaryLoader(config: ImageLoaderConfig): string {
	const { src, width } = config

	if (!src.includes("res.cloudinary.com")) return src

	const params = ["f_auto", "q_auto:best"]

	if (width) {
		params.push(`c_limit`)
		params.push(`w_${width}`)
	}

	const splitPoint = "/upload/"
	const parts = src.split(splitPoint)

	if (parts.length < 2) return src

	return `${parts[0]}${splitPoint}${params.join(",")}/${parts[1]}`
}

const CustomImageLoaderProvider: Provider = {
	provide: IMAGE_LOADER,
	useValue: cloudinaryLoader,
}

@Component({
	selector: "app-image-container",
	standalone: true,
	imports: [CommonModule, NgOptimizedImage],
	providers: [CustomImageLoaderProvider],
	template: `
		@if (useFill) {
			<img
				[ngSrc]="src"
				[alt]="alt"
				fill
				[priority]="priority"
				[sizes]="sizes"
				class="w-h-full"
				[style.object-fit]="objectFit"
				[class.fast-trans]="!disableFade"
				[class.hide]="!isLoaded()"
				(load)="onLoad()" />
		} @else {
			<img
				[ngSrc]="src"
				[alt]="alt"
				[width]="width!"
				[height]="height!"
				[priority]="priority"
				[sizes]="sizes"
				class="w-h-full"
				[style.object-fit]="objectFit"
				[class.fast-trans]="!disableFade"
				[class.hide]="!isLoaded()"
				(load)="onLoad()" />
		}
	`,
	host: {
		"[class]": "hostClasses",
		"[class.ready]": "isLoaded()",
		"[style]": "style",
		"[style.backgroundImage]": "blurDataURL()",
		"[style.backgroundSize]": "blurDataURL() ? 'cover' : null",
		"[style.backgroundPosition]": "blurDataURL() ? 'center' : null",
		"[style.backgroundRepeat]": "blurDataURL() ? 'no-repeat' : null",
		"(click)": "onClickEvent.emit()",
		"(keydown.enter)": "onClickEvent.emit()",
		"(keydown.space)": "$event.preventDefault(); onClickEvent.emit()",
	},
})
export class ImageContainerComponent implements OnInit {
	@Input({ required: true }) src!: string
	@Input() alt = ""
	@Input() style: Record<string, string> = {}
	@Input() className = ""
	@Input() width?: number
	@Input() height?: number
	@Input() priority = false
	@Input() disableFade = false
	@Input() sizes = "100vw"
	@Input() objectFit: "cover" | "contain" = "cover"

	onClickEvent = output<void>()

	readonly isLoaded = signal(false)

	ngOnInit() {
		this.isLoaded.set(this.disableFade)
	}

	onLoad() {
		this.isLoaded.set(true)
	}

	get useFill(): boolean {
		return this.width === undefined || this.height === undefined
	}

	get hostClasses(): string {
		const positionClass = this.useFill ? "relative" : ""
		return `flex ${positionClass} ${this.className}`.trim()
	}

	blurDataURL(): string | null {
		if (this.isLoaded() || !this.src || !this.src.includes("res.cloudinary.com")) return null

		const lowResUrl = cloudinaryLoader({ src: this.src, width: 25 })

		return `url('${lowResUrl}')`
	}
}
