import { ChangeDetectionStrategy, Component, Input, output } from "@angular/core"
import { RouterLink, RouterLinkActive } from "@angular/router"

import { IconName } from "../icon/icon.map"

import { SvgIconComponent } from "../icon/icon.component"

@Component({
	selector: "app-nav-link",
	standalone: true,
	imports: [RouterLink, RouterLinkActive, SvgIconComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<a
			[routerLink]="href"
			routerLinkActive="active"
			[routerLinkActiveOptions]="{ exact: exact }"
			ariaCurrentWhenActive="page"
			[class]="combinedClasses"
			(click)="onClickEvent.emit()">
			@if (isLogo) {
				<ng-content></ng-content>
			} @else {
				@if (icon) {
					<app-svg-icon [icon]="icon"></app-svg-icon>
				}
				<span>{{ label }}</span>
			}
		</a>
	`,
	host: {
		style: "display: contents",
	},
})
export class NavLinkComponent {
	@Input({ required: true }) href!: string
	@Input({ required: true }) label!: string
	@Input() icon?: IconName
	@Input() className = ""
	@Input() exact = false
	@Input() isLogo = false

	onClickEvent = output<void>()

	get combinedClasses(): string {
		// Tailwind hover classes have been removed as requested.
		// Manage :hover states in your global css or component css targeting the .nav-link class.
		return `nav-link font-semibold transition-colors ${this.className}`.trim()
	}
}
