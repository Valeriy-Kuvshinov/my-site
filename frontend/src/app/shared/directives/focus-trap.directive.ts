import { Directive, ElementRef, HostListener, Input, inject } from "@angular/core"

@Directive({
	selector: "[appFocusTrap]",
	standalone: true,
})
export class FocusTrapDirective {
	private readonly elem = inject(ElementRef<HTMLElement>)

	@Input() appFocusTrap = true

	@HostListener("keydown", ["$event"])
	onKeyDown(event: KeyboardEvent): void {
		if (!this.appFocusTrap || event.key !== "Tab") return

		const focusableSelectors =
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

		const focusableNodes = this.elem.nativeElement.querySelectorAll(
			focusableSelectors
		) as NodeListOf<HTMLElement>

		if (focusableNodes.length === 0) return

		const firstNode = focusableNodes[0]
		const lastNode = focusableNodes[focusableNodes.length - 1]

		if (event.shiftKey) {
			if (document.activeElement === firstNode) {
				lastNode.focus()
				event.preventDefault()
			}
		} else {
			if (document.activeElement === lastNode) {
				firstNode.focus()
				event.preventDefault()
			}
		}
	}
}
