import { isPlatformBrowser } from "@angular/common"
import {
	Component,
	OnInit,
	inject,
	PLATFORM_ID,
	DOCUMENT,
	computed,
	signal,
	ViewChild,
	ElementRef,
	effect,
} from "@angular/core"
import { RouterLink } from "@angular/router"

import { SystemStore } from "../../../core/stores/system.store"

import { SvgIconComponent } from "../icon/icon.component"

declare global {
	interface Window {
		dataLayer: any[]
		gtag?: (...args: any[]) => void
	}
}

const GOOGLE_TAG_MANAGER_ID = "G-JM33WQ5Q8X"

@Component({
	selector: "app-cookie-banner",
	standalone: true,
	imports: [RouterLink, SvgIconComponent],
	templateUrl: "./cookie-banner.html",
	styleUrl: "./cookie-banner.css",
	host: {
		style: "display: contents",
	},
})
export class CookieBannerComponent implements OnInit {
	private readonly platformId = inject(PLATFORM_ID)
	private readonly document = inject(DOCUMENT)
	protected readonly store = inject(SystemStore)

	readonly deviceType = computed(() => this.store.deviceType())

	readonly consent = signal<string | null | "pending">("pending")

	@ViewChild("bannerRef") bannerRef?: ElementRef<HTMLElement>

	constructor() {
		effect((onCleanup) => {
			if (this.consent() === null) {
				const timer = setTimeout(() => this.bannerRef?.nativeElement.focus(), 10)
				onCleanup(() => clearTimeout(timer))
			}
		})
	}

	ngOnInit() {
		if (isPlatformBrowser(this.platformId)) {
			this.initGtmScripts()

			const savedConsent = localStorage.getItem("vk_cookie_consent")
			this.consent.set(savedConsent)

			if (savedConsent === "granted") this.updateGtagConsent("granted")
		}
	}

	handleAccept() {
		localStorage.setItem("vk_cookie_consent", "granted")
		this.consent.set("granted")
		this.updateGtagConsent("granted")
	}

	handleDecline() {
		localStorage.setItem("vk_cookie_consent", "denied")
		this.consent.set("denied")
		this.updateGtagConsent("denied")
	}

	private updateGtagConsent(status: "granted" | "denied") {
		window.gtag?.("consent", "update", {
			ad_user_data: status,
			ad_personalization: status,
			ad_storage: status,
			analytics_storage: status,
		})
	}

	private initGtmScripts() {
		if (this.document.getElementById("google-consent-default")) return

		const head = this.document.head

		const consentScript = this.document.createElement("script")
		consentScript.id = "google-consent-default"
		consentScript.text = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'analytics_storage': 'denied'
            });
        `
		head.appendChild(consentScript)

		const gtmScript = this.document.createElement("script")
		gtmScript.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_MANAGER_ID}`
		gtmScript.async = true
		head.appendChild(gtmScript)

		const initScript = this.document.createElement("script")
		initScript.id = "google-analytics-init"
		initScript.text = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GOOGLE_TAG_MANAGER_ID}');
        `
		head.appendChild(initScript)
	}
}
