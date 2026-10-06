import { isPlatformBrowser } from "@angular/common"
import { DestroyRef, inject, Injectable, PLATFORM_ID, signal } from "@angular/core"

type DeviceType = "mobile" | "tablet" | "desktop"

interface FlashMessage {
	title: string
	msg: string
	type: "success" | "error"
}

interface A11yPreferences {
	pauseMotion: boolean
	dyslexiaFont: boolean
	readingMask: boolean
	hideMedia: boolean
	highlightLinks: boolean
	highContrast: boolean
	grayscaleView: boolean
	textScale: 0 | 1 | 2 | 3 | 4
	lineHeight: 0 | 1 | 2 | 3 | 4
	letterSpacing: 0 | 1 | 2 | 3 | 4
	wordSpacing: 0 | 1 | 2 | 3 | 4
}

const DISPLAY_TIMEOUT_MILLIS = 8 * 1000

@Injectable({
	providedIn: "root",
})
export class SystemStore {
	private readonly platformId = inject(PLATFORM_ID)
	private readonly destroyRef = inject(DestroyRef)

	// DEVICE STATE
	readonly deviceType = signal<DeviceType>("desktop")

	// FLASH MESSAGE STATE
	readonly message = signal<FlashMessage | null>(null)
	readonly a11yAnnouncement = signal<string>("")
	readonly a11yUrgency = signal<"polite" | "assertive">("polite")
	private timeoutId: ReturnType<typeof setTimeout> | null = null

	// MODAL STATE
	readonly activeModals = signal<string[]>([])
	readonly modalValues = signal<Record<string, string | null>>({})
	readonly modalFunctions = signal<Record<string, () => void>>({})

	// ACCESSIBILITY STATE
	readonly a11yPreferences = signal<A11yPreferences>({
		pauseMotion: false,
		dyslexiaFont: false,
		readingMask: false,
		hideMedia: false,
		highlightLinks: false,
		highContrast: false,
		grayscaleView: false,
		textScale: 0,
		lineHeight: 0,
		letterSpacing: 0,
		wordSpacing: 0,
	})

	constructor() {
		this.initDeviceTypeSync()
	}

	private initDeviceTypeSync() {
		if (isPlatformBrowser(this.platformId)) {
			const handleResize = () => {
				const width = window.innerWidth

				if (width <= 480) this.deviceType.set("mobile")
				else if (width <= 900) this.deviceType.set("tablet")
				else this.deviceType.set("desktop")
			}
			handleResize()

			window.addEventListener("resize", handleResize)

			this.destroyRef.onDestroy(() => {
				window.removeEventListener("resize", handleResize)
			})
		}
	}

	// FLASH MESSAGES
	// =====================================
	showSuccess(title: string, msg: string) {
		this.setFlashMessage({ title, msg, type: "success" }, "polite")
	}

	showError(title: string, msg: string) {
		this.setFlashMessage({ title, msg, type: "error" }, "assertive")
	}

	private setFlashMessage(msgObj: FlashMessage, urgency: "polite" | "assertive") {
		if (this.timeoutId) clearTimeout(this.timeoutId)

		this.message.set(msgObj)
		this.a11yAnnouncement.set(
			`${msgObj.type === "error" ? "Error" : "Success"}: ${msgObj.title}. ${msgObj.msg}`
		)
		this.a11yUrgency.set(urgency)

		if (isPlatformBrowser(this.platformId)) {
			this.timeoutId = setTimeout(() => this.closeMsg(), DISPLAY_TIMEOUT_MILLIS)
		}
	}

	closeMsg() {
		if (this.timeoutId) clearTimeout(this.timeoutId)

		this.message.set(null)
	}

	// MODALS
	// =====================================
	openModal(modalId: string, value?: string, action?: () => void) {
		this.activeModals.update((modals) => [...modals, modalId])

		if (value !== undefined) {
			this.modalValues.update((values) => ({ ...values, [modalId]: value }))
		}
		if (action) {
			this.modalFunctions.update((funcs) => ({ ...funcs, [modalId]: action }))
		}
	}

	closeModal(modalId: string) {
		this.activeModals.update((modals) => modals.filter((id) => id !== modalId))

		this.modalValues.update((values) => {
			const newValues = { ...values }
			delete newValues[modalId]
			return newValues
		})
		this.modalFunctions.update((funcs) => {
			const newFuncs = { ...funcs }
			delete newFuncs[modalId]
			return newFuncs
		})
	}

	closeAllModals() {
		this.activeModals.set([])
		this.modalValues.set({})
		this.modalFunctions.set({})
	}

	// ACCESSIBILITY
	// =====================================
	setA11yAnnouncement(msg: string, urgency: "polite" | "assertive" = "polite") {
		this.a11yAnnouncement.set(msg)
		this.a11yUrgency.set(urgency)
	}

	updateA11yPreference<K extends keyof A11yPreferences>(key: K, value: A11yPreferences[K]) {
		this.a11yPreferences.update((prefs) => ({ ...prefs, [key]: value }))
	}

	toggleColorMode(mode: "highContrast" | "grayscaleView") {
		this.a11yPreferences.update((prefs) => {
			const nextValue = !prefs[mode]

			if (mode === "highContrast") {
				return {
					...prefs,
					highContrast: nextValue,
					grayscaleView: nextValue ? false : prefs.grayscaleView,
				}
			} else {
				return {
					...prefs,
					grayscaleView: nextValue,
					highContrast: nextValue ? false : prefs.highContrast,
				}
			}
		})
	}

	resetA11yPreferences() {
		let hardwareMotion = false

		if (isPlatformBrowser(this.platformId)) {
			hardwareMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
		}
		this.a11yPreferences.set({
			pauseMotion: hardwareMotion,
			dyslexiaFont: false,
			readingMask: false,
			hideMedia: false,
			highlightLinks: false,
			highContrast: false,
			grayscaleView: false,
			textScale: 0,
			lineHeight: 0,
			letterSpacing: 0,
			wordSpacing: 0,
		})
	}
}
