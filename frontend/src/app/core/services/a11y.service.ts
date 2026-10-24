import { isPlatformBrowser } from "@angular/common"
import { Injectable, inject, PLATFORM_ID, DOCUMENT, DestroyRef, effect } from "@angular/core"

import { SystemStore } from "../stores/system.store"

@Injectable({
	providedIn: "root",
})
export class A11yService {
	private readonly store = inject(SystemStore)
	private readonly platformId = inject(PLATFORM_ID)
	private readonly document = inject(DOCUMENT)
	private readonly destroyRef = inject(DestroyRef)

	private readingMaskListenersAttached = false
	private handleMove!: (e: MouseEvent | TouchEvent) => void

	constructor() {
		if (isPlatformBrowser(this.platformId)) this.initHardwareSync()

		effect(() => {
			const prefs = this.store.a11yPreferences()

			if (isPlatformBrowser(this.platformId)) {
				this.applyStaticClasses(prefs)
				this.manageReadingMask(prefs.readingMask)
			}
		})
	}

	private initHardwareSync() {
		const hardwareMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")

		const handleMotionChange = (e: MediaQueryListEvent | MediaQueryList) => {
			if (e.matches) this.store.updateA11yPreference("pauseMotion", true)
		}
		handleMotionChange(hardwareMotionQuery)

		hardwareMotionQuery.addEventListener("change", handleMotionChange)

		this.destroyRef.onDestroy(() => {
			hardwareMotionQuery.removeEventListener("change", handleMotionChange)
		})
	}

	private applyStaticClasses(prefs: any) {
		const html = this.document.documentElement

		html.classList.toggle("force-motion-paused", prefs.pauseMotion)
		html.classList.toggle("font-accessible", prefs.dyslexiaFont)
		html.classList.toggle("hide-media", prefs.hideMedia)
		html.classList.toggle("highlight-links", prefs.highlightLinks)
		html.classList.toggle("high-contrast", prefs.highContrast)
		html.classList.toggle("grayscale-view", prefs.grayscaleView)

		html.classList.remove("text-scale-1", "text-scale-2", "text-scale-3", "text-scale-4")

		if (prefs.textScale !== 0) html.classList.add(`text-scale-${prefs.textScale}`)

		html.classList.remove("line-height-1", "line-height-2", "line-height-3", "line-height-4")

		if (prefs.lineHeight !== 0) html.classList.add(`line-height-${prefs.lineHeight}`)

		html.classList.remove(
			"letter-spacing-1",
			"letter-spacing-2",
			"letter-spacing-3",
			"letter-spacing-4"
		)
		if (prefs.letterSpacing !== 0) html.classList.add(`letter-spacing-${prefs.letterSpacing}`)

		html.classList.remove(
			"word-spacing-1",
			"word-spacing-2",
			"word-spacing-3",
			"word-spacing-4"
		)
		if (prefs.wordSpacing !== 0) html.classList.add(`word-spacing-${prefs.wordSpacing}`)
	}

	private manageReadingMask(isActive: boolean) {
		const html = this.document.documentElement

		if (!isActive) {
			html.classList.remove("reading-mask-active")
			this.detachReadingMaskListeners()
			return
		}
		html.classList.add("reading-mask-active")
		this.attachReadingMaskListeners(html)
	}

	private attachReadingMaskListeners(html: HTMLElement) {
		if (this.readingMaskListenersAttached) return

		let ticking = false

		this.handleMove = (e: MouseEvent | TouchEvent) => {
			if (!ticking) {
				requestAnimationFrame(() => {
					const clientY =
						"touches" in e ? e.touches[0].clientY : (e as MouseEvent).clientY

					html.style.setProperty("--mask-y", `${clientY}px`)
					ticking = false
				})
				ticking = true
			}
		}
		window.addEventListener("mousemove", this.handleMove, { passive: true })
		window.addEventListener("touchmove", this.handleMove, { passive: true })

		this.readingMaskListenersAttached = true
	}

	private detachReadingMaskListeners() {
		if (!this.readingMaskListenersAttached) return

		window.removeEventListener("mousemove", this.handleMove)
		window.removeEventListener("touchmove", this.handleMove)

		this.readingMaskListenersAttached = false
	}
}
