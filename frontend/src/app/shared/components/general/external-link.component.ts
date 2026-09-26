import { Component, ChangeDetectionStrategy, Input } from "@angular/core"

@Component({
	selector: "a[app-external-link]",
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `{{ label }}`,
	host: {
		"[attr.href]": "href",
		target: "_blank",
		rel: "noopener noreferrer",
		"[attr.aria-label]": 'label + " (opens in a new tab)"',
		class: "",
	},
})
export class ExternalLinkComponent {
	@Input({ required: true }) href!: string
	@Input({ required: true }) label!: string
}
