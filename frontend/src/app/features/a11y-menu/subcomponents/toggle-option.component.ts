import { Component, ChangeDetectionStrategy, Input, output } from "@angular/core"

import { IconName } from "../../../shared/icon/icon.map"

import { SvgIconComponent } from "../../../shared/icon/icon.component"

@Component({
	selector: "button[app-toggle-option]",
	standalone: true,
	imports: [SvgIconComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="toggle-header flex flex-row items-center">
			<app-svg-icon [icon]="icon"></app-svg-icon>
			<span class="text-center">{{ label }}</span>
		</div>
	`,
	host: {
		"[attr.aria-pressed]": "isActive",
		"[class.active]": "isActive",
		"(click)": "onToggle.emit()",
		class: "toggle-option flex flex-row items-center justify-center transition-all duration-200",
	},
})
export class ToggleOptionComponent {
	@Input({ required: true }) label!: string
	@Input({ required: true }) icon!: IconName
	@Input({ required: true }) isActive!: boolean

	onToggle = output<void>()
}
