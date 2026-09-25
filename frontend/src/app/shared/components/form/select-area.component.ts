import { ChangeDetectionStrategy, Component, Input } from "@angular/core"

import { IconName } from "../icon/icon.map"

import { SvgIconComponent } from "../icon/icon.component"

@Component({
	selector: "app-select-area",
	standalone: true,
	imports: [SvgIconComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<label
			[for]="name"
			class="grid items-center">
			@if (icon) {
				<app-svg-icon [icon]="icon"></app-svg-icon>
				<span>[{{ icon }}]</span>
			}
			<span>{{ label }}</span>
			@if (error) {
				<span class="text-hide-overflow">{{ error }}</span>
			}
		</label>

		<select
			[id]="name"
			[name]="name">
			<ng-content></ng-content>
		</select>
	`,
	host: {
		"[class.error]": "!!error",
		class: "select-area grid h-fit block",
	},
})
export class SelectAreaComponent {
	@Input({ required: true }) label!: string
	@Input({ required: true }) name!: string
	@Input() icon?: IconName
	@Input() error?: string | null
}
