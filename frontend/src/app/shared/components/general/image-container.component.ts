import { ImageLoaderConfig, IMAGE_LOADER, CommonModule, NgOptimizedImage } from "@angular/common"
import { Provider, Component, OnInit, Input, output } from "@angular/core"

export function cloudinaryLoader(config: ImageLoaderConfig): string {
	const { src, width } = config

	if (!src.includes("res.cloudinary.com")) return src

	const params = ["f_auto", "c_limit", `w_${width}`, `q_auto`]
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
		<img
			[ngSrc]="src"
			[alt]="alt"
			[width]="width"
			[height]="height"
			[priority]="priority"
			class="size-full"
			[class.fast-trans]="!disableFade"
			[class.hide]="!isLoaded"
			(load)="onLoad()" />
	`,
	host: {
		"[class]": "hostClasses",
		"[style]": "style",
		"[style.backgroundImage]": "blurDataURL",
		"[style.backgroundSize]": '"cover"',
		"[style.backgroundPosition]": '"center"',
		"(click)": "onClickEvent.emit()",
	},
})
export class ImageContainerComponent implements OnInit {
	@Input({ required: true }) src!: string
	@Input() alt = ""
	@Input() style: Record<string, string> = {}
	@Input() className = ""
	@Input() width = 200
	@Input() height = 200
	@Input() priority = false
	@Input() disableFade = false

	onClickEvent = output<void>()

	isLoaded = false

	ngOnInit() {
		this.isLoaded = this.disableFade
	}

	onLoad() {
		this.isLoaded = true
	}

	get hostClasses(): string {
		return `image-container flex ${this.className}`.trim()
	}

	get blurDataURL(): string | null {
		if (!this.src || !this.src.includes("res.cloudinary.com")) return null

		const lowResUrl = cloudinaryLoader({ src: this.src, width: 25 })

		return `url('${lowResUrl}')`
	}
}
