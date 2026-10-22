import { Injectable, inject } from "@angular/core"
import { injectMutation } from "@tanstack/angular-query-experimental"

import { ContactFormData } from "@/shared/interfaces/form"

import { SystemStore } from "@/core/stores/system.store"

import { ApiService } from "../api.service"

@Injectable({
	providedIn: "root",
})
export class MailService {
	private readonly store = inject(SystemStore)

	private readonly api = inject(ApiService)

	sendContactMail() {
		return injectMutation(() => ({
			mutationFn: async (formData: ContactFormData) => {
				await this.api.post<void>("mail/contact", formData)
			},
			onSuccess: () => {
				this.store.showSuccess(
					"Message Sent!",
					"We have received your message and will reply shortly."
				)
				this.store.setA11yAnnouncement(
					"Message sent successfully. We will reply shortly.",
					"polite"
				)
			},
			onError: (error: Error) => {
				this.store.showError("Mail Send Failed!", error.message)
				this.store.setA11yAnnouncement(
					`Failed to send message: ${error.message}`,
					"assertive"
				)
			},
		}))
	}
}
