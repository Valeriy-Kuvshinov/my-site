import { ChangeDetectionStrategy, Component, computed, inject, Input } from "@angular/core"
import { FormControl, ReactiveFormsModule } from "@angular/forms"

import { IconName } from "../../icon/icon.map"

import { SystemStore } from "@/core/stores/system.store"

import { SvgIconComponent } from "../../icon/icon.component"

@Component({
	selector: "app-select-area",
	standalone: true,
	imports: [SvgIconComponent, ReactiveFormsModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		@let size = iconSize();

		<label
			[for]="name"
			class="grid items-center">
			@if (icon) {
				<app-svg-icon
					[icon]="icon"
					[width]="size"
					[height]="size">
				</app-svg-icon>
			}
			<span>{{ label }}</span>

			<!--  -->
			@if (error) {
				<span class="text-hide-overflow">{{ error }}</span>
			}
		</label>

		<select
			[formControl]="control"
			[id]="name"
			[name]="name">
			<ng-content></ng-content>
		</select>
	`,
	styleUrl: "./select-area.css",
	host: {
		"[class.error]": "!!error",
		class: "select-area grid h-fit gap-1",
	},
})
export class SelectAreaComponent {
	@Input({ required: true }) control!: FormControl
	@Input({ required: true }) label!: string
	@Input({ required: true }) name!: string
	@Input() icon?: IconName
	@Input() error?: string | null

	private readonly store = inject(SystemStore)

	protected readonly iconSize = computed(() => (this.store.deviceType() === "desktop" ? 24 : 16))
}
