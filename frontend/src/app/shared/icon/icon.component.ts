import { Component, ChangeDetectionStrategy, inject, Input } from "@angular/core"
import { DomSanitizer, SafeHtml } from "@angular/platform-browser"

import { ICON_MAP, IconName } from "./icon.map"

@Component({
	selector: "app-svg-icon",
	standalone: true,
	template: ``,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		"[innerHTML]": "safeSvg",
		"[class]": "hostClass",
		"[style.width.px]": "width",
		"[style.height.px]": "height",
		"aria-hidden": "true",
	},
})
export class SvgIconComponent {
	private readonly sanitizer = inject(DomSanitizer)

	@Input({ required: true }) icon!: IconName
	@Input() width: number | string = 64
	@Input() height: number | string = 64
	@Input() className = ""

	// Ensure the host element behaves like an icon container while accepting utility classes
	get hostClass(): string {
		return `inline-flex items-center justify-center ${this.className}`.trim()
	}

	get safeSvg(): SafeHtml | null {
		const svgString = ICON_MAP[this.icon]

		if (!svgString) return null

		return this.sanitizer.bypassSecurityTrustHtml(svgString)
	}
}
