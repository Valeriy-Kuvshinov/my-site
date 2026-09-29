import { Injectable, inject } from "@angular/core"
import { injectMutation } from "@tanstack/angular-query-experimental"

import { SystemStore } from "../../../stores/system.store"

import { ApiService } from "../api.service"

export interface ContactMailForm {
	name: string
	email: string
	title: string
	requestType: string
	message: string
	turnstileToken?: string
}

@Injectable({
	providedIn: "root",
})
export class MailService {
	private readonly store = inject(SystemStore)

	private readonly api = inject(ApiService)

	sendContactMail() {
		return injectMutation(() => ({
			mutationFn: async (formData: ContactMailForm) => {
				await this.api.post<void>("mail/contact", formData)
			},
			onSuccess: () => {
				this.store.showSuccess(
					"Message Sent!",
					"We have received your message and will reply shortly."
				)
			},
			onError: (error: Error) => {
				this.store.showError("Mail Send Failed!", error.message)
			},
		}))
	}
}
