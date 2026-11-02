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
					$localize`:@@contact.mail.success.title:Message Sent!`,
					$localize`:@@contact.mail.success.msg:We have received your message and will reply shortly.`
				)
				this.store.setA11yAnnouncement(
					$localize`:@@contact.mail.success.a11y:Message sent successfully. We will reply shortly.`,
					"polite"
				)
			},
			onError: (error: Error) => {
				this.store.showError(
					$localize`:@@contact.mail.error.title:Mail Send Failed!`,
					error.message // Do not localize the dynamic error payload
				)
				this.store.setA11yAnnouncement(
					$localize`:@@contact.mail.error.a11y:Failed to send message: ${error.message}`,
					"assertive"
				)
			},
		}))
	}
}
