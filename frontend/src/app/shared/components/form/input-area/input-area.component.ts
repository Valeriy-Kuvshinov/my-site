import { Component, ChangeDetectionStrategy, Input, computed, inject } from "@angular/core"
import { FormControl, ReactiveFormsModule } from "@angular/forms"

import { IconName } from "../../icon/icon.map"

import { SystemStore } from "@/core/stores/system.store"

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
					[width]="iconSize()"
					[height]="iconSize()">
				</app-svg-icon>
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
				[attr.maxlength]="maxLength"
				[placeholder]="placeholder"></textarea>
		} @else {
			<input
				[formControl]="control"
				[type]="type"
				[id]="name"
				[name]="name"
				[required]="required"
				[attr.aria-required]="required"
				[attr.maxlength]="maxLength"
				[placeholder]="placeholder" />
		}
		<ng-content></ng-content>
	`,
	styleUrl: "./input-area.css",
	host: {
		"[class.error]": "!!error",
		class: "input-area grid h-fit gap-1",
	},
})
export class InputAreaComponent {
	@Input({ required: true }) control!: FormControl
	@Input({ required: true }) label!: string
	@Input({ required: true }) name!: string
	@Input() icon?: IconName
	@Input() type: InputAreaType = "text"
	@Input() error?: string | null
	@Input() maxLength: number = 100
	@Input() required = false
	@Input() placeholder = ""

	private readonly store = inject(SystemStore)

	protected readonly iconSize = computed(() => (this.store.deviceType() === "desktop" ? 24 : 16))
}
