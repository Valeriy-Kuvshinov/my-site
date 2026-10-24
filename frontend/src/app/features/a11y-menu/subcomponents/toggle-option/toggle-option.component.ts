import { Component, ChangeDetectionStrategy, Input, output } from "@angular/core"

import { IconName } from "@/shared/components/icon/icon.map"

import { SvgIconComponent } from "@/shared/components/icon/icon.component"

@Component({
	selector: "button[app-toggle-option]",
	standalone: true,
	imports: [SvgIconComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="toggle-header flex flex-row items-center gap-2">
			<app-svg-icon
				[icon]="icon"
				width="32"
				height="32">
			</app-svg-icon>
			<span class="text-center">{{ label }}</span>
		</div>
	`,
	styleUrl: "./toggle-option.css",
	host: {
		"[attr.aria-pressed]": "isActive",
		"[class.active]": "isActive",
		"(click)": "onToggle.emit()",
		class: "flex flex-row full-center w-full fast-trans",
	},
})
export class ToggleOptionComponent {
	@Input({ required: true }) label!: string
	@Input({ required: true }) icon!: IconName
	@Input({ required: true }) isActive!: boolean

	onToggle = output<void>()
}
