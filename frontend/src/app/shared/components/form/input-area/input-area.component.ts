import { Component, ChangeDetectionStrategy, Input } from "@angular/core"
import { FormControl, ReactiveFormsModule } from "@angular/forms"

import { IconName } from "../../icon/icon.map"

import { SvgIconComponent } from "../../icon/icon.component"

type InputAreaType = "text" | "email" | "textarea" | "password" | "tel"

@Component({
	selector: "app-input-area",
	standalone: true,
	imports: [SvgIconComponent, ReactiveFormsModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<label
			[for]="name"
			class="grid items-center">
			@if (icon) {
				<app-svg-icon
					[icon]="icon"
					width="32"
					height="32"></app-svg-icon>
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
				[formControl]="control"
				[id]="name"
				[name]="name"
				[required]="required"
				[attr.aria-required]="required"
				[placeholder]="placeholder"></textarea>
		} @else {
			<input
				[formControl]="control"
				[type]="type"
				[id]="name"
				[name]="name"
				[required]="required"
				[attr.aria-required]="required"
				[placeholder]="placeholder" />
		}
		<ng-content></ng-content>
	`,
	styleUrl: "./input-area.css",
	host: {
		"[class.error]": "!!error",
		class: "input-area grid h-fit block",
	},
})
export class InputAreaComponent {
	@Input({ required: true }) control!: FormControl
	@Input({ required: true }) label!: string
	@Input({ required: true }) name!: string
	@Input() icon?: IconName
	@Input() type: InputAreaType = "text"
	@Input() error?: string | null
	@Input() required = false
	@Input() placeholder = ""
}
