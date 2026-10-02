import { Directive, ElementRef, EventEmitter, HostListener, Output, inject } from "@angular/core"

@Directive({
	selector: "[appClickOutside]",
	standalone: true,
})
export class ClickOutsideDirective {
	private readonly elem = inject(ElementRef<HTMLElement>)

	@Output() appClickOutside = new EventEmitter<void>()

	@HostListener("document:mousedown", ["$event.target"])
	@HostListener("document:touchstart", ["$event.target"])
	onClick(targetElement: EventTarget | null): void {
		if (!targetElement) return

		const node = targetElement as Node

		if (!document.contains(node)) return

		const clickedInside = this.elem.nativeElement.contains(node)

		if (!clickedInside) this.appClickOutside.emit()
	}
}
