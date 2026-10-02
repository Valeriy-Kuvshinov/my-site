import { Component, inject, ViewChild, signal, OnInit, Input } from "@angular/core"
import { FormBuilder, Validators, ReactiveFormsModule, FormControl } from "@angular/forms"
import { NgxTurnstileModule, NgxTurnstileComponent } from "ngx-turnstile"

import { environment } from "../../../../environments/environment.development"

import { MailService, ContactMailForm } from "../../../core/services/api/mail/mail.service"

import { InputAreaComponent } from "../../../shared/components/form/input-area/input-area.component"
import { SelectAreaComponent } from "../../../shared/components/form/select-area/select-area.component"
import { SvgIconComponent } from "../../../shared/components/icon/icon.component"

interface ContactFormValues {
	name: string
	email: string
	title: string
	requestType: string
	message: string
}

@Component({
	selector: "app-contact-form",
	standalone: true,
	imports: [
		ReactiveFormsModule,
		NgxTurnstileModule,
		InputAreaComponent,
		SelectAreaComponent,
		SvgIconComponent,
	],
	templateUrl: "./form.html",
	styleUrl: "./form.css",
	host: {
		style: "display: contents",
	},
})
export class ContactFormComponent implements OnInit {
	private readonly fb = inject(FormBuilder)
	private readonly mailService = inject(MailService)

	@Input({ required: true }) initialValues!: ContactFormValues

	@ViewChild(NgxTurnstileComponent) turnstileRef!: NgxTurnstileComponent

	readonly sendMailMutation = this.mailService.sendContactMail()

	protected readonly TURNSTILE_KEY = environment.turnstilePublicKey
	protected readonly DEFAULT_SUBMIT_IMG_SRC = "/images/default_submit.avif"
	protected readonly FOCUS_SUBMIT_IMG_SRC = "/images/hover_submit.avif"

	readonly isActiveInteract = signal(false)
	readonly isProcessing = signal(false)
	readonly turnstileToken = signal<string | null>(null)

	// Initialize without values; populate in ngOnInit
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
		requestType: ["", Validators.required],
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

	ngOnInit() {
		this.form.patchValue(this.initialValues)
	}

	getInputControl(name: keyof typeof this.form.controls): FormControl {
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

	get buttonImage(): string {
		return this.isActiveInteract() && !this.isSendDisabled
			? this.FOCUS_SUBMIT_IMG_SRC
			: this.DEFAULT_SUBMIT_IMG_SRC
	}

	onTurnstileResolved(token: string | null) {
		this.turnstileToken.set(token)
	}

	// error or expire
	onTurnstileInvalid() {
		this.turnstileToken.set(null)
	}

	async onSubmit() {
		if (this.isSendDisabled) {
			this.form.markAllAsTouched()
			return
		}

		this.isProcessing.set(true)

		if (!this.turnstileToken()) {
			this.isProcessing.set(false)
			return
		}

		const formData: ContactMailForm = {
			...this.form.getRawValue(),
			turnstileToken: this.turnstileToken()!,
		}

		try {
			await this.sendMailMutation.mutateAsync(formData)
			this.form.reset(this.initialValues)
		} catch (err) {
			console.error("Failed process in ContactForm:", err)
		} finally {
			this.isProcessing.set(false)
			this.turnstileToken.set(null)
			this.turnstileRef.reset()
		}
	}
}
