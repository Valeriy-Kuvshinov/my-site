import { Component, inject, ViewChild, signal } from "@angular/core"
import { FormBuilder, Validators, ReactiveFormsModule, FormControl } from "@angular/forms"
import { RecaptchaModule, RecaptchaComponent } from "ng-recaptcha-2"

import { environment } from "../../../../environments/environment.development"

import { MailService, ContactMailForm } from "../../../core/services/api/mail/mail.service"

import { InputAreaComponent } from "../../../shared/components/form/input-area/input-area.component"
import { SelectAreaComponent } from "../../../shared/components/form/select-area/select-area.component"
import { ImageContainerComponent } from "../../../shared/components/general/image-container.component"
import { SvgIconComponent } from "../../../shared/components/icon/icon.component"

@Component({
	selector: "app-contact-form",
	standalone: true,
	imports: [
		ReactiveFormsModule,
		RecaptchaModule,
		SvgIconComponent,
		InputAreaComponent,
		SelectAreaComponent,
		ImageContainerComponent,
	],
	templateUrl: "./form.html",
	styleUrl: "./form.css",
	host: {
		style: "display: contents",
	},
})
export class ContactFormComponent {
	private readonly fb = inject(FormBuilder)

	private readonly mailService = inject(MailService)

	readonly sendMailMutation = this.mailService.sendContactMail()

	@ViewChild("recaptchaRef") recaptchaRef!: RecaptchaComponent

	protected readonly RECAPTCHA_KEY = environment.recaptchaPublicKey
	protected readonly RECAPTCHA_IMG_SRC = "/images/recaptcha.avif"

	readonly isActiveInteract = signal(false)
	readonly isProcessing = signal(false)

	// Form schema mapping with native Validators
	readonly form = this.fb.nonNullable.group({
		name: [
			"",
			[
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(30),
				Validators.pattern(/^[a-zA-Z\s'.-]+$/),
			],
		],
		email: [
			"",
			[
				Validators.required,
				Validators.email,
				Validators.minLength(5),
				Validators.maxLength(50),
			],
		],
		title: [
			"",
			[
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(50),
				Validators.pattern(/^[a-zA-Z0-9\s.\-!?']+$/),
			],
		],
		requestType: ["Q&A", Validators.required],
		message: [
			"",
			[
				Validators.required,
				Validators.minLength(15),
				Validators.maxLength(600),
				Validators.pattern(/^[a-zA-Z0-9\s.\-!?@#$',*;:]+$/),
			],
		],
	})

	// Helper method to cast abstract controls to FormControl for the template
	getControl(name: keyof typeof this.form.controls): FormControl {
		return this.form.get(name) as FormControl
	}

	getErrorMessage(controlName: keyof typeof this.form.controls): string | null {
		const control = this.form.get(controlName)

		if (!control || !control.touched || !control.errors) return null

		if (control.errors["required"]) return "Required field"
		if (control.errors["minlength"]) return "Too short"
		if (control.errors["maxlength"]) return "Too long"
		if (control.errors["email"]) return "Invalid format"
		if (control.errors["pattern"]) return "Invalid characters"

		return "Invalid input"
	}

	get isSendDisabled(): boolean {
		return this.form.invalid || this.isProcessing() || this.sendMailMutation.isPending()
	}

	onSubmit() {
		if (this.form.invalid) {
			this.form.markAllAsTouched()
			return
		}
		this.isProcessing.set(true)
		this.recaptchaRef.execute()
	}

	async onRecaptchaResolved(token: string | null) {
		if (!token) {
			console.error("reCAPTCHA verification failed")

			this.isProcessing.set(false)
			this.recaptchaRef.reset()

			return
		}
		const formData: ContactMailForm = {
			...this.form.getRawValue(),
			recaptchaToken: token,
		}
		try {
			await this.sendMailMutation.mutateAsync(formData)
			this.form.reset({ requestType: "Q&A" })
		} catch (err) {
			console.error("Failed process in ContactForm:", err)
		} finally {
			this.isProcessing.set(false)
			this.recaptchaRef.reset()
		}
	}
}
