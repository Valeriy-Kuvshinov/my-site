import { Component, ChangeDetectionStrategy, Input } from "@angular/core"

import { IconName } from "../icon/icon.map"

import { SvgIconComponent } from "../icon/icon.component"

export type InputAreaType = "text" | "email" | "textarea" | "password" | "tel"

@Component({
	selector: "app-input-area",
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
			<span>
				{{ label }}
				@if (required) {
					<span aria-hidden="true">*</span>
				}
			</span>
			@if (error) {
				<span class="text-hide-overflow">{{ error }}</span>
			}
		</label>

		@if (type === "textarea") {
			<textarea
				[id]="name"
				[name]="name"
				[required]="required"
				[attr.aria-required]="required"
				[placeholder]="placeholder"></textarea>
		} @else {
			<input
				[type]="type"
				[id]="name"
				[name]="name"
				[required]="required"
				[attr.aria-required]="required"
				[placeholder]="placeholder" />
		}
		<ng-content></ng-content>
	`,
	host: {
		"[class.error]": "!!error",
		class: "input-area grid h-fit block",
	},
})
export class InputAreaComponent {
	@Input({ required: true }) label!: string
	@Input({ required: true }) name!: string
	@Input() icon?: IconName
	@Input() type: InputAreaType = "text"
	@Input() error?: string | null
	@Input() required = false
	@Input() placeholder = ""
}
