import { ChangeDetectionStrategy, Component, Input, output } from "@angular/core"

import { IconName } from "../../../shared/icon/icon.map"

import { SvgIconComponent } from "../../../shared/icon/icon.component"

export type ScaleLevel = 0 | 1 | 2 | 3 | 4

@Component({
	selector: "div[app-scale-option]",
	standalone: true,
	imports: [SvgIconComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="scale-header flex flex-row items-center">
			<app-svg-icon [icon]="icon"></app-svg-icon>
			<label
				[for]="id"
				class="font-bold text-center"
				>{{ label }}</label
			>
		</div>

		<div class="progressive-bar w-full">
			<input
				type="range"
				[id]="id"
				min="0"
				max="4"
				step="1"
				[value]="currentLevel"
				(input)="handleScaleChange($event)"
				class="w-full"
				[attr.aria-valuemin]="0"
				[attr.aria-valuemax]="4"
				[attr.aria-valuenow]="currentLevel"
				[attr.aria-valuetext]="currentLevel === 0 ? 'Default' : 'Level ' + currentLevel" />
		</div>
	`,
	host: {
		"[class.active]": "currentLevel > 0",
		class: "scale-option flex flex-col items-center justify-center transition-all duration-200 w-full",
	},
})
export class ScaleOptionComponent {
	@Input({ required: true }) label!: string
	@Input({ required: true }) icon!: IconName
	@Input({ required: true }) currentLevel!: ScaleLevel

	onScaleChange = output<ScaleLevel>()

	get id(): string {
		return `scale-${this.label.replace(/\s+/g, "-").toLowerCase()}`
	}

	handleScaleChange(event: Event) {
		const target = event.target as HTMLInputElement
		this.onScaleChange.emit(Number(target.value) as ScaleLevel)
	}
}
