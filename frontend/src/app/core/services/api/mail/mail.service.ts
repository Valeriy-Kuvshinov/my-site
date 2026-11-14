import { Injectable, inject } from "@angular/core"

import { ContactFormData } from "@/shared/interfaces/form"

import { SystemStore } from "@/core/stores/system.store"

import { HttpService } from "../http.service"

const MAIL_ENDPOINT = "mail"

@Injectable({
	providedIn: "root",
})
export class MailService {
	private readonly store = inject(SystemStore)

	private readonly http = inject(HttpService)

	async sendContactMail(formData: ContactFormData): Promise<void> {
		try {
			await this.http.post<void>(`${MAIL_ENDPOINT}/contact`, formData)

			this.store.showSuccess(
				$localize`:@@contact.mail.success.title:Message Sent!`,
				$localize`:@@contact.mail.success.msg:We have received your message and will reply shortly.`
			)
			this.store.setA11yAnnouncement(
				$localize`:@@contact.mail.success.a11y:Message sent successfully. We will reply shortly.`,
				"polite"
			)
		} catch (error: any) {
			this.store.showError(
				$localize`:@@contact.mail.error.title:Mail Send Failed!`,
				error.message
			)
			this.store.setA11yAnnouncement(
				$localize`:@@contact.mail.error.a11y:Failed to send message: ${error.message}`,
				"assertive"
			)
			throw error
		}
	}
}
