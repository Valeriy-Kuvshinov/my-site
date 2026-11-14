import {
	Component,
	inject,
	signal,
	computed,
	HostListener,
	DestroyRef,
	Input,
	OnInit,
} from "@angular/core"

import { IconName } from "../icon/icon.map"

import { SystemStore } from "@/core/stores/system.store"

import { ClickOutsideDirective } from "@/shared/directives/click-outside.directive"

import { SvgIconComponent } from "../icon/icon.component"

interface LanguageOption {
	value: "en" | "ru" | "he"
	label: string
	icon: IconName
}

const OPTIONS: LanguageOption[] = [
	{ value: "en", label: "English", icon: "usa" },
	{ value: "ru", label: "Русский", icon: "rus" },
	{ value: "he", label: "עברית", icon: "isr" },
]

@Component({
	selector: "app-language-select",
	standalone: true,
	imports: [SvgIconComponent],
	hostDirectives: [ClickOutsideDirective],
	templateUrl: "./language-select.html",
	styleUrl: "./language-select.css",
	host: {
		class: "flex column relative",
	},
})
export class LanguageSelectComponent implements OnInit {
	@Input() position: "up" | "down" = "down"

	private readonly store = inject(SystemStore)

	private readonly clickOutside = inject(ClickOutsideDirective)

	private readonly destroyRef = inject(DestroyRef)

	protected readonly isOpen = signal(false)

	protected readonly options = OPTIONS

	protected readonly activeOption = computed(
		() => this.options.find((opt) => opt.value === this.store.currentLanguage()) || this.options[0]
	)

	ngOnInit() {
		const sub = this.clickOutside.appClickOutside.subscribe(() => this.close())
		this.destroyRef.onDestroy(() => sub.unsubscribe())
	}

	toggleOpen() {
		this.isOpen.update((v) => !v)
	}

	close() {
		this.isOpen.set(false)
	}

	selectLanguage(value: "en" | "ru" | "he") {
		this.store.switchLanguage(value)
		this.close()
	}

	@HostListener("window:keydown.escape")
	onEscape() {
		if (this.isOpen()) this.close()
	}
}
